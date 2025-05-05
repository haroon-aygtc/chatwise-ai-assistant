import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop, Palette } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }
  
  // Determine which icon to show based on current theme
  const renderThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'system':
        return <Laptop className="h-[1.2rem] w-[1.2rem]" />;
      case 'purple':
        return <Palette className="h-[1.2rem] w-[1.2rem] text-purple-500" />;
      case 'blue':
        return <Palette className="h-[1.2rem] w-[1.2rem] text-blue-500" />;
      case 'green':
        return <Palette className="h-[1.2rem] w-[1.2rem] text-green-500" />;
      case 'orange':
        return <Palette className="h-[1.2rem] w-[1.2rem] text-orange-500" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          {renderThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-muted" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-muted" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-muted" : ""}
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("purple")}
          className={theme === "purple" ? "bg-muted" : ""}
        >
          <Palette className="mr-2 h-4 w-4 text-purple-500" />
          <span>Purple</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("blue")}
          className={theme === "blue" ? "bg-muted" : ""}
        >
          <Palette className="mr-2 h-4 w-4 text-blue-500" />
          <span>Blue</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("green")}
          className={theme === "green" ? "bg-muted" : ""}
        >
          <Palette className="mr-2 h-4 w-4 text-green-500" />
          <span>Green</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("orange")}
          className={theme === "orange" ? "bg-muted" : ""}
        >
          <Palette className="mr-2 h-4 w-4 text-orange-500" />
          <span>Orange</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
