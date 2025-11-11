import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spade, Heart, Club, Diamond, Target, BookOpen, Lightbulb, Calculator } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#0a1810]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        {/* Decorative cards */}
        <div className="absolute left-4 top-20 opacity-20 rotate-[-15deg]">
          <Card className="w-16 h-24 md:w-20 md:h-32 bg-card/50 backdrop-blur" />
        </div>
        <div className="absolute right-4 top-32 opacity-20 rotate-12">
          <Card className="w-16 h-24 md:w-20 md:h-32 bg-card/50 backdrop-blur" />
        </div>
        <div className="absolute left-10 bottom-20 opacity-15 rotate-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--casino-gold)] blur-sm" />
        </div>
        <div className="absolute right-16 top-40 opacity-15 rotate-[-25deg]">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-destructive blur-sm" />
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-balance">
            <span className="bg-gradient-to-r from-[var(--casino-gold)] via-secondary to-[var(--casino-gold)] bg-clip-text text-transparent">
              BLACKJACK
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl text-primary">ACADEMY</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Aprende, juega y domina el arte del Blackjack
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            >
              <Link href="#reglas">Aprender Reglas</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="#juego">Jugar</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-[var(--casino-gold)] text-[var(--casino-gold)] hover:bg-[var(--casino-gold)]/10 bg-transparent"
            >
              <Link href="#estrategias">Configuración</Link>
            </Button>
          </div>

          <div className="mt-16 flex justify-center gap-6 text-muted-foreground">
            <Spade className="w-8 h-8" />
            <Heart className="w-8 h-8" />
            <Club className="w-8 h-8" />
            <Diamond className="w-8 h-8" />
          </div>
        </div>
      </section>

      {/* Educational Guide Section */}
      <section id="reglas" className="px-4 py-20 bg-card/30 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--casino-gold)]">
            Guía Educativa
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Aprende las reglas fundamentales del Blackjack y conviértete en un experto
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Objetivo del Juego</h3>
                <p className="text-muted-foreground">
                  Alcanza 21 puntos o acércate lo más posible sin pasarte. Supera la mano del crupier para ganar.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Valores de las Cartas</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• Números 2-10: Valor nominal</li>
                  <li>• J, Q, K: Valen 10 puntos</li>
                  <li>• As: Vale 1 u 11 puntos</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--casino-gold)]/20 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-[var(--casino-gold)]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Estrategia Básica</h3>
                <p className="text-muted-foreground">
                  Pide carta con 11 o menos. Plántate con 17 o más. Dobla con 10 u 11 cuando el crupier tenga cartas
                  bajas.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-gradient-to-r from-card to-[var(--casino-felt)]/20 border-[var(--casino-gold)]/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--casino-gold)]/30 flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-[var(--casino-gold)]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--casino-gold)]">Estrategias Avanzadas</h3>
                  <p className="text-muted-foreground mb-4">
                    Domina técnicas profesionales para mejorar tus probabilidades de ganar. El conteo de cartas es una
                    habilidad avanzada que te permite rastrear las cartas jugadas y tomar decisiones más informadas.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    📚 Próximamente: Guía completa de conteo de cartas, estrategias de apuesta y gestión de bankroll.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Game Simulator Section */}
      <section id="juego" className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--casino-gold)]">
            Zona de Juego
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Practica tus habilidades con nuestro simulador educativo
          </p>

          <Card className="bg-gradient-to-br from-[var(--casino-felt)] to-[var(--casino-green)] border-[var(--casino-gold)]/30 overflow-hidden">
            <CardContent className="p-0">
              {/* Betting Screen */}
              <div className="relative min-h-[600px] flex flex-col items-center justify-center p-8">
                {/* Table felt texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--casino-green)_0%,_var(--casino-felt)_100%)] opacity-80" />

                <div className="relative z-10 w-full max-w-4xl">
                  {/* Dealer Section */}
                  <div className="text-center mb-12">
                    <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50 mb-8">
                      <span className="text-[var(--casino-gold)] font-bold">CRUPIER</span>
                    </div>
                  </div>

                  {/* Betting prompt */}
                  <div className="text-center mb-12">
                    <div className="inline-block px-8 py-4 bg-background/90 backdrop-blur rounded-2xl border border-primary/50">
                      <p className="text-primary text-lg font-semibold">Realiza tu apuesta para comenzar</p>
                    </div>
                  </div>

                  {/* Player Section */}
                  <div className="text-center mb-12">
                    <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50">
                      <span className="text-[var(--casino-gold)] font-bold">JUGADOR</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
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

          {/* Game Controls Info */}
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
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-[var(--font-display)] text-2xl font-bold text-[var(--casino-gold)] mb-4">
                BLACKJACK ACADEMY
              </h3>
              <p className="text-sm text-muted-foreground">
                Tu academia digital para aprender y dominar el Blackjack de forma responsable.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#reglas" className="text-muted-foreground hover:text-primary transition-colors">
                    Reglas del Juego
                  </Link>
                </li>
                <li>
                  <Link href="#estrategias" className="text-muted-foreground hover:text-primary transition-colors">
                    Estrategias
                  </Link>
                </li>
                <li>
                  <Link href="#juego" className="text-muted-foreground hover:text-primary transition-colors">
                    Simulador
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Redes Sociales</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Aprende con responsabilidad. El juego debe ser entretenimiento, no una fuente de ingresos.
            </p>
            <p className="text-sm text-muted-foreground">© 2025 Blackjack Academy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
