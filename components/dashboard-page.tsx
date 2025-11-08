"use client"

import { useState, useEffect } from "react"
import StatsView from "./stats-view"

interface DashboardPageProps {
  token: string
  onLogout: () => void
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        // Token expired
        onLogout()
        return
      }

      const data = await response.json()
      setUserName(data.display_name || data.email)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">KYS</h1>
            {userName && <p className="text-sm text-muted-foreground">Welcome, {userName}</p>}
          </div>
          <button
            onClick={onLogout}
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatsView token={token} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made with Spotify API</p>
        </div>
      </footer>
    </div>
  )
}
