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
    return <div className="text-center text-destructive text-sm">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="group relative h-56 sm:h-64 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          {/* Blurred Background Image */}
          {artist.images[0] && (
            <img
              src={artist.images[0].url || "/placeholder.svg"}
              alt={artist.name}
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
            {/* Artist Image */}
            {artist.images[0] && (
              <img
                src={artist.images[0].url || "/placeholder.svg"}
                alt={artist.name}
                className="w-12 h-12 rounded-full mb-3 shadow-lg object-cover"
              />
            )}

            {/* Artist Name */}
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{artist.name}</h3>

            {/* Genre */}
            {artist.genres.length > 0 && (
              <p className="text-xs text-white/80 line-clamp-1 capitalize">{artist.genres.slice(0, 2).join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
