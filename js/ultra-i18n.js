// НАДПОТУЖНА СИСТЕМА ЛОКАЛІЗАЦІЇ
class UltraI18n {
  constructor() {
    this.currentLang = 'uk';
    this.fallbackLang = 'en';
    this.supportedLanguages = ['uk', 'en', 'de'];
    this.translations = {};
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('🌍 Ultra I18n System Loading...');
    this.loadTranslations();
    this.setupEventListeners();
    this.detectSavedLanguage();
    this.isInitialized = true;
    console.log('✅ Ultra I18n System Ready');
  }

  loadTranslations() {
    this.translations = {
      uk: {
        // PAGE TITLE & META
        'page-title': 'Inner Garden - Абстрактні картини для бізнес-просторів | +40% ROI',
        
        // PRELOADER
        'choose-language': 'Оберіть мову / Choose Language',
        'loading': 'Завантаження...',
        
        // NAVIGATION
        'site-title': 'Inner Garden',
        'site-tagline': 'Мистецтво Внутрішньої Гармонії',
        'nav-home': 'Головна',
        'nav-collection': 'Колекція',
        'nav-map': 'Карта Гармонії',
        'nav-quiz': 'Вибрати Атмосферу',
        'nav-artworks': 'Картини',
        'nav-meditation': 'Медитація',
        'nav-stories': 'Історії',
        'nav-business': 'Для Бізнесу',
        'nav-about': 'Про Художницю',
        'nav-contact': 'Контакти',

        // HERO
        'hero-title': 'Внутрішній Сад',
        'hero-subtitle': 'Простір у Гармонії',
        'hero-description': 'Відкрийте для себе світ абстрактного мистецтва, який трансформує бізнес-простори у оазиси спокою та натхнення. Кожна картина – це портал до внутрішньої гармонії ваших клієнтів і співробітників.',
        'hero-btn-quiz': 'Знайти Мою Картину',
        'hero-btn-artworks': 'Переглянути Колекцію',
        'scroll-explore': 'Досліджуйте',

        // HARMONY MAP
        'map-title': 'Простори Гармонії',
        'map-subtitle': 'Відкрийте, як наші картини трансформують різні бізнес-простори і створюють атмосферу гармонії',
        'filter-all': 'Усі простори',
        'filter-hotel': 'Готелі',
        'filter-medical': 'Медцентри',
        'filter-office': 'Офіси',
        'filter-wellness': 'Wellness',
        'map-loading': 'Завантаження карти...',

        // COLLECTION SECTION
        'collection-title': 'Колекція Картин',
        'collection-subtitle': 'Досліджуйте наші унікальні абстрактні роботи, створені спеціально для гармонійних бізнес-просторів',
        'search-placeholder': 'Пошук картин...',
        'collection-filter-all': 'Всі роботи',
        'collection-filter-abstract': 'Абстракція',
        'collection-filter-nature': 'Природа',
        'collection-filter-geometric': 'Геометрія',
        'collection-filter-minimalism': 'Мінімалізм',
        
        // ARTWORK DETAILS
        'artwork-dimensions': 'Розміри',
        'artwork-materials': 'Матеріали',
        'artwork-price': 'Ціна',
        'artwork-status-available': 'Доступна',
        'artwork-status-sold': 'Продана',
        'artwork-view-details': 'Детальніше',
        'artwork-request-info': 'Запит інформації',
        
        // QUIZ EFFECTS
        'quiz-step1-title': 'Яку атмосферу ви хочете створити?',
        'effect-calm': 'Заспокійлива атмосфера для релаксації',
        'effect-inspiration': 'Стимулює креативність та інновації', 
        'effect-energy': 'Активізує та мотивує до дії',
        'effect-balance': 'Гармонія між активністю та спокоєм',
        'quiz-step2-title': 'Який тип вашого простору?',
        'quiz-step3-title': 'Який розмір картини вам підходить?',
        'space-office': 'Робоче середовище для команди',
        'space-hotel': 'Гостинність та комфорт гостей',
        'space-medical': 'Заспокійлива атмосфера для пацієнтів',
        'space-wellness': 'Розслаблення та відновлення',
        'size-small': 'Компактні роботи для акцентів',
        'size-medium': 'Середні картини для балансу',
        'size-large': 'Великі полотна як головні елементи',
        
        // GALLERY
        'play-sound': 'Послухати звуки',
        'view-ar': 'Переглянути в AR',
        'add-favorite': 'Додати до обраного',
        'share-artwork': 'Поділитися',
        'artwork-available': 'Доступна',
        'artwork-sold': 'Продана',
        'price-on-request': 'Ціна за запитом',
        'gallery-view-details': 'Детальний перегляд',
        'gallery-download': 'Зберегти зображення',
        'gallery-share': 'Поділитися',
        'gallery-image-saved': '🎨 Зображення збережено!',
        'gallery-link-copied': '🔗 Посилання скопійовано!',
        'gallery-share-page': '📤 Поділіться цією сторінкою!',

        // ATMOSPHERE QUIZ
        'quiz-title': 'Виберіть Свою Атмосферу',
        'quiz-subtitle': 'Пройдіть короткий тест і знайдіть картину, яка ідеально підходить для вашого простору',

        // ARTWORKS
        'artworks-title': 'Доторкніться до Мистецтва',
        'artworks-subtitle': 'Подивіться, як кожна картина може виглядати у вашому просторі за допомогою AR-технологій',
        'ar-title': 'Побачте у своєму просторі',
        'ar-instruction': 'Наведіть камеру на стіну і розмістіть картину',
        'ar-fallback': 'Для AR-перегляду використовуйте мобільний пристрій з камерою',
        'ar-capture': 'Зберегти Фото',
        'ar-done': 'Готово',

        // MEDITATION
        'meditation-title': 'Гармонія в Реальному Часі',
        'meditation-subtitle': 'Зануртеся у медитативний досвід з нашими картинами. Відчуйте, як мистецтво впливає на ваш внутрішній стан',
        'meditation-start': 'Почати Медитацію',
        'meditation-pause': 'Пауза',
        'meditation-skip': 'Пропустити',
        'meditation-complete-title': 'Дякуємо за медитацію!',
        'meditation-complete-text': 'Ця картина може надихати вас щодня',
        'meditation-order': 'Замовити Картину',

        // STORIES
        'stories-title': 'Історії Ваших Просторів',
        'stories-subtitle': 'Дізнайтеся, як наші картини змінили атмосферу в реальних бізнес-просторах наших клієнтів',
        'stories-all': 'Усі історії',
        'stories-hotel': 'Готелі',
        'stories-medical': 'Медцентри',
        'stories-office': 'Офіси',
        'stories-wellness': 'Wellness',
        'share-story': 'Поділитися Історією',
        'story-form-title': 'Розповісти Вашу Історію',
        'story-name-label': 'Ім\'я',
        'story-space-label': 'Тип простору',
        'story-space-select': 'Оберіть тип',
        'story-space-hotel': 'Готель',
        'story-space-medical': 'Медцентр',
        'story-space-office': 'Офіс',
        'story-space-wellness': 'Wellness центр',
        'story-photo-label': 'Фото простору',
        'story-text-label': 'Ваша історія',
        'story-consent': 'Даю дозвіл на публікацію',
        'story-submit': 'Надіслати Історію',
        'story-textarea-placeholder': 'Розкажіть, як наша картина змінила ваш простір...',

        // BUSINESS / ROI
        'business-title': 'ROI Мистецтва',
        'business-subtitle': 'Дізнайтеся, як інвестиції в мистецтво підвищують продуктивність, знижують стрес і покращують враження клієнтів',
        'roi-nps': 'Зростання NPS',
        'roi-productivity': 'Продуктивність',
        'roi-stress': 'Рівень стресу',
        'roi-satisfaction': 'Задоволеність клієнтів',
        'testimonial-1': '"Після розміщення картин Inner Garden в нашому готелі, відгуки гостей покращилися на 40%. Атмосфера стала більш спокійною та гармонійною." — Марія К., менеджер готелю',
        'consultation-title': 'Безкоштовна Консультація',
        'consultation-text': 'Запишіться на персональну консультацію і дізнайтеся, які картини найкраще підійдуть для вашого бізнес-простору',
        'consultation-btn': 'Записатися на Консультацію',
        'business-form-title': 'Запит для Бізнесу',
        'company-name': 'Назва компанії',
        'space-type': 'Тип простору',
        'select-space': 'Оберіть тип',
        'budget-range': 'Бюджет',
        'select-budget': 'Оберіть діапазон',
        'contact-email': 'Email',
        'project-details': 'Деталі проекту',
        'business-submit': 'Надіслати Запит',
        'project-details-placeholder': 'Розкажіть про ваш простір та цілі...',
        'business-space-hotel': 'Готель',
        'business-space-medical': 'Медичний центр',
        'business-space-office': 'Офіс',
        'business-space-wellness': 'Wellness центр',
        'business-space-restaurant': 'Ресторан',
        'business-space-retail': 'Роздрібна торгівля',
        'case-study-hotel-testimonial': 'Після встановлення картин Inner Garden наш NPS зріс на 28%, а гості залишаються на 0.8 днів довше',
        'case-study-medical-testimonial': 'Пацієнти стали менше нервувати перед процедурами, рівень стресу знизився на 35%',
        'case-study-office-testimonial': 'Продуктивність команди зросла на 22%, а кількість лікарняних знизилась на 18%',
        'testimonial-1-author': '- Анна Петрова, Готель "Гармонія"',
        'footer-legal-info': 'Правова інформація',

        // NEWSLETTER
        'newsletter-title': 'Залишайтеся в Гармонії',
        'newsletter-subtitle': 'Отримуйте нові картини та інсайти про мистецтво у бізнесі',
        'newsletter-subscribe': 'Підписатися',
        'newsletter-email-placeholder': 'Ваша email адреса',

        // FOOTER
        'footer-description': 'Inner Garden створює унікальні абстрактні картини для бізнес-просторів. Наше мистецтво трансформує офіси, готелі та медичні центри у простори гармонії та натхнення.',
        'footer-quick-links': 'Швидкі посилання',
        'footer-collection': 'Колекція',
        'footer-business': 'Для Бізнесу',
        'footer-stories': 'Історії',
        'footer-meditation': 'Медитація',
        'footer-privacy': 'Політика Конфіденційності',
        'footer-terms': 'Умови Використання',
        'footer-cookies': 'Політика Cookies',
        'footer-contact-title': 'Контакти',
        'privacy-policy': 'Політика Конфіденційності',
        'terms-service': 'Умови Користування',
        'cookie-policy': 'Політика Cookies',
        'footer-rights': 'Всі права захищені.',
        
        // LEGAL POLICIES
        'privacy-policy-title': 'Політика Конфіденційності',
        'terms-service-title': 'Умови Користування',
        'cookie-policy-title': 'Політика Cookies',
        'policy-last-updated': 'Останнє оновлення',
        'policy-accept': 'Прийняти',
        'policy-decline': 'Відхилити',
        
        // COMMON
        'btn-learn-more': 'Дізнатися більше',
        'btn-contact': 'Зв\'язатися',
        'btn-close': 'Закрити',
        'back-to-top': 'Вверх',
        'loading-text': 'Завантаження...',
        'error-loading': 'Помилка завантаження',
        'try-again': 'Спробувати знову',
        'skip-to-content': 'Перейти до контенту',
        
        // SORT AND VIEW OPTIONS
        'sort-name': 'За назвою',
        'sort-year': 'За роком',
        'sort-price': 'За ціною',
        'sort-size': 'За розміром',
        'view-grid-title': 'Сітка',
        'view-list-title': 'Список',
        
        // ARTWORKS GALLERY
        'artwork-touch': 'Доторкніться',
        'play-sound': 'Послухати звуки',
        'view-ar': 'Переглянути в AR',
        'artwork-view-ar': 'Побачити в AR',
        'artwork-details': 'Деталі',
        'emotions': 'Емоції',
        'click-to-enable-audio': 'Клікніть, щоб увімкнути звук',
        'audio-error': 'Помилка відтворення аудіо',
        'audio-not-supported': 'Аудіо не підтримується',
        'link-copied': 'Посилання скопійовано',
        
        // MEDITATION SECTION
        'meditation-complete': 'Медитацію завершено',
        'meditation-benefits': 'Користь від медитації',
        'meditation-instructions': 'Інструкції для медитації',
        'choose-meditation': 'Оберіть медитацію',
        'meditation-duration': 'Тривалість',
        'minutes': 'хвилин'
      },
      
      en: {
        // PAGE TITLE & META
        'page-title': 'Inner Garden - Abstract Art for Business Spaces | +40% ROI',
        
        // PRELOADER
        'choose-language': 'Choose Language / Оберіть мову',
        'loading': 'Loading...',
        
        // NAVIGATION
        'site-title': 'Inner Garden',
        'site-tagline': 'Art of Inner Harmony',
        'nav-home': 'Home',
        'nav-collection': 'Collection',
        'nav-map': 'Harmony Map',
        'nav-quiz': 'Choose Atmosphere',
        'nav-artworks': 'Artworks',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Stories',
        'nav-business': 'For Business',
        'nav-about': 'About Artist',
        'nav-contact': 'Contact',

        // HERO
        'hero-title': 'Inner Garden',
        'hero-subtitle': 'Space in Harmony',
        'hero-description': 'Discover the world of abstract art that transforms business spaces into oases of calm and inspiration. Each painting is a portal to inner harmony for your clients and employees.',
        'hero-btn-quiz': 'Find My Artwork',
        'hero-btn-artworks': 'View Artworks',
        'scroll-explore': 'Explore',

        // HARMONY MAP
        'map-title': 'Harmony Spaces',
        'map-subtitle': 'Discover how our paintings transform different business spaces and create an atmosphere of harmony',
        'filter-all': 'All spaces',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medical centers',
        'filter-office': 'Offices',
        'filter-wellness': 'Wellness',
        'map-loading': 'Loading map...',

        // COLLECTION SECTION
        'collection-title': 'Art Collection',
        'collection-subtitle': 'Explore our unique abstract works, created specifically for harmonious business spaces',
        'search-placeholder': 'Search artworks...',
        'collection-filter-all': 'All works',
        'collection-filter-abstract': 'Abstract',
        'collection-filter-nature': 'Nature',
        'collection-filter-geometric': 'Geometric',
        'collection-filter-minimalism': 'Minimalism',
        
        // ARTWORK DETAILS
        'artwork-dimensions': 'Dimensions',
        'artwork-materials': 'Materials',
        'artwork-price': 'Price',
        'artwork-status-available': 'Available',
        'artwork-status-sold': 'Sold',
        'artwork-view-details': 'View Details',
        'artwork-request-info': 'Request Info',
        
        // QUIZ EFFECTS AND QUIZ SYSTEM
        'quiz-step1-title': 'What effect do you want to create?',
        'effect-calm': 'Calm',
        'effect-calm-desc': 'Calming atmosphere for relaxation',
        'effect-inspiration': 'Inspiration',
        'effect-inspiration-desc': 'Stimulates creativity and innovation',
        'effect-energy': 'Energy',
        'effect-energy-desc': 'Activates and motivates to action',
        'effect-balance': 'Balance',
        'effect-balance-desc': 'Harmony between activity and calm',
        'quiz-step2-title': 'What is your space type?',
        'quiz-step3-title': 'What color palette do you prefer?',
        'space-office': 'Office',
        'space-office-desc': 'Work environment for teams',
        'space-hotel': 'Hotel',
        'space-hotel-desc': 'Hospitality and guest comfort',
        'space-medical': 'Medical Center',
        'space-medical-desc': 'Calming atmosphere for patients',
        'space-wellness': 'Wellness',
        'space-wellness-desc': 'Relaxation and restoration',
        'palette-warm': 'Warm',
        'palette-warm-desc': 'Orange, yellow, red tones',
        'palette-cool': 'Cool',
        'palette-cool-desc': 'Blue, cyan, purple tones',
        'palette-neutral': 'Neutral',
        'palette-neutral-desc': 'Beige, gray, natural tones',
        'palette-vibrant': 'Vibrant',
        'palette-vibrant-desc': 'Saturated and contrasting colors',
        'quiz-back': 'Back',
        'quiz-next': 'Next',
        'quiz-results': 'Your Recommendations',
        'quiz-results-desc': 'Based on your answers, we have selected the perfect paintings for your space',
        'quiz-view-all': 'View all paintings',
        'quiz-retry': 'Retake quiz',
        'quiz-match-percent': '% match',
        'quiz-best-match': 'Best choice',
        'artwork-view-ar': 'View in AR',
        'artwork-details': 'Details',
        'artwork-order': 'Order',
        'artwork-close': 'Close',
        'audio-play-error': 'Could not play audio',
        
        // GALLERY
        'play-sound': 'Listen to sounds',
        'view-ar': 'View in AR',
        'add-favorite': 'Add to favorites',
        'share-artwork': 'Share',
        'artwork-available': 'Available',
        'artwork-sold': 'Sold',
        'price-on-request': 'Price on request',

        // ATMOSPHERE QUIZ
        'quiz-title': 'Choose Your Atmosphere',
        'quiz-subtitle': 'Take a short quiz and find the painting that perfectly suits your space',

        // ARTWORKS
        'artworks-title': 'Touch the Art',
        'artworks-subtitle': 'See how each painting can look in your space using AR technology',
        'ar-title': 'See in your space',
        'ar-instruction': 'Point the camera at the wall and place the painting',
        'ar-fallback': 'For AR viewing, use a mobile device with camera',
        'ar-capture': 'Save Photo',
        'ar-done': 'Done',

        // MEDITATION
        'meditation-title': 'Harmony in Real Time',
        'meditation-subtitle': 'Immerse yourself in a meditative experience with our paintings. Feel how art affects your inner state',
        'meditation-start': 'Start Meditation',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Skip',
        'meditation-complete-title': 'Thank you for meditation!',
        'meditation-complete-text': 'This painting can inspire you every day',
        'meditation-order': 'Order Painting',

        // STORIES
        'stories-title': 'Stories of Your Spaces',
        'stories-subtitle': 'Learn how our paintings changed the atmosphere in real business spaces of our clients',
        'stories-all': 'All stories',
        'stories-hotel': 'Hotels',
        'stories-medical': 'Medical centers',
        'stories-office': 'Offices',
        'stories-wellness': 'Wellness',
        'share-story': 'Share Story',
        'story-form-title': 'Tell Your Story',
        'story-name-label': 'Name',
        'story-space-label': 'Space type',
        'story-space-select': 'Select type',
        'story-space-hotel': 'Hotel',
        'story-space-medical': 'Medical center',
        'story-space-office': 'Office',
        'story-space-wellness': 'Wellness center',
        'story-photo-label': 'Space photo',
        'story-text-label': 'Your story',
        'story-consent': 'I consent to publication',
        'story-submit': 'Send Story',
        'story-textarea-placeholder': 'Tell us how our artwork changed your space...',

        // BUSINESS / ROI
        'business-title': 'Art ROI',
        'business-subtitle': 'Learn how art investments increase productivity, reduce stress and improve customer experience',
        'roi-nps': 'NPS Growth',
        'roi-productivity': 'Productivity',
        'roi-stress': 'Stress Level',
        'roi-satisfaction': 'Customer Satisfaction',
        'testimonial-1': '"After placing Inner Garden paintings in our hotel, guest reviews improved by 40%. The atmosphere became calmer and more harmonious." — Maria K., hotel manager',
        'consultation-title': 'Free Consultation',
        'consultation-text': 'Book a personal consultation and find out which paintings would be best for your business space',
        'consultation-btn': 'Book Consultation',
        'business-form-title': 'Business Inquiry',
        'company-name': 'Company name',
        'space-type': 'Space type',
        'select-space': 'Select type',
        'budget-range': 'Budget',
        'select-budget': 'Select range',
        'contact-email': 'Email',
        'project-details': 'Project details',
        'business-submit': 'Send Inquiry',
        'project-details-placeholder': 'Tell us about your space and goals...',
        'business-space-hotel': 'Hotel',
        'business-space-medical': 'Medical center',
        'business-space-office': 'Office',
        'business-space-wellness': 'Wellness center',
        'business-space-restaurant': 'Restaurant',
        'business-space-retail': 'Retail',
        'case-study-hotel-testimonial': 'After installing Inner Garden paintings, our NPS increased by 28%, and guests stay 0.8 days longer',
        'case-study-medical-testimonial': 'Patients became less nervous before procedures, stress level decreased by 35%',
        'case-study-office-testimonial': 'Team productivity increased by 22%, and sick days decreased by 18%',
        'testimonial-1-author': '- Anna Petrova, Harmony Hotel',
        'footer-legal-info': 'Legal Information',

        // NEWSLETTER
        'newsletter-title': 'Stay in Harmony',
        'newsletter-subtitle': 'Get new artworks and insights about art in business',
        'newsletter-subscribe': 'Subscribe',
        'newsletter-email-placeholder': 'Your email address',

        // FOOTER
        'footer-description': 'Inner Garden creates unique abstract paintings for business spaces. Our art transforms offices, hotels and medical centers into spaces of harmony and inspiration.',
        'footer-quick-links': 'Quick links',
        'footer-collection': 'Collection',
        'footer-business': 'For Business',
        'footer-stories': 'Stories',
        'footer-meditation': 'Meditation',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Use',
        'footer-cookies': 'Cookie Policy',
        'footer-contact-title': 'Contact',
        'privacy-policy': 'Privacy Policy',
        'terms-service': 'Terms of Service',
        'cookie-policy': 'Cookie Policy',
        'footer-rights': 'All rights reserved.',
        
        // LEGAL POLICIES
        'privacy-policy-title': 'Privacy Policy',
        'terms-service-title': 'Terms of Service',
        'cookie-policy-title': 'Cookie Policy',
        'policy-last-updated': 'Last updated',
        'policy-accept': 'Accept',
        'policy-decline': 'Decline',
        
        // COMMON
        'btn-learn-more': 'Learn More',
        'btn-contact': 'Contact',
        'btn-close': 'Close',
        'back-to-top': 'Back to Top',
        'loading-text': 'Loading...',
        'error-loading': 'Loading error',
        'try-again': 'Try again',
        'skip-to-content': 'Skip to content',
        
        // SORT AND VIEW OPTIONS
        'sort-name': 'By Name',
        'sort-year': 'By Year',
        'sort-price': 'By Price',
        'sort-size': 'By Size',
        'view-grid-title': 'Grid View',
        'view-list-title': 'List View',
        
        // ARTWORKS GALLERY
        'artwork-touch': 'Touch',
        'play-sound': 'Play Sounds',
        'view-ar': 'View in AR',
        'artwork-view-ar': 'View in AR',
        'artwork-details': 'Details',
        'emotions': 'Emotions',
        'click-to-enable-audio': 'Click to enable audio',
        'audio-error': 'Audio playback error',
        'audio-not-supported': 'Audio not supported',
        'link-copied': 'Link copied',
        'gallery-view-details': 'Detailed View',
        'gallery-download': 'Save Image',
        'gallery-share': 'Share',
        'gallery-image-saved': '🎨 Image saved!',
        'gallery-link-copied': '🔗 Link copied!',
        'gallery-share-page': '📤 Share this page!',
        
        // MEDITATION SECTION
        'meditation-complete': 'Meditation completed',
        'meditation-benefits': 'Benefits of meditation',
        'meditation-instructions': 'Meditation instructions',
        'choose-meditation': 'Choose meditation',
        'meditation-duration': 'Duration',
        'minutes': 'minutes'
      },
      
      de: {
        // PAGE TITLE & META
        'page-title': 'Inner Garden - Abstrakte Kunst für Geschäftsräume | +40% ROI',
        
        // PRELOADER
        'choose-language': 'Sprache wählen / Choose Language',
        'loading': 'Wird geladen...',
        
        // NAVIGATION
        'site-title': 'Inner Garden',
        'site-tagline': 'Kunst der inneren Harmonie',
        'nav-home': 'Startseite',
        'nav-collection': 'Kollektion',
        'nav-map': 'Harmonie-Karte',
        'nav-quiz': 'Atmosphäre wählen',
        'nav-artworks': 'Kunstwerke',
        'nav-meditation': 'Meditation',
        'nav-stories': 'Geschichten',
        'nav-business': 'Für Unternehmen',
        'nav-about': 'Über die Künstlerin',
        'nav-contact': 'Kontakt',

        // HERO
        'hero-title': 'Innerer Garten',
        'hero-subtitle': 'Raum in Harmonie',
        'hero-description': 'Entdecken Sie die Welt der abstrakten Kunst, die Geschäftsräume in Oasen der Ruhe und Inspiration verwandelt. Jedes Gemälde ist ein Portal zur inneren Harmonie für Ihre Kunden und Mitarbeiter.',
        'hero-btn-quiz': 'Mein Kunstwerk finden',
        'hero-btn-artworks': 'Kunstwerke ansehen',
        'scroll-explore': 'Erkunden',

        // HARMONY MAP
        'map-title': 'Harmonie-Räume',
        'map-subtitle': 'Entdecken Sie, wie unsere Gemälde verschiedene Geschäftsräume verwandeln und eine Atmosphäre der Harmonie schaffen',
        'filter-all': 'Alle Räume',
        'filter-hotel': 'Hotels',
        'filter-medical': 'Medizinzentren',
        'filter-office': 'Büros',
        'filter-wellness': 'Wellness',
        'map-loading': 'Karte wird geladen...',

        // COLLECTION SECTION
        'collection-title': 'Kunstkollektion',
        'collection-subtitle': 'Entdecken Sie unsere einzigartigen abstrakten Werke, speziell für harmonische Geschäftsräume geschaffen',
        'search-placeholder': 'Kunstwerke suchen...',
        'collection-filter-all': 'Alle Werke',
        'collection-filter-abstract': 'Abstrakt',
        'collection-filter-nature': 'Natur',
        'collection-filter-geometric': 'Geometrisch',
        'collection-filter-minimalism': 'Minimalismus',
        
        // ARTWORK DETAILS
        'artwork-dimensions': 'Abmessungen',
        'artwork-materials': 'Materialien',
        'artwork-price': 'Preis',
        'artwork-status-available': 'Verfügbar',
        'artwork-status-sold': 'Verkauft',
        'artwork-view-details': 'Details ansehen',
        'artwork-request-info': 'Info anfragen',
        
        // QUIZ EFFECTS AND QUIZ SYSTEM
        'quiz-step1-title': 'Welchen Effekt möchten Sie schaffen?',
        'effect-calm': 'Ruhe',
        'effect-calm-desc': 'Beruhigende Atmosphäre zur Entspannung',
        'effect-inspiration': 'Inspiration',
        'effect-inspiration-desc': 'Stimuliert Kreativität und Innovation',
        'effect-energy': 'Energie',
        'effect-energy-desc': 'Aktiviert und motiviert zum Handeln',
        'effect-balance': 'Balance',
        'effect-balance-desc': 'Harmonie zwischen Aktivität und Ruhe',
        'quiz-step2-title': 'Was ist Ihr Raumtyp?',
        'quiz-step3-title': 'Welche Farbpalette bevorzugen Sie?',
        'space-office': 'Büro',
        'space-office-desc': 'Arbeitsumgebung für Teams',
        'space-hotel': 'Hotel',
        'space-hotel-desc': 'Gastfreundschaft und Gästekomfort',
        'space-medical': 'Medizinzentrum',
        'space-medical-desc': 'Beruhigende Atmosphäre für Patienten',
        'space-wellness': 'Wellness',
        'space-wellness-desc': 'Entspannung und Erholung',
        'palette-warm': 'Warm',
        'palette-warm-desc': 'Orange, gelbe, rote Töne',
        'palette-cool': 'Kühl',
        'palette-cool-desc': 'Blaue, türkise, violette Töne',
        'palette-neutral': 'Neutral',
        'palette-neutral-desc': 'Beige, graue, natürliche Töne',
        'palette-vibrant': 'Lebhaft',
        'palette-vibrant-desc': 'Gesättigte und kontrastierende Farben',
        'quiz-back': 'Zurück',
        'quiz-next': 'Weiter',
        'quiz-results': 'Ihre Empfehlungen',
        'quiz-results-desc': 'Basierend auf Ihren Antworten haben wir die perfekten Gemälde für Ihren Raum ausgewählt',
        'quiz-view-all': 'Alle Gemälde anzeigen',
        'quiz-retry': 'Quiz wiederholen',
        'quiz-match-percent': '% Übereinstimmung',
        'quiz-best-match': 'Beste Wahl',
        'artwork-view-ar': 'In AR ansehen',
        'artwork-details': 'Details',
        'artwork-order': 'Bestellen',
        'artwork-close': 'Schließen',
        'audio-play-error': 'Audio konnte nicht abgespielt werden',
        
        // GALLERY
        'play-sound': 'Klänge hören',
        'view-ar': 'In AR anzeigen',
        'add-favorite': 'Zu Favoriten hinzufügen',
        'share-artwork': 'Teilen',
        'artwork-available': 'Verfügbar',
        'artwork-sold': 'Verkauft',
        'price-on-request': 'Preis auf Anfrage',
        'gallery-view-details': 'Detailansicht',
        'gallery-download': 'Bild speichern',
        'gallery-share': 'Teilen',
        'gallery-image-saved': '🎨 Bild gespeichert!',
        'gallery-link-copied': '🔗 Link kopiert!',
        'gallery-share-page': '📤 Diese Seite teilen!',

        // ATMOSPHERE QUIZ
        'quiz-title': 'Wählen Sie Ihre Atmosphäre',
        'quiz-subtitle': 'Machen Sie einen kurzen Test und finden Sie das Gemälde, das perfekt zu Ihrem Raum passt',

        // ARTWORKS
        'artworks-title': 'Kunst berühren',
        'artworks-subtitle': 'Sehen Sie, wie jedes Gemälde mit AR-Technologie in Ihrem Raum aussehen kann',
        'ar-title': 'In Ihrem Raum sehen',
        'ar-instruction': 'Richten Sie die Kamera auf die Wand und platzieren Sie das Gemälde',
        'ar-fallback': 'Für AR-Anzeige verwenden Sie ein mobiles Gerät mit Kamera',
        'ar-capture': 'Foto speichern',
        'ar-done': 'Fertig',

        // MEDITATION
        'meditation-title': 'Harmonie in Echtzeit',
        'meditation-subtitle': 'Tauchen Sie ein in eine meditative Erfahrung mit unseren Gemälden. Spüren Sie, wie Kunst Ihren inneren Zustand beeinflusst',
        'meditation-start': 'Meditation beginnen',
        'meditation-pause': 'Pause',
        'meditation-skip': 'Überspringen',
        'meditation-complete-title': 'Danke für die Meditation!',
        'meditation-complete-text': 'Dieses Gemälde kann Sie jeden Tag inspirieren',
        'meditation-order': 'Gemälde bestellen',

        // STORIES
        'stories-title': 'Geschichten Ihrer Räume',
        'stories-subtitle': 'Erfahren Sie, wie unsere Gemälde die Atmosphäre in echten Geschäftsräumen unserer Kunden verändert haben',
        'stories-all': 'Alle Geschichten',
        'stories-hotel': 'Hotels',
        'stories-medical': 'Medizinzentren',
        'stories-office': 'Büros',
        'stories-wellness': 'Wellness',
        'share-story': 'Geschichte teilen',
        'story-form-title': 'Erzählen Sie Ihre Geschichte',
        'story-name-label': 'Name',
        'story-space-label': 'Raumtyp',
        'story-space-select': 'Typ auswählen',
        'story-space-hotel': 'Hotel',
        'story-space-medical': 'Medizinzentrum',
        'story-space-office': 'Büro',
        'story-space-wellness': 'Wellness-Zentrum',
        'story-photo-label': 'Raumfoto',
        'story-text-label': 'Ihre Geschichte',
        'story-consent': 'Ich stimme der Veröffentlichung zu',
        'story-submit': 'Geschichte senden',
        'story-textarea-placeholder': 'Erzählen Sie, wie unser Kunstwerk Ihren Raum verändert hat...',

        // BUSINESS / ROI
        'business-title': 'Kunst-ROI',
        'business-subtitle': 'Erfahren Sie, wie Kunstinvestitionen die Produktivität steigern, Stress reduzieren und die Kundenerfahrung verbessern',
        'roi-nps': 'NPS-Wachstum',
        'roi-productivity': 'Produktivität',
        'roi-stress': 'Stress-Level',
        'roi-satisfaction': 'Kundenzufriedenheit',
        'testimonial-1': '"Nach der Platzierung von Inner Garden Gemälden in unserem Hotel verbesserten sich die Gästebewertungen um 40%. Die Atmosphäre wurde ruhiger und harmonischer." — Maria K., Hotelmanagerin',
        'consultation-title': 'Kostenlose Beratung',
        'consultation-text': 'Buchen Sie eine persönliche Beratung und finden Sie heraus, welche Gemälde am besten für Ihren Geschäftsraum geeignet sind',
        'consultation-btn': 'Beratung buchen',
        'business-form-title': 'Geschäftsanfrage',
        'company-name': 'Firmenname',
        'space-type': 'Raumtyp',
        'select-space': 'Typ auswählen',
        'budget-range': 'Budget',
        'select-budget': 'Bereich auswählen',
        'contact-email': 'E-Mail',
        'project-details': 'Projektdetails',
        'business-submit': 'Anfrage senden',
        'project-details-placeholder': 'Erzählen Sie uns von Ihrem Raum und Ihren Zielen...',
        'business-space-hotel': 'Hotel',
        'business-space-medical': 'Medizinzentrum',
        'business-space-office': 'Büro',
        'business-space-wellness': 'Wellness-Zentrum',
        'business-space-restaurant': 'Restaurant',
        'business-space-retail': 'Einzelhandel',
        'case-study-hotel-testimonial': 'Nach der Installation der Inner Garden Gemälde stieg unser NPS um 28%, und Gäste bleiben 0,8 Tage länger',
        'case-study-medical-testimonial': 'Patienten wurden vor Eingriffen weniger nervös, das Stresslevel sank um 35%',
        'case-study-office-testimonial': 'Die Teamproduktivität stieg um 22%, und Krankheitstage sanken um 18%',
        'testimonial-1-author': '- Anna Petrova, Hotel Harmonie',
        'footer-legal-info': 'Rechtliche Informationen',

        // NEWSLETTER
        'newsletter-title': 'In Harmonie bleiben',
        'newsletter-subtitle': 'Erhalten Sie neue Kunstwerke und Einblicke in Kunst im Geschäft',
        'newsletter-subscribe': 'Abonnieren',
        'newsletter-email-placeholder': 'Ihre E-Mail-Adresse',

        // FOOTER
        'footer-description': 'Inner Garden schafft einzigartige abstrakte Gemälde für Geschäftsräume. Unsere Kunst verwandelt Büros, Hotels und Medizinzentren in Räume der Harmonie und Inspiration.',
        'footer-quick-links': 'Schnelle Links',
        'footer-collection': 'Kollektion',
        'footer-business': 'Für Unternehmen',
        'footer-stories': 'Geschichten',
        'footer-meditation': 'Meditation',
        'footer-privacy': 'Datenschutz-Bestimmungen',
        'footer-terms': 'Nutzungsbedingungen',
        'footer-cookies': 'Cookie-Richtlinie',
        'footer-contact-title': 'Kontakt',
        'privacy-policy': 'Datenschutz-Bestimmungen',
        'terms-service': 'Nutzungsbedingungen',
        'cookie-policy': 'Cookie-Richtlinie',
        'footer-rights': 'Alle Rechte vorbehalten.',
        
        // LEGAL POLICIES
        'privacy-policy-title': 'Datenschutz-Bestimmungen',
        'terms-service-title': 'Nutzungsbedingungen',
        'cookie-policy-title': 'Cookie-Richtlinie',
        'policy-last-updated': 'Zuletzt aktualisiert',
        'policy-accept': 'Akzeptieren',
        'policy-decline': 'Ablehnen',
        
        // COMMON
        'btn-learn-more': 'Mehr erfahren',
        'btn-contact': 'Kontakt',
        'btn-close': 'Schließen',
        'back-to-top': 'Nach oben',
        'loading-text': 'Wird geladen...',
        'error-loading': 'Ladefehler',
        'try-again': 'Erneut versuchen',
        'skip-to-content': 'Zum Inhalt springen',
        
        // SORT AND VIEW OPTIONS
        'sort-name': 'Nach Name',
        'sort-year': 'Nach Jahr',
        'sort-price': 'Nach Preis',
        'sort-size': 'Nach Größe',
        'view-grid-title': 'Rasteransicht',
        'view-list-title': 'Listenansicht',
        
        // ARTWORKS GALLERY
        'artwork-touch': 'Berühren',
        'play-sound': 'Klänge abspielen',
        'view-ar': 'In AR ansehen',
        'artwork-view-ar': 'In AR ansehen',
        'artwork-details': 'Details',
        'emotions': 'Emotionen',
        'click-to-enable-audio': 'Klicken Sie, um Audio zu aktivieren',
        'audio-error': 'Audio-Wiedergabefehler',
        'audio-not-supported': 'Audio nicht unterstützt',
        'link-copied': 'Link kopiert',
        
        // MEDITATION SECTION
        'meditation-complete': 'Meditation abgeschlossen',
        'meditation-benefits': 'Vorteile der Meditation',
        'meditation-instructions': 'Meditationsanweisungen',
        'choose-meditation': 'Meditation wählen',
        'meditation-duration': 'Dauer',
        'minutes': 'Minuten'
      }
    };
  }

