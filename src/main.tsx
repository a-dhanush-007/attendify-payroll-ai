
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Prefetch critical resources
const prefetchResources = () => {
  // Add prefetch for critical resources if needed
  const links = [
    { rel: 'dns-prefetch', href: 'https://oaockrwpzfamwrkzpapb.supabase.co' },
    { rel: 'preconnect', href: 'https://oaockrwpzfamwrkzpapb.supabase.co' }
  ];

  links.forEach(({ rel, href }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  });
};

// Execute prefetch
prefetchResources();

// Create root with error boundary
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

// Render with error handling
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render application:", error);
  root.render(
    <div className="flex h-screen items-center justify-center">
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
        <p>The application failed to load. Please refresh the page or try again later.</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
