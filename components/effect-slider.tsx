"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface EffectSliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  "aria-label": string
}

export default function EffectSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  "aria-label": ariaLabel,
}: EffectSliderProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const handleSliderChange = (newValue: number) => {
    setInputValue(newValue.toString())
    onChange(newValue)
  }

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    const num = Number.parseFloat(newValue)
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      handleSliderChange(Math.min(value + step, max))
    } else if (e.key === "ArrowDown") {
      handleSliderChange(Math.max(value - step, min))
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-16 px-2 py-1 bg-background border border-border/50 rounded text-xs text-center focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          aria-label={`${label} value input`}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleSliderChange(Number.parseFloat(e.target.value))}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        className="w-full h-2 bg-accent/20 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${
            ((value - min) / (max - min)) * 100
          }%, var(--color-accent-foreground) ${((value - min) / (max - min)) * 100}%, var(--color-accent-foreground) 100%)`,
          opacity: 0.7,
        }}
      />
    </div>
  )
}
