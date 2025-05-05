import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeIndicator } from "@/components/ui/theme-indicator";

export function ThemeDebugger() {
  const { theme, setTheme } = useTheme();
  
  const themes = ["light", "dark", "system", "purple", "blue", "green", "orange"];
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Debugger</CardTitle>
        <CardDescription>Test and preview all available themes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span>Current Theme:</span>
          <ThemeIndicator />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <Button 
              key={t}
              variant={theme === t ? "default" : "outline"}
              onClick={() => setTheme(t as any)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="text-sm text-muted-foreground">Theme colors preview:</div>
        <div className="flex flex-wrap gap-2">
          <div className="w-8 h-8 rounded-full bg-primary"></div>
          <div className="w-8 h-8 rounded-full bg-secondary"></div>
          <div className="w-8 h-8 rounded-full bg-accent"></div>
          <div className="w-8 h-8 rounded-full bg-muted"></div>
          <div className="w-8 h-8 rounded-full bg-background border"></div>
        </div>
      </CardFooter>
    </Card>
  );
}