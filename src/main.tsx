import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import the intl-tel-input CSS
import "intl-tel-input/build/css/intlTelInput.css";
import { BrowserRouter } from "react-router-dom";
// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
import { AuthProvider } from "@/hooks/auth/useAuth";
TempoDevtools.init();

// Ensure CSRF token is fetched before rendering
import apiService from "./services/api/api";

// Debug flag
const DEBUG = true;

const basename = import.meta.env.BASE_URL;

// Initialize the application
const initApp = async () => {
  try {
    // Initialize CSRF token before app renders
    if (DEBUG) console.log("Initializing CSRF token...");
    await apiService.fetchCsrfToken();
    if (DEBUG) console.log("CSRF token initialized successfully");
  } catch (error) {
    console.warn("Failed to fetch CSRF token:", error);
    console.info(
      "App will continue to render, but authentication may not work properly",
    );
  } finally {
    // Render the app regardless of CSRF token initialization success
    if (DEBUG) console.log("Rendering application...");
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
  }
};

// Start the application
initApp();
