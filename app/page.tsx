"use client"

import { useAuth } from "@/hooks/use-auth"
import { LandingPage } from "@/components/landing/landing-page"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <Dashboard />
}
