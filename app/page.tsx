"use client"

import { useState } from "react"
import ImageUpload from "@/components/image-upload"
import ImageEditor from "@/components/image-editor"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleReset = () => {
    setSelectedImage(null)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!selectedImage ? (
        <ImageUpload onImageSelect={setSelectedImage} />
      ) : (
        <div className="min-h-screen flex flex-col">
          <ImageEditor imageSrc={selectedImage} onReset={handleReset} />
        </div>
      )}
    </main>
  )
}
