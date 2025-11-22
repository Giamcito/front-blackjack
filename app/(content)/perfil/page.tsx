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
        <CardContent className="p-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {/* Coloca la imagen `perfil-avatar.png` en la carpeta `public/` */}
              <img
                src="/perfil-avatar.png"
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-[var(--casino-gold)] shadow-md"
              />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold">{user.username}</div>
              <div className="text-xs text-muted-foreground">Miembro</div>
              <div className="mt-2 text-sm">Fichas: <span className="font-semibold">{chips != null ? chips : "—"}</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" disabled={busy} onClick={() => changeChips(+100)}>+100</Button>
              <Button size="sm" disabled={busy} onClick={() => changeChips(-100)}>-100</Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={busy} onClick={refresh}>Actualizar</Button>
              <Button size="sm" variant="ghost">Editar perfil</Button>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <p className="text-xs text-muted-foreground mt-3">Estos ajustes son temporales para pruebas. Luego se limitarán según reglas de juego.</p>
        </CardContent>
      </Card>
    </div>
  )
}
