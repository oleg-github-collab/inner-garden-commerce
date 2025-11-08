// Inner Garden - Ultra Perfect Internationalization System
// Повністю переписана система локалізації з нуля

class UltraPerfectI18n {
  constructor() {
    this.currentLang = 'uk';
    this.fallbackLang = 'uk';
    this.isReady = false;
    this.loadingPromise = null;
    this.observers = [];
    
    // Повна база локалізації
    this.translations = this.cloneTranslations(window.InnerGardenTranslations || this.buildFallbackTranslations());

    this.init();
  }

  async init() {
    try {
      // Отримуємо збережену мову або використовуємо за замовчуванням
      const savedLang = this.getSavedLanguage();
      if (savedLang && this.translations[savedLang]) {
        this.currentLang = savedLang;
      }

      this.isReady = true;
      this.notifyObservers('ready');
      
      console.log(`[UltraPerfectI18n] Initialized with language: ${this.currentLang}`);
    } catch (error) {
      console.error('[UltraPerfectI18n] Initialization failed:', error);
      this.isReady = false;
    }
  }


  buildFallbackTranslations() {
    return {
      'uk': {
        // ЗАГАЛЬНІ
        'site-title': 'Inner Garden',
        'loading': 'Завантаження...',
        'skip-to-content': 'Перейти до контенту',
        'back-to-top': 'Повернутися вгору',
        'close': 'Закрити',
        'choose-language': 'Оберіть мову',
        'btn-learn-more': 'Дізнатися більше',
        'btn-contact': 'Зв\'язатися',
        'btn-close': 'Закрити',
        'error-loading': 'Помилка завантаження',
        'try-again': 'Спробувати знову',

        // АДМІН ПАНЕЛЬ
        'admin-dashboard': 'Головна панель',
        'admin-artworks': 'Керування картинами',
        'admin-map': 'Керування картою',
        'admin-categories': 'Категорії',
        'admin-orders': 'Замовлення',
        'admin-analytics': 'Аналітика',
        'admin-settings': 'Налаштування',
        'admin-login': 'Увійти в Адмінку',
        'admin-logout': 'Вийти',

        // КРОКИ ЗАВАНТАЖЕННЯ
        'loading-step-resources': 'Завантаження ресурсів...',
        'loading-step-components': 'Ініціалізація компонентів...',
        'loading-step-interface': 'Налаштування інтерфейсу...',
        'loading-step-content': 'Підготовка контенту...',
        'loading-step-ready': 'Готово!'

        // НАВІГАЦІЯ
        'nav-home': 'Головна',
        'nav-map': 'Карта Гармонії',
        'nav-collection': 'Колекція',
        'nav-quiz': 'Вибрати Атмосферу',
        'nav-artworks': 'Картини',
        'nav-meditation': 'Медитація',
        'nav-stories': 'Історії',
        'nav-business': 'Для Бізнесу',

        // ГЕРОЙ СЕКЦІЯ
        'hero-title': 'Внутрішній Сад',
        'hero-subtitle': 'Простір у Гармонії',
        'hero-description': 'Відкрийте для себе світ абстрактного мистецтва, який трансформує бізнес-простори у оазиси спокою та натхнення. Кожна картина – це портал до внутрішньої гармонії ваших клієнтів і співробітників.',
        'hero-btn-quiz': 'Знайти Мою Картину',
        'hero-btn-artworks': 'Переглянути Колекцію',
        'scroll-explore': 'Досліджуйте',

        // КАРТА ГАРМОНІЇ
        'map-title': 'Простори Гармонії',
        'map-subtitle': 'Подорожуйте світом і відкривайте реальні простори, де наше мистецтво створює атмосферу гармонії',
        'filter-all': 'Усі простори',
        'filter-hotel': 'Готелі',
        'filter-medical': 'Медцентри',
        'filter-office': 'Офіси',
        'filter-wellness': 'Wellness',
        'map-loading': 'Завантаження карти...',

        // КОЛЕКЦІЯ
        'collection-title': 'Колекція Картин',
        'collection-subtitle': 'Досліджуйте наші унікальні абстрактні роботи, створені спеціально для гармонійних бізнес-просторів',
        'search-placeholder': 'Пошук картин...',
        'collection-filter-all': 'Всі роботи',
        'collection-filter-abstract': 'Абстракція',
        'collection-filter-nature': 'Природа',
        'collection-filter-geometric': 'Геометрія',
        'collection-filter-minimalism': 'Мінімалізм',

        // ТЕСТ АТМОСФЕРИ
        'quiz-title': 'Виберіть Свою Атмосферу',
        'quiz-subtitle': 'Дозвольте нам знайти ідеальну картину для вашого простору',

        // КАРТИНИ/ГАЛЕРЕЯ
        'artworks-title': 'Доторкніться до Мистецтва',
        'artworks-subtitle': 'Наведіть курсор на картину, щоб відчути її енергію',
        'gallery-view-details': 'Детальний перегляд',
        'gallery-download': 'Зберегти зображення',
        'gallery-share': 'Поділитися',
        'gallery-image-saved': '🎨 Зображення збережено!',
        'gallery-link-copied': '🔗 Посилання скопійовано!',
        'gallery-share-page': '📤 Поділіться цією сторінкою!',

        // AR
        'ar-title': 'Побачте у своєму просторі',
        'ar-instruction': 'Наведіть камеру на стіну і розмістіть картину',
        'ar-fallback': 'Для AR-перегляду використовуйте мобільний пристрій з камерою',
        'ar-capture': 'Зберегти Фото',
        'ar-done': 'Готово',
        'ar-instructions-title': '📱 AR Інструкції',
        'ar-instructions-1': '1. Натисніть "Запустити AR"',
        'ar-instructions-2': '2. Дозвольте доступ до камери',
        'ar-instructions-3': '3. Наведіть на рівну поверхню',
        'ar-ready': 'AR Готовий!',
        'ar-select-artwork': 'Оберіть картину для перегляду в AR',
        'ar-start': 'Запустити AR',
        'ar-stop': 'Зупинити',
        'ar-place-artwork': 'Розмістити картину',
        'ar-camera-active': '📷 Камера активна! Наведіть на стіну',
        'ar-camera-error': '❌ Помилка камери',
        'ar-camera-access-denied': 'Не вдається отримати доступ до камери',
        'ar-check-permissions': 'Перевірте дозволи браузера',
        'ar-try-again': 'Спробувати знову',
        'ar-session-ended': 'AR сесія завершена',
        'ar-thanks': 'Дякуємо за використання AR!',
        'ar-restart': 'Запустити знову',
        'ar-mobile-only': 'Функції AR працюють тільки на мобільних пристроях',
        'ar-unavailable': 'AR недоступна',
        'ar-artwork-placed': 'Картину розміщено! 🎨',

        // МЕДИТАЦІЯ
        'meditation-title': 'Гармонія в Реальному Часі',
        'meditation-subtitle': '5-хвилинний досвід медитації з нашим мистецтвом',
        'meditation-start': 'Почати Медитацію',
        'meditation-pause': 'Пауза',
        'meditation-skip': 'Пропустити',
        'meditation-complete-title': 'Дякуємо за медитацію!',
        'meditation-complete-text': 'Ця картина може надихати вас щодня',
        'meditation-order': 'Замовити Картину',

        // ІСТОРІЇ
        'stories-title': 'Історії Ваших Просторів',
        'stories-subtitle': 'Реальні історії клієнтів про трансформацію їхніх просторів',
        'stories-all': 'Усі історії',
        'stories-hotel': 'Готелі',
        'stories-medical': 'Медцентри',
        'stories-office': 'Офіси',
        'stories-wellness': 'Wellness',
        'share-story': 'Поділитися Історією',

        // БІЗНЕС ROI
        'business-title': 'ROI Мистецтва',
        'business-subtitle': 'Картина – це інвестиція, а не витрата',
        'roi-nps': 'Зростання NPS',
        'roi-productivity': 'Продуктивність',
        'roi-stress': 'Рівень стресу',
        'roi-satisfaction': 'Задоволеність клієнтів',
        'testimonial-1': '"Після встановлення картин Inner Garden в нашому лобі, оцінки гостей зросли на 25%. Люди справді відчувають різницю в атмосфері."',
        'testimonial-1-author': '- Анна Петрова, Готель "Гармонія"',
        'consultation-title': 'Безкоштовна Консультація',
        'consultation-text': 'Отримайте персональні рекомендації щодо мистецтва для вашого простору',
        'consultation-btn': 'Записатися на Консультацію',

        // ФОРМИ
        'business-form-title': 'Запит для Бізнесу',
        'company-name': 'Назва компанії',
        'space-type': 'Тип простору',
        'select-space': 'Оберіть тип',
        'budget-range': 'Бюджет',
        'select-budget': 'Оберіть діапазон',
        'contact-email': 'Email',
        'project-details': 'Деталі проекту',
        'project-details-placeholder': 'Розкажіть про ваш простір та цілі...',
        'business-submit': 'Надіслати Запит',

        // ТИПИ ПРОСТОРІВ
        'business-space-hotel': 'Готель',
        'business-space-medical': 'Медичний центр',
        'business-space-office': 'Офіс',
        'business-space-wellness': 'Wellness центр',
        'business-space-restaurant': 'Ресторан',
        'business-space-retail': 'Роздрібна торгівля',

        // РОЗСИЛКА
        'newsletter-title': 'Залишайтеся в Гармонії',
        'newsletter-subtitle': 'Отримуйте нові картини та інсайти про мистецтво у бізнесі',
        'newsletter-subscribe': 'Підписатися',
        'newsletter-email-placeholder': 'Ваша email адреса',

        // ФУТЕР
        'footer-description': 'Створюємо гармонійні простори через абстрактне мистецтво',
        'footer-quick-links': 'Швидкі посилання',
        'footer-collection': 'Колекція',
        'footer-business': 'Для Бізнесу',
        'footer-stories': 'Історії',
        'footer-meditation': 'Медитація',
        'footer-legal-info': 'Правова інформація',
        'footer-privacy': 'Політика Конфіденційності',
        'footer-terms': 'Умови Використання',
        'footer-cookies': 'Політика Cookies',
        'footer-contact-title': 'Контакти',
        'footer-rights': 'Всі права захищені.',

        // КЕЙСИ
        'case-study-hotel-testimonial': 'Після встановлення картин Inner Garden наш NPS зріс на 28%, а гості залишаються на 0.8 днів довше',
        'case-study-medical-testimonial': 'Пацієнти стали менше нервувати перед процедурами, рівень стресу знизився на 35%',
        'case-study-office-testimonial': 'Продуктивність команди зросла на 22%, а кількість лікарняних знизилась на 18%',

        // ДОДАТКОВІ КЛЮЧІ
        'ar-artwork-placed': 'Картину розміщено! 🎨',
        'artwork-contact-price': 'Ціна за запитом',
        'artwork-year': 'Рік створення',
        'artwork-sold': 'Продана',
        'artwork-available': 'Доступна',
        'success-added-to-favorites': 'Додано до обраного',
        'newsletter-success': 'Дякуємо! Ви успішно підписалися на розсилку.',
        'share': 'Поділитися',
        'contact-us': 'Зв\'язатися з нами',
        'legend-title': 'Типи просторів',
        'audio-play-error': 'Не вдалося відтворити аудіо',
        'privacy-policy': 'Політика Конфіденційності',
        'terms-service': 'Умови Користування',
        'cookie-policy': 'Політика Cookies',
        'newsletter-error-email-invalid': 'Будь ласка, введіть правильну email адресу',
        'newsletter-error-already-subscribed': 'Ви вже підписані на нашу розсилку',
        'newsletter-error-subscribe-failed': 'Помилка підписки. Спробуйте пізніше.',
        'newsletter-error-request-failed': 'Помилка надсилання запиту. Спробуйте пізніше.',
        'newsletter-error-company-required': 'Введіть назву компанії',
        'newsletter-error-space-required': 'Оберіть тип простору',
        'newsletter-preferences-saved': 'Налаштування збережено!',
        'newsletter-preferences-error': 'Помилка збереження налаштувань',
        'newsletter-preferences-title': 'Налаштування розсилки',
        'newsletter-preferences-intro': 'Виберіть, про що ви хочете отримувати інформацію:',
        'newsletter-pref-new-artworks-title': 'Нові роботи',
        'newsletter-pref-new-artworks-desc': 'Повідомлення про нові картини та колекції',
        'newsletter-pref-business-title': 'Бізнес-інсайти',
        'newsletter-pref-business-desc': 'Статті про вплив мистецтва на бізнес',
        'newsletter-pref-meditation-title': 'Медитативний контент',
        'newsletter-pref-meditation-desc': 'Медитації та практики гармонії',
        'newsletter-pref-offers-title': 'Спеціальні пропозиції',
        'newsletter-pref-offers-desc': 'Знижки та ексклюзивні пропозиції',
        'newsletter-preferences-save': 'Зберегти налаштування',
        'newsletter-sending': 'Надсилання...',
        'newsletter-request-sent': 'Запит надіслано!',
        'newsletter-request-message': 'Дякуємо за ваш інтерес! Ми зв\'яжемося з вами протягом 24 годин для обговорення деталей проекту.',
        'newsletter-suggestion-prefix': 'Можливо, ви мали на увазі: ',
        'action-ok': 'Добре'
      },

      'en': {
        // GENERAL
        'site-title': 'Inner Garden',
        'loading': 'Loading...',
        'skip-to-content': 'Skip to content',
        'back-to-top': 'Back to top',
        'close': 'Close',
        'choose-language': 'Choose Language',
        'btn-learn-more': 'Learn More',
        'btn-contact': 'Contact',
        'btn-close': 'Close',
        'error-loading': 'Loading error',
        'try-again': 'Try again',

        // ADMIN PANEL
        'admin-dashboard': 'Dashboard',
        'admin-artworks': 'Manage Artworks',
        'admin-map': 'Map Management',
        'admin-categories': 'Categories',
        'admin-orders': 'Orders',
        'admin-analytics': 'Analytics',
        'admin-settings': 'Settings',
        'admin-login': 'Admin Login',
        'admin-logout': 'Log out',

        // LOADING STEPS
        'loading-step-resources': 'Loading resources...',
        'loading-step-components': 'Initializing components...',
        'loading-step-interface': 'Configuring interface...',
        'loading-step-content': 'Preparing content...',
        'loading-step-ready': 'Ready!'

        // NAVIGATION
        'nav-home': 'Home',
        'nav-map': 'Harmony Map',
        'nav-collection': 'Collection',
        'nav-quiz': 'Choose Atmosphere',
        'nav-artworks': 'Artworks',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Stories',
        'nav-business': 'For Business',

        // HERO SECTION
        'hero-title': 'Inner Garden',
        'hero-subtitle': 'Space in Harmony',
        'hero-description': 'Discover the world of abstract art that transforms business spaces into oases of calm and inspiration. Each painting is a portal to the inner harmony of your clients and employees.',
        'hero-btn-quiz': 'Find My Painting',
        'hero-btn-artworks': 'View Collection',
        'scroll-explore': 'Explore',

        // HARMONY MAP
        'map-title': 'Harmony Spaces',
        'map-subtitle': 'Travel the world and discover real spaces where our art creates an atmosphere of harmony',
        'filter-all': 'All spaces',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medical centers',
        'filter-office': 'Offices',
        'filter-wellness': 'Wellness',
        'map-loading': 'Loading map...',
        'legend-title': 'Space types',

        // COLLECTION
        'collection-title': 'Art Collection',
        'collection-subtitle': 'Explore our unique abstract works created specifically for harmonious business spaces',
        'search-placeholder': 'Search paintings...',
        'collection-filter-all': 'All works',
        'collection-filter-abstract': 'Abstract',
        'collection-filter-nature': 'Nature',
        'collection-filter-geometric': 'Geometric',
        'collection-filter-minimalism': 'Minimalism',

        // ATMOSPHERE QUIZ
        'quiz-title': 'Choose Your Atmosphere',
        'quiz-subtitle': 'Let us find the perfect painting for your space',

        // ARTWORKS/GALLERY
        'artworks-title': 'Touch the Art',
        'artworks-subtitle': 'Hover over the painting to feel its energy',
        'gallery-view-details': 'Detailed View',
        'gallery-download': 'Save Image',
        'gallery-share': 'Share',
        'gallery-image-saved': '🎨 Image saved!',
        'gallery-link-copied': '🔗 Link copied!',
        'gallery-share-page': '📤 Share this page!',

        // AR
        'ar-title': 'See in your space',
        'ar-instruction': 'Point the camera at the wall and place the painting',
        'ar-fallback': 'For AR viewing, use a mobile device with camera',
        'ar-capture': 'Save Photo',
        'ar-done': 'Done',
        'ar-instructions-title': '📱 AR Instructions',
        'ar-instructions-1': '1. Tap "Start AR"',
        'ar-instructions-2': '2. Allow camera access',
        'ar-instructions-3': '3. Aim at a flat surface',
        'ar-ready': 'AR Ready!',
        'ar-select-artwork': 'Select a painting to view in AR',
        'ar-start': 'Start AR',
        'ar-stop': 'Stop',
        'ar-place-artwork': 'Place artwork',
        'ar-camera-active': '📷 Camera active! Point at a wall',
        'ar-camera-error': '❌ Camera error',
        'ar-camera-access-denied': 'Cannot access the camera',
        'ar-check-permissions': 'Check your browser permissions',
        'ar-try-again': 'Try again',
        'ar-session-ended': 'AR session ended',
        'ar-thanks': 'Thank you for using AR!',
        'ar-restart': 'Restart',
        'ar-mobile-only': 'AR works only on mobile devices',
        'ar-unavailable': 'AR unavailable',
        'ar-artwork-placed': 'Artwork placed! 🎨',

        // MEDITATION
        'meditation-title': 'Harmony in Real Time',
        'meditation-subtitle': '5-minute meditation experience with our art',
        'meditation-start': 'Start Meditation',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Skip',
        'meditation-complete-title': 'Thank you for meditation!',
        'meditation-complete-text': 'This painting can inspire you every day',
        'meditation-order': 'Order Painting',

        // STORIES
        'stories-title': 'Stories of Your Spaces',
        'stories-subtitle': 'Real customer stories about transforming their spaces',
        'stories-all': 'All stories',
        'stories-hotel': 'Hotels',
        'stories-medical': 'Medical centers',
        'stories-office': 'Offices',
        'stories-wellness': 'Wellness',
        'share-story': 'Share Story',
        'share': 'Share',

        // BUSINESS ROI
        'business-title': 'Art ROI',
        'business-subtitle': 'Painting is an investment, not an expense',
        'roi-nps': 'NPS Growth',
        'roi-productivity': 'Productivity',
        'roi-stress': 'Stress Level',
        'roi-satisfaction': 'Customer Satisfaction',
        'testimonial-1': '"After installing Inner Garden paintings in our lobby, guest ratings increased by 25%. People really feel the difference in atmosphere."',
        'testimonial-1-author': '- Anna Petrova, Harmony Hotel',
        'consultation-title': 'Free Consultation',
        'consultation-text': 'Get personalized recommendations for art in your space',
        'consultation-btn': 'Book Consultation',

        // FORMS
        'business-form-title': 'Business Inquiry',
        'company-name': 'Company Name',
        'space-type': 'Space Type',
        'select-space': 'Select type',
        'budget-range': 'Budget',
        'select-budget': 'Select range',
        'contact-email': 'Email',
        'project-details': 'Project Details',
        'project-details-placeholder': 'Tell us about your space and goals...',
        'business-submit': 'Send Inquiry',
        'artwork-contact-price': 'Price on request',
        'artwork-year': 'Year created',
        'success-added-to-favorites': 'Added to favorites',

        // SPACE TYPES
        'business-space-hotel': 'Hotel',
        'business-space-medical': 'Medical Center',
        'business-space-office': 'Office',
        'business-space-wellness': 'Wellness Center',
        'business-space-restaurant': 'Restaurant',
        'business-space-retail': 'Retail',

        // NEWSLETTER
        'newsletter-title': 'Stay in Harmony',
        'newsletter-subtitle': 'Receive new artwork and insights about art in business',
        'newsletter-subscribe': 'Subscribe',
        'newsletter-email-placeholder': 'Your email address',
        'newsletter-success': 'Thank you! You have subscribed successfully.',

        // FOOTER
        'footer-description': 'Creating harmonious spaces through abstract art',
        'footer-quick-links': 'Quick Links',
        'footer-collection': 'Collection',
        'footer-business': 'For Business',
        'footer-stories': 'Stories',
        'footer-meditation': 'Meditation',
        'footer-legal-info': 'Legal Information',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Use',
        'footer-cookies': 'Cookie Policy',
        'footer-contact-title': 'Contact',
        'footer-rights': 'All rights reserved.',
        'contact-us': 'Contact us',

        // CASE STUDIES
        'case-study-hotel-testimonial': 'After installing Inner Garden paintings, our NPS increased by 28%, and guests stay 0.8 days longer',
        'case-study-medical-testimonial': 'Patients became less nervous before procedures, stress level decreased by 35%',
        'case-study-office-testimonial': 'Team productivity increased by 22%, and sick days decreased by 18%',
        'newsletter-error-email-invalid': 'Please enter a valid email address',
        'newsletter-error-already-subscribed': 'You are already subscribed to our newsletter',
        'newsletter-error-subscribe-failed': 'Subscription failed. Please try again later.',
        'newsletter-error-request-failed': 'Request failed. Please try again later.',
        'newsletter-error-company-required': 'Enter the company name',
        'newsletter-error-space-required': 'Select the space type',
        'newsletter-preferences-saved': 'Preferences saved!',
        'newsletter-preferences-error': 'Failed to save preferences',
        'newsletter-preferences-title': 'Newsletter preferences',
        'newsletter-preferences-intro': 'Choose the updates you want to receive:',
        'newsletter-pref-new-artworks-title': 'New artworks',
        'newsletter-pref-new-artworks-desc': 'Updates about new paintings and collections',
        'newsletter-pref-business-title': 'Business insights',
        'newsletter-pref-business-desc': 'Articles on how art impacts business',
        'newsletter-pref-meditation-title': 'Meditative content',
        'newsletter-pref-meditation-desc': 'Meditations and harmony practices',
        'newsletter-pref-offers-title': 'Special offers',
        'newsletter-pref-offers-desc': 'Discounts and exclusive offers',
        'newsletter-preferences-save': 'Save preferences',
        'newsletter-sending': 'Sending...',
        'newsletter-request-sent': 'Request sent!',
        'newsletter-request-message': 'Thank you for your interest! We will contact you within 24 hours to discuss project details.',
        'newsletter-suggestion-prefix': 'Did you mean: ',
        'action-ok': 'OK'
      },

      'de': {
        // ALLGEMEIN
        'site-title': 'Inner Garden',
        'loading': 'Laden...',
        'skip-to-content': 'Zum Inhalt springen',
        'back-to-top': 'Nach oben',
        'close': 'Schließen',
        'choose-language': 'Sprache wählen',
        'btn-learn-more': 'Mehr erfahren',
        'btn-contact': 'Kontakt',
        'btn-close': 'Schließen',
        'error-loading': 'Ladefehler',
        'try-again': 'Erneut versuchen',

        // ADMIN-BEREICH
        'admin-dashboard': 'Dashboard',
        'admin-artworks': 'Kunstwerke verwalten',
        'admin-map': 'Kartenverwaltung',
        'admin-categories': 'Kategorien',
        'admin-orders': 'Bestellungen',
        'admin-analytics': 'Analysen',
        'admin-settings': 'Einstellungen',
        'admin-login': 'Admin-Anmeldung',
        'admin-logout': 'Abmelden',

        // LADEVORGANG
        'loading-step-resources': 'Ressourcen werden geladen...',
        'loading-step-components': 'Komponenten werden initialisiert...',
        'loading-step-interface': 'Oberfläche wird konfiguriert...',
        'loading-step-content': 'Inhalte werden vorbereitet...',
        'loading-step-ready': 'Fertig!',

        // NAVIGATION
        'nav-home': 'Start',
        'nav-map': 'Harmonie-Karte',
        'nav-collection': 'Sammlung',
        'nav-quiz': 'Atmosphäre wählen',
        'nav-artworks': 'Kunstwerke',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Geschichten',
        'nav-business': 'Für Unternehmen',

        // HERO BEREICH
        'hero-title': 'Inner Garden',
        'hero-subtitle': 'Raum in Harmonie',
        'hero-description': 'Entdecken Sie die Welt der abstrakten Kunst, die Geschäftsräume in Oasen der Ruhe und Inspiration verwandelt. Jedes Gemälde ist ein Portal zur inneren Harmonie Ihrer Kunden und Mitarbeiter.',
        'hero-btn-quiz': 'Mein Gemälde finden',
        'hero-btn-artworks': 'Sammlung ansehen',
        'scroll-explore': 'Erkunden',

        // HARMONIE-KARTE
        'map-title': 'Harmonie-Räume',
        'map-subtitle': 'Reisen Sie um die Welt und entdecken Sie echte Räume, wo unsere Kunst eine Atmosphäre der Harmonie schafft',
        'filter-all': 'Alle Räume',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medizinzentren',
        'filter-office': 'Büros',
        'filter-wellness': 'Wellness',
        'map-loading': 'Karte wird geladen...',
        'legend-title': 'Raumtypen',

        // SAMMLUNG
        'collection-title': 'Kunstsammlung',
        'collection-subtitle': 'Entdecken Sie unsere einzigartigen abstrakten Werke, speziell für harmonische Geschäftsräume geschaffen',
        'search-placeholder': 'Gemälde suchen...',
        'collection-filter-all': 'Alle Werke',
        'collection-filter-abstract': 'Abstrakt',
        'collection-filter-nature': 'Natur',
        'collection-filter-geometric': 'Geometrisch',
        'collection-filter-minimalism': 'Minimalismus',

        // ATMOSPHÄRE-QUIZ
        'quiz-title': 'Wählen Sie Ihre Atmosphäre',
        'quiz-subtitle': 'Lassen Sie uns das perfekte Gemälde für Ihren Raum finden',

        // KUNSTWERKE/GALERIE
        'artworks-title': 'Kunst berühren',
        'artworks-subtitle': 'Bewegen Sie den Cursor über das Gemälde, um seine Energie zu spüren',
        'gallery-view-details': 'Detailansicht',
        'gallery-download': 'Bild speichern',
        'gallery-share': 'Teilen',
        'gallery-image-saved': '🎨 Bild gespeichert!',
        'gallery-link-copied': '🔗 Link kopiert!',
        'gallery-share-page': '📤 Diese Seite teilen!',

        // AR
        'ar-title': 'In Ihrem Raum sehen',
        'ar-instruction': 'Richten Sie die Kamera auf die Wand und platzieren Sie das Gemälde',
        'ar-fallback': 'Für AR-Anzeige verwenden Sie ein mobiles Gerät mit Kamera',
        'ar-capture': 'Foto speichern',
        'ar-done': 'Fertig',
        'ar-instructions-title': '📱 AR-Anleitung',
        'ar-instructions-1': '1. Tippen Sie auf „AR starten“',
        'ar-instructions-2': '2. Kamerazugriff erlauben',
        'ar-instructions-3': '3. Auf eine ebene Fläche richten',
        'ar-ready': 'AR bereit!',
        'ar-select-artwork': 'Wählen Sie ein Gemälde für AR',
        'ar-start': 'AR starten',
        'ar-stop': 'Stoppen',
        'ar-place-artwork': 'Gemälde platzieren',
        'ar-camera-active': '📷 Kamera aktiv! Auf eine Wand richten',
        'ar-camera-error': '❌ Kamera-Fehler',
        'ar-camera-access-denied': 'Kein Kamerazugriff möglich',
        'ar-check-permissions': 'Browserberechtigungen prüfen',
        'ar-try-again': 'Erneut versuchen',
        'ar-session-ended': 'AR-Sitzung beendet',
        'ar-thanks': 'Danke für die Nutzung von AR!',
        'ar-restart': 'Neu starten',
        'ar-mobile-only': 'AR funktioniert nur auf mobilen Geräten',
        'ar-unavailable': 'AR nicht verfügbar',
        'ar-artwork-placed': 'Gemälde platziert! 🎨',

        // MEDITATION
        'meditation-title': 'Harmonie in Echtzeit',
        'meditation-subtitle': '5-minütige Meditationserfahrung mit unserer Kunst',
        'meditation-start': 'Meditation beginnen',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Überspringen',
        'meditation-complete-title': 'Danke für die Meditation!',
        'meditation-complete-text': 'Dieses Gemälde kann Sie jeden Tag inspirieren',
        'meditation-order': 'Gemälde bestellen',

        // GESCHICHTEN
        'stories-title': 'Geschichten Ihrer Räume',
        'stories-subtitle': 'Echte Kundengeschichten über die Verwandlung ihrer Räume',
        'stories-all': 'Alle Geschichten',
        'stories-hotel': 'Hotels',
        'stories-medical': 'Medizinzentren',
        'stories-office': 'Büros',
        'stories-wellness': 'Wellness',
        'share-story': 'Geschichte teilen',
        'share': 'Teilen',

        // BUSINESS ROI
        'business-title': 'Kunst-ROI',
        'business-subtitle': 'Gemälde sind eine Investition, keine Ausgabe',
        'roi-nps': 'NPS-Wachstum',
        'roi-productivity': 'Produktivität',
        'roi-stress': 'Stress-Level',
        'roi-satisfaction': 'Kundenzufriedenheit',
        'testimonial-1': '"Nach der Installation der Inner Garden Gemälde in unserer Lobby stiegen die Gästebewertungen um 25%. Die Menschen spüren wirklich den Unterschied in der Atmosphäre."',
        'testimonial-1-author': '- Anna Petrova, Hotel Harmonie',
        'consultation-title': 'Kostenlose Beratung',
        'consultation-text': 'Erhalten Sie personalisierte Empfehlungen für Kunst in Ihrem Raum',
        'consultation-btn': 'Beratung buchen',

        // FORMULARE
        'business-form-title': 'Geschäftsanfrage',
        'company-name': 'Firmenname',
        'space-type': 'Raumtyp',
        'select-space': 'Typ auswählen',
        'budget-range': 'Budget',
        'select-budget': 'Bereich auswählen',
        'contact-email': 'E-Mail',
        'project-details': 'Projektdetails',
        'project-details-placeholder': 'Erzählen Sie uns von Ihrem Raum und Ihren Zielen...',
        'business-submit': 'Anfrage senden',
        'artwork-contact-price': 'Preis auf Anfrage',
        'artwork-year': 'Entstehungsjahr',
        'success-added-to-favorites': 'Zu Favoriten hinzugefügt',

        // RAUMTYPEN
        'business-space-hotel': 'Hotel',
        'business-space-medical': 'Medizinzentrum',
        'business-space-office': 'Büro',
        'business-space-wellness': 'Wellness-Zentrum',
        'business-space-restaurant': 'Restaurant',
        'business-space-retail': 'Einzelhandel',

        // NEWSLETTER
        'newsletter-title': 'In Harmonie bleiben',
        'newsletter-subtitle': 'Erhalten Sie neue Kunstwerke und Einblicke in Kunst im Geschäft',
        'newsletter-subscribe': 'Abonnieren',
        'newsletter-email-placeholder': 'Ihre E-Mail-Adresse',
        'newsletter-success': 'Vielen Dank! Sie haben sich erfolgreich angemeldet.',

        // FOOTER
        'footer-description': 'Harmonische Räume durch abstrakte Kunst schaffen',
        'footer-quick-links': 'Schnelle Links',
        'footer-collection': 'Sammlung',
        'footer-business': 'Für Unternehmen',
        'footer-stories': 'Geschichten',
        'footer-meditation': 'Meditation',
        'footer-legal-info': 'Rechtliche Informationen',
        'footer-privacy': 'Datenschutzrichtlinie',
        'footer-terms': 'Nutzungsbedingungen',
        'footer-cookies': 'Cookie-Richtlinie',
        'footer-contact-title': 'Kontakt',
        'footer-rights': 'Alle Rechte vorbehalten.',
        'contact-us': 'Kontaktieren Sie uns',

        // FALLSTUDIEN
        'case-study-hotel-testimonial': 'Nach der Installation der Inner Garden Gemälde stieg unser NPS um 28%, und Gäste bleiben 0,8 Tage länger',
        'case-study-medical-testimonial': 'Patienten wurden vor Eingriffen weniger nervös, das Stresslevel sank um 35%',
        'case-study-office-testimonial': 'Die Teamproduktivität stieg um 22%, und Krankheitstage sanken um 18%',
        'newsletter-error-email-invalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        'newsletter-error-already-subscribed': 'Sie sind bereits für unseren Newsletter angemeldet',
        'newsletter-error-subscribe-failed': 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.',
        'newsletter-error-request-failed': 'Anfrage fehlgeschlagen. Bitte versuchen Sie es später erneut.',
        'newsletter-error-company-required': 'Bitte geben Sie den Firmennamen ein',
        'newsletter-error-space-required': 'Wählen Sie den Raumtyp aus',
        'newsletter-preferences-saved': 'Einstellungen gespeichert!',
        'newsletter-preferences-error': 'Einstellungen konnten nicht gespeichert werden',
        'newsletter-preferences-title': 'Newsletter-Einstellungen',
        'newsletter-preferences-intro': 'Wählen Sie, über welche Inhalte Sie informiert werden möchten:',
        'newsletter-pref-new-artworks-title': 'Neue Werke',
        'newsletter-pref-new-artworks-desc': 'Neuigkeiten zu neuen Gemälden und Kollektionen',
        'newsletter-pref-business-title': 'Business-Insights',
        'newsletter-pref-business-desc': 'Artikel über die Wirkung von Kunst auf Unternehmen',
        'newsletter-pref-meditation-title': 'Meditativer Inhalt',
        'newsletter-pref-meditation-desc': 'Meditationen und Harmoniepraktiken',
        'newsletter-pref-offers-title': 'Spezielle Angebote',
        'newsletter-pref-offers-desc': 'Rabatte und exklusive Angebote',
        'newsletter-preferences-save': 'Einstellungen speichern',
        'newsletter-sending': 'Senden...',
        'newsletter-request-sent': 'Anfrage gesendet!',
        'newsletter-request-message': 'Vielen Dank für Ihr Interesse! Wir melden uns innerhalb von 24 Stunden, um die Projektdetails zu besprechen.',
        'newsletter-suggestion-prefix': 'Meinten Sie: ',
        'action-ok': 'OK'
      }
    };
  }

