"use client"

import { useState, useEffect } from "react"
import { Music2 } from "lucide-react"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
}

interface TracksListProps {
  token: string
  timeRange: "short_term" | "medium_term" | "long_term"
  limit: number
  viewMode: "card" | "simple"
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function TracksList({ token, timeRange, limit, viewMode }: TracksListProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTracks()
  }, [timeRange, limit, token])

  const fetchTracks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        setError("Session expired. Please login again.")
        return
      }

      const data = await response.json()
      setTracks(data.items || [])
    } catch (err) {
      setError("Failed to fetch tracks")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-destructive text-sm py-8">{error}</div>
  }

  if (viewMode === "simple") {
    return (
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-background/50 transition-colors group"
          >
            {/* Rank */}
            <div className="shrink-0 w-8 text-center">
              <span className="text-lg font-bold text-muted-foreground group-hover:text-accent transition-colors">
                {index + 1}
              </span>
            </div>

            {/* Album Art */}
            <div className="shrink-0">
              {track.album.images[0] ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-14 h-14 rounded-lg object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                  <Music2 size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                {track.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{track.artists.map((a) => a.name).join(", ")}</p>
              <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{track.album.name}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Card View - Reference UI Style: Two columns with tall cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group relative h-[280px] md:h-[320px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Background Image - Full album art, not blurred */}
          {track.album.images[0] ? (
            <img
              src={track.album.images[0].url || "/placeholder.svg"}
              alt={track.album.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-muted to-muted/50" />
          )}

          {/* Subtle Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60"></div>

          {/* Content Container */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between text-white z-10">
            {/* Top Section - Rank */}
            <div>
              <span className="text-6xl md:text-7xl font-bold leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                {index + 1}
              </span>
            </div>

            {/* Bottom Section - Track Info */}
            <div className="space-y-2">
              {/* Track Name */}
              <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {track.name}
              </h3>

              {/* Artist Name */}
              <p className="text-base md:text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {track.artists.map((a) => a.name).join(", ")}
              </p>

              {/* Duration - Bottom Right */}
              <div className="flex justify-end mt-4">
                <span className="text-sm md:text-base text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {formatDuration(track.duration_ms)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
