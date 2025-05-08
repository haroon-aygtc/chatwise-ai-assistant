import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import the intl-tel-input CSS
import 'intl-tel-input/build/css/intlTelInput.css'
import { BrowserRouter } from 'react-router-dom'


const basename = import.meta.env.BASE_URL;


ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );



  // Ensure CSRF token is fetched before rendering
// getCsrfToken()
//   .then(() => {
//     createRoot(document.getElementById("root")!).render(<App />);
//   })
//   .catch(error => {
//     console.error('Failed to initialize CSRF token:', error);
//     // Still render the app even if CSRF fails - it will retry on API calls
//     createRoot(document.getElementById("root")!).render(<App />);
//   });
