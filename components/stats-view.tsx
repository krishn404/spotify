"use client"

import { useState, useRef } from "react"
import TracksList from "./tracks-list"
import ArtistsList from "./artists-list"
import ShareButton from "./share-button"

interface StatsViewProps {
  token: string
}

type TimeRange = "short_term" | "medium_term" | "long_term"
type Tab = "tracks" | "artists"

export default function StatsView({ token }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks")
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
  const [limit, setLimit] = useState(5)
  const statsRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-lg p-1 border border-border">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === "tracks" ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Tracks
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === "artists" ? "bg-accent text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Artists
          </button>
        </div>

        {/* Share Button */}
        <ShareButton statsRef={statsRef} activeTab={activeTab} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Time Range Dropdown */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          >
            <option value="short_term">Last 4 Weeks</option>
            <option value="medium_term">Last 6 Months</option>
            <option value="long_term">All Time</option>
          </select>
        </div>

        {/* Limit Dropdown - Removed 15 and 20 options */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Number of Results
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Stats Container */}
      <div ref={statsRef} className="bg-background rounded-xl p-6 sm:p-8">
        {activeTab === "tracks" && <TracksList token={token} timeRange={timeRange} limit={limit} />}
        {activeTab === "artists" && <ArtistsList token={token} timeRange={timeRange} limit={limit} />}
      </div>
    </div>
  )
}
