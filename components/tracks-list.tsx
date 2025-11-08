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
  showAlbumArt?: boolean
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function TracksList({ token, timeRange, limit, viewMode, showAlbumArt = false }: TracksListProps) {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-destructive text-sm py-8">{error}</div>
  }

  // Minimal list layout (always used now)
  return (
    <div className="space-y-2">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group glass rounded-xl p-4 lg:p-5 flex items-center gap-4 lg:gap-6 hover:glass-strong hover:scale-[1.01] transition-all duration-300 cursor-pointer"
        >
          {/* Rank Badge */}
          <div className="shrink-0 w-10 lg:w-12 flex items-center justify-center">
            <span className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {index + 1}
            </span>
          </div>

          {/* Album Art Thumbnail (if enabled) */}
          {showAlbumArt && (
            <div className="shrink-0">
              {track.album.images[0] ? (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Music2 size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>
          )}

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors mb-1">
              {track.name}
            </h3>
            <p className="text-sm lg:text-base text-muted-foreground truncate">
              {showAlbumArt ? track.album.name : track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>

          {/* Duration */}
          <div className="shrink-0">
            <span className="text-sm lg:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {formatDuration(track.duration_ms)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
