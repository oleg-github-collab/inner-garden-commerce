/**
 * Index Page i18n System
 * Handles language switching and translations for index.html
 */

(function() {
  'use strict';

  // Configuration
  const STORAGE_KEY = 'artkaminska_language';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'uk';
  let translations = {};

  // Language config
  const langConfig = {
    uk: { flag: '🇺🇦', short: 'УКР' },
    en: { flag: '🇺🇸', short: 'ENG' },
    de: { flag: '🇩🇪', short: 'DEU' }
  };

  /**
   * Load translations from JSON file
   */
  async function loadTranslations(lang) {
    try {
      console.log(`%c Loading translations for: ${lang}`, 'color: blue; font-weight: bold');
      const response = await fetch(`locales/index-${lang}.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      translations = await response.json();
      console.log(`%c Translations loaded: ${Object.keys(translations).length} keys`, 'color: green; font-weight: bold');

      applyTranslations();
      updateLanguageUI();
    } catch (error) {
      console.error('%c Failed to load translations:', 'color: red; font-weight: bold', error);
      console.error('Error details:', error);
    }
  }

  /**
   * Apply translations to elements with data-key attribute
   */
  function applyTranslations() {
    console.log('%c Applying translations...', 'color: orange; font-weight: bold');

    let translatedCount = 0;
    let missingCount = 0;

    document.querySelectorAll('[data-key]').forEach(element => {
      const key = element.getAttribute('data-key');

      if (translations[key]) {
        if (element.tagName === 'TITLE') {
          element.textContent = translations[key];
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[key];
        } else if (element.hasAttribute('data-key')) {
          element.textContent = translations[key];
        }
        translatedCount++;
      } else {
        console.warn(`Missing translation for key: ${key}`);
        missingCount++;
      }
    });

    // Update document title
    if (translations['page-title']) {
      document.title = translations['page-title'];
    }

    console.log(`%c ✓ Translated ${translatedCount} elements, ${missingCount} missing`, 'color: green');
  }

  /**
   * Update language UI (flag and dropdown)
   */
  function updateLanguageUI() {
    const langBtn = document.getElementById('langBtn');

    if (!langBtn) {
      console.warn('Language button not found');
      return;
    }

    const langIcon = langBtn.querySelector('.lang-icon');
    const langText = langBtn.querySelector('.lang-text');

    if (langIcon && langText) {
      langIcon.textContent = langConfig[currentLang].flag;
      langText.textContent = langConfig[currentLang].short;
    }

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(item => {
      item.classList.toggle('active', item.dataset.lang === currentLang);
    });
  }

  /**
   * Set language and save to localStorage
   */
  function setLanguage(lang) {
    console.log('Setting language to:', lang);
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    loadTranslations(lang);
  }

  /**
   * Initialize language system
   */
  function initLanguageSystem() {
    console.log('Initializing language system...');

    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');

    if (!langBtn || !langMenu) {
      console.error('Language selector elements not found!');
      console.log('langBtn:', langBtn);
      console.log('langMenu:', langMenu);
      return;
    }

    // Toggle language dropdown
    langBtn.addEventListener('click', (e) => {
      console.log('Language button clicked');
      e.stopPropagation();
      langMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
        langMenu.classList.remove('active');
      }
    });

    // Language selection
    document.querySelectorAll('.lang-option').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = item.dataset.lang;
        console.log('Language option clicked:', lang);
        setLanguage(lang);
        langMenu.classList.remove('active');
      });
    });

    console.log('Language system initialized successfully');

    // Load initial translations
    loadTranslations(currentLang);
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSystem);
  } else {
    initLanguageSystem();
  }

  /**
   * Expose public API for other scripts
   */
  window.IndexI18n = {
    getTranslation: function(key, fallback = '') {
      return translations[key] || fallback;
    },
    getCurrentLang: function() {
      return currentLang;
    },
    setLanguage: setLanguage
  };

})();
