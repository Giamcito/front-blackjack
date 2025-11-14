"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { spin, type RouletteBet, type RouletteBetType, rouletteStatus, type SpinResult } from "@/lib/ruletaApi"
import { adjustChips, me, type MeResponse } from "@/lib/userApi"
import Protected from "@/components/protected"

const BET_TYPES: { value: RouletteBetType; label: string }[] = [
  { value: "STRAIGHT", label: "Número (35:1)" },
  { value: "COLOR", label: "Color (1:1)" },
  { value: "EVEN_ODD", label: "Par/Impar (1:1)" },
  { value: "HIGH_LOW", label: "Alta/Baja (1:1)" },
  { value: "DOZEN", label: "Docena (2:1)" },
  { value: "COLUMN", label: "Columna (2:1)" },
]

export default function RuletaPage() {
  const [bets, setBets] = useState<RouletteBet[]>([])
  const [type, setType] = useState<RouletteBetType>("STRAIGHT")
  const [value, setValue] = useState<string>("17")
  const [amount, setAmount] = useState<number>(10)
  const [busy, setBusy] = useState<boolean>(false)
  const [status, setStatus] = useState<string>("")
  const [result, setResult] = useState<SpinResult | null>(null)
  const [error, setError] = useState<string>("")
  const [chips, setChips] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    me().then((u) => { if (mounted) setChips(u.chips) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const totalStake = useMemo(() => bets.reduce((s, b) => s + Math.max(0, b.amount || 0), 0), [bets])

  const refreshStatus = useCallback(async () => {
    try { setStatus(await rouletteStatus()) } catch { setStatus("") }
  }, [])

  const onTypeChange = (t: RouletteBetType) => {
    setType(t)
    // Reset valor según tipo
    if (t === "STRAIGHT") setValue("17")
    else if (t === "COLOR") setValue("RED")
    else if (t === "EVEN_ODD") setValue("EVEN")
    else if (t === "HIGH_LOW") setValue("HIGH")
    else if (t === "DOZEN") setValue("1")
    else if (t === "COLUMN") setValue("1")
  }

  const addBet = () => {
    const amt = Math.max(1, Math.floor(amount || 0))
    // Validar valor básico
    if (type === "STRAIGHT") {
      const n = Number(value)
      if (!Number.isInteger(n) || n < 0 || n > 36) { setError("Número inválido (0-36)"); return }
    }
    if (type === "COLOR" && value !== "RED" && value !== "BLACK") { setError("Color inválido"); return }
    if (type === "EVEN_ODD" && value !== "EVEN" && value !== "ODD") { setError("Debe ser EVEN/ODD"); return }
    if (type === "HIGH_LOW" && value !== "HIGH" && value !== "LOW") { setError("Debe ser HIGH/LOW"); return }
    if (type === "DOZEN" && !["1","2","3"].includes(value)) { setError("Docena 1/2/3"); return }
    if (type === "COLUMN" && !["1","2","3"].includes(value)) { setError("Columna 1/2/3"); return }
    // Validar saldo disponible si está cargado
    const nextStake = totalStake + amt
    if (chips != null && nextStake > chips) { setError("Saldo insuficiente"); return }
    setError("")
    setBets(prev => [...prev, { type, value, amount: amt }])
  }

  const removeBet = (idx: number) => setBets(prev => prev.filter((_, i) => i !== idx))

  const clearBets = () => { setBets([]); setResult(null); setError("") }

  const doSpin = async () => {
    if (bets.length === 0) { setError("Agrega al menos una apuesta"); return }
    if (chips == null) { setError("Inicia sesión para jugar y sincronizar saldo"); return }
    if (chips != null && totalStake > chips) { setError("Saldo insuficiente"); return }
    setBusy(true); setError("")
    try {
      const r = await spin({ bets })
      setResult(r)
      // Ajustar fichas según neto del resultado
      try {
        if (r.net !== 0) {
          const u = await adjustChips(r.net)
          setChips(u.chips)
        } else {
          // Asegurar sincronización tras jugar aunque neto 0
          const u = await me(); setChips(u.chips)
        }
      } catch {}
    } catch (e: any) {
      setError(e?.message || "Falla al girar")
    } finally { setBusy(false) }
  }

  return (
    <Protected>
    <div className="mx-auto max-w-6xl px-2 md:px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center text-[var(--casino-gold)]">Ruleta</h1>
        <div className="flex items-center gap-3 text-xs text-zinc-300">
          <div className="px-3 py-1 rounded-full border border-[var(--casino-gold)]/50 bg-black/40">
            <span className="mr-1 text-[var(--casino-gold)]">Saldo:</span>
            <span className="font-semibold">{chips != null ? chips : "—"}</span>
          </div>
          <Button size="sm" variant="outline" onClick={refreshStatus}>Estado</Button>
          {status && <span className="ml-2">{status}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Formulario apuesta */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Tipo de apuesta</label>
              <select className="w-full rounded-md border bg-background p-2" value={type} onChange={e => onTypeChange(e.target.value as RouletteBetType)}>
                {BET_TYPES.map(bt => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
              </select>
            </div>

            {/* Valor según tipo */}
            {type === "STRAIGHT" && (
              <div>
                <label className="block text-sm mb-1">Número (0-36)</label>
                <input type="number" min={0} max={36} value={value} onChange={e => setValue(e.target.value)} className="w-full rounded-md border bg-background p-2" />
              </div>
            )}
            {type === "COLOR" && (
              <div>
                <label className="block text-sm mb-1">Color</label>
                <select className="w-full rounded-md border bg-background p-2" value={value} onChange={e => setValue(e.target.value)}>
                  <option value="RED">Rojo</option>
                  <option value="BLACK">Negro</option>
                </select>
              </div>
            )}
            {type === "EVEN_ODD" && (
              <div>
                <label className="block text-sm mb-1">Par/Impar</label>
                <select className="w-full rounded-md border bg-background p-2" value={value} onChange={e => setValue(e.target.value)}>
                  <option value="EVEN">Par</option>
                  <option value="ODD">Impar</option>
                </select>
              </div>
            )}
            {type === "HIGH_LOW" && (
              <div>
                <label className="block text-sm mb-1">Alta/Baja</label>
                <select className="w-full rounded-md border bg-background p-2" value={value} onChange={e => setValue(e.target.value)}>
                  <option value="HIGH">Alta (19-36)</option>
                  <option value="LOW">Baja (1-18)</option>
                </select>
              </div>
            )}
            {type === "DOZEN" && (
              <div>
                <label className="block text-sm mb-1">Docena</label>
                <select className="w-full rounded-md border bg-background p-2" value={value} onChange={e => setValue(e.target.value)}>
                  <option value="1">1 (1-12)</option>
                  <option value="2">2 (13-24)</option>
                  <option value="3">3 (25-36)</option>
                </select>
              </div>
            )}
            {type === "COLUMN" && (
              <div>
                <label className="block text-sm mb-1">Columna</label>
                <select className="w-full rounded-md border bg-background p-2" value={value} onChange={e => setValue(e.target.value)}>
                  <option value="1">Columna 1</option>
                  <option value="2">Columna 2</option>
                  <option value="3">Columna 3</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Monto</label>
              <input type="number" min={1} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full rounded-md border bg-background p-2" />
            </div>

            <div className="flex gap-2">
              <Button onClick={addBet}>Agregar apuesta</Button>
              <Button variant="secondary" onClick={clearBets}>Limpiar</Button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </CardContent>
        </Card>

        {/* Lista de apuestas */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Apuestas ({bets.length})</h2>
            {bets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin apuestas aún</p>
            ) : (
              <ul className="space-y-2">
                {bets.map((b, idx) => (
                  <li key={idx} className="flex items-center justify-between rounded-md border p-2">
                    <div className="text-sm">
                      <div><span className="font-medium">{b.type}</span> / Valor: {b.value}</div>
                      <div className="text-muted-foreground">Monto: {b.amount}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => removeBet(idx)}>Quitar</Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 text-sm">Total apostado: <span className="font-semibold">{totalStake}</span></div>
            <div className="mt-4">
              <Button className="w-full" disabled={busy || bets.length===0} onClick={doSpin}>{busy ? "Girando..." : "Girar"}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold">Resultado</h2>
            {!result ? (
              <p className="text-sm text-muted-foreground">Aún sin resultados. Agrega apuestas y gira.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div>Número: <span className="font-semibold">{result.number}</span></div>
                <div>Color: <span className="font-semibold">{result.color}</span> {result.zero && <span className="ml-1 text-zinc-400">(cero)</span>}</div>
                <div>Paridad: <span className="font-semibold">{result.even ? 'Par' : (result.zero ? 'N/A' : 'Impar')}</span></div>
                <div>Apostado: <span className="font-semibold">{result.totalStake}</span></div>
                <div>Pago total: <span className="font-semibold">{result.totalPayout}</span></div>
                <div>Neto: <span className={`font-semibold ${result.net>=0 ? 'text-emerald-400' : 'text-red-400'}`}>{result.net}</span></div>
                <div className="pt-2">
                  <div className="font-medium mb-1">Detalle</div>
                  <ul className="space-y-1">
                    {result.breakdown.map((bp, i) => (
                      <li key={i} className="rounded border p-2 flex items-center justify-between">
                        <div>
                          <div className="text-xs">{bp.bet.type} / {bp.bet.value}</div>
                          <div className="text-xs text-muted-foreground">Monto: {bp.bet.amount} · {bp.reason}</div>
                        </div>
                        <div className={`text-xs font-semibold ${bp.win ? 'text-emerald-400' : 'text-red-400'}`}>{bp.win ? `+${bp.payout}` : '—'}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </Protected>
  )
}
