"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout as apiLogout, me } from "@/lib/userApi"

import { useEffect, useState } from "react"

interface NavLink { href: string; label: string }

function buildLinks(authenticated: boolean): NavLink[] {
  return [
    { href: "/", label: "Inicio" },
    { href: "/reglas", label: "Reglas" },
    { href: "/juego", label: "Juego" },
    { href: "/ruleta", label: "Ruleta" },
    { href: "/configuracion", label: "Configuración" },
    authenticated ? { href: "/perfil", label: "Perfil" } : { href: "/login", label: "Acceso" },
  ]
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [links, setLinks] = useState<NavLink[]>(buildLinks(false))
  useEffect(() => {
    const refresh = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      if (!token) { setAuthenticated(false); setLinks(buildLinks(false)); return }
      me().then(() => { setAuthenticated(true); setLinks(buildLinks(true)) }).catch(() => { setAuthenticated(false); setLinks(buildLinks(false)) })
    }
    refresh()
    const onAuth = () => refresh()
    const onStorage = (e: StorageEvent) => { if (e.key === 'auth_token') refresh() }
    window.addEventListener('auth-changed', onAuth)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('auth-changed', onAuth)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const onLogout = () => {
    apiLogout()
    setAuthenticated(false)
    setLinks(buildLinks(false))
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-[var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--casino-gold)]">
            BLACKJACK
          </span>
          <span className="hidden text-sm text-primary md:inline">ACADEMY</span>
        </Link>

        <nav className="hidden gap-2 md:flex items-center">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="inline-flex">
              <Button
                variant={pathname === href ? "default" : "ghost"}
                className={cn(
                  "px-4",
                  pathname === href && "bg-primary text-primary-foreground"
                )}
              >
                {label}
              </Button>
            </Link>
          ))}
          {authenticated && (
            <Button variant="outline" onClick={onLogout}>Salir</Button>
          )}
        </nav>

        {/* Compact menu for mobile with simple links */}
        <div className="flex md:hidden">
          <div className="flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="inline-flex">
                <Button variant={pathname === href ? "default" : "ghost"} size="sm">
                  {label}
                </Button>
              </Link>
            ))}
            {authenticated && (
              <Button variant="outline" size="sm" onClick={onLogout}>Salir</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