  setupEventListeners() {
    // Слухати події вибору мови з preloader
    window.addEventListener('languageSelected', (event) => {
      const { language } = event.detail;
      console.log(`🌍 Language selected: ${language}`);
      this.setLanguage(language);
    });

    // Слухати готовність сайту
    window.addEventListener('siteReady', () => {
      console.log('🎯 Site ready - applying translations');
      this.updateDOM();
    });

    // Слухати зміни в DOM
    document.addEventListener('DOMContentLoaded', () => {
      if (this.isInitialized) {
        this.updateDOM();
      }
    });
  }

  detectSavedLanguage() {
    // НЕ використовуємо збережену мову - завжди показуємо preloader
    const saved = localStorage.getItem('selectedLanguage');
    if (saved && this.supportedLanguages.includes(saved)) {
      console.log(`💾 Detected saved language: ${saved}`);
      // Але не встановлюємо автоматично - чекаємо вибір користувача
    }
  }

  setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.warn(`❌ Unsupported language: ${lang}`);
      return false;
    }

    console.log(`🔄 Setting language to: ${lang}`);
    this.currentLang = lang;
    
    // Зберігаємо вибір
    try {
      localStorage.setItem('selectedLanguage', lang);
      sessionStorage.setItem('selectedLanguage', lang);
    } catch (e) {
      console.warn('Cannot save language preference');
    }

    // Оновлюємо DOM
    this.updateDOM();
    
    // Сповіщаємо про зміну
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang }
    }));

    return true;
  }

  translate(key) {
    const translation = this.translations[this.currentLang]?.[key] 
                    || this.translations[this.fallbackLang]?.[key] 
                    || key;
    
    return translation;
  }

  updateDOM() {
    console.log(`🔄 Updating DOM for language: ${this.currentLang}`);
    
    // Оновлюємо всі елементи з data-key
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
      const key = element.getAttribute('data-key');
      const translation = this.translate(key);
      
      if (element.tagName === 'TITLE') {
        // Оновлюємо title сторінки
        element.textContent = translation;
      } else if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
        element.placeholder = translation;
      } else if (element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else if (element.tagName === 'OPTION') {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Оновлюємо мову документа
    document.documentElement.lang = this.currentLang;
    
    // Оновлюємо html lang атрибут
    if (document.documentElement) {
      document.documentElement.setAttribute('lang', this.currentLang);
    }
    
    console.log(`✅ DOM updated for language: ${this.currentLang}`);
  }

  // Публічні методи
  getCurrentLanguage() {
    return this.currentLang;
  }

  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  isLanguageSupported(lang) {
    return this.supportedLanguages.includes(lang);
  }
}

// Глобальна ініціалізація
window.ultraI18n = new UltraI18n();

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraI18n;
}