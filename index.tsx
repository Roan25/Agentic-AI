import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProviders } from './AppProviders';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
} else {
  // Graceful fallback UI instead of a hard crash
  document.body.innerHTML = `
    <div style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #121212; color: #EAEAEA;">
      <h1>Application failed to load: Root element not found.</h1>
    </div>
  `;
  console.error("Fatal: Could not find root element to mount the React application.");
}
