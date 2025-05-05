
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponseFormat } from "@/types/ai-configuration";

interface SavedFormatsCardProps {
  formats: ResponseFormat[];
  onSelectFormat: (format: ResponseFormat) => void;
  onSetDefault: (id: string) => void;
  isSettingDefault: boolean;
}

export const SavedFormatsCard = ({ 
  formats, 
  onSelectFormat, 
  onSetDefault,
  isSettingDefault 
}: SavedFormatsCardProps) => {
  if (!formats || formats.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Formats</CardTitle>
        <CardDescription>
          Select a format to edit or test
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formats.map((format) => (
            <Card key={format.id} className={format.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{format.name}</CardTitle>
                <CardDescription className="text-xs">{format.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  <div><span className="font-medium">Format:</span> {format.format}</div>
                  <div><span className="font-medium">Length:</span> {format.length}</div>
                  <div><span className="font-medium">Tone:</span> {format.tone}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectFormat(format)}
                  >
                    Edit
                  </Button>
                  {!format.isDefault && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => onSetDefault(format.id)}
                      disabled={isSettingDefault}
                    >
                      Set Default
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedFormatsCard;
