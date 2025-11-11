import { Card, CardContent } from "@/components/ui/card"
import { Target, BookOpen, Lightbulb, Calculator } from "lucide-react"

export default function ReglasPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--casino-gold)]">
        Guía Educativa
      </h1>
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
  )
}
