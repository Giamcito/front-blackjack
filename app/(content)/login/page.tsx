"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { login, register as apiRegister, me, setAuthToken, type MeResponse } from "@/lib/userApi"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<MeResponse | null>(null)

  const doRegister = async () => {
    setBusy(true); setError("")
    try {
      const t = await apiRegister(username, password)
      setAuthToken(t.token)
      const p = await me(); setProfile(p)
    } catch (e: any) { setError(e?.message || "Error") }
    finally { setBusy(false) }
  }
  const doLogin = async () => {
    setBusy(true); setError("")
    try {
      const t = await login(username, password)
      setAuthToken(t.token)
      const p = await me(); setProfile(p)
    } catch (e: any) { setError(e?.message || "Error") }
    finally { setBusy(false) }
  }
  const refreshMe = async () => { try { setProfile(await me()) } catch (e:any) { setError(e?.message || "No autenticado") } }
  // Chip adjustments se movieron al perfil

  return (
    <div className="mx-auto max-w-md px-3">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--casino-gold)] text-center my-6">Acceso</h1>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div>
            <label className="block text-sm mb-1">Usuario</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full rounded-md border bg-background p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-md border bg-background p-2" />
          </div>
          <div className="flex gap-2">
            <Button onClick={doLogin} disabled={busy}>Iniciar sesión</Button>
            <Button variant="secondary" onClick={doRegister} disabled={busy}>Registrar</Button>
            <Button variant="outline" onClick={refreshMe}>Yo</Button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardContent className="p-4 text-sm">
            {!profile ? (
              <p className="text-muted-foreground">Inicia sesión para continuar.</p>
            ) : (
              <div className="space-y-2">
                <div>Usuario: <span className="font-semibold">{profile.username}</span></div>
                <div>Fichas: <span className="font-semibold">{profile.chips}</span></div>
                <p className="text-xs text-muted-foreground">Gestión avanzada en el apartado Perfil.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
