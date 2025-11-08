import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")

    console.log("[v0] Token exchange - clientId:", clientId?.slice(0, 5) + "...", "redirectUri:", redirectUri)

    // Exchange authorization code for access token
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    })

    const data = await response.json()

    console.log("[v0] Token response status:", response.status, "has token:", !!data.access_token)

    if (!response.ok) {
      console.error("[v0] Token exchange error:", data)
      return NextResponse.json({ error: data.error_description || "Token exchange failed" }, { status: 400 })
    }

    return NextResponse.json({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    })
  } catch (error) {
    console.error("[v0] Callback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
