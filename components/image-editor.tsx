"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import EffectsPanel from "./effects-panel"
import { Download, RotateCcw, X } from "lucide-react"

interface ImageEditorProps {
  imageSrc: string
  onReset: () => void
}

export interface ImageEffects {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  opacity: number
  invert: number
  sepia: number
}

const DEFAULT_EFFECTS: ImageEffects = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  opacity: 100,
  invert: 0,
  sepia: 0,
}

export default function ImageEditor({ imageSrc, onReset }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [effects, setEffects] = useState<ImageEffects>(DEFAULT_EFFECTS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return

    const image = imageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Set canvas size to match image
    canvas.width = image.width
    canvas.height = image.height

    // Apply CSS filters and draw image
    ctx.filter = buildFilterString(effects)
    ctx.globalAlpha = effects.opacity / 100
    ctx.drawImage(image, 0, 0)
    ctx.globalAlpha = 1
  }, [effects])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `edited-image-${Date.now()}.png`
    link.click()
  }

  const resetEffects = () => {
    setEffects(DEFAULT_EFFECTS)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-balance">PixelCraft Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetEffects} aria-label="Reset all effects to default">
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Reset
            </Button>
            <Button size="sm" onClick={downloadImage} aria-label="Download edited image">
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset} aria-label="Go back and upload new image">
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 p-4 bg-background">
        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center min-w-0 bg-card/30 rounded-lg border border-border/50 overflow-auto">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full h-auto w-auto rounded-lg shadow-lg"
              role="img"
              aria-label="Edited image preview"
            />
            <img
              ref={imageRef}
              src={imageSrc || "/placeholder.svg"}
              alt=""
              className="hidden"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading image...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Effects Panel */}
        <div className="w-80 max-h-full overflow-y-auto">
          <EffectsPanel effects={effects} onChange={setEffects} />
        </div>
      </div>
    </div>
  )
}

function buildFilterString(effects: ImageEffects): string {
  return `
    brightness(${effects.brightness}%)
    contrast(${effects.contrast}%)
    saturate(${effects.saturation}%)
    hue-rotate(${effects.hue}deg)
    blur(${effects.blur}px)
    invert(${effects.invert}%)
    sepia(${effects.sepia}%)
  `.trim()
}
