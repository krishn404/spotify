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
    return <div className="bg-card border border-border rounded-lg p-6 text-center text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors flex items-center gap-4"
        >
          {/* Rank */}
          <div className="text-2xl font-bold text-accent w-12 text-center">{index + 1}</div>

          {/* Album Image */}
          <div className="w-16 h-16 flex-shrink-0">
            {track.album.images[0] && (
              <img
                src={track.album.images[0].url || "/placeholder.svg"}
                alt={track.album.name}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{track.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artists.map((a) => a.name).join(", ")}</p>
            <p className="text-xs text-muted-foreground truncate">{track.album.name}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
