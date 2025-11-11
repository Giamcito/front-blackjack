import type React from "react"
import Navbar from "@/components/navbar"

export default function ContentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#0a1810]">
      <Navbar />
      <main className="px-4 py-8">{children}</main>
    </div>
  )
}
