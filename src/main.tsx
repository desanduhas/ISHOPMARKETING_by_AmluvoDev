import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './CompanySite';
import './index.css';
import './company-site.css';
import './site-motion.css';
import './envato-style.css';
import './apple-ios-theme.css';
import './company-hero.css';

const resetPageToTop = () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }

  window.scrollTo(0, 0);
  window.requestAnimationFrame(() => window.scrollTo(0, 0));
};

resetPageToTop();
window.addEventListener('pageshow', resetPageToTop);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
