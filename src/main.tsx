import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const app = document.getElementById('app');
if (!app) {
  throw new Error('Failed to get the application markup.');
}

createRoot(app).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          loading...
        </div>
      }
    >
      <App />
    </Suspense>
  </StrictMode>
);
