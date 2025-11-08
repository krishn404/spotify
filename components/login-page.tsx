"use client"

export default function LoginPage() {
  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = window.location.origin
    const scope = "user-top-read"
    const authUrl = new URL("https://accounts.spotify.com/authorize")

    authUrl.searchParams.append("client_id", clientId || "")
    authUrl.searchParams.append("response_type", "code")
    authUrl.searchParams.append("redirect_uri", redirectUri)
    authUrl.searchParams.append("scope", scope)
    authUrl.searchParams.append("show_dialog", "true")

    window.location.href = authUrl.toString()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">SoundSlate</h1>
        <p className="text-lg text-muted-foreground">Visualize your Spotify listening stats</p>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-lg p-12 w-full max-w-md shadow-xl">
        <div className="space-y-6">
          <div>
            <p className="text-center text-muted-foreground mb-6">
              Connect your Spotify account to view your top tracks and artists
            </p>
          </div>

          <button
            onClick={handleSpotifyLogin}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.6 17.3c-.2.3-.6.5-1 .5-.4 0-.8-.2-1-.5-3.1 1.9-7.1 1.9-10.2 0-.3.3-.6.5-1 .5-.4 0-.8-.2-1-.5-4 2.5-6.1 6.7-6.1 11.3s2.1 8.8 6.1 11.3c.2.3.6.5 1 .5s.8-.2 1-.5c4-2.5 6.1-6.7 6.1-11.3s-2.1-8.8-6.1-11.3zm-1.9-3.5c-.5 0-1 .2-1.3.5-.3.4-.5.8-.5 1.3s.2 1 .5 1.3c.4.3.8.5 1.3.5.5 0 1-.2 1.3-.5.3-.4.5-.8.5-1.3s-.2-1-.5-1.3c-.3-.3-.8-.5-1.3-.5z" />
            </svg>
            Login with Spotify
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Made with Spotify API</p>
      </div>
    </div>
  )
}
