"use client"
import React from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"

export default function Protected({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { loading } = useRequireAuth()
  if (loading) return fallback ?? <div className="mx-auto max-w-md p-6">Cargando...</div>
  return <>{children}</>
}
