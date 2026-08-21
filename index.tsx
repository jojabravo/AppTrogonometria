
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('Trigonométrica ServiceWorker registrado con éxito:', reg.scope);
      })
      .catch((err) => {
        console.warn('Error al registrar ServiceWorker:', err);
      });
  });
} else if ('serviceWorker' in navigator) {
  // In development, also register service worker if supported
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
