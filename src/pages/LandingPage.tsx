import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Bot,
  Code,
  Database,
  ExternalLink,
  Globe,
  Laptop,
  Layout,
  LineChart,
  MessageSquare,
  Palette,
  ServerCog,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const LandingPage = () => {
  const [activeView, setActiveView] = useState("dashboard"); // Default to "dashboard" view
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-white dark:bg-card sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CS
            </div>
            <h1 className="font-bold text-lg">ChatSystem</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Testimonials
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>

              {/*Temporary API Tester and CSRF Debugger */}
              <Button
                  variant={activeView === "api-tester" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate("/api-tester")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  API Tester
                </Button>
              <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/csrf-debug")}
                >
                  <ServerCog className="mr-2 h-4 w-4" />
                  CSRF Debugger
                </Button>
              {/* End of Temporary API Tester and CSRF Debugger */}

            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6">
              <Badge className="mb-4" variant="secondary">
                Next-Gen AI Chat System
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Intelligent Conversations,{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Effortlessly Embedded
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Deploy an AI-powered chat widget on your website in minutes.
                Customize, train, and manage your AI assistant without writing a
                single line of code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/admin/chat-sessions">
                  <Button size="lg" variant="outline" className="gap-2">
                    Go to Dashboard <Layout className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>No credit card required • Free 14-day trial</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-lg border bg-background p-3 shadow-xl transform transition-all hover:scale-[1.01] hover:shadow-2xl">
                <div className="rounded-md bg-muted p-4 h-[400px] relative overflow-hidden backdrop-blur-sm">
                  {/* Chat widget that extends beyond the container */}
                  <div className="absolute -bottom-20 -right-24 w-[420px] rounded-xl shadow-[0_20px_50px_rgba(249,115,22,0.4)] overflow-hidden transform perspective-[1200px] rotate-y-3 rotate-x-6 transition-all duration-700 hover:rotate-y-0 hover:rotate-x-0 hover:scale-105 border border-white/20 bg-white/5 backdrop-blur-sm animate-float z-30">
                    {/* Video recording indicator */}
                    <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-500 animate-pulse z-10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-3 flex justify-between items-center border-b border-white/20 shadow-lg relative">
                      {/* Glossy reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                      <div className="flex items-center gap-2 relative z-10">
                        <div className="h-8 w-8 rounded-full bg-white/20 ring-2 ring-white/40 flex items-center justify-center shadow-inner">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">
                            AI Assistant
                          </h3>
                          <p className="text-[10px] text-white/90 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                          </p>
                        </div>
                      </div>
                      <button className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shadow-sm relative z-10">
                        <span className="sr-only">Close</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                        >
                          <path
                            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 dark:bg-card p-3 h-56 overflow-y-auto relative">
                      {/* 3D effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none"></div>
                      {/* Scan line effect */}
                      <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none"></div>
                      <div className="flex justify-start mb-3">
                        <div
                          className="max-w-[80%] rounded-lg bg-muted p-3 text-xs shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg animate-slide-in-left"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <p>Hello! How can I help you today?</p>
                        </div>
                      </div>
                      <div className="flex justify-end mb-3">
                        <div
                          className="max-w-[80%] rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 p-3 text-xs text-white shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg animate-slide-in-right"
                          style={{ animationDelay: "0.6s" }}
                        >
                          <p>I have a question about your services.</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div
                          className="max-w-[80%] rounded-lg bg-muted p-3 text-xs shadow-md transform transition-all hover:-translate-y-1 hover:shadow-lg animate-slide-in-left"
                          style={{ animationDelay: "0.9s" }}
                        >
                          <p>
                            I'd be happy to help with that! What would you like
                            to know about our AI chat system?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-3 flex gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm relative">
                      {/* Bottom reflection */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-30"></div>
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 text-xs p-2 rounded-md border border-gray-200 dark:border-gray-700 shadow-inner focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all relative z-10"
                      />
                      <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-md px-4 py-2 text-xs shadow-md hover:shadow-lg hover:-translate-y-1 transition-all relative z-10">
                        Send
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 right-4 h-8 bg-background rounded flex items-center px-4">
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                    <div className="flex-1 text-xs text-center text-muted-foreground">
                      yourwebsite.com
                    </div>
                  </div>
                </div>
                {/* Enhanced background effects */}
                <div className="absolute -z-10 h-48 w-48 rounded-full bg-orange-500/30 blur-3xl top-1/2 -translate-y-1/2 -right-20 animate-pulse-subtle"></div>
                <div
                  className="absolute -z-10 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl bottom-0 left-1/2 -translate-x-1/2 animate-pulse-subtle"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute -z-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl top-1/4 right-1/4 animate-pulse-subtle"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                {/* Additional glow effect behind the chat widget */}
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-500/40 blur-3xl animate-pulse-subtle z-10"></div>
                {/* Extra floating elements for depth */}
                <div
                  className="absolute top-20 right-20 h-16 w-16 rounded-full bg-blue-500/10 blur-md animate-float"
                  style={{ animationDuration: "8s" }}
                ></div>
                <div
                  className="absolute bottom-20 left-20 h-12 w-12 rounded-full bg-purple-500/10 blur-md animate-float"
                  style={{ animationDuration: "6s", animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            TRUSTED BY INNOVATIVE COMPANIES
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-muted/50 rounded flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground font-medium">
                  COMPANY {i}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deploy, customize, and manage your AI chat
              assistant without writing a single line of code.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Bot className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Conversations</CardTitle>
                <CardDescription>
                  Leverage advanced AI models to provide intelligent,
                  context-aware responses to your users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Multi-model support (Gemini, Hugging Face)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Dynamic AI routing based on query type</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Context-aware responses with memory</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Palette className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Visual Customization</CardTitle>
                <CardDescription>
                  Tailor the look and feel of your chat widget to match your
                  brand identity perfectly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Custom colors, fonts, and styling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Multiple widget positions and sizes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Light/dark mode with auto-switching</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Knowledge Base Integration</CardTitle>
                <CardDescription>
                  Ground your AI's responses in your specific business knowledge
                  and documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Upload documents in multiple formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Automatic indexing and semantic search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Version control and change history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get up and running with your AI chat assistant in just a few
              simple steps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="absolute top-0 left-6 bottom-0 border-l-2 border-dashed border-muted-foreground/30 -z-10"></div>
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create Your Account
              </h3>
              <p className="text-muted-foreground">
                Sign up for ChatSystem and access your personalized dashboard to
                begin configuring your AI assistant.
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-6 bottom-0 border-l-2 border-dashed border-muted-foreground/30 -z-10"></div>
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Customize Your Widget
              </h3>
              <p className="text-muted-foreground">
                Design your chat widget's appearance, configure AI behavior, and
                upload your knowledge base documents.
              </p>
            </div>

            <div>
              <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Embed and Launch</h3>
              <p className="text-muted-foreground">
                Copy your unique embed code, add it to your website, and your AI
                chat assistant is ready to engage with your visitors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Transform Your Customer Experience?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using ChatSystem to provide
              exceptional AI-powered support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/chat-sessions">
                <Button size="lg" variant="outline" className="gap-2">
                  Go to Dashboard <Layout className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  CS
                </div>
                <h1 className="font-bold text-lg">ChatSystem</h1>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The most advanced AI-powered chat system for modern businesses.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ChatSystem. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
