"use client"

import { useState, useRef } from "react"
import { LayoutGrid, List } from "lucide-react"
import TracksList from "./tracks-list"
import ArtistsList from "./artists-list"
import ShareButton from "./share-button"

interface StatsViewProps {
  token: string
  userName?: string | null
}

type TimeRange = "short_term" | "medium_term" | "long_term"
type Tab = "tracks" | "artists"
type ViewMode = "card" | "simple"

function getTimeRangeLabel(timeRange: TimeRange): string {
  switch (timeRange) {
    case "short_term":
      return "LAST MONTH"
    case "medium_term":
      return "LAST 6 MONTHS"
    case "long_term":
      return "ALL TIME"
    default:
      return "LAST MONTH"
  }
}

export default function StatsView({ token, userName }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks")
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term")
  const [limit, setLimit] = useState(10)
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const statsRef = useRef<HTMLDivElement>(null)

  const displayName = userName || "User"
  const timeRangeLabel = getTimeRangeLabel(timeRange)
  const tabLabel = activeTab === "tracks" ? "Top songs" : "Top artists"

  return (
    <div className="space-y-6">
      {/* Reference UI Style Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Left side - Title */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold text-muted-foreground/70 mb-1 tracking-tight">
            {timeRangeLabel}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {displayName.toUpperCase()}'s {tabLabel}
          </h2>
        </div>

        {/* Right side - Controls and attribution */}
        <div className="flex flex-col items-end gap-3">
          <p className="text-xs text-muted-foreground/60 hidden sm:block">stats by KYS</p>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle - Only show in card view */}
            {viewMode === "card" && (
              <div className="flex items-center gap-2 bg-card/50 rounded-lg p-1 border border-border/50">
                <button
                  onClick={() => setViewMode("card")}
                  className="p-2 rounded-md bg-accent text-background transition-all"
                  title="Card View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("simple")}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50 transition-all"
                  title="Simple View"
                >
                  <List size={16} />
                </button>
              </div>
            )}
            {viewMode === "simple" && (
              <div className="flex items-center gap-2 bg-card/50 rounded-lg p-1 border border-border/50">
                <button
                  onClick={() => setViewMode("card")}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50 transition-all"
                  title="Card View"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("simple")}
                  className="p-2 rounded-md bg-accent text-background transition-all"
                  title="Simple View"
                >
                  <List size={16} />
                </button>
              </div>
            )}
            <ShareButton statsRef={statsRef} activeTab={activeTab} />
          </div>
        </div>
      </div>

      {/* Filters - Hidden in card view, shown in simple view or always visible */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-card/50 rounded-lg p-1 border border-border/50">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === "tracks"
                ? "bg-accent text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => setActiveTab("artists")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
              activeTab === "artists"
                ? "bg-accent text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Artists
          </button>
        </div>

        {/* Time Range Dropdown */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="bg-card/50 border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        >
          <option value="short_term">Last 4 Weeks</option>
          <option value="medium_term">Last 6 Months</option>
          <option value="long_term">All Time</option>
        </select>

        {/* Limit Dropdown */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="bg-card/50 border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
        </select>
      </div>

      {/* Stats Container - No background in card view to match reference */}
      <div ref={statsRef} className={viewMode === "card" ? "" : "bg-card rounded-xl p-6 sm:p-8 border border-border shadow-sm"}>
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
