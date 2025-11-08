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

  // Card View - Reference UI Style: Two columns with tall cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="group relative h-[280px] md:h-[320px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Background Image - Full artist image, not blurred */}
          {artist.images[0] ? (
            <img
              src={artist.images[0].url || "/placeholder.svg"}
              alt={artist.name}
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

            {/* Bottom Section - Artist Info */}
            <div className="space-y-2">
              {/* Artist Name */}
              <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {artist.name}
              </h3>

              {/* Genre */}
              {artist.genres.length > 0 && (
                <p className="text-base md:text-lg text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] capitalize line-clamp-1">
                  {artist.genres.slice(0, 2).join(", ")}
                </p>
              )}

              {/* Popularity - Bottom Right */}
              <div className="flex justify-end mt-4">
                <span className="text-sm md:text-base text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {artist.popularity}% popular
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
