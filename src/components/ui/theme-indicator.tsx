import { useTheme } from "@/components/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Laptop, Palette } from "lucide-react";

export function ThemeIndicator() {
  const { theme } = useTheme();
  
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-3 w-3 mr-1" />;
      case 'dark':
        return <Moon className="h-3 w-3 mr-1" />;
      case 'system':
        return <Laptop className="h-3 w-3 mr-1" />;
      case 'purple':
        return <Palette className="h-3 w-3 mr-1 text-purple-500" />;
      case 'blue':
        return <Palette className="h-3 w-3 mr-1 text-blue-500" />;
      case 'green':
        return <Palette className="h-3 w-3 mr-1 text-green-500" />;
      case 'orange':
        return <Palette className="h-3 w-3 mr-1 text-orange-500" />;
      default:
        return <Sun className="h-3 w-3 mr-1" />;
    }
  };
  
  const getThemeColor = () => {
    switch (theme) {
      case 'light':
        return "bg-gray-100 text-gray-800";
      case 'dark':
        return "bg-gray-800 text-gray-100";
      case 'system':
        return "bg-gray-500 text-white";
      case 'purple':
        return "bg-purple-100 text-purple-800";
      case 'blue':
        return "bg-blue-100 text-blue-800";
      case 'green':
        return "bg-green-100 text-green-800";
      case 'orange':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Badge variant="outline" className={`flex items-center ${getThemeColor()}`}>
      {getThemeIcon()}
      <span className="capitalize">{theme}</span>
    </Badge>
  );
}