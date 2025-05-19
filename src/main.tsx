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

// Ensure CSRF token is fetched before rendering - disabled for now
// We're rendering the app directly since the backend might not be available
// If you need to enable CSRF protection later, uncomment this code and ensure
// the backend is running at the configured URL
