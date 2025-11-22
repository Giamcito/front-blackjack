"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { register as apiRegister, me, setAuthToken, type MeResponse } from "@/lib/userApi"

export default function RegistroPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<MeResponse | null>(null)
  const router = useRouter()

  const doRegister = async () => {
    setBusy(true); setError("")
    try {
      const t = await apiRegister(username, password)
      setAuthToken(t.token)
      const p = await me(); setProfile(p)
      router.push('/juego')
    } catch (e: any) { setError(e?.message || "Error") }
    finally { setBusy(false) }
  }

  const handleSubmit = async (e: FormEvent) => { e.preventDefault(); await doRegister() }

  return (
    <div className="mx-auto max-w-md px-3">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--casino-gold)] text-center my-6">Registrarse</h1>
      <Card>
        <CardContent className="p-4 space-y-3">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 font-bold">Usuario:</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full mt-2 mb-2 rounded-md border bg-background p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1 font-bold">Contraseña:</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-2 mb-2 rounded-md border bg-background p-2" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Button type="submit" disabled={busy} className="px-5 py-2 cursor-pointer text-base font-semibold bg-[var(--casino-gold)] text-black hover:brightness-105">Crear cuenta</Button>
              <div className="ml-auto">
                <Button variant="outline" onClick={() => router.push('/login')} className="px-4 py-2 cursor-pointer bg-gray-800 hover:bg-gray-800 hover:text-white font-medium">Ya tengo cuenta</Button>
              </div>
            </div>
          </form>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
