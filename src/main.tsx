import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Import the intl-tel-input CSS
import "intl-tel-input/build/css/intlTelInput.css";
import { BrowserRouter } from "react-router-dom";
// Import the dev tools and initialize them
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Ensure CSRF token is fetched before rendering
import apiService from "./services/api/api";

// Initialize CSRF token before app renders
apiService.fetchCsrfToken().catch((error) => {
  console.warn("Failed to fetch CSRF token:", error);
  console.info(
    "App will continue to render, but authentication may not work properly",
  );
});
