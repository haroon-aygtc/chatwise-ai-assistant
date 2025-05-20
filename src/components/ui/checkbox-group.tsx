import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CheckboxGroupProps {
    children: ReactNode
    className?: string
}

export function CheckboxGroup({ children, className }: CheckboxGroupProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {children}
        </div>
    )
} 