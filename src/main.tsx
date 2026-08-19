import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Vercel Web Analytics is wired up with the official <Analytics /> component
// inside `src/App.tsx` (from the installed `@vercel/analytics/react` package).
// The previous hand-rolled loader injected the insights script with
// `data-auto="false"` and never called the manual pageview API afterwards, so
// analytics silently collected nothing at all.

// Suppress benign Vite HMR WebSocket connection errors in sandboxed environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason || '');
    if (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('closed without opened')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || String(event.error || '');
    if (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('closed without opened')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
