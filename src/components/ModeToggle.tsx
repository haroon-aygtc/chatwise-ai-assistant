
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white w-8 h-8">
      <Sun className="h-4 w-4" />
    </Button>;
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white w-8 h-8"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
