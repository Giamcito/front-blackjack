type TokenResponse = { token: string }
export type MeResponse = { id: number; username: string; chips: number }

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
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? await res.json() : await res.text() as any
}

export async function register(username: string, password: string) {
  return req<TokenResponse>('/api/users/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export async function login(username: string, password: string) {
  return req<TokenResponse>('/api/users/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
  try { window.dispatchEvent(new Event('auth-changed')) } catch {}
}

export function logout() {
  setAuthToken(null)
}

export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const t = localStorage.getItem('auth_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function me() {
  return req<MeResponse>('/api/users/users/me', { headers: { ...getAuthHeader() } })
}

export async function adjustChips(delta: number) {
  return req<MeResponse>(`/api/users/users/chips/adjust?delta=${delta}`, { method: 'POST', headers: { ...getAuthHeader() } })
}
