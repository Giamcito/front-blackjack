"use client"

import { useEffect, useState } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { adjustChips, me } from "@/lib/userApi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PerfilPage() {
  const { user, loading } = useRequireAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [chips, setChips] = useState<number | null>(null)

  // Sync chips after auth loaded
  useEffect(() => {
    if (!loading && user) {
      setChips(user.chips)
    }
  }, [loading, user])

  const changeChips = async (delta: number) => {
    if (!user) return
    setBusy(true); setError("")
    try { const u = await adjustChips(delta); setChips(u.chips) } catch (e:any) { setError(e?.message || "Error") } finally { setBusy(false) }
  }

  const refresh = async () => { try { const u = await me(); setChips(u.chips) } catch (e:any) { setError(e?.message || "Error") } }

  if (loading) return <div className="mx-auto max-w-md p-6">Cargando perfil...</div>
  if (!user) return null

  return (
    <div className="mx-auto max-w-md px-3">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--casino-gold)] text-center my-6">Perfil</h1>
      <Card>
        <CardContent className="p-4 space-y-3 text-sm">
          <div>Usuario: <span className="font-semibold">{user.username}</span></div>
          <div>Fichas: <span className="font-semibold">{chips != null ? chips : "—"}</span></div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" disabled={busy} onClick={() => changeChips(+100)}>+100</Button>
            <Button size="sm" disabled={busy} onClick={() => changeChips(-100)}>-100</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={refresh}>Actualizar</Button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <p className="text-xs text-muted-foreground mt-2">Estos ajustes son temporales para pruebas. Luego se limitarán según reglas de juego.</p>
        </CardContent>
      </Card>
    </div>
  )
}
