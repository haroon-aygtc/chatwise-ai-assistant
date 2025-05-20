import { useState, useRef, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"

export interface Option {
    value: string
    label: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (values: string[]) => void
    className?: string
    placeholder?: string
    creatable?: boolean
}

export function MultiSelect({
    options,
    selected,
    onChange,
    className,
    placeholder = "Select options",
    creatable = false,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUnselect = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "") {
                    const lastSelected = selected[selected.length - 1]
                    if (lastSelected) {
                        handleUnselect(lastSelected)
                    }
                }
            }
            // Add new item on enter
            if (e.key === "Enter" && creatable && inputValue.trim() !== "") {
                e.preventDefault()
                if (!selected.includes(inputValue.trim())) {
                    const newSelected = [...selected, inputValue.trim()]
                    onChange(newSelected)
                    setInputValue("")
                }
            }
        }
    }

    // Focus the input when the popover opens
    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
        }
    }, [open])

    // Create a combined list of options including any user-created ones
    const allOptions: Option[] = [...options]

    // Add user-created options that aren't in the original list
    if (creatable) {
        selected.forEach(value => {
            const existingOption = options.find(option => option.value === value)
            if (!existingOption) {
                allOptions.push({ value, label: value })
            }
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    <div className="flex flex-wrap gap-1 mr-1">
                        {selected.length > 0 ? (
                            selected.map((value) => {
                                const selectedOption = allOptions.find(option => option.value === value)
                                return (
                                    <Badge
                                        key={value}
                                        variant="secondary"
                                        className="mr-1"
                                    >
                                        {selectedOption?.label || value}
                                        <button
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleUnselect(value)
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    </Badge>
                                )
                            })
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command
                    onKeyDown={handleKeyDown}
                    className="max-h-[300px] overflow-auto"
                >
                    <CommandInput
                        ref={inputRef}
                        placeholder="Search..."
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandEmpty>
                        {creatable && inputValue.trim() !== "" ? (
                            <div
                                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                    if (!selected.includes(inputValue.trim())) {
                                        const newSelected = [...selected, inputValue.trim()]
                                        onChange(newSelected)
                                        setInputValue("")
                                    }
                                }}
                            >
                                Create "{inputValue}"
                            </div>
                        ) : (
                            "No options found."
                        )}
                    </CommandEmpty>
                    <CommandGroup>
                        {allOptions.map((option) => {
                            const isSelected = selected.includes(option.value)
                            return (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                        if (isSelected) {
                                            handleUnselect(option.value)
                                        } else {
                                            onChange([...selected, option.value])
                                        }
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 