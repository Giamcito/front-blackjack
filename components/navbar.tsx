"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/reglas", label: "Reglas" },
  { href: "/juego", label: "Juego" },
  { href: "/configuracion", label: "Configuración" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-[var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--casino-gold)]">
            BLACKJACK
          </span>
          <span className="hidden text-sm text-primary md:inline">ACADEMY</span>
        </Link>

        <nav className="hidden gap-2 md:flex">
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
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
