"use client"

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Orden de números (ruleta europea, 37 casillas)
const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6,
  27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29,
  7, 28, 12, 35, 3, 26,
]

const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])
const colorFor = (n: number): 'GREEN' | 'RED' | 'BLACK' => (n === 0 ? 'GREEN' : (RED_NUMBERS.has(n) ? 'RED' : 'BLACK'))

export type RouletteWheelRef = {
  spinTo: (num: number, opts?: { spins?: number; durationMs?: number }) => Promise<void>
}

export function numberIndex(n: number) {
  const i = WHEEL_ORDER.indexOf(n)
  if (i === -1) throw new Error(`Número ${n} no existe en la ruleta`)
  return i
}

export const RouletteWheel = forwardRef<RouletteWheelRef, {
  className?: string
  size?: number // px
}>(function RouletteWheel({ className, size = 320 }, ref) {
  const step = 360 / WHEEL_ORDER.length
  const [rotation, setRotation] = useState(0) // grados
  const wheelRef = useRef<HTMLDivElement>(null)
  const transResolver = useRef<(() => void) | null>(null)

  useImperativeHandle(ref, () => ({
    spinTo: async (num: number, opts?: { spins?: number; durationMs?: number }) => {
      const spins = Math.max(3, Math.floor(opts?.spins ?? 6))
      const durationMs = Math.max(800, Math.floor(opts?.durationMs ?? 4000))
      const idx = numberIndex(num)

      // Queremos que el índice idx quede en la parte superior (puntero). En rotación 0, el centro del índice i está en i*step.
      // Para llevar el centro de idx al puntero (0°), la rotación final debe cumplir: final % 360 = -idx*step (mod 360)
      const current = rotation
      const norm = ((current % 360) + 360) % 360
  // Centro del segmento: idx*step + step/2
  const desired = ((-(idx * step + step / 2)) % 360 + 360) % 360
      const deltaMod = (desired - norm + 360) % 360
      const finalRotation = current + spins * 360 + deltaMod

      return new Promise<void>((resolve) => {
        if (!wheelRef.current) return resolve()
        transResolver.current = resolve
        const el = wheelRef.current
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        requestAnimationFrame(() => {
          setRotation(finalRotation)
        })
      })
    }
  }), [rotation, step])

  // Limpiar transición tras terminar para no acumular
  const onTransitionEnd = () => {
    if (!wheelRef.current) return
    // Eliminar transición para posteriores cambios instantáneos
    wheelRef.current.style.transition = ""
    if (transResolver.current) {
      transResolver.current()
      transResolver.current = null
    }
  }

  const slices = useMemo(() => {
    const arr: {
      start: number
      end: number
      n: number
      color: 'GREEN' | 'RED' | 'BLACK'
    }[] = []
    for (let i = 0; i < WHEEL_ORDER.length; i++) {
      const n = WHEEL_ORDER[i]
      const start = i * step
      const end = (i + 1) * step
      arr.push({ start, end, n, color: colorFor(n) })
    }
    return arr
  }, [step])

  const r = size / 2
  const labelRadius = r * 0.78

  function arcPath(cx: number, cy: number, rad: number, a0: number, a1: number) {
    // ángulos en grados (0° arriba, sentido horario)
    const toRad = (deg: number) => (Math.PI / 180) * (deg - 90)
    const x0 = cx + rad * Math.cos(toRad(a0))
    const y0 = cy + rad * Math.sin(toRad(a0))
    const x1 = cx + rad * Math.cos(toRad(a1))
    const y1 = cy + rad * Math.sin(toRad(a1))
    const largeArc = a1 - a0 > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${x0} ${y0} A ${rad} ${rad} 0 ${largeArc} 1 ${x1} ${y1} Z`
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Puntero superior */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: -8 }}>
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-yellow-400 drop-shadow" />
      </div>

      {/* Rueda */}
      <div
        ref={wheelRef}
        onTransitionEnd={onTransitionEnd}
        className="absolute inset-0 rounded-full will-change-transform"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id="rouletteCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#111" />
              <stop offset="85%" stopColor="#111" />
              <stop offset="100%" stopColor="#333" />
            </radialGradient>
          </defs>
          <circle cx={r} cy={r} r={r} fill="#0a0a0a" stroke="#444" strokeWidth={2} />
          {slices.map((s, i) => (
            <path
              key={i}
              d={arcPath(r, r, r - 6, s.start, s.end)}
              fill={s.color === 'RED' ? '#b91c1c' : s.color === 'BLACK' ? '#111' : '#0a7d2b'}
              stroke="#1f2937"
              strokeWidth={1}
            />
          ))}
          {/* Borde interior */}
          <circle cx={r} cy={r} r={r - 6} fill="none" stroke="#27272a" strokeWidth={2} />

          {/* Etiquetas */}
          {slices.map((s, i) => {
            const mid = (s.start + s.end) / 2
            const toRad = (deg: number) => (Math.PI / 180) * (deg - 90)
            const x = r + labelRadius * Math.cos(toRad(mid))
            const y = r + labelRadius * Math.sin(toRad(mid))
            const isGreen = s.color === 'GREEN'
            return (
              <g key={`label-${i}`}> 
                <text
                  x={x}
                  y={y}
                  fontSize={Math.max(10, size * 0.05)}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isGreen ? '#063' : '#f9fafb'}
                >
                  {s.n}
                </text>
              </g>
            )
          })}

          {/* Centro */}
          <circle cx={r} cy={r} r={r * 0.18} fill="url(#rouletteCenter)" stroke="#555" />
        </svg>
      </div>
    </div>
  )
})

export default RouletteWheel
