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
}

interface TracksListProps {
  token: string
  timeRange: "short_term" | "medium_term" | "long_term"
  limit: number
  viewMode: "card" | "simple"
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

  // Card View
  const gridCols = limit === 5 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group relative h-64 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          {/* Blurred Background Image */}
          {track.album.images[0] && (
            <img
              src={track.album.images[0].url || "/placeholder.svg"}
              alt={track.album.name}
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110 brightness-75"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>

          {/* Rank Badge */}
          <div className="absolute top-3 right-3 bg-accent text-background rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shadow-lg z-10">
            {index + 1}
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-5 flex flex-col justify-end text-white z-10">
            {/* Small Album Image */}
            {track.album.images[0] && (
              <img
                src={track.album.images[0].url || "/placeholder.svg"}
                alt={track.album.name}
                className="w-14 h-14 rounded-lg mb-3 shadow-xl ring-2 ring-white/20"
              />
            )}

            {/* Track Name */}
            <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1.5 drop-shadow-lg">{track.name}</h3>

            {/* Artist Name */}
            <p className="text-xs text-white/90 line-clamp-1 drop-shadow-md">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
