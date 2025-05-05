
import { useState } from 'react';
import { Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface TemplatePresetsProps {
  templates: Template[];
  applyTemplate: (templateId: string) => void;
  currentTemplate: string;
}

const TemplatePresets = ({ templates, applyTemplate, currentTemplate }: TemplatePresetsProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {templates.map((template) => (
        <div 
          key={template.id}
          onClick={() => applyTemplate(template.id)}
          onMouseEnter={() => setHovered(template.id)}
          onMouseLeave={() => setHovered(null)}
          className={`
            relative cursor-pointer rounded-md overflow-hidden border transition-all
            ${currentTemplate === template.id 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-muted hover:border-muted-foreground/30'
            }
          `}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2 bg-background text-xs">
            <h4 className="font-medium truncate">{template.name}</h4>
          </div>
          
          {/* Hover overlay */}
          {hovered === template.id && currentTemplate !== template.id && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-sm">
              Apply
            </div>
          )}
          
          {/* Selected indicator */}
          {currentTemplate === template.id && (
            <div className="absolute top-2 right-2 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplatePresets;