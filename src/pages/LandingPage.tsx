
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MessageSquare, Sun, Moon, Check, ExternalLink, ChevronRight, Upload, Zap, Database, PaintBucket, Layers, Search, Clock, Command } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ModeToggle } from "@/components/ModeToggle";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080d16] text-white">
      {/* Navigation */}
      <nav className="py-4 px-6 md:px-10 lg:px-20 border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white h-8 w-8 rounded-md flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-[#080d16]" />
            </div>
            <span className="font-bold text-lg">ChatSystem</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link to="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</Link>
            <Link to="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link to="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            
            <Button variant="outline" className="text-xs border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white" asChild>
              <Link to="/login">Login</Link>
            </Button>
            
            <Button className="text-xs bg-white text-black hover:bg-gray-200" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            
            <Button variant="outline" className="text-xs border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white hidden md:flex" asChild>
              <Link to="#api">
                <span>API Tester</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="text-xs border-gray-700 bg-transparent text-white hover:bg-gray-800 hover:text-white hidden md:flex" asChild>
              <Link to="#csrf">
                <span>CSRF Debugger</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Hero section */}
      <section className="py-16 lg:py-24 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-950/50 text-blue-400 mb-4">
              Next Gen AI Chat System
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Intelligent Conversations, <br />
              Effortlessly <span className="text-[#4d9ef8]">Embedded</span>
            </h1>
            
            <p className="text-gray-400 max-w-md">
              Deploy an AI-powered chat widget on your website in minutes.
              Customize, train, and manage your AI assistant without writing a single
              line of code.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-[#4d9ef8] hover:bg-[#3a8ae0]">
                Get Started <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
                Go to Dashboard <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400 pt-2">
              <div className="flex-shrink-0">
                <Check className="h-4 w-4" />
              </div>
              <span>No credit card required • Free 14-day trial</span>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/lovable-uploads/f4cc33cb-f666-4fe9-83db-ce696df0ad58.png" 
              alt="Chat Widget Demo" 
              className="w-full rounded-md shadow-2xl border border-gray-800"
            />
          </div>
        </div>
      </section>
      
      {/* Trusted by section */}
      <section className="py-16 px-6 md:px-10 lg:px-20 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-10">TRUSTED BY INNOVATIVE COMPANIES</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="text-gray-500 font-semibold">COMPANY {i}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to deploy, customize, and manage your AI chat assistant without writing a
              single line of code.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-[#0f172a] border-gray-800 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-400">
                  <Command className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">AI-Powered Conversations</h3>
                <p className="text-gray-400 text-sm">
                  Leverage advanced AI models to provide intelligent, context-aware responses to your customers' queries.
                </p>
                <ul className="space-y-2 pt-4">
                  <FeatureItem text="Multi-model support (Gemini, Hugging Face)" />
                  <FeatureItem text="Dynamic AI routing based on query type" />
                  <FeatureItem text="Context-aware responses with memory" />
                </ul>
              </div>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-[#0f172a] border-gray-800 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-400">
                  <PaintBucket className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Visual Customization</h3>
                <p className="text-gray-400 text-sm">
                  Tailor the look and feel of your chat widget to match your brand's identity and website design.
                </p>
                <ul className="space-y-2 pt-4">
                  <FeatureItem text="Custom colors, fonts, and styling" />
                  <FeatureItem text="Multiple widget positions and sizes" />
                  <FeatureItem text="Light/dark mode with auto-switching" />
                </ul>
              </div>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-[#0f172a] border-gray-800 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-md bg-blue-900/50 flex items-center justify-center text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Knowledge Base Integration</h3>
                <p className="text-gray-400 text-sm">
                  Ground your AI's responses on your specific business information for accurate and helpful answers.
                </p>
                <ul className="space-y-2 pt-4">
                  <FeatureItem text="Upload documents in multiple formats" />
                  <FeatureItem text="Automatic indexing and semantic search" />
                  <FeatureItem text="Version control and change history" />
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works section */}
      <section id="how-it-works" className="py-20 px-6 md:px-10 lg:px-20 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get up and running with your AI chat assistant in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full bg-[#0f172a] border-2 border-gray-700 flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Create Your Account</h3>
              <p className="text-gray-400 text-center">
                Sign up for ChatSystem and access your personalized dashboard to begin configuring your AI assistant.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full bg-[#0f172a] border-2 border-gray-700 flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Customize Your Widget</h3>
              <p className="text-gray-400 text-center">
                Design your chat widget's appearance, configure AI behavior, and upload your knowledge base documents.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full bg-[#0f172a] border-2 border-gray-700 flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Embed and Launch</h3>
              <p className="text-gray-400 text-center">
                Copy your unique embed code, add it to your website, and your AI chat assistant is ready to engage with your visitors.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Join thousands of businesses using ChatSystem to provide exceptional AI-powered support.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-[#4d9ef8] hover:bg-[#3a8ae0]">
              Start Free Trial <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
              Go to Dashboard <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mt-6">
            <div className="flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <span>No credit card required • 14-day free trial • Cancel anytime</span>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-16 px-6 md:px-10 lg:px-20 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white h-8 w-8 rounded-md flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-[#080d16]" />
                </div>
                <span className="font-bold text-lg">ChatSystem</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                The most advanced AI-powered chat system for modern businesses.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-gray-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
                <Link to="#" className="text-gray-500 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#features" className="text-sm text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="#how-it-works" className="text-sm text-gray-400 hover:text-white">How It Works</Link></li>
                <li><Link to="#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">Cookie Policy</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-white">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2025 ChatSystem. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="text-xs text-gray-500 hover:text-white">Terms</Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-white">Privacy</Link>
              <Link to="#" className="text-xs text-gray-500 hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature item component
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <div className="mt-1 flex-shrink-0">
        <Check className="h-4 w-4 text-[#4d9ef8]" />
      </div>
      <span className="text-gray-300">{text}</span>
    </li>
  );
}
