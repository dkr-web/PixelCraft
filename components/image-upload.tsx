"use client"

import { useRef, useState } from "react"
import { Upload, AlertCircle } from "lucide-react"

interface ImageUploadProps {
  onImageSelect: (src: string) => void
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>("")

  const handleFileSelect = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const maxSize = 50 * 1024 * 1024 // 50MB max for RPi performance

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP, or GIF)")
      return
    }

    if (file.size > maxSize) {
      setError("Image size must be under 50MB")
      return
    }

    setError("")
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      onImageSelect(src)
    }
    reader.onerror = () => {
      setError("Failed to load image")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">PixelCraft</h1>
          <p className="text-muted-foreground text-lg">Lightweight image editing for Raspberry Pi</p>
        </div>

        <div
          className="border-2 border-dashed border-accent/50 rounded-lg p-12 text-center cursor-pointer hover:border-accent transition-colors bg-card/50 hover:bg-card/80"
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) handleFileSelect(file)
          }}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          aria-label="Upload image area - click to select or drag and drop"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click()
            }
          }}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-accent" aria-hidden="true" />
          <p className="text-foreground font-semibold mb-1">Drag & drop your image</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          aria-label="Image file input"
        />

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6 text-center">
          All processing happens locally on your device. Your images are never uploaded.
        </p>
      </div>
    </div>
  )
}
