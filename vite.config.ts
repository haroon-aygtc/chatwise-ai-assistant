import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx"],
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 8080,
    allowedHosts: process.env.TEMPO === "true" ? true : true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          // Return false to continue proxy, true to bypass
          if (
            req.url.startsWith("/api") &&
            !req.headers.host?.includes("localhost:8000")
          ) {
            console.log("Bypassing API proxy for development");
            return req.url;
          }
          return false;
        },
      },
      "/sanctum": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          // Return false to continue proxy, true to bypass
          if (
            req.url.startsWith("/sanctum") &&
            !req.headers.host?.includes("localhost:8000")
          ) {
            console.log("Bypassing Sanctum proxy for development");
            return req.url;
          }
          return false;
        },
      },
    },
  },
}));
