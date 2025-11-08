"use client"

import { useState, useRef } from "react"
import { Download } from "lucide-react"
import TracksList from "./tracks-list"
import ArtistsList from "./artists-list"
import ShareButton from "./share-button"
import { Switch } from "./ui/switch"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

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
      return "LAST SIX MONTHS"
    case "long_term":
      return "ALL TIME"
    default:
      return "LAST MONTH"
  }
}

export default function StatsView({ token, userName }: StatsViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tracks")
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
  const [limit, setLimit] = useState(10)
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [showAlbumArt, setShowAlbumArt] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const displayName = userName || "User"
  const timeRangeLabel = getTimeRangeLabel(timeRange)
  const tabLabel = activeTab === "tracks" ? "Top Songs" : "Top Artists"

  const handleExportImage = () => {
    if (statsRef.current) {
      // Import html2canvas dynamically
      import("html2canvas").then((html2canvas) => {
        html2canvas.default(statsRef.current!, {
          backgroundColor: "#0e0e0e",
          scale: 2,
          useCORS: true,
        }).then((canvas) => {
          const link = document.createElement("a")
          link.download = `kantcancook-stats-${timeRangeLabel.toLowerCase().replace(/\s+/g, "-")}.png`
          link.href = canvas.toDataURL()
          link.click()
        })
      })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-200px)]">
      {/* Left Sidebar - Controls */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="glass-strong rounded-2xl p-6 space-y-8 sticky top-24">
          {/* Section Title */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Customize your chart
            </h3>
      </div>

        {/* Tabs */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">View Type</Label>
            <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("tracks")}
                className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "tracks"
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => setActiveTab("artists")}
                className={`flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "artists"
                    ? "bg-primary text-primary-foreground neon-glow"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            Artists
          </button>
            </div>
        </div>

          {/* Time Period Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Time Period</Label>
            <div className="flex flex-col gap-2">
              {[
                { value: "short_term" as TimeRange, label: "Last Month" },
                { value: "medium_term" as TimeRange, label: "Last 6 Months" },
                { value: "long_term" as TimeRange, label: "All Time" },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setTimeRange(period.value)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium text-left transition-all duration-300 ${
                    timeRange === period.value
                      ? "bg-primary/20 text-primary border border-primary/30 neon-glow-purple"
                      : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="simple-mode" className="text-sm font-medium text-foreground cursor-pointer">
                Simple Mode
              </Label>
              <Switch
                id="simple-mode"
                checked={viewMode === "simple"}
                onCheckedChange={(checked) => setViewMode(checked ? "simple" : "card")}
                className="data-[state=checked]:bg-primary data-[state=checked]:neon-glow"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="album-art" className="text-sm font-medium text-foreground cursor-pointer">
                Display album instead of artist
              </Label>
              <Switch
                id="album-art"
                checked={showAlbumArt}
                onCheckedChange={setShowAlbumArt}
                className="data-[state=checked]:bg-primary data-[state=checked]:neon-glow"
              />
            </div>
          </div>

          {/* Number of Tracks Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Number of Tracks</Label>
              <span className="text-sm font-semibold text-primary">{limit}</span>
            </div>
            <Slider
              value={[limit]}
              onValueChange={([value]) => setLimit(value)}
              min={5}
              max={20}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>20</span>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExportImage}
            variant="outline"
            className="w-full glass border-primary/30 hover:border-primary/50 hover:neon-glow-purple transition-all duration-300"
          >
            <Download size={16} />
            Export Image
          </Button>
        </div>
      </aside>

      {/* Main Chart Area */}
      <main className="flex-1 min-w-0">
        <div className="spotlight-bg rounded-2xl p-8 lg:p-12 space-y-8">
          {/* Title Section */}
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight text-gradient">
              {timeRangeLabel}
            </h1>
            <h2 className="text-xl lg:text-2xl font-light text-muted-foreground">
              {displayName.toUpperCase()}'s {tabLabel}
            </h2>
            <div className="flex justify-end">
              <p className="text-xs text-muted-foreground/60">stats by kantcancook</p>
            </div>
      </div>

          {/* Stats Container */}
          <div ref={statsRef} className="space-y-4">
        {activeTab === "tracks" && (
              <TracksList 
                token={token} 
                timeRange={timeRange} 
                limit={limit} 
                viewMode={viewMode}
                showAlbumArt={showAlbumArt}
              />
        )}
        {activeTab === "artists" && (
              <ArtistsList 
                token={token} 
                timeRange={timeRange} 
                limit={limit} 
                viewMode={viewMode}
                showAlbumArt={showAlbumArt}
              />
        )}
      </div>
        </div>
      </main>
    </div>
  )
}
