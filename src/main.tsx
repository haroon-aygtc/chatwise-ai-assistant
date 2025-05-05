import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import the intl-tel-input CSS
import 'intl-tel-input/build/css/intlTelInput.css'

createRoot(document.getElementById("root")!).render(<App />);
