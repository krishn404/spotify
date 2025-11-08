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

  // Card View - Reference UI Style: Grid with album art as background
  if (viewMode === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="group relative aspect-[2/1] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Background Image - Full album art */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-4 md:p-5 lg:p-6 flex flex-col justify-between text-white z-10">
              {/* Top Section - Rank */}
              <div>
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  {index + 1}
                </span>
              </div>

              {/* Bottom Section - Track Info */}
              <div className="space-y-1">
                {/* Track Name */}
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold leading-tight line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {track.name}
                </h3>

                {/* Artist Name */}
                <p className="text-sm md:text-base text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1">
                  {track.artists.map((a) => a.name).join(", ")}
                </p>

                {/* Duration - Bottom Right */}
                <div className="flex justify-end mt-2">
                  <span className="text-xs md:text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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

  // Simple List View
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
