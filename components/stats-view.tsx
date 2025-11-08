"use client"

import { useState } from "react"
import TracksList from "./tracks-list"
import ArtistsList from "./artists-list"

interface StatsViewProps {
  token: string
}

type TimeRange = "short_term" | "medium_term" | "long_term"
type Tab = "tracks" | "artists"

export default function StatsView({ token }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks")
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
  const [limit, setLimit] = useState(10)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`font-semibold pb-2 transition-colors ${
              activeTab === "tracks"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Tracks
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`font-semibold pb-2 transition-colors ${
              activeTab === "artists"
                ? "text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Top Artists
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Time Range Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </div>

          {/* Limit Dropdown */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Number of Results</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={20}>Top 20</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "tracks" && <TracksList token={token} timeRange={timeRange} limit={limit} />}
        {activeTab === "artists" && <ArtistsList token={token} timeRange={timeRange} limit={limit} />}
      </div>
    </div>
  )
}
