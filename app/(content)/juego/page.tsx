import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator } from "lucide-react"

export default function JuegoPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--casino-gold)]">
        Zona de Juego
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Practica tus habilidades con nuestro simulador educativo
      </p>

      <Card className="bg-gradient-to-br from-[var(--casino-felt)] to-[var(--casino-green)] border-[var(--casino-gold)]/30 overflow-hidden">
        <CardContent className="p-0">
          {/* Betting Screen (placeholder - interactive logic por implementar) */}
          <div className="relative min-h-[600px] flex flex-col items-center justify-center p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--casino-green)_0%,_var(--casino-felt)_100%)] opacity-80" />

            <div className="relative z-10 w-full max-w-4xl">
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50 mb-8">
                  <span className="text-[var(--casino-gold)] font-bold">CRUPIER</span>
                </div>
              </div>

              <div className="text-center mb-12">
                <div className="inline-block px-8 py-4 bg-background/90 backdrop-blur rounded-2xl border border-primary/50">
                  <p className="text-primary text-lg font-semibold">Realiza tu apuesta para comenzar</p>
                </div>
              </div>

              <div className="text-center mb-12">
                <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50">
                  <span className="text-[var(--casino-gold)] font-bold">JUGADOR</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls with balance and chips */}
            <div className="relative z-10 w-full max-w-5xl mt-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Balance */}
                <Card className="bg-background/90 backdrop-blur border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="text-primary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Saldo</p>
                        <p className="text-lg font-bold text-primary">$1,000</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bet Amount */}
                <Card className="bg-background/90 backdrop-blur border-[var(--casino-gold)]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="text-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Apuesta</p>
                        <p className="text-lg font-bold text-secondary">$0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chip Selector Label */}
                <Card className="bg-background/90 backdrop-blur border-border">
                  <CardContent className="p-4 flex items-center justify-center">
                    <p className="text-sm font-semibold text-foreground">Selecciona tus fichas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Chips Selection */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {[
                  { value: "$10", color: "bg-destructive", border: "border-destructive" },
                  { value: "$25", color: "bg-primary", border: "border-primary" },
                  { value: "$50", color: "bg-blue-600", border: "border-blue-600" },
                  { value: "$100", color: "bg-zinc-700", border: "border-zinc-500" },
                  { value: "$500", color: "bg-purple-600", border: "border-purple-500" },
                  { value: "$1000", color: "bg-[var(--casino-gold)]", border: "border-[var(--casino-gold)]" },
                ].map((chip) => (
                  <button
                    key={chip.value}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${chip.color} ${chip.border} border-4 flex items-center justify-center font-bold text-white shadow-lg hover:scale-110 transition-transform`}
                  >
                    {chip.value}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" variant="destructive" className="w-full text-base">
                  Limpiar
                </Button>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-base">
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">🎴</span>
            </div>
            <h4 className="font-bold text-primary mb-1">Pedir Carta</h4>
            <p className="text-xs text-muted-foreground">Solicita una carta adicional</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-destructive mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">✋</span>
            </div>
            <h4 className="font-bold text-destructive mb-1">Plantarse</h4>
            <p className="text-xs text-muted-foreground">Mantén tu mano actual</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-secondary/30">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary mx-auto mb-2 flex items-center justify-center">
              <span className="text-xl">2️⃣</span>
            </div>
            <h4 className="font-bold text-secondary mb-1">Doblar</h4>
            <p className="text-xs text-muted-foreground">Duplica tu apuesta</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--casino-gold)]/10 border-[var(--casino-gold)]/30">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--casino-gold)] mx-auto mb-2 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-background" />
            </div>
            <h4 className="font-bold text-[var(--casino-gold)] mb-1">Conteo de Cartas</h4>
            <p className="text-xs text-muted-foreground">Activa el modo avanzado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
