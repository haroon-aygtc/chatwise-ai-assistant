import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { testModelConfiguration } from "@/services/ai-configuration/aiModelService"
import { CircleUser, Bot, RefreshCw } from "lucide-react"
import { GeminiConfiguration } from "@/types/ai-configuration"
import { useToast } from "@/components/ui/use-toast"

export const GeminiTester = () => {
    const [apiKey, setApiKey] = useState("")
    const [prompt, setPrompt] = useState("Explain how generative AI works in a few sentences.")
    const [response, setResponse] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleTest = async () => {
        if (!apiKey) {
            toast({
                variant: "destructive",
                title: "API Key Required",
                description: "Please provide a Gemini API key to test the integration."
            })
            return
        }

        if (!prompt) {
            toast({
                variant: "destructive",
                title: "Prompt Required",
                description: "Please provide a prompt to test the model."
            })
            return
        }

        try {
            setIsLoading(true)
            setResponse("")

            // Configure model
            const configuration: GeminiConfiguration = {
                temperature: 0.7,
                maxTokens: 2048,
                model: "gemini-1.5-pro",
                topP: 0.95,
                topK: 40
            }

            // Test the model
            const result = await testModelConfiguration(
                "Gemini",
                configuration,
                prompt,
                apiKey
            )

            setResponse(result)
        } catch (error) {
            console.error("Error testing Gemini model:", error)
            toast({
                variant: "destructive",
                title: "Test Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CircleUser className="h-6 w-6 text-blue-500" />
                    <div>
                        <CardTitle>Gemini AI Tester</CardTitle>
                        <CardDescription>Test your Gemini API integration</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="api-key">Gemini API Key</Label>
                    <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prompt">Test Prompt</Label>
                    <Textarea
                        id="prompt"
                        placeholder="Enter a prompt to test"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                    />
                </div>
                {response && (
                    <div className="space-y-2">
                        <Label>Response</Label>
                        <div className="rounded-md border p-4 bg-muted/30">
                            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setResponse("")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear
                </Button>
                <Button onClick={handleTest} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                        </>
                    ) : (
                        <>
                            <Bot className="mr-2 h-4 w-4" />
                            Test Gemini
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default GeminiTester 