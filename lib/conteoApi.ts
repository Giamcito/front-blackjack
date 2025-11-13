type CountResponse = { count: number }

type InitCounterRequest = { numDecks: number }
type RegisterCardRequest = { value: number }
type RecommendationRequest = { playerTotal: number; dealerUpValue: number }

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
  if (res.status === 204) return undefined as unknown as T
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? ((await res.json()) as T) : ((await res.text()) as unknown as T)
}

export async function initCounter(numDecks: number) {
  const body: InitCounterRequest = { numDecks }
  return req<void>('/api/conteo/init', { method: 'POST', body: JSON.stringify(body) })
}

export async function registerCard(value: number) {
  const body: RegisterCardRequest = { value }
  return req<void>('/api/conteo/register', { method: 'POST', body: JSON.stringify(body) })
}

export async function getRunningCount() {
  return req<CountResponse>('/api/conteo/running')
}

export async function getTrueCount() {
  return req<CountResponse>('/api/conteo/true')
}

export async function resetCounter() {
  return req<void>('/api/conteo/reset', { method: 'POST' })
}

export async function recommend(playerTotal: number, dealerUpValue: number) {
  const body: RecommendationRequest = { playerTotal, dealerUpValue }
  return req<{ recommendation: string }>('/api/conteo/recommend', { method: 'POST', body: JSON.stringify(body) })
}

export async function getStatus() {
  return req<string>('/api/conteo/status')
}

export async function getHistory() {
  return req<Array<{ id: number; runningCount: number; trueCount: number; cardValue: number; decksInPlay: number; timestamp: string; notes?: string }>>('/api/conteo/history')
}

export async function clearHistory() {
  return req<void>('/api/conteo/clear-history', { method: 'POST' })
}
