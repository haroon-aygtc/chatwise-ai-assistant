import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { tempo } from "tempo-devtools/dist/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current directory
  const env = loadEnv(mode, process.cwd());

  // Get port from environment variable or use default
  const port = parseInt(env.VITE_PORT || '5173', 10);

  return {
    plugins: [
      react(),
      tempo(), // Add the tempo plugin
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: port,
      // @ts-ignore
      allowedHosts: process.env.TEMPO === "true" ? true : undefined,
      // Add proxy for API requests to avoid CORS issues during development
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/sanctum': {
          target: env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    },
  };
});
