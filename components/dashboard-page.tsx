"use client"

import { useState, useEffect } from "react"
import { LogOut, User } from "lucide-react"
import StatsView from "./stats-view"

interface DashboardPageProps {
  token: string
  onLogout: () => void
}

export default function DashboardPage({ token, onLogout }: DashboardPageProps) {
  const [userName, setUserName] = useState<string | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)

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
      if (data.images && data.images.length > 0) {
        setUserImage(data.images[0].url)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gradient-accent">
              psyxtify stats
            </h1>
            {userName && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border/50">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Welcome back</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">{userName}</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:neon-glow"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <StatsView token={token} userName={userName} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">Made with Spotify API • psyxtify stats</p>
        </div>
      </footer>
    </div>
  )
}
