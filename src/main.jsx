// StrictMode = modul de dezvoltare care detectează probleme potențiale
// (randează componenta de 2x în dev pentru a detecta efecte secundare)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Stilurile globale
import App from './App.jsx';

// Găsim elementul cu id="root" din index.html
// Acesta este „ancora" în care React injectează toată aplicația
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);