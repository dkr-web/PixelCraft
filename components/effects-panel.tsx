"use client"

import { Card } from "@/components/ui/card"
import EffectSlider from "./effect-slider"
import type { ImageEffects } from "./image-editor"
import { Zap } from "lucide-react"

interface EffectsPanelProps {
  effects: ImageEffects
  onChange: (effects: ImageEffects) => void
}

const EFFECT_CONFIGS = [
  { key: "brightness" as const, label: "Brightness", min: 0, max: 200, step: 1 },
  { key: "contrast" as const, label: "Contrast", min: 0, max: 200, step: 1 },
  { key: "saturation" as const, label: "Saturation", min: 0, max: 200, step: 1 },
  { key: "hue" as const, label: "Hue", min: 0, max: 360, step: 1 },
  { key: "blur" as const, label: "Blur", min: 0, max: 20, step: 0.5 },
  { key: "opacity" as const, label: "Opacity", min: 0, max: 100, step: 1 },
  { key: "invert" as const, label: "Invert", min: 0, max: 100, step: 1 },
  { key: "sepia" as const, label: "Sepia", min: 0, max: 100, step: 1 },
]

export default function EffectsPanel({ effects, onChange }: EffectsPanelProps) {
  const handleEffectChange = (key: keyof ImageEffects, value: number) => {
    onChange({
      ...effects,
      [key]: value,
    })
  }

  return (
    <Card className="p-4 bg-card/50 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-accent" aria-hidden="true" />
        <h2 className="font-semibold text-lg">Effects</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {EFFECT_CONFIGS.map((config) => (
          <EffectSlider
            key={config.key}
            label={config.label}
            value={effects[config.key]}
            min={config.min}
            max={config.max}
            step={config.step}
            onChange={(value) => handleEffectChange(config.key, value)}
            aria-label={`${config.label} slider`}
          />
        ))}
      </div>

      <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border/30">
        <p>💡 Adjust sliders to see live effects on your image.</p>
      </div>
    </Card>
  )
}
