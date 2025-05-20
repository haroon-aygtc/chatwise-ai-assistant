import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
    value: string
    onChange: (value: string) => void
    onValidate?: (isValid: boolean) => void
    language?: string
    height?: string
    className?: string
}

export function CodeEditor({
    value,
    onChange,
    onValidate,
    language = "javascript",
    height = "300px",
    className
}: CodeEditorProps) {
    const [error, setError] = useState<string | null>(null)

    // Validate JSON if the language is JSON
    useEffect(() => {
        if (language === "json" && onValidate) {
            try {
                JSON.parse(value)
                setError(null)
                onValidate(true)
            } catch (e) {
                setError((e as Error).message)
                onValidate(false)
            }
        }
    }, [value, language, onValidate])

    return (
        <div className={cn("relative", className)}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "font-mono text-sm w-full rounded-md border border-input bg-transparent px-3 py-2",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "resize-none"
                )}
                style={{ height }}
                spellCheck="false"
                data-language={language}
            />
            {error && (
                <div className="text-xs text-destructive mt-1">
                    {error}
                </div>
            )}
        </div>
    )
} 