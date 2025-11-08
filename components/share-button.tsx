"use client"

import { useState, type RefObject } from "react"
import { Share2, Download, X } from "lucide-react"

interface ShareButtonProps {
  statsRef: RefObject<HTMLDivElement | null>
  activeTab: "tracks" | "artists"
}

export default function ShareButton({ statsRef, activeTab }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const exportAsImage = async () => {
    if (!statsRef.current) return

    setIsExporting(true)
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(statsRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `soundslate-${activeTab}-${new Date().toISOString().split("T")[0]}.png`
      link.click()

      setIsOpen(false)
    } catch (err) {
      console.error("Failed to export image:", err)
      alert("Failed to export image")
    } finally {
      setIsExporting(false)
    }
  }

  const shareVia = (platform: "instagram" | "whatsapp" | "twitter") => {
    const text = `Check out my top ${activeTab} on SoundSlate! 🎵`
    const url = window.location.origin
    const shareUrl = `${url} - ${text}`

    let link = ""
    switch (platform) {
      case "twitter":
        link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "whatsapp":
        link = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`
        break
      case "instagram":
        alert("Share to Instagram: Screenshot your stats and upload to Instagram Stories!")
        setIsOpen(false)
        return
    }

    window.open(link, "_blank", "width=600,height=600")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-lg font-semibold hover:bg-accent/90 transition-colors shadow-sm"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 p-3 space-y-2">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">Share Your Stats</span>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>

          {/* Export as Image */}
          <button
            onClick={exportAsImage}
            disabled={isExporting}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background/50 text-foreground text-sm transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Export as Image"}
          </button>

          {/* Share on Twitter */}
          <button
            onClick={() => shareVia("twitter")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background/50 text-foreground text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
            </svg>
            Share on Twitter
          </button>

          {/* Share on WhatsApp */}
          <button
            onClick={() => shareVia("whatsapp")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background/50 text-foreground text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.275 9.9 9.9 0 006.364 16.787h.005c2.541 0 4.94-.822 6.946-2.329v-5.536c0-.262.107-.513.298-.699.192-.187.45-.291.72-.291.27 0 .528.104.72.291.19.186.298.437.298.699v5.536a9.879 9.879 0 01-6.946 2.329h-.005a9.87 9.87 0 01-6.365-16.787 9.87 9.87 0 014.946-1.275" />
            </svg>
            Share on WhatsApp
          </button>

          {/* Share on Instagram */}
          <button
            onClick={() => shareVia("instagram")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background/50 text-foreground text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                ry="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
            Share on Instagram
          </button>
        </div>
      )}
    </div>
  )
}
