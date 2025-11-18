"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { login, me, setAuthToken, type MeResponse } from "@/lib/userApi"
import Link from "next/link"

export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<MeResponse | null>(null)
  const router = useRouter()

  const doLogin = async () => {
    setBusy(true); setError("")
    try {
      const t = await login(loginUsername, loginPassword)
      setAuthToken(t.token)
      const p = await me(); setProfile(p)
      router.push('/juego')
    } catch (e: any) { setError(e?.message || "Error") }
    finally { setBusy(false) }
  }

  const handleLoginSubmit = async (e: FormEvent) => { e.preventDefault(); await doLogin() }
  const refreshMe = async () => { try { setProfile(await me()) } catch (e:any) { setError(e?.message || "No autenticado") } }
  // Chip adjustments se movieron al perfil

  return (
    <div className="mx-auto max-w-md px-3">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--casino-gold)] text-center my-6">Iniciar Sesión</h1>
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-4 space-y-3">
            <form onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-sm mb-1 font-bold">Usuario:</label>
                <input value={loginUsername} onChange={e=>setLoginUsername(e.target.value)} className="w-full mt-2 mb-2 rounded-md border bg-background p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-bold">Contraseña:</label>
                <input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full mt-2 mb-2 rounded-md border bg-background p-2" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Button type="submit" disabled={busy} className="px-5 py-2 cursor-pointer text-base font-semibold bg-[var(--casino-gold)] text-black hover:brightness-105">Iniciar sesión</Button>
                <div className="ml-auto">
                  <Button onClick={() => router.push('/registro')} className="px-4 py-2 cursor-pointer text-sm font-semibold bg-primary text-white hover:bg-green-700 hover:brightness-105">Crear cuenta</Button>
                </div>
              </div>
            </form>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
