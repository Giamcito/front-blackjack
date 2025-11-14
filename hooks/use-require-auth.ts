"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { me, type MeResponse } from "@/lib/userApi"

export function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) {
      router.replace('/login')
      setLoading(false)
      return
    }
    me().then(u => { if (mounted) setUser(u) }).catch(() => { router.replace('/login') }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [router])
  return { user, loading }
}
