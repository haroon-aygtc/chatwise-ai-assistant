import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/hooks/auth/useAuth";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  showImagePanel?: boolean;
  className?: string;
}

const AuthLayout = ({
  children,
  title,
  description,
  showImagePanel = true,
  className,
}: AuthLayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex">
        {/* Left panel with image - only shown on larger screens */}
        {showImagePanel && (
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary/40">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.7),transparent)]" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-md animate-float"
                style={{ animationDuration: "6s" }}
              ></div>
              <div
                className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-md animate-float"
                style={{ animationDuration: "8s", animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-2/3 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-md animate-float"
                style={{ animationDuration: "7s", animationDelay: "0.5s" }}
              ></div>

              {/* Abstract shapes */}
              <div className="absolute top-20 right-20 w-40 h-40">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-20 animate-float"
                  style={{ animationDuration: "10s" }}
                >
                  <path
                    fill="#FFFFFF"
                    d="M40.8,-62.2C52.9,-56.3,62.5,-44.2,68.1,-30.8C73.7,-17.4,75.2,-2.8,71.4,9.8C67.6,22.4,58.4,33,48.1,42.6C37.8,52.2,26.5,60.8,13.5,64.3C0.6,67.8,-14,66.2,-27.2,61.1C-40.4,56,-52.3,47.4,-58.3,36.1C-64.4,24.8,-64.7,10.8,-63.3,-2.8C-61.9,-16.4,-58.9,-29.6,-51.5,-39.9C-44.1,-50.2,-32.4,-57.6,-20,-61.4C-7.6,-65.2,5.5,-65.4,18.1,-65C30.7,-64.6,42.8,-63.6,52.9,-57.7Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              <div className="absolute bottom-20 left-20 w-48 h-48">
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-20 animate-float"
                  style={{ animationDuration: "12s", animationDelay: "1s" }}
                >
                  <path
                    fill="#FFFFFF"
                    d="M47.7,-73.2C59.5,-65.3,65.9,-48.3,70.9,-32.1C75.9,-15.9,79.4,-0.5,76.3,13.4C73.1,27.2,63.2,39.5,51.6,49.8C40,60.2,26.6,68.6,11.2,73.1C-4.2,77.6,-21.6,78.2,-35.9,71.9C-50.2,65.6,-61.3,52.3,-69.5,37.3C-77.7,22.3,-82.9,5.5,-80.2,-9.8C-77.5,-25.1,-66.9,-38.9,-54.4,-47.4C-41.9,-55.9,-27.5,-59.1,-13.5,-63.9C0.5,-68.7,14,-74.1,28.9,-75.8C43.8,-77.5,60.1,-75.5,73.1,-67.1Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 group transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded bg-white flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
                    CS
                  </div>
                  <h1 className="font-bold text-xl text-white group-hover:translate-x-1 transition-transform">
                    ChatSystem
                  </h1>
                </Link>
              </div>

              <div className="space-y-6">
                {/* 3D Chat Widget Illustration */}
                <div className="relative mx-auto w-80 h-80 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 transform perspective-800 rotate-y-6 rotate-x-6 transition-all duration-500 hover:rotate-y-0 hover:rotate-x-0 group">
                    {/* Video recording indicator */}
                    <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-500 animate-pulse z-10 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl flex items-center px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 text-white"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                        <span className="text-xs text-white font-medium">
                          AI Assistant
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-10 left-0 right-0 bottom-12 p-4 overflow-hidden">
                      {/* 3D effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none"></div>
                      {/* Scan line effect */}
                      <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none"></div>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-start">
                          <div
                            className="bg-white/10 rounded-lg p-3 max-w-[80%] text-white text-xs animate-slide-in-left shadow-glow"
                            style={{
                              animationDelay: "0.3s",
                              textShadow: "0 0 5px rgba(255,255,255,0.3)",
                            }}
                          >
                            Hello! How can I help you today?
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div
                            className="bg-orange-500/80 rounded-lg p-3 max-w-[80%] text-white text-xs animate-slide-in-right shadow-glow"
                            style={{
                              animationDelay: "0.6s",
                              textShadow: "0 0 5px rgba(255,255,255,0.3)",
                            }}
                          >
                            I need information about your services.
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div
                            className="bg-white/10 rounded-lg p-3 max-w-[80%] text-white text-xs animate-slide-in-left shadow-glow"
                            style={{
                              animationDelay: "0.9s",
                              textShadow: "0 0 5px rgba(255,255,255,0.3)",
                            }}
                          >
                            I'd be happy to help! Our AI chat system offers
                            seamless integration, customizable widgets, and
                            advanced analytics.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-12 border-t border-white/10 flex items-center gap-2 p-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 rounded-md px-3 py-1.5 text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                      />
                      <button className="bg-orange-500/80 rounded-md h-7 w-7 flex items-center justify-center" title="Send Message">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 text-white"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl transform hover:scale-[1.01] transition-all duration-300">
                  <div className="text-white text-lg font-medium mb-2">
                    "Revolutionize your customer experience"
                  </div>
                  <div className="text-white/80 text-sm">
                    ChatSystem has transformed how we engage with our customers.
                    The AI responses are incredibly accurate and the setup was
                    effortless.
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 overflow-hidden">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=testimonial1"
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-white font-medium">Sarah Johnson</div>
                      <div className="text-white/70 text-xs">
                        Product Manager, TechCorp
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-white/80"></div>
                  <div className="h-2 w-2 rounded-full bg-white/40"></div>
                  <div className="h-2 w-2 rounded-full bg-white/40"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-subtle"></div>
            <div
              className="absolute top-1/4 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-subtle"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        )}

        {/* Right panel with form */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            showImagePanel ? "lg:w-1/2" : "w-full",
            className,
          )}
        >
          <div className="flex items-center justify-between p-6">
            <Link
              to="/"
              className="flex items-center gap-2 group transition-all duration-300 hover:opacity-80"
            >
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold group-hover:scale-105 transition-transform">
                CS
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-lg group-hover:translate-x-0.5 transition-transform">
                  ChatSystem
                </h1>
                <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Home
                </span>
              </div>
            </Link>
            <div className="ml-auto">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 pb-10">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="mt-2 text-muted-foreground">{description}</p>
              </div>
              <div className="mt-8">{children}</div>
            </div>
          </div>
          <div className="p-6 text-center text-sm text-muted-foreground border-t">
            <div className="flex items-center justify-center gap-4">
              <ThemeSwitcher />
              <div className="flex divide-x divide-muted [&>a]:px-2 [&>a]:transition-colors [&>a:hover]:text-foreground text-muted-foreground">
                <Link to="/terms">Terms</Link>
                <Link to="/privacy">Privacy</Link>
                <Link to="/help">Help</Link>
              </div>
            </div>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} ChatSystem. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default AuthLayout;