  cloneTranslations(source) {
    if (!source || typeof source !== 'object') {
      return {};
    }

    if (typeof structuredClone === 'function') {
      return structuredClone(source);
    }

    return JSON.parse(JSON.stringify(source));
  }

  // Перекладає ключ
  translate(key, fallback = null) {
    if (!this.isReady) {
      console.warn(`[UltraPerfectI18n] Not ready, returning key: ${key}`);
      return fallback || key;
    }

    const translation = this.translations[this.currentLang]?.[key] 
                       || this.translations[this.fallbackLang]?.[key]
                       || fallback 
                       || key;

    if (translation === key && key !== fallback) {
      console.warn(`[UltraPerfectI18n] Missing translation for key: ${key} in language: ${this.currentLang}`);
    }

    return translation;
  }

  // Змінює мову
  async setLanguage(lang) {
    if (!this.translations[lang]) {
      console.error(`[UltraPerfectI18n] Language not supported: ${lang}`);
      return false;
    }

    const oldLang = this.currentLang;
    this.currentLang = lang;
    
    // Зберігаємо в localStorage
    this.saveLanguage(lang);
    
    // Оновлюємо всі елементи
    this.updateAllElements();
    
    // Сповіщаємо спостерігачів
    this.notifyObservers('languageChanged', { oldLang, newLang: lang });
    
    console.log(`[UltraPerfectI18n] Language changed from ${oldLang} to ${lang}`);
    return true;
  }

