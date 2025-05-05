import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presets?: string[];
  className?: string;
}

const ColorPicker = ({ color, onChange, presets = [], className }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color || "#1e40af");
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 0, a: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(false);

  // Convert hex to HSV on initial load and when color prop changes
  useEffect(() => {
    const hex = color.startsWith("#") ? color : "#" + color;
    setCurrentColor(hex);
    setHsva(hexToHsv(hex));
  }, [color]);

  // Draw color picker canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw hue/saturation gradient
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw saturation/value gradient
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = x / width;
        const v = 1 - y / height;
        const rgb = hsvToRgb(hsva.h, s, v);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hsva.h, open]);

  // Handle canvas mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && e.type !== "mousedown") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    const s = x / rect.width;
    const v = 1 - y / rect.height;
    
    const newHsva = { ...hsva, s, v };
    setHsva(newHsva);
    
    const newColor = hsvToHex(newHsva.h, newHsva.s, newHsva.v);
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse up event
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging]);

  // Handle hue slider change
  const handleHueChange = (values: number[]) => {
    const h = values[0] / 360;
    const newHsva = { ...hsva, h };
    setHsva(newHsva);
    
    const newColor = hsvToHex(newHsva.h, newHsva.s, newHsva.v);
    setCurrentColor(newColor);
    onChange(newColor);
  };

  // Handle direct hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    if (!hex.startsWith("#")) {
      hex = "#" + hex;
    }
    
    // Only update if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
      setCurrentColor(hex);
      setHsva(hexToHsv(hex));
      onChange(hex);
    } else {
      setCurrentColor(hex);
    }
  };

  // Calculate the position of the color selector based on hsva
  const selectorPosition = {
    left: `${hsva.s * 100}%`,
    top: `${(1 - hsva.v) * 100}%`,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full h-10 p-1 flex justify-between items-center gap-2", className)}
        >
          <div 
            className="h-full aspect-square rounded-sm border" 
            style={{ backgroundColor: currentColor }}
          />
          <span className="flex-1 text-left font-mono text-sm">{currentColor}</span>
          <Palette className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div 
            className="relative w-full h-40 rounded-md border cursor-crosshair overflow-hidden"
          >
            <canvas 
              ref={canvasRef} 
              width={200} 
              height={160} 
              className="w-full h-full rounded-md"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            />
            <div 
              className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white pointer-events-none"
              style={{
                ...selectorPosition,
                backgroundColor: currentColor,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
              }}
            />
          </div>
          
          <div className="space-y-1">
            <Label>Hue</Label>
            <Slider
              value={[hsva.h * 360]}
              min={0}
              max={360}
              step={1}
              onValueChange={handleHueChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              style={{
                background: `linear-gradient(to right, 
                  #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
              }}
            />
          </div>
          
          <div className="space-y-1">
            <Label>Hex Color</Label>
            <Input 
              value={currentColor} 
              onChange={handleHexChange}
              className="font-mono"
            />
          </div>

          {presets.length > 0 && (
            <div className="space-y-1">
              <Label>Presets</Label>
              <div className="flex flex-wrap gap-1">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    className="w-6 h-6 p-0 rounded-md"
                    style={{ backgroundColor: preset }}
                    onClick={() => {
                      setCurrentColor(preset);
                      setHsva(hexToHsv(preset));
                      onChange(preset);
                    }}
                  >
                    {preset === currentColor && (
                      <Check className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Utility functions for color conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  
  return { r, g, b };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  
  return { h, s, v };
}

function hexToHsv(hex: string): { h: number; s: number; v: number; a: number } {
  const rgb = hexToRgb(hex);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  return { ...hsv, a: 1 };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  let r = 0, g = 0, b = 0;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  switch (i % 6) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hsvToHex(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export default ColorPicker;