"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

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
  viewMode: "card" | "simple"
}

export default function ArtistsList({ token, timeRange, limit, viewMode }: ArtistsListProps) {
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
    return <div className="text-center text-destructive text-sm py-8">{error}</div>
  }

  if (viewMode === "simple") {
    return (
      <div className="space-y-2">
        {artists.map((artist, index) => (
          <div
            key={artist.id}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-background/50 transition-colors group"
          >
            {/* Rank */}
            <div className="shrink-0 w-8 text-center">
              <span className="text-lg font-bold text-muted-foreground group-hover:text-accent transition-colors">
                {index + 1}
              </span>
            </div>

            {/* Artist Image */}
            <div className="shrink-0">
              {artist.images[0] ? (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-14 h-14 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <User size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                {artist.name}
              </h3>
              {artist.genres.length > 0 && (
                <p className="text-sm text-muted-foreground truncate capitalize">
                  {artist.genres.slice(0, 2).join(", ")}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${artist.popularity}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground/70">{artist.popularity}</span>
              </div>
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
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="group relative h-64 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          {/* Blurred Background Image */}
          {artist.images[0] && (
            <img
              src={artist.images[0].url || "/placeholder.svg"}
              alt={artist.name}
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
            {/* Artist Image */}
            {artist.images[0] && (
              <img
                src={artist.images[0].url || "/placeholder.svg"}
                alt={artist.name}
                className="w-16 h-16 rounded-full mb-3 shadow-xl ring-2 ring-white/20 object-cover"
              />
            )}

            {/* Artist Name */}
            <h3 className="font-bold text-base line-clamp-2 leading-tight mb-1.5 drop-shadow-lg">{artist.name}</h3>

            {/* Genre */}
            {artist.genres.length > 0 && (
              <p className="text-xs text-white/90 line-clamp-1 capitalize drop-shadow-md">
                {artist.genres.slice(0, 2).join(", ")}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
