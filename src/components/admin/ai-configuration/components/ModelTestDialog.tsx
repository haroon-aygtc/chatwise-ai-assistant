import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AIModel } from "@/types/ai-configuration";
import { Loader2, Send, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ModelTestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    model: AIModel | null;
}

export function ModelTestDialog({ isOpen, onClose, model }: ModelTestDialogProps) {
    const [prompt, setPrompt] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tokensUsed, setTokensUsed] = useState<number | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const { toast } = useToast();

    const samplePrompts = [
        "Write a short paragraph about artificial intelligence.",
        "Explain quantum computing in simple terms.",
        "What are the benefits of clean energy?",
        "Write a creative story about a time traveler.",
    ];

    const handleSelectSamplePrompt = (sample: string) => {
        setPrompt(sample);
    };

    const handleSubmit = async () => {
        if (!prompt.trim() || !model) return;

        setIsLoading(true);
        setResponse("");
        setTokensUsed(null);
        setResponseTime(null);

        const startTime = Date.now();

        try {
            // This would be replaced with your actual API call to test the model
            // The implementation would depend on your backend service

            // Simulated API call for demonstration purposes
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate a response
            const mockResponse = `This is a simulated response from the ${model.name} model. In a real implementation, this would be the actual response from the API.
      
The response would include the capabilities of the model such as language understanding, creative content generation, or specialized domain knowledge depending on which model is being tested.`;

            const endTime = Date.now();
            setResponseTime(endTime - startTime);

            // Simulate token usage (in a real implementation, this would come from the API response)
            setTokensUsed(Math.floor(Math.random() * 200) + 100);

            // Set the response
            setResponse(mockResponse);
        } catch (error) {
            console.error("Error testing model:", error);
            setResponse("Error: Failed to get a response from the model. Please check your API key and try again.");
            toast({
                title: "Test Failed",
                description: "There was an error testing the model.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyResponse = () => {
        if (response) {
            navigator.clipboard.writeText(response);
            toast({
                title: "Copied to clipboard",
                description: "Response has been copied to clipboard",
            });
        }
    };

    if (!model) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Test Model: {model.name}
                        <Badge variant="outline" className="ml-2">
                            {model.provider}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Send a test prompt to verify the model configuration works correctly.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 my-4 overflow-hidden flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {samplePrompts.map((sample, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                                onClick={() => handleSelectSamplePrompt(sample)}
                            >
                                Sample {index + 1}
                            </Badge>
                        ))}
                    </div>

                    <div className="grid gap-2 flex-shrink-0">
                        <Textarea
                            placeholder="Enter your prompt here..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Prompt
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="border rounded-md p-3 mt-3 flex-grow overflow-auto max-h-[180px] bg-muted/20">
                        {response ? (
                            <div className="flex flex-col gap-2">
                                <div className="whitespace-pre-wrap">{response}</div>
                                {(tokensUsed || responseTime) && (
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                                        {tokensUsed && <span>Tokens: {tokensUsed}</span>}
                                        {responseTime && <span>Time: {(responseTime / 1000).toFixed(2)}s</span>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-center py-8">
                                Response will appear here...
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2 flex-col sm:flex-row sm:justify-between">
                    <div className="flex gap-2">
                        {response && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyResponse}
                                    className="gap-1.5"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 