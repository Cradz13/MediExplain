import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Load Vercel Analytics script in production only
function loadVercelAnalyticsScript() {
  if (typeof window === 'undefined') return;
  // Avoid loading multiple times
  if ((window as any).__vercel_analytics_loaded) return;
  // Only load in production builds
  if (import.meta.env.MODE !== 'production') return;

  const s = document.createElement('script');
  s.src = 'https://static.vercel-insights.com/v1/script.js';
  s.defer = true;
  s.setAttribute('data-auto', 'false');
  s.onload = () => {
    (window as any).__vercel_analytics_loaded = true;
    console.log('Vercel Analytics script loaded');
  };
  s.onerror = () => console.warn('Failed to load Vercel Analytics script');
  document.head.appendChild(s);
}

// Call the loader before the app mounts
loadVercelAnalyticsScript();

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
