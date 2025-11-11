import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Lightbulb } from "lucide-react"

export default function EstrategiasPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--casino-gold)]">
        Estrategias
      </h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Conceptos clave y recursos para mejorar tu juego de forma responsable.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-[var(--casino-gold)]/20 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-[var(--casino-gold)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Estrategia Básica</h3>
            <p className="text-muted-foreground">
              Aprende cuándo pedir, plantarte, doblar o dividir según tu mano y la carta visible del crupier.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Conteo de Cartas (Teoría)</h3>
            <p className="text-muted-foreground">
              Introducción al conteo Hi-Lo y a la gestión de apuestas. Úsalo como herramienta educativa y práctica
              responsable.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
