"use client"

import { useState, useRef } from "react"
import { LayoutGrid, List } from "lucide-react"
import TracksList from "./tracks-list"
import ArtistsList from "./artists-list"
import ShareButton from "./share-button"

interface StatsViewProps {
  token: string
}

type TimeRange = "short_term" | "medium_term" | "long_term"
type Tab = "tracks" | "artists"
type ViewMode = "card" | "simple"

export default function StatsView({ token }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks")
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
  const [limit, setLimit] = useState(5)
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const statsRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-card rounded-lg p-1 border border-border shadow-sm">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-all ${
              activeTab === "tracks"
                ? "bg-accent text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Top Tracks
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-all ${
              activeTab === "artists"
                ? "bg-accent text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Top Artists
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-card rounded-lg p-1 border border-border shadow-sm">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "card"
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
              title="Card View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("simple")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "simple"
                  ? "bg-accent text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
              title="Simple View"
            >
              <List size={18} />
            </button>
          </div>

          {/* Share Button */}
          <ShareButton statsRef={statsRef} activeTab={activeTab} />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Time Range Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
          >
            <option value="short_term">Last 4 Weeks</option>
            <option value="medium_term">Last 6 Months</option>
            <option value="long_term">All Time</option>
          </select>
        </div>

        {/* Limit Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Number of Results
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Stats Container */}
      <div ref={statsRef} className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-sm">
        {activeTab === "tracks" && (
          <TracksList token={token} timeRange={timeRange} limit={limit} viewMode={viewMode} />
        )}
        {activeTab === "artists" && (
          <ArtistsList token={token} timeRange={timeRange} limit={limit} viewMode={viewMode} />
        )}
      </div>
    </div>
  )
}
