"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import LoginPage from "@/components/login-page"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for auth code from Spotify redirect
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("Auth error:", error)
      setLoading(false)
      return
    }

    if (code) {
      // Exchange code for token
      exchangeCodeForToken(code)
    } else {
      // Check localStorage for existing token
      const savedToken = localStorage.getItem("spotify_access_token")
      if (savedToken) {
        setToken(savedToken)
      }
      setLoading(false)
    }
  }, [searchParams])

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch("/api/spotify/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token)
        setToken(data.access_token)
        // Clear the URL
        router.replace("/")
      } else {
        console.error("No access token received")
      }
    } catch (error) {
      console.error("Token exchange failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token")
    setToken(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return <LoginPage />
  }

  return <DashboardPage token={token} onLogout={handleLogout} />
}