  // Оновлює всі елементи з data-key атрибутами
  updateAllElements() {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
      const key = element.getAttribute('data-key');
      if (key) {
        const translation = this.translate(key);
        
        // Визначаємо, що оновлювати
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'search')) {
          element.placeholder = translation;
        } else if (element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Оновлюємо title сторінки
    const pageTitle = this.translate('site-title');
    if (pageTitle && pageTitle !== 'site-title') {
      document.title = pageTitle + ' - ' + this.translate('hero-subtitle', 'Art for Business');
    }
  }

  // Додає спостерігача
  subscribe(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(obs => obs !== callback);
    };
  }

  // Сповіщає спостерігачів
  notifyObservers(event, data = null) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('[UltraPerfectI18n] Observer error:', error);
      }
    });
  }

  // Зберігає мову в localStorage
  saveLanguage(lang) {
    try {
      localStorage.setItem('inner-garden-language', lang);
    } catch (error) {
      console.warn('[UltraPerfectI18n] Could not save language to localStorage:', error);
    }
  }

  // Отримує збережену мову з localStorage
  getSavedLanguage() {
    try {
      return localStorage.getItem('inner-garden-language');
    } catch (error) {
      console.warn('[UltraPerfectI18n] Could not load language from localStorage:', error);
      return null;
    }
  }

  // Отримує поточну мову
  getCurrentLanguage() {
    return this.currentLang;
  }

  // Перевіряє готовність
  isSystemReady() {
    return this.isReady;
  }

  // Отримує всі доступні мови
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  // Автоматично виявляє мову браузера
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    
    if (this.translations[langCode]) {
      return langCode;
    }
    
    return this.fallbackLang;
  }

  // Знищує екземпляр
  destroy() {
    this.observers = [];
    this.isReady = false;
    console.log('[UltraPerfectI18n] Destroyed');
  }
}

// Створюємо глобальний екземпляр
window.ultraI18n = new UltraPerfectI18n();

// Експорт для модульних систем
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraPerfectI18n;
}

// Зворотна сумісність
window.i18n = window.ultraI18n;

console.log('📚 Ultra Perfect I18n System loaded');
