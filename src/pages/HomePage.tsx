import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to ChatSystem</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive platform for managing your chat operations and AI assistants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Dashboard</CardTitle>
            <CardDescription>
              Access your personal dashboard to view system statistics and quick actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Get a quick overview of your system's performance and access commonly used features.
            </p>
            <Button asChild>
              <Link to="/dashboard" className="flex items-center">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat Sessions</CardTitle>
            <CardDescription>
              View and manage all chat interactions with your users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Access chat logs, analyze conversations, and optimize your chat experience.
            </p>
            <Button asChild>
              <Link to="/chat-sessions" className="flex items-center">
                View Chat Sessions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md bg-background">
            <h3 className="font-medium text-lg mb-2">1. Explore the Dashboard</h3>
            <p className="text-muted-foreground mb-3">
              Get familiar with the system's key metrics and features available to you.
            </p>
            <Button variant="outline" asChild size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <div className="p-4 border rounded-md bg-background">
            <h3 className="font-medium text-lg mb-2">2. Check Chat Sessions</h3>
            <p className="text-muted-foreground mb-3">
              Review ongoing and past conversations with your users.
            </p>
            <Button variant="outline" asChild size="sm">
              <Link to="/chat-sessions">Sessions</Link>
            </Button>
          </div>

          <div className="p-4 border rounded-md bg-background">
            <h3 className="font-medium text-lg mb-2">3. Update Settings</h3>
            <p className="text-muted-foreground mb-3">
              Configure your preferences and system settings.
            </p>
            <Button variant="outline" asChild size="sm">
              <Link to="/settings">Settings</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
