"use client"

import { useState, useEffect } from "react"

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
}

export default function TracksList({ token, timeRange, limit }: TracksListProps) {
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
    return <div className="text-center text-destructive text-sm">{error}</div>
  }

  const gridCols = limit === 5 ? "grid-cols-1 sm:grid-cols-5" : "grid-cols-1 sm:grid-cols-5"
  const containerClass = limit === 10 ? "grid grid-cols-1 sm:grid-cols-5 gap-4" : `grid ${gridCols} gap-4`

  return (
    <div className={containerClass}>
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="group relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          {/* Blurred Background Image */}
          {track.album.images[0] && (
            <img
              src={track.album.images[0].url || "/placeholder.svg"}
              alt={track.album.name}
              className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80"></div>

          {/* Rank Badge */}
          <div className="absolute top-3 right-3 bg-accent text-background rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
            {/* Small Album Image */}
            {track.album.images[0] && (
              <img
                src={track.album.images[0].url || "/placeholder.svg"}
                alt={track.album.name}
                className="w-12 h-12 rounded-lg mb-3 shadow-lg"
              />
            )}

            {/* Track Name */}
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{track.name}</h3>

            {/* Artist Name */}
            <p className="text-xs text-white/80 line-clamp-1">{track.artists.map((a) => a.name).join(", ")}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
