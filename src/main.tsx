/**
 * Design philosophy: Swiss International Typographic Style adapted for mobile-money checkout.
 * This entry file preserves a lean application shell so the payment experience remains precise, legible, and fast.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
