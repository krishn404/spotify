"use client"

import { useState, useEffect } from "react"

interface Artist {
  id: string
  name: string
  images: Array<{ url: string }>
  popularity: number
  genres: string[]
}

interface ArtistsListProps {
  token: string
  timeRange: "short_term" | "medium_term" | "long_term"
  limit: number
}

export default function ArtistsList({ token, timeRange, limit }: ArtistsListProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtists()
  }, [timeRange, limit, token])

  const fetchArtists = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 401) {
        setError("Session expired. Please login again.")
        return
      }

      const data = await response.json()
      setArtists(data.items || [])
    } catch (err) {
      setError("Failed to fetch artists")
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
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors flex items-center gap-4"
        >
          {/* Rank */}
          <div className="text-2xl font-bold text-accent w-12 text-center">{index + 1}</div>

          {/* Artist Image */}
          <div className="w-16 h-16 flex-shrink-0">
            {artist.images[0] && (
              <img
                src={artist.images[0].url || "/placeholder.svg"}
                alt={artist.name}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>

          {/* Artist Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{artist.name}</h3>
            <p className="text-sm text-muted-foreground truncate">Popularity: {artist.popularity}%</p>
            {artist.genres.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">{artist.genres.slice(0, 2).join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
