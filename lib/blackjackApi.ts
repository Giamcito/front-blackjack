export type ApiCard = { suit: number; rank: number }
export type ApiPlayer = { id: string; hand: ApiCard[]; balance?: number; bet?: number; active?: boolean }
export type ApiDealer = { id: string; hand: ApiCard[] }
export type ApiDeck = { id: string; numDecks: number; remaining: number }
export type ApiGame = { id: string; deck: ApiDeck; players: ApiPlayer[]; dealer: ApiDealer; finished: boolean }

async function req<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input as any, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export async function createDeck(decks = 1) {
  return req<{ mensaje: string; deck: ApiDeck }>(`/api/blackjack/deck?decks=${decks}`, { method: 'POST' })
}

export async function shuffleDeck(deckId: string, seed?: number) {
  const q = typeof seed === 'number' ? `?seed=${seed}` : ''
  return req<{ mensaje: string }>(`/api/blackjack/deck/${deckId}/shuffle${q}`, { method: 'POST' })
}

export async function createGame(players = 1, decks = 1) {
  return req<{ mensaje: string; game: ApiGame }>(`/api/blackjack/game?players=${players}&decks=${decks}`, { method: 'POST' })
}

export async function dealInitial(gameId: string) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}/deal`, { method: 'POST' })
}

export async function playerHit(gameId: string, playerIdx = 0) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}/player/${playerIdx}/hit`, { method: 'POST' })
}

export async function placeBet(gameId: string, playerIdx = 0, amount: number) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}/player/${playerIdx}/bet?amount=${amount}`, { method: 'POST' })
}

export async function dealerPlay(gameId: string) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}/dealer/play`, { method: 'POST' })
}

export async function settleBets(gameId: string) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}/settle`, { method: 'POST' })
}

export async function getGame(gameId: string) {
  return req<{ mensaje: string; game: ApiGame }>(`/api/blackjack/game/${gameId}`)
}

export async function deleteGame(gameId: string) {
  return req<{ mensaje: string }>(`/api/blackjack/game/${gameId}` , { method: 'DELETE' })
}
