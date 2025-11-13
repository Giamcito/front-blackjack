"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image, { type StaticImageData } from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  createGame as apiCreateGame,
  dealInitial as apiDealInitial,
  playerHit as apiPlayerHit,
  dealerPlay as apiDealerPlay,
  settleBets as apiSettleBets,
  getGame as apiGetGame,
  placeBet as apiPlaceBet,
  type ApiCard,
  type ApiGame,
} from "@/lib/blackjackApi"
// Sonidos vía carpeta public para compatibilidad con Turbopack
const AUDIO_CHIP = "/Sonidos/dinero.m4a"
const AUDIO_WIN = "/Sonidos/ganador.mp3"
const AUDIO_LOSE = "/Sonidos/perdedor.mp3"

// Fondo de carta oculta
import CartaBack from "@/assets/Cartas/CartaBack.png"

// Corazones
import Corazon1 from "@/assets/Cartas/Corazon1.png"
import Corazon10 from "@/assets/Cartas/Corazon10.png"
import Corazon2 from "@/assets/Cartas/Corazon2.png"
import Corazon3 from "@/assets/Cartas/Corazon3.png"
import Corazon4 from "@/assets/Cartas/Corazon4.png"
import Corazon5 from "@/assets/Cartas/Corazon5.png"
import Corazon6 from "@/assets/Cartas/Corazon6.png"
import Corazon7 from "@/assets/Cartas/Corazon7.png"
import Corazon8 from "@/assets/Cartas/Corazon8.png"
import Corazon9 from "@/assets/Cartas/Corazon9.png"
import CorazonJ from "@/assets/Cartas/CorazonJ.png"
import CorazonK from "@/assets/Cartas/CorazonK.png"
import CorazonQ from "@/assets/Cartas/CorazonQ.png"

// Diamantes
import Diamante1 from "@/assets/Cartas/Diamante1.png"
import Diamante10 from "@/assets/Cartas/Diamante10.png"
import Diamante2 from "@/assets/Cartas/Diamante2.png"
import Diamante3 from "@/assets/Cartas/Diamante3.png"
import Diamante4 from "@/assets/Cartas/Diamante4.png"
import Diamante5 from "@/assets/Cartas/Diamante5.png"
import Diamante6 from "@/assets/Cartas/Diamante6.png"
import Diamante7 from "@/assets/Cartas/Diamante7.png"
import Diamante8 from "@/assets/Cartas/Diamante8.png"
import Diamante9 from "@/assets/Cartas/Diamante9.png"
import DiamanteJ from "@/assets/Cartas/DiamanteJ.png"
import DiamanteK from "@/assets/Cartas/DiamanteK.png"
import DiamanteQ from "@/assets/Cartas/DiamanteQ.png"

// Picas
import Pica1 from "@/assets/Cartas/Pica1.png"
import Pica10 from "@/assets/Cartas/Pica10.png"
import Pica2 from "@/assets/Cartas/Pica2.png"
import Pica3 from "@/assets/Cartas/Pica3.png"
import Pica4 from "@/assets/Cartas/Pica4.png"
import Pica5 from "@/assets/Cartas/Pica5.png"
import Pica6 from "@/assets/Cartas/Pica6.png"
import Pica7 from "@/assets/Cartas/Pica7.png"
import Pica8 from "@/assets/Cartas/Pica8.png"
import Pica9 from "@/assets/Cartas/Pica9.png"
import PicaJ from "@/assets/Cartas/PicaJ.png"
import PicaK from "@/assets/Cartas/PicaK.png"
import PicaQ from "@/assets/Cartas/PicaQ.png"

// Tréboles
import Trebol1 from "@/assets/Cartas/Trebol1.png"
import Trebol10 from "@/assets/Cartas/Trebol10.png"
import Trebol2 from "@/assets/Cartas/Trebol2.png"
import Trebol3 from "@/assets/Cartas/Trebol3.png"
import Trebol4 from "@/assets/Cartas/Trebol4.png"
import Trebol5 from "@/assets/Cartas/Trebol5.png"
import Trebol6 from "@/assets/Cartas/Trebol6.png"
import Trebol7 from "@/assets/Cartas/Trebol7.png"
import Trebol8 from "@/assets/Cartas/Trebol8.png"
import Trebol9 from "@/assets/Cartas/Trebol9.png"
import TrebolJ from "@/assets/Cartas/TrebolJ.png"
import TrebolK from "@/assets/Cartas/TrebolK.png"
import TrebolQ from "@/assets/Cartas/TrebolQ.png"

type Suit = "Corazon" | "Diamante" | "Pica" | "Trebol"
type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K"
type Phase = "betting" | "player" | "dealer" | "settled"

interface PlayingCard {
  suit: Suit
  rank: Rank
  img: StaticImageData
}

const IMAGE_MAP: Record<Suit, Record<Rank, StaticImageData>> = {
  Corazon: {
    1: Corazon1,
    2: Corazon2,
    3: Corazon3,
    4: Corazon4,
    5: Corazon5,
    6: Corazon6,
    7: Corazon7,
    8: Corazon8,
    9: Corazon9,
    10: Corazon10,
    J: CorazonJ,
    Q: CorazonQ,
    K: CorazonK,
  } as unknown as Record<Rank, StaticImageData>,
  Diamante: {
    1: Diamante1,
    2: Diamante2,
    3: Diamante3,
    4: Diamante4,
    5: Diamante5,
    6: Diamante6,
    7: Diamante7,
    8: Diamante8,
    9: Diamante9,
    10: Diamante10,
    J: DiamanteJ,
    Q: DiamanteQ,
    K: DiamanteK,
  } as unknown as Record<Rank, StaticImageData>,
  Pica: {
    1: Pica1,
    2: Pica2,
    3: Pica3,
    4: Pica4,
    5: Pica5,
    6: Pica6,
    7: Pica7,
    8: Pica8,
    9: Pica9,
    10: Pica10,
    J: PicaJ,
    Q: PicaQ,
    K: PicaK,
  } as unknown as Record<Rank, StaticImageData>,
  Trebol: {
    1: Trebol1,
    2: Trebol2,
    3: Trebol3,
    4: Trebol4,
    5: Trebol5,
    6: Trebol6,
    7: Trebol7,
    8: Trebol8,
    9: Trebol9,
    10: Trebol10,
    J: TrebolJ,
    Q: TrebolQ,
    K: TrebolK,
  } as unknown as Record<Rank, StaticImageData>,
}

const SUITS: Suit[] = ["Corazon", "Diamante", "Pica", "Trebol"]
const RANKS: Rank[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function buildDeck(numDecks = 1): PlayingCard[] {
  const deck: PlayingCard[] = []
  for (let d = 0; d < numDecks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({ suit, rank, img: IMAGE_MAP[suit][rank] })
      }
    }
  }
  return deck
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function handValue(hand: PlayingCard[]): { total: number; isSoft: boolean } {
  let total = 0
  let aces = 0
  for (const c of hand) {
    if (c.rank === "J" || c.rank === "Q" || c.rank === "K") total += 10
    else if (c.rank === "1") {
      aces += 1
      total += 1
    } else total += Number(c.rank)
  }
  let isSoft = false
  while (aces > 0 && total + 10 <= 21) {
    total += 10
    aces -= 1
    isSoft = true
  }
  return { total, isSoft }
}

function isBlackjack(hand: PlayingCard[]): boolean {
  return hand.length === 2 && handValue(hand).total === 21
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)

export default function JuegoPage() {
  // Modo backend: usa microservicio vía proxy /api/blackjack/*
  const USE_BACKEND = true
  const [gameId, setGameId] = useState<string | null>(null)
  const [apiDump, setApiDump] = useState<string>("")
  const [apiBusy, setApiBusy] = useState<boolean>(false)
  const [phase, setPhase] = useState<Phase>("betting")
  const gameAreaRef = useRef<HTMLDivElement | null>(null)
  // Referencia mutable del mazo para evitar duplicaciones al robar varias cartas en un mismo tick.
  const deckRef = useRef<PlayingCard[]>(shuffle(buildDeck(1)))
  const [shoe, setShoe] = useState<PlayingCard[]>(deckRef.current)
  const [player, setPlayer] = useState<PlayingCard[]>([])
  const [dealer, setDealer] = useState<PlayingCard[]>([])
  const [balance, setBalance] = useState<number>(1000)
  const [pendingBet, setPendingBet] = useState<number>(0)
  const [bet, setBet] = useState<number>(0)
  const [revealDealer, setRevealDealer] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("Realiza tu apuesta para comenzar")
  // Cartas restantes reportadas por el backend (si está disponible)
  const [deckRemaining, setDeckRemaining] = useState<number | null>(null)
  // Saldo al inicio de la ronda para normalizar pagos (win/push/blackjack)
  const roundStartBalanceRef = useRef<number>(balance)
  // Para evitar cierre obsoleto: pasar mano del jugador a la liquidación cuando auto-se planta
  const settlementPlayerRef = useRef<PlayingCard[] | null>(null)
  // Para evitar cierre obsoleto del valor de apuesta (especialmente tras doblar)
  const betRef = useRef<number>(0)
  useEffect(() => {
    betRef.current = bet
  }, [bet])
  // Audio refs
  const winAudioRef = useRef<HTMLAudioElement | null>(null)
  const loseAudioRef = useRef<HTMLAudioElement | null>(null)
  const chipAudioRef = useRef<HTMLAudioElement | null>(null)
  // AudioContext compartido para beep de respaldo (si faltan archivos)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Inicializa objetos de audio de forma programática al primer gesto del usuario
  const ensureAudio = useCallback(() => {
    if (!winAudioRef.current) {
      const a = new Audio(AUDIO_WIN)
      a.preload = "auto"
      a.onerror = () => { winAudioRef.current = null }
      winAudioRef.current = a
    }
    if (!loseAudioRef.current) {
      const a = new Audio(AUDIO_LOSE)
      a.preload = "auto"
      a.onerror = () => { loseAudioRef.current = null }
      loseAudioRef.current = a
    }
    if (!chipAudioRef.current) {
      const a = new Audio(AUDIO_CHIP)
      a.preload = "auto"
      a.onerror = () => { chipAudioRef.current = null }
      chipAudioRef.current = a
    }
    if (typeof window !== "undefined" && !audioCtxRef.current) {
      try {
        // AudioContext debe crearse tras un gesto del usuario
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch {}
    }
  }, [])

  // Tiny beep fallback using Web Audio API when the audio files are missing
  const playBeep = useCallback((kind: "win" | "lose" | "chip") => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    let freq = 440
    let duration = 0.18
    let volume = 0.07
    if (kind === "win") { freq = 880; duration = 0.22; volume = 0.09 }
    if (kind === "lose") { freq = 220; duration = 0.25; volume = 0.06 }
    if (kind === "chip") { freq = 600; duration = 0.08; volume = 0.05 }
    osc.type = kind === "lose" ? "sawtooth" : "sine"
    osc.frequency.value = freq
    gain.gain.value = volume
    osc.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    osc.start(now)
    // quick decay for a snappy click/coin effect
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.stop(now + duration + 0.02)
  }, [])

  const playAudioOrBeep = useCallback((audio: HTMLAudioElement | null, kind: "win" | "lose" | "chip") => {
    if (!audio) {
      playBeep(kind)
      return
    }
    try {
      audio.pause()
      audio.currentTime = 0
      const p = audio.play()
      if (p && typeof p.then === "function") {
        p.catch(() => playBeep(kind))
      }
    } catch {
      playBeep(kind)
    }
  }, [playBeep])

  // Helpers centralizados para disparar sonidos
  const playWin = useCallback(() => {
    ensureAudio()
    playAudioOrBeep(winAudioRef.current, "win")
  }, [ensureAudio, playAudioOrBeep])
  const playLose = useCallback(() => {
    ensureAudio()
    playAudioOrBeep(loseAudioRef.current, "lose")
  }, [ensureAudio, playAudioOrBeep])
  const playChipSound = useCallback(() => {
    ensureAudio()
    playAudioOrBeep(chipAudioRef.current, "chip")
  }, [ensureAudio, playAudioOrBeep])

  const playerTotal = useMemo(() => handValue(player).total, [player])
  const dealerTotal = useMemo(() => handValue(dealer).total, [dealer])

  const canDouble = phase === "player" && player.length === 2 && balance >= bet && bet > 0

  const drawCard = useCallback((): PlayingCard => {
    if (deckRef.current.length <= 10) {
      deckRef.current = shuffle(buildDeck(1))
    }
    const card = deckRef.current[0]
    deckRef.current = deckRef.current.slice(1)
    setShoe(deckRef.current)
    return card
  }, [])

  // Mapear carta de API a carta con imagen local
  const mapApiCard = useCallback((c: ApiCard): PlayingCard => {
    const suit: Suit = c.suit === 0 ? "Trebol" : c.suit === 1 ? "Diamante" : c.suit === 2 ? "Corazon" : "Pica"
    let rank: Rank
    if (c.rank === 11) rank = "J"
    else if (c.rank === 12) rank = "Q"
    else if (c.rank === 13) rank = "K"
    else rank = String(c.rank) as Rank
    return { suit, rank, img: IMAGE_MAP[suit][rank] }
  }, [])

  const refreshFromApiGame = useCallback((g: ApiGame) => {
    const p0 = g.players?.[0]
    const playerCards: PlayingCard[] = (p0?.hand || []).map(mapApiCard)
    const dealerCards: PlayingCard[] = (g.dealer?.hand || []).map(mapApiCard)
    setPlayer(playerCards)
    setDealer(dealerCards)
    // Si el backend expone cartas restantes del mazo, reflejarlas
    try {
      // @ts-ignore - algunos backends incluyen deck.remaining en la respuesta del juego
      const rem = (g as any)?.deck?.remaining
      if (typeof rem === 'number') {
        setDeckRemaining(rem)
      }
    } catch {}
  }, [mapApiCard])

  const dealInitial = useCallback(() => {
    const p1 = drawCard()
    const d1 = drawCard()
    const p2 = drawCard()
    const d2 = drawCard()
    const initialPlayer = [p1, p2]
    const initialDealer = [d1, d2]
    setPlayer(initialPlayer)
    setDealer(initialDealer)
    setRevealDealer(false)

    const playerBJ = isBlackjack(initialPlayer)
    const dealerBJ = isBlackjack(initialDealer)

    if (playerBJ || dealerBJ) {
      setRevealDealer(true)
      setPhase("settled")
      if (playerBJ && dealerBJ) {
        setMessage("Ambos tienen Blackjack. Empate.")
        // Empate: restaurar exactamente el saldo inicial de la ronda
        setBalance(() => roundStartBalanceRef.current)
      } else if (playerBJ) {
        setMessage("¡Blackjack! Pago 3:2")
        // Pago total = apuesta + 1.5x de ganancia; saldo final = saldo inicial + 2.5 * bet
        const currentBet = betRef.current
        setBalance(() => roundStartBalanceRef.current + Math.round(currentBet * 2.5))
        playWin()
      } else {
        setMessage("Crupier tiene Blackjack. Pierdes.")
        // Pierde: saldo final = saldo inicial - apuesta
        const currentBet = betRef.current
        setBalance(() => roundStartBalanceRef.current - currentBet)
        playLose()
      }
    } else {
      setPhase("player")
      setMessage("Tu turno: pide carta o plántate")
    }
  }, [drawCard])

  const startRound = async () => {
    if (pendingBet <= 0 || pendingBet > balance) return
    setBet(pendingBet) // actualizará betRef via useEffect
    // Capturar saldo inicial de la ronda y descontar la apuesta
    setBalance((b) => {
      roundStartBalanceRef.current = b
      return b - pendingBet
    })
    setPendingBet(0)
    setMessage("Repartiendo...")
    requestAnimationFrame(() => {
      gameAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    })

    if (!USE_BACKEND) {
      setTimeout(dealInitial, 200)
      return
    }
    try {
      // Reutilizar el mismo juego (y mazo) entre rondas; crear solo si no existe
      let id = gameId
      let isNewGame = false
      if (!id) {
        const cg = await apiCreateGame(1, 1)
        id = cg.game.id
        setGameId(id)
        // Intentar barajar el mazo del juego recién creado para asegurar aleatoriedad
        try {
          // Si el backend devuelve el deck en la respuesta de createGame, usarlo
          const deckId = cg.game?.deck?.id
          if (deckId) {
            const seed = Date.now() & 0x7fffffff
            const { shuffleDeck: apiShuffleDeck } = await import("@/lib/blackjackApi")
            await apiShuffleDeck(deckId, seed)
          }
        } catch {}
        isNewGame = true
      }
      // Sincronizar apuesta en el servidor (para liquidación correcta)
      try {
        await apiPlaceBet(id!, 0, pendingBet)
        await apiDealInitial(id!)
      } catch {
        // Si el juego expiró/ no existe en el backend (p.ej. reinicio del microservicio), recrear
        const cg2 = await apiCreateGame(1, 1)
        id = cg2.game.id
        setGameId(id)
        // Barajar el mazo del juego recreado
        try {
          const deckId2 = cg2.game?.deck?.id
          if (deckId2) {
            const seed2 = Date.now() & 0x7fffffff
            const { shuffleDeck: apiShuffleDeck } = await import("@/lib/blackjackApi")
            await apiShuffleDeck(deckId2, seed2)
          }
        } catch {}
        await apiPlaceBet(id!, 0, pendingBet)
        await apiDealInitial(id!)
      }
      const g = await apiGetGame(id!)
      refreshFromApiGame(g.game)

      const playerBJ = isBlackjack((g.game.players?.[0]?.hand || []).map(mapApiCard))
      const dealerBJ = isBlackjack((g.game.dealer?.hand || []).map(mapApiCard))
      setRevealDealer(false)
      if (playerBJ || dealerBJ) {
        setRevealDealer(true)
        setPhase("settled")
        if (playerBJ && dealerBJ) {
          setMessage("Ambos tienen Blackjack. Empate.")
          setBalance(() => roundStartBalanceRef.current)
        } else if (playerBJ) {
          setMessage("¡Blackjack! Pago 3:2")
          const currentBet = betRef.current
          setBalance(() => roundStartBalanceRef.current + Math.round(currentBet * 2.5))
          playWin()
        } else {
          setMessage("Crupier tiene Blackjack. Pierdes.")
          const currentBet = betRef.current
          setBalance(() => roundStartBalanceRef.current - currentBet)
          playLose()
        }
      } else {
        setPhase("player")
        setMessage("Tu turno: pide carta o plántate")
      }
    } catch (e) {
      setMessage("No se pudo iniciar la ronda. Intenta de nuevo.")
    }
  }

  const hit = async () => {
    if (phase !== "player") return
    if (!USE_BACKEND) {
      const c = drawCard()
      setPlayer(h => {
        const next = [...h, c]
        const { total } = handValue(next)
        if (total > 21) {
          setPhase("settled")
          setRevealDealer(true)
          setMessage("Te pasaste de 21. Pierdes.")
          playLose()
        } else if (total === 21) {
          settlementPlayerRef.current = next
          setTimeout(() => stand(), 150)
        }
        return next
      })
      return
    }
    if (!gameId) return
    await apiPlayerHit(gameId, 0)
    const g = await apiGetGame(gameId)
    refreshFromApiGame(g.game)
    const total = handValue((g.game.players?.[0]?.hand || []).map(mapApiCard)).total
    if (total > 21) {
      setPhase("settled")
      setRevealDealer(true)
      setMessage("Te pasaste de 21. Pierdes.")
      playLose()
    } else if (total === 21) {
      settlementPlayerRef.current = (g.game.players?.[0]?.hand || []).map(mapApiCard)
      setTimeout(() => stand(), 150)
    }
  }

  const stand = async () => {
    if (phase !== "player") return
    setRevealDealer(true)
    setPhase("dealer")

    if (!USE_BACKEND) {
      setTimeout(() => {
        setDealer((current) => {
          let next = [...current]
          while (handValue(next).total < 17) {
            next = [...next, drawCard()]
          }
          const playerForTotal = settlementPlayerRef.current ?? player
          settlementPlayerRef.current = null
          const p = handValue(playerForTotal).total
          const d = handValue(next).total
          let msg: string
          if (d > 21) {
            msg = "Crupier se pasa. ¡Ganas!"
            const currentBet = betRef.current
            setBalance(() => roundStartBalanceRef.current + currentBet)
            playWin()
          } else if (p > d) {
            msg = "¡Ganas!"
            const currentBet = betRef.current
            setBalance(() => roundStartBalanceRef.current + currentBet)
            playWin()
          } else if (p < d) {
            msg = "Pierdes."
            const currentBet = betRef.current
            setBalance(() => roundStartBalanceRef.current - currentBet)
            playLose()
          } else {
            msg = "Empate. Se devuelve la apuesta."
            setBalance(() => roundStartBalanceRef.current)
          }
          setMessage(msg)
          setPhase("settled")
          return next
        })
      }, 250)
      return
    }
    if (!gameId) return
    await apiDealerPlay(gameId)
    await apiSettleBets(gameId)
    const g = await apiGetGame(gameId)
    refreshFromApiGame(g.game)
    const p = handValue((settlementPlayerRef.current ?? (g.game.players?.[0]?.hand || []).map(mapApiCard)) as PlayingCard[]).total
    settlementPlayerRef.current = null
    const d = handValue((g.game.dealer?.hand || []).map(mapApiCard)).total
    let msg: string
    if (d > 21) {
      msg = "Crupier se pasa. ¡Ganas!"
      const currentBet = betRef.current
      setBalance(() => roundStartBalanceRef.current + currentBet)
      playWin()
    } else if (p > d) {
      msg = "¡Ganas!"
      const currentBet = betRef.current
      setBalance(() => roundStartBalanceRef.current + currentBet)
      playWin()
    } else if (p < d) {
      msg = "Pierdes."
      const currentBet = betRef.current
      setBalance(() => roundStartBalanceRef.current - currentBet)
      playLose()
    } else {
      msg = "Empate. Se devuelve la apuesta."
      setBalance(() => roundStartBalanceRef.current)
    }
    setMessage(msg)
    setPhase("settled")
  }

  const doubleDown = async () => {
    if (!canDouble) return
    setBalance(b => b - bet)
    setBet(v => v * 2)
    if (!USE_BACKEND) {
      const c = drawCard()
      setPlayer(h => {
        const next = [...h, c]
        const { total } = handValue(next)
        if (total > 21) {
          setPhase("settled")
          setRevealDealer(true)
          setMessage("Te pasaste de 21. Pierdes.")
          playLose()
        } else {
          settlementPlayerRef.current = next
          setTimeout(stand, 150)
        }
        return next
      })
      return
    }
    if (!gameId) return
    // Reflejar doble de apuesta en el servidor
    try { await apiPlaceBet(gameId, 0, bet) } catch {}
    await apiPlayerHit(gameId, 0)
    const g = await apiGetGame(gameId)
    const next = (g.game.players?.[0]?.hand || []).map(mapApiCard)
    setPlayer(next)
    const { total } = handValue(next)
    if (total > 21) {
      setPhase("settled")
      setRevealDealer(true)
      setMessage("Te pasaste de 21. Pierdes.")
      playLose()
    } else {
      settlementPlayerRef.current = next
      setTimeout(stand, 150)
    }
  }

  const clearBet = () => setPendingBet(0)
  const addChip = (amount: number) => {
    if (phase !== "betting") return
    setPendingBet((cur) => Math.min(balance, cur + amount))
    // Sonido de ficha
    playChipSound()
  }

  const newRound = () => {
    setPlayer([])
    setDealer([])
    setRevealDealer(false)
    setBet(0)
    setPhase("betting")
    setMessage("Realiza tu apuesta para comenzar")
    setApiDump("")
    // Sólo rebarajar el mazo local en modo sin backend
    if (!USE_BACKEND) {
      if (deckRef.current.length < 30) {
        deckRef.current = shuffle(buildDeck(1))
        setShoe(deckRef.current)
      }
    }
    // Reposicionar al inicio en nueva ronda para facilitar apuestas
    requestAnimationFrame(() => {
      gameAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  // Utilidades de backend para depurar/administrar partida
  const viewApiState = async () => {
    if (!USE_BACKEND || !gameId) return
    setApiBusy(true)
    try {
      const g = await apiGetGame(gameId)
      setApiDump(JSON.stringify(g, null, 2))
    } catch (e: any) {
      setApiDump(`Error: ${e?.message ?? "desconocido"}`)
    } finally {
      setApiBusy(false)
    }
  }

  const resetGame = async () => {
    // Borra en backend si hay partida activa, y limpia el estado local
    try {
      if (USE_BACKEND && gameId) {
        // Lazy import para evitar circular: usar la firma ya importada arriba
        const { deleteGame: apiDeleteGame } = await import("@/lib/blackjackApi")
        await apiDeleteGame(gameId)
      }
    } catch {}
    setGameId(null)
    setDeckRemaining(null)
    newRound()
  }

  return (
  <div className="relative mx-auto max-w-7xl px-2 md:px-4" onPointerDown={ensureAudio}>
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-center mb-3 text-[var(--casino-gold)]">
        Blackjack Educativo
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-sm md:text-base">
        Ajusta tu apuesta, juega y practica la estrategia básica
      </p>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Tablero principal */}
        <Card
          ref={gameAreaRef}
          className="flex-1 bg-gradient-to-br from-[var(--casino-felt)] via-emerald-800 to-[var(--casino-green)] border-[var(--casino-gold)]/40 overflow-hidden relative shadow-2xl rounded-3xl"
        >
          <CardContent className="p-0">
            <div className="relative min-h-[620px] flex flex-col items-center justify-center p-8">
              {/* Fondo decorativo animado */}
              <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,215,0,0.08),transparent_65%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--casino-green)_0%,_var(--casino-felt)_100%)] mix-blend-overlay" />

            <div className="relative z-10 w-full max-w-4xl">
              {/* Dealer */}
              <div className="text-center mb-6">
                <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50 mb-4">
                  <span className="text-[var(--casino-gold)] font-bold">CRUPIER</span>
                </div>
                <div className="flex items-center justify-center gap-5 flex-wrap">
                  {dealer.length === 0 && (
                    <div className="text-sm text-muted-foreground italic">Esperando ronda...</div>
                  )}
                  {dealer.map((c, idx) => (
                    <div
                      key={`d-${idx}`}
                      className="relative w-[104px] h-[150px] md:w-[128px] md:h-[186px] rounded-xl overflow-hidden shadow-[0_8px_18px_-4px_rgba(0,0,0,0.6)] border border-[var(--casino-gold)]/40 bg-background/10 backdrop-blur-sm transition-transform duration-200 animate-[fadeIn_0.4s_ease]"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {idx === 1 && !revealDealer ? (
                        <Image src={CartaBack} alt="Carta oculta" fill className="object-contain" />
                      ) : (
                        <Image src={c.img} alt={`${c.suit} ${c.rank}`} fill className="object-contain" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-foreground/90">
                  {dealer.length > 0 && (
                    <span>Total: {revealDealer ? dealerTotal : handValue([dealer[0]]).total}</span>
                  )}
                </div>
              </div>

              {/* Mensajes */}
              <div className="text-center mb-10">
                <div className="inline-block px-10 py-5 bg-gradient-to-r from-primary/90 to-primary/40 backdrop-blur-md rounded-3xl border border-primary/60 shadow-[0_0_0_2px_rgba(255,255,255,0.05),0_10px_25px_-5px_rgba(0,0,0,0.5)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:repeating-linear-gradient(45deg,rgba(255,255,255,0.15)_0_8px,transparent_8px_16px)]" />
                  <p className="relative text-background text-xl font-bold tracking-wide drop-shadow-sm animate-[fadeIn_0.5s_ease]" aria-live="polite">{message}</p>
                </div>
              </div>

              {/* Player */}
              <div className="text-center mb-4">
                <div className="inline-block px-6 py-2 bg-background/80 backdrop-blur rounded-full border border-[var(--casino-gold)]/50">
                  <span className="text-[var(--casino-gold)] font-bold">JUGADOR</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
                  {player.map((c, idx) => (
                    <div
                      key={`p-${idx}`}
                      className="relative w-[104px] h-[150px] md:w-[128px] md:h-[186px] rounded-xl overflow-hidden shadow-[0_8px_18px_-4px_rgba(0,0,0,0.6)] border border-primary/40 bg-background/10 backdrop-blur-sm transition-transform duration-200 hover:scale-105 animate-[fadeIn_0.45s_ease]"
                      style={{ animationDelay: `${idx * 70}ms` }}
                    >
                      <Image src={c.img} alt={`${c.suit} ${c.rank}`} fill className="object-contain" />
                    </div>
                  ))}
                </div>
                {player.length > 0 && (
                  <div className="mt-2 text-sm text-foreground/90">Total: {playerTotal}</div>
                )}
              </div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mt-auto">
              {/* Eliminados cuadros de saldo/apuesta/acciones - ahora overlay fijo arriba izq */}

              {phase === "betting" ? (
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {[
                    { label: "$10", amount: 10, color: "bg-destructive", border: "border-destructive" },
                    { label: "$25", amount: 25, color: "bg-primary", border: "border-primary" },
                    { label: "$50", amount: 50, color: "bg-blue-600", border: "border-blue-600" },
                    { label: "$100", amount: 100, color: "bg-zinc-700", border: "border-zinc-500" },
                    { label: "$500", amount: 500, color: "bg-purple-600", border: "border-purple-500" },
                    { label: "$1000", amount: 1000, color: "bg-[var(--casino-gold)]", border: "border-[var(--casino-gold)]" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => addChip(chip.amount)}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${chip.color} ${chip.border} border-4 flex items-center justify-center font-bold text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50`}
                      disabled={pendingBet >= balance}
                      aria-label={`Agregar ficha de ${chip.label}`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Button
                    size="lg"
                    variant="default"
                    className="min-w-32 h-14 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                    onClick={hit}
                    disabled={phase !== "player"}
                  >
                    Pedir carta
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="min-w-32 h-14 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                    onClick={stand}
                    disabled={phase !== "player"}
                  >
                    Plantarse
                  </Button>
                  <Button
                    size="lg"
                    className="min-w-32 h-14 text-base font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                    onClick={doubleDown}
                    disabled={!canDouble}
                  >
                    Doblar
                  </Button>
                  {phase === "settled" && (
                    <Button
                      size="lg"
                      className="min-w-32 h-14 text-base font-semibold bg-[var(--casino-gold)] text-background hover:bg-[var(--casino-gold)]/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
                      onClick={newRound}
                    >
                      Nueva Ronda
                    </Button>
                  )}
                </div>
              )}

              {phase === "betting" ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button size="lg" variant="destructive" className="w-full text-base" onClick={clearBet} disabled={pendingBet === 0}>
                    Limpiar
                  </Button>
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-base"
                    onClick={startRound}
                    disabled={pendingBet === 0 || pendingBet > balance}
                  >
                    Confirmar
                  </Button>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  {phase === "player" ? "Tu turno" : phase === "dealer" ? "Turno del crupier" : "Ronda finalizada"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        </Card>

        {/* Panel lateral (overlay al lado del tablero) */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-4 lg:sticky top-6">
          <div className="px-5 py-4 rounded-2xl bg-black/55 backdrop-blur border border-[var(--casino-gold)]/50 shadow-md">
            <p className="text-xs uppercase tracking-wider text-[var(--casino-gold)] font-semibold mb-1">Saldo</p>
            <p className="text-2xl font-bold text-[var(--casino-gold)] drop-shadow">{formatCurrency(balance)}</p>
          </div>
          <div className="px-5 py-4 rounded-2xl bg-black/50 backdrop-blur border border-primary/40 shadow-md">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Apuesta</p>
            <p className="text-xl font-bold text-primary drop-shadow">{formatCurrency(phase === "betting" ? pendingBet : bet)}</p>
          </div>
          <div className="px-5 py-4 rounded-2xl bg-black/40 backdrop-blur border border-zinc-600/40 shadow-md">
            <p className="text-xs uppercase tracking-wider text-zinc-300 font-semibold mb-1">Estado</p>
            <p className="text-sm font-medium text-zinc-200">
              {phase === "betting" && "Apostando"}
              {phase === "player" && "Turno del jugador"}
              {phase === "dealer" && "Turno del crupier"}
              {phase === "settled" && "Ronda finalizada"}
            </p>
          </div>
        </aside>
  </div>

      {/* Controles backend (compactos, debajo del juego) */}
      <div className="mt-6">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3 rounded-xl bg-black/40 backdrop-blur border border-zinc-600/40">
            <span className="text-xs text-zinc-300">Game ID: {gameId ?? "—"}</span>
            {deckRemaining != null && (
              <span className="text-xs text-zinc-300">Restantes: {deckRemaining}</span>
            )}
            <Button size="sm" onClick={viewApiState} disabled={!gameId || apiBusy}>
              {apiBusy ? "Cargando..." : "Ver estado (API)"}
            </Button>
            <Button size="sm" variant="secondary" onClick={resetGame}>
              Reset partida
            </Button>
          </div>
          {apiDump && (
            <pre className="mt-3 max-h-60 overflow-auto text-xs text-zinc-200 bg-black/40 p-3 rounded-lg border border-zinc-600/40">
              {apiDump}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
