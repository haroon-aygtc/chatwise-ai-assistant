
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, X } from 'lucide-react';

interface AiSuggestion {
  title: string;
  description: string;
  action: () => void;
}

interface AiAssistantProps {
  suggestions: AiSuggestion[];
}

const AiAssistant = ({ suggestions }: AiAssistantProps) => {
  const [visible, setVisible] = useState(true);
  
  if (!visible || suggestions.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-4 border-amber-200 bg-amber-50 mb-6">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <span>AI Assistant Suggestions</span>
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => setVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="bg-white rounded-md p-3 border border-amber-100 hover:border-amber-300 transition-all cursor-pointer"
                onClick={() => {
                  suggestion.action();
                  setVisible(false);
                }}
              >
                <h5 className="text-sm font-medium mb-1">{suggestion.title}</h5>
                <p className="text-xs text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AiAssistant;