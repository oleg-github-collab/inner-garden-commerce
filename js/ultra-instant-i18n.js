// Ultra Instant I18n System - Lightning Fast Language Switching
// Миттєве перемикання мов без перезавантаження

class UltraInstantI18n {
  constructor() {
    this.currentLang = 'uk';
    this.fallbackLang = 'uk';
    this.translations = {};
    this.cache = new Map();
    this.observers = new Set();
    this.isReady = false;
    this.activeElements = new Set();

    // Компактні переклади для швидкого завантаження
    this.initTranslations();
    this.init();
  }

  initTranslations() {
    this.translations = {
      'uk': {
        // Основні
        'site-title': 'Inner Garden',
        'loading': 'Завантаження...',
        'choose-language': 'Оберіть мову / Choose Language',
        'skip-to-content': 'Перейти до контенту',
        'close': 'Закрити',

        // Навігація
        'nav-home': 'Головна',
        'nav-map': 'Карта Гармонії',
        'nav-collection': 'Колекція',
        'nav-quiz': 'Вибрати Атмосферу',
        'nav-artworks': 'Картини',
        'nav-meditation': 'Медитація',
        'nav-stories': 'Історії',
        'nav-business': 'Для Бізнесу',

        // Головна сторінка
        'hero-title': 'Внутрішній Сад',
        'hero-subtitle': 'Простір у Гармонії',
        'hero-description': 'Відкрийте для себе світ абстрактного мистецтва, який трансформує бізнес-простори у оазиси спокою та натхнення. Кожна картина – це портал до внутрішньої гармонії ваших клієнтів і співробітників.',
        'hero-btn-quiz': 'Знайти Мою Картину',
        'hero-btn-artworks': 'Переглянути Колекцію',
        'scroll-explore': 'Досліджуйте',

        // Секції
        'map-title': 'Простори Гармонії',
        'map-subtitle': 'Подорожуйте світом і відкривайте реальні простори, де наше мистецтво створює атмосферу гармонії',
        'collection-title': 'Колекція Картин',
        'quiz-title': 'Виберіть Свою Атмосферу',
        'artworks-title': 'Доторкніться до Мистецтва',
        'meditation-title': 'Гармонія в Реальному Часі',
        'stories-title': 'Історії Ваших Просторів',
        'business-title': 'ROI Мистецтва',

        // Фільтри
        'filter-all': 'Усі простори',
        'filter-hotel': 'Готелі',
        'filter-medical': 'Медцентри',
        'filter-office': 'Офіси',
        'filter-wellness': 'Wellness',

        // AR
        'ar-title': 'Побачте у своєму просторі',
        'ar-instruction': 'Наведіть камеру на стіну і розмістіть картину',
        'ar-capture': 'Зберегти Фото',
        'ar-done': 'Готово',

        // Медитація
        'meditation-start': 'Почати Медитацію',
        'meditation-pause': 'Пауза',
        'meditation-skip': 'Пропустити',

        // Історії
        'share-story': 'Поділіться Своєю Історією',
        'story-form-title': 'Розповісти Вашу Історію',

        // Бізнес
        'roi-nps': 'Зростання NPS',
        'roi-productivity': 'Продуктивність',
        'roi-stress': 'Рівень стресу',
        'roi-satisfaction': 'Задоволеність клієнтів',
        'consultation-btn': 'Записатися на Консультацію',

        // Футер
        'footer-description': 'Створюємо гармонійні простори через абстрактне мистецтво',
        'footer-rights': 'Всі права захищені.'
      },

      'en': {
        // Basic
        'site-title': 'Inner Garden',
        'loading': 'Loading...',
        'choose-language': 'Choose Language / Оберіть мову',
        'skip-to-content': 'Skip to content',
        'close': 'Close',

        // Navigation
        'nav-home': 'Home',
        'nav-map': 'Harmony Map',
        'nav-collection': 'Collection',
        'nav-quiz': 'Choose Atmosphere',
        'nav-artworks': 'Artworks',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Stories',
        'nav-business': 'For Business',

        // Hero
        'hero-title': 'Inner Garden',
        'hero-subtitle': 'Space in Harmony',
        'hero-description': 'Discover the world of abstract art that transforms business spaces into oases of tranquility and inspiration. Each painting is a portal to the inner harmony of your clients and employees.',
        'hero-btn-quiz': 'Find My Painting',
        'hero-btn-artworks': 'View Collection',
        'scroll-explore': 'Explore',

        // Sections
        'map-title': 'Harmony Spaces',
        'map-subtitle': 'Travel the world and discover real spaces where our art creates an atmosphere of harmony',
        'collection-title': 'Art Collection',
        'quiz-title': 'Choose Your Atmosphere',
        'artworks-title': 'Touch the Art',
        'meditation-title': 'Real-Time Harmony',
        'stories-title': 'Stories of Your Spaces',
        'business-title': 'Art ROI',

        // Filters
        'filter-all': 'All spaces',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medical centers',
        'filter-office': 'Offices',
        'filter-wellness': 'Wellness',

        // AR
        'ar-title': 'See in your space',
        'ar-instruction': 'Point camera at wall and place artwork',
        'ar-capture': 'Save Photo',
        'ar-done': 'Done',

        // Meditation
        'meditation-start': 'Start Meditation',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Skip',

        // Stories
        'share-story': 'Share Your Story',
        'story-form-title': 'Tell Your Story',

        // Business
        'roi-nps': 'NPS Growth',
        'roi-productivity': 'Productivity',
        'roi-stress': 'Stress Level',
        'roi-satisfaction': 'Client Satisfaction',
        'consultation-btn': 'Book Consultation',

        // Footer
        'footer-description': 'Creating harmonious spaces through abstract art',
        'footer-rights': 'All rights reserved.'
      },

      'de': {
        // Basic
        'site-title': 'Inner Garden',
        'loading': 'Laden...',
        'choose-language': 'Sprache wählen / Choose Language',
        'skip-to-content': 'Zum Inhalt springen',
        'close': 'Schließen',

        // Navigation
        'nav-home': 'Home',
        'nav-map': 'Harmonie-Karte',
        'nav-collection': 'Kollektion',
        'nav-quiz': 'Atmosphäre wählen',
        'nav-artworks': 'Kunstwerke',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Geschichten',
        'nav-business': 'Für Unternehmen',

        // Hero
        'hero-title': 'Inner Garden',
        'hero-subtitle': 'Raum in Harmonie',
        'hero-description': 'Entdecken Sie die Welt der abstrakten Kunst, die Geschäftsräume in Oasen der Ruhe und Inspiration verwandelt. Jedes Gemälde ist ein Portal zur inneren Harmonie Ihrer Kunden und Mitarbeiter.',
        'hero-btn-quiz': 'Mein Gemälde finden',
        'hero-btn-artworks': 'Kollektion ansehen',
        'scroll-explore': 'Erkunden',

        // Sections
        'map-title': 'Harmonie-Räume',
        'map-subtitle': 'Reisen Sie um die Welt und entdecken Sie echte Räume, in denen unsere Kunst eine Atmosphäre der Harmonie schafft',
        'collection-title': 'Kunstkollektion',
        'quiz-title': 'Wählen Sie Ihre Atmosphäre',
        'artworks-title': 'Kunst berühren',
        'meditation-title': 'Echtzeit-Harmonie',
        'stories-title': 'Geschichten Ihrer Räume',
        'business-title': 'Kunst-ROI',

        // Filters
        'filter-all': 'Alle Räume',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medizinzentren',
        'filter-office': 'Büros',
        'filter-wellness': 'Wellness',

        // AR
        'ar-title': 'In Ihrem Raum sehen',
        'ar-instruction': 'Kamera auf Wand richten und Kunstwerk platzieren',
        'ar-capture': 'Foto speichern',
        'ar-done': 'Fertig',

        // Meditation
        'meditation-start': 'Meditation starten',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Überspringen',

        // Stories
        'share-story': 'Ihre Geschichte teilen',
        'story-form-title': 'Erzählen Sie Ihre Geschichte',

        // Business
        'roi-nps': 'NPS-Wachstum',
        'roi-productivity': 'Produktivität',
        'roi-stress': 'Stresslevel',
        'roi-satisfaction': 'Kundenzufriedenheit',
        'consultation-btn': 'Beratung buchen',

        // Footer
        'footer-description': 'Harmonische Räume durch abstrakte Kunst schaffen',
        'footer-rights': 'Alle Rechte vorbehalten.'
      }
    };

    console.log('🌍 Ultra Instant I18n translations loaded');
  }

  init() {
    // Встановлюємо збережену мову
    this.currentLang = this.getSavedLanguage();

    // Додаємо debug логування
    console.log(`🌍 Initializing with language: ${this.currentLang}`);
    console.log('Available translations:', Object.keys(this.translations));

    // Налаштовуємо слухачів подій ПЕРЕД оновленням контенту
    this.setupEventListeners();

    // Оновлюємо інтерфейс миттєво
    this.updateLanguageInterface();

    // Затримка для DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.updateAllContent();
      });
    } else {
      this.updateAllContent();
    }

    this.isReady = true;
    console.log(`🚀 Ultra Instant I18n ready with language: ${this.currentLang}`);
  }

  // =====================================================
  // LANGUAGE SWITCHING
  // =====================================================

  setLanguage(langCode) {
    console.log(`🔄 Attempting to set language to: ${langCode}`);

    if (!this.translations[langCode]) {
      console.warn(`❌ Language ${langCode} not found in translations:`, Object.keys(this.translations));
      return false;
    }

    const oldLang = this.currentLang;
    this.currentLang = langCode;

    console.log(`✅ Language set from ${oldLang} to ${langCode}`);

    // Миттєво оновлюємо весь контент
    try {
      this.updateAllContent();
      this.updateLanguageInterface();
      this.saveLanguage(langCode);

      // Оновлюємо URL та мета-дані
      this.updateDocumentMeta();

      // Повідомляємо слухачів
      this.notifyObservers('languageChanged', { old: oldLang, new: langCode });

      console.log(`🎉 Language successfully switched: ${oldLang} → ${langCode}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating language:', error);
      this.currentLang = oldLang; // Rollback
      return false;
    }
  }

  // =====================================================
  // CONTENT UPDATE
  // =====================================================

  updateAllContent() {
    const startTime = performance.now();

    // Отримуємо всі елементи з data-key
    const elements = document.querySelectorAll('[data-key]');
    let updatedCount = 0;
    let failedCount = 0;

    console.log(`🔄 Updating ${elements.length} elements with language: ${this.currentLang}`);

    elements.forEach((element, index) => {
      try {
        const key = element.getAttribute('data-key');
        const translation = this.get(key);

        // console.log(`Element ${index}: key="${key}", translation="${translation}"`);

        if (translation && translation !== key) {
          // Визначаємо тип елемента і оновлюємо відповідно
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'submit' || element.type === 'button') {
              element.value = translation;
            } else {
              element.placeholder = translation;
            }
          } else if (element.tagName === 'IMG') {
            element.alt = translation;
          } else if (element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', translation);
          } else {
            element.textContent = translation;
          }

          updatedCount++;
        } else {
          console.warn(`❌ No translation found for key: ${key}`);
          failedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating element:`, error);
        failedCount++;
      }
    });

    const endTime = performance.now();
    console.log(`⚡ Updated ${updatedCount} elements, ${failedCount} failed in ${(endTime - startTime).toFixed(1)}ms`);
  }

  updateLanguageInterface() {
    // Оновлюємо прапорці та текст мови
    const langToggles = document.querySelectorAll('.lang-toggle');
    langToggles.forEach(toggle => {
      const iconElement = toggle.querySelector('.lang-icon');
      const textElement = toggle.querySelector('.lang-text');

      if (iconElement && textElement) {
        const langConfig = this.getLanguageConfig(this.currentLang);
        iconElement.textContent = langConfig.flag;
        textElement.textContent = langConfig.short;
      }
    });

    // Оновлюємо активні стани в dropdown
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      option.classList.toggle('active', lang === this.currentLang);
    });

    // Оновлюємо HTML lang атрибут
    document.documentElement.lang = this.currentLang;
  }

  updateDocumentMeta() {
    // Оновлюємо заголовок сторінки
    const titleElement = document.querySelector('[data-key="page-title"]');
    if (titleElement) {
      document.title = this.get('page-title') || document.title;
    }

    // Оновлюємо мета-описи
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const newDesc = this.getMetaDescription();
      if (newDesc) metaDesc.content = newDesc;
    }
  }

  getMetaDescription() {
    const descriptions = {
      'uk': 'Inner Garden ⭐ Унікальні абстрактні картини для бізнес-просторів з доведеним ROI +40%. Трансформуйте готелі, офіси та медцентри у оазиси гармонії.',
      'en': 'Inner Garden ⭐ Unique abstract paintings for business spaces with proven ROI +40%. Transform hotels, offices and medical centers into oases of harmony.',
      'de': 'Inner Garden ⭐ Einzigartige abstrakte Gemälde für Geschäftsräume mit nachgewiesenem ROI +40%. Verwandeln Sie Hotels, Büros und Medizinzentren in Harmonie-Oasen.'
    };
    return descriptions[this.currentLang];
  }

  // =====================================================
  // TRANSLATION METHODS
  // =====================================================

  get(key, params = {}) {
    // Перевіряємо кеш
    const cacheKey = `${this.currentLang}:${key}`;
    if (this.cache.has(cacheKey)) {
      return this.interpolate(this.cache.get(cacheKey), params);
    }

    // Отримуємо переклад з поточної мови
    let translation = this.translations[this.currentLang]?.[key];

    if (!translation) {
      // Пробуємо fallback мову
      translation = this.translations[this.fallbackLang]?.[key];
    }

    if (!translation) {
      // Якщо нічого не знайдено, повертаємо сам ключ
      translation = key;
      console.warn(`❌ No translation found for "${key}", using key as fallback`);
    }

    // Кешуємо
    this.cache.set(cacheKey, translation);

    return this.interpolate(translation, params);
  }

  interpolate(text, params) {
    if (!params || Object.keys(params).length === 0) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // =====================================================
  // LANGUAGE CONFIGURATION
  // =====================================================

  getLanguageConfig(langCode) {
    const configs = {
      'uk': { flag: '🇺🇦', short: 'УКР', name: 'Українська' },
      'en': { flag: '🇺🇸', short: 'ENG', name: 'English' },
      'de': { flag: '🇩🇪', short: 'DEU', name: 'Deutsch' }
    };
    return configs[langCode] || configs['uk'];
  }

  getAvailableLanguages() {
    return Object.keys(this.translations).map(code => ({
      code,
      ...this.getLanguageConfig(code)
    }));
  }

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  setupEventListeners() {
    console.log('🎧 Setting up event listeners for language switching');

    // Слухаємо кліки на мовні перемикачі
    document.addEventListener('click', (e) => {
      // console.log('👆 Click detected:', e.target);

      // Перемикачі мови в header
      if (e.target.closest('.lang-option')) {
        e.preventDefault();
        const langElement = e.target.closest('.lang-option');
        const langCode = langElement.getAttribute('data-lang');
        console.log('🔄 Header language switch requested:', langCode);

        if (this.setLanguage(langCode)) {
          // Закриваємо dropdown
          const dropdown = e.target.closest('.lang-dropdown');
          if (dropdown) dropdown.classList.remove('active');
        }
      }

      // Перемикачі в preloader
      if (e.target.closest('.lang-btn')) {
        e.preventDefault();
        const langElement = e.target.closest('.lang-btn');
        const langCode = langElement.getAttribute('data-lang');
        console.log('🔄 Preloader language switch requested:', langCode);

        if (this.setLanguage(langCode)) {
          // Додаємо візуальний feedback
          document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('selected');
          });
          langElement.classList.add('selected');

          // Приховуємо preloader після вибору мови
          setTimeout(() => {
            this.hidePreloader();
          }, 500);
        }
      }

      // Toggle dropdown
      if (e.target.closest('.lang-toggle')) {
        e.preventDefault();
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('active');
        }
      }
    });

    // Закриваємо dropdown при кліку поза ним
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.classList.remove('active');
      }
    });
  }

  hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  }

  // =====================================================
  // STORAGE & PERSISTENCE
  // =====================================================

  getSavedLanguage() {
    try {
      const saved = localStorage.getItem('innerGarden_language');
      if (saved && this.translations[saved]) {
        return saved;
      }
    } catch (e) {}

    // Автовизначення мови браузера
    const browserLang = navigator.language.split('-')[0];
    return this.translations[browserLang] ? browserLang : this.fallbackLang;
  }

  saveLanguage(langCode) {
    try {
      localStorage.setItem('innerGarden_language', langCode);
    } catch (e) {
      console.warn('Could not save language preference');
    }
  }

  // =====================================================
  // OBSERVERS
  // =====================================================

  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notifyObservers(event, data = {}) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Observer callback failed:', error);
      }
    });
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  getCurrentLanguage() {
    return this.currentLang;
  }

  isLanguageSupported(langCode) {
    return !!this.translations[langCode];
  }

  // Множинні ключі за раз
  getMultiple(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  // Пряме оновлення елемента
  updateElement(element, key = null) {
    const translationKey = key || element.getAttribute('data-key');
    if (!translationKey) return false;

    const translation = this.get(translationKey);
    if (!translation) return false;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.type === 'submit' || element.type === 'button') {
        element.value = translation;
      } else {
        element.placeholder = translation;
      }
    } else {
      element.textContent = translation;
    }

    return true;
  }
}

// Миттєва ініціалізація
window.ultraI18n = new UltraInstantI18n();

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraInstantI18n;
}

// Глобальна функція для швидкого доступу
window.t = (key, params) => window.ultraI18n.get(key, params);