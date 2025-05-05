
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Brain, Code, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b py-4 px-6 md:px-10 bg-card">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">ChatWise</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link to="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link to="#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Hero section */}
      <section className="py-12 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Intelligent AI Chat For Your Website
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            ChatWise is an embeddable AI-powered chat system that lets you provide 
            intelligent customer support 24/7. Customize it to match your brand and 
            integrate it in minutes.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#demo">View Demo</Link>
            </Button>
          </div>
          
          <div className="mt-16 relative">
            <Card className="shadow-xl mx-auto max-w-4xl overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src="/placeholder.svg"
                  alt="ChatWise Admin Dashboard" 
                  className="w-full h-auto aspect-video object-cover"
                />
              </CardContent>
            </Card>
            <div className="absolute -z-10 w-full h-full max-w-5xl top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full opacity-30" />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-16 bg-muted/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support experiences with AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="h-6 w-6" />}
              title="AI-Powered Intelligence"
              description="Leverage advanced AI models like Gemini and Hugging Face to provide intelligent, context-aware responses to your customers."
            />
            
            <FeatureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Real-Time Communication"
              description="Instant messaging with typing indicators, read receipts, and file attachment support for seamless conversations."
            />
            
            <FeatureCard 
              icon={<Code className="h-6 w-6" />}
              title="Easy Integration"
              description="Embed the chat widget on your website with a simple JavaScript snippet. No coding knowledge required."
            />
            
            {/* More feature cards would go here */}
          </div>
          
          <div className="text-center mt-16">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ChatWise</span>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0 justify-center">
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © 2025 ChatWise. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="bg-primary/10 h-12 w-12 rounded-lg flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
