export type RouletteBetType = 'STRAIGHT' | 'COLOR' | 'EVEN_ODD' | 'HIGH_LOW' | 'DOZEN' | 'COLUMN'
export type RouletteBet = { type: RouletteBetType; value: string; amount: number }

export type SpinRequest = { bets: RouletteBet[] }
export type SpinResult = {
  number: number
  color: 'GREEN' | 'RED' | 'BLACK'
  even: boolean
  zero: boolean
  totalStake: number
  totalPayout: number
  net: number
  breakdown: Array<{
    bet: RouletteBet
    win: boolean
    payout: number
    reason: string
  }>
}

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
  if ((res.headers.get('content-type') || '').includes('application/json')) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}

export async function rouletteStatus() {
  return req<string>('/api/ruleta/status')
}

export async function spin(reqBody: SpinRequest) {
  return req<SpinResult>('/api/ruleta/spin', { method: 'POST', body: JSON.stringify(reqBody) })
}
