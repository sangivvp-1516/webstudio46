/**
 * WEB STUDIO 46 — Vercel Speed Insights Initialization
 * Automatically injects Speed Insights tracking on all pages
 */

import { injectSpeedInsights } from './speed-insights.mjs';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights();
  });
} else {
  // DOM is already loaded
  injectSpeedInsights();
}
