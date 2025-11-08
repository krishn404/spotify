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
  showAlbumArt?: boolean
}

export default function ArtistsList({ token, timeRange, limit, viewMode, showAlbumArt = false }: ArtistsListProps) {
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
      {artists.map((artist, index) => (
        <div
          key={artist.id}
          className="group glass rounded-xl p-4 lg:p-5 flex items-center gap-4 lg:gap-6 hover:glass-strong hover:scale-[1.01] transition-all duration-300 cursor-pointer"
        >
          {/* Rank Badge */}
          <div className="shrink-0 w-10 lg:w-12 flex items-center justify-center">
            <span className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {index + 1}
            </span>
          </div>

          {/* Artist Image */}
          <div className="shrink-0">
            {artist.images[0] ? (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-muted flex items-center justify-center">
                <User size={20} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground truncate group-hover:text-primary transition-colors mb-1">
              {artist.name}
            </h3>
            {artist.genres.length > 0 && (
              <p className="text-sm lg:text-base text-muted-foreground truncate capitalize">
                {artist.genres.slice(0, 2).join(", ")}
              </p>
            )}
          </div>

          {/* Popularity */}
          <div className="shrink-0 text-right">
            <span className="text-sm lg:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {artist.popularity}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
