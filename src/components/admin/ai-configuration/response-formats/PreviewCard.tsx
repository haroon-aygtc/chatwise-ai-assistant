
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewCardProps {
  result: string;
  isLoading: boolean;
}

export const PreviewCard = ({ result, isLoading }: PreviewCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>See how your format will look</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading preview...</p>
            </div>
          ) : result ? (
            <div className="whitespace-pre-wrap">{result}</div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Test a prompt to see the formatted output</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
