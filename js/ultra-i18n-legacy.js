// Legacy support for old ultra-i18n.js
// Redirects to new UltraPerfectI18n system

console.warn('[DEPRECATED] ultra-i18n.js is deprecated. Please use ultra-perfect-i18n.js instead');

// Wait for new system to load
if (window.ultraI18n) {
  window.i18n = window.ultraI18n;
} else {
  // Fallback in case new system isn't loaded yet
  window.addEventListener('load', () => {
    if (window.ultraI18n) {
      window.i18n = window.ultraI18n;
    }
  });
}