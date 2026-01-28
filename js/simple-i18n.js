/* Inner Garden – Minimal multilingual helper */
(function () {
  'use strict';

  const STORAGE_KEY = 'innerGarden_language';
  const DEFAULT_LANGUAGE = 'uk';
  const SUPPORTED_LANGUAGES = ['uk', 'en', 'de'];
  const TRANSLATION_BASE_PATH = 'locales';
  const PAGE_ID = (() => {
    const bodyId = document.body?.dataset?.page;
    if (bodyId) return bodyId;
    const htmlId = document.documentElement?.dataset?.page;
    return htmlId || 'default';
  })();

  const translations = {
    uk: {
      'site-title': 'Inner Garden',
      'choose-language': 'Оберіть мову / Choose Language',
      loading: 'Завантаження...',
      'skip-to-content': 'Перейти до контенту',
      'nav-home': 'Головна',
      'nav-map': 'Карта Гармонії',
      'nav-collection': 'Колекція',
      'nav-quiz': 'Вибрати Атмосферу',
      'nav-artworks': 'Картини',
      'nav-meditation': 'Медитація',
      'nav-stories': 'Історії',
      'nav-business': 'Для Бізнесу',
      'nav-gallery': 'Галерея',
      'link-business': 'Мистецтво для Бізнесу',
      'link-home': 'Мистецтво для Дому',
      'hero-title': 'Marina Kaminska',
      'hero-subtitle': 'Українська художниця абстрактного мистецтва. Створюю унікальні картини для бізнесу та дому.',
      'hero-description': 'Відкрийте для себе світ абстрактного мистецтва, який трансформує бізнес-простори у оазиси спокою та натхнення. Кожна картина – це портал до внутрішньої гармонії ваших клієнтів і співробітників.',
      'gallery-title': 'Галерея Робіт',
      'gallery-subtitle': 'Досліджуйте мої унікальні абстрактні картини',
      'hero-btn-quiz': 'Знайти Мою Картину',
      'hero-btn-artworks': 'Переглянути Колекцію',
      'scroll-explore': 'Досліджуйте',
      'map-title': 'Простори Гармонії',
      'map-subtitle': 'Мапа міст по всьому світу, де представлені картини Марини Камінської',
      'map-legend-title': 'Міста з роботами',
      'collection-title': 'Колекція Картин',
      'collection-subtitle': 'Досліджуйте наші унікальні абстрактні роботи, створені спеціально для гармонійних бізнес-просторів',
      'search-placeholder': 'Пошук картин...',
      'collection-filter-all': 'Всі роботи',
      'collection-filter-abstract': 'Абстракція',
      'collection-filter-nature': 'Природа',
      'collection-filter-geometric': 'Геометрія',
      'collection-filter-minimalism': 'Мінімалізм',
      'collection-item-1-title': 'Внутрішня Гармонія',
      'collection-item-1-desc': 'Тепла палітра сонячних відтінків, що наповнює простір відчуттям стабільності та спокою.',
      'collection-item-1-meta': '120 × 80 см · Акрил на полотні',
      'collection-item-2-title': 'Дзен Сад',
      'collection-item-2-desc': 'Мінімалістична композиція з акцентом на дихання простору – ідеально для reception або лаунжу.',
      'collection-item-2-meta': '100 × 90 см · Змішана техніка',
      'collection-item-3-title': 'Міський Бриз',
      'collection-item-3-desc': 'Насичені синьо-срібні мазки створюють динаміку, що оживляє переговорні та зони очікування.',
      'collection-item-3-meta': '140 × 100 см · Акрил, текстурна паста',
      'quiz-title': 'Виберіть Свою Атмосферу',
      'quiz-subtitle': 'Дозвольте нам знайти ідеальну картину для вашого простору',
      'quiz-option-1-title': 'Лобі готелю',
      'quiz-option-1-desc': 'Потрібна виразна робота, що створює перше враження і підтримує преміальний сервіс.',
      'quiz-option-1-tag-1': 'Високий трафік',
      'quiz-option-1-tag-2': 'Нічне освітлення',
      'quiz-option-2-title': 'Медичний центр',
      'quiz-option-2-desc': 'Максимальне відчуття спокою та підтримки для відвідувачів і персоналу.',
      'quiz-option-2-tag-1': 'Світлі тони',
      'quiz-option-2-tag-2': 'Антистрес',
      'quiz-option-3-title': 'Офіс-креатив',
      'quiz-option-3-desc': 'Акцент на енергії та натхненні для командних зустрічей і брейнштормінгу.',
      'quiz-option-3-tag-1': 'Яскраві акценти',
      'quiz-option-3-tag-2': 'Потік ідей',
      'quiz-chip-any': 'Будь-який',
      'quiz-refine-mood': 'Обрати настрій',
      'quiz-refine-palette': 'Головна палітра',
      'quiz-results-heading': 'Рекомендовані картини',
      'quiz-recommendations-empty': 'Наразі немає точних збігів.',
      'quiz-recommendations-empty-hint': 'Змініть атмосферу або перегляньте повну колекцію.',
      'quiz-action-view-all': 'Переглянути всю колекцію',
      'quiz-action-reset': 'Очистити вибір',
      'quiz-meta-space': 'Простір',
      'quiz-meta-mood': 'Настрій',
      'quiz-meta-palette': 'Палітра',
      'quiz-card-view-ar': 'Переглянути в AR',
      'quiz-result-creative-title': 'Креативний Потік',
      'quiz-result-creative-desc': 'Насичена робота з динамічною енергією для командних просторів.',
      'quiz-result-creative-alt': 'Картина «Креативний Потік» в офісі',
      'quiz-result-meditative-title': 'Медитативний Простір',
      'quiz-result-meditative-desc': 'Мʼяка гармонія кольорів, що підтримує заспокійливу атмосферу.',
      'quiz-result-meditative-alt': 'Картина «Медитативний Простір» у кімнаті відпочинку',
      'quiz-result-elegance-title': 'Готельна Елегантність',
      'quiz-result-elegance-desc': 'Витончена композиція з делікатними відблисками для лобі та лаунжів.',
      'quiz-result-elegance-alt': 'Картина «Готельна Елегантність» в інтерʼєрі',
      'artworks-title': 'Доторкніться до Мистецтва',
      'artworks-subtitle': 'Наведіть курсор на картину, щоб відчути її енергію',
      'artwork-card-1-title': 'Внутрішній Спокій',
      'artwork-card-1-desc': 'Плавні переходи кольорів, що нагадують ритм приливів та відливів. Створює атмосферу дихання простору.',
      'artwork-card-2-title': 'Пульс Аврори',
      'artwork-card-2-desc': 'Світіння холодних та теплих відтінків підкреслює енергію відкритих офісів і креативних просторів.',
      'artwork-card-3-title': 'Золотий Горизонт',
      'artwork-card-3-desc': 'Гра світла на теплих металічних мазках додає відчуття статусу в лаунжах і приватних кабінетах.',
      'artwork-card-cta': 'Замовити консультацію',
      'ar-title': 'Побачте у своєму просторі',
      'ar-instruction': 'Наведіть камеру на стіну і розмістіть картину',
      'ar-fallback': 'Для AR-перегляду використовуйте мобільний пристрій з камерою',
      'ar-capture': 'Зберегти Фото',
      'ar-done': 'Готово',
      'meditation-title': 'Гармонія в Реальному Часі',
      'meditation-subtitle': '5-хвилинний досвід медитації з нашим мистецтвом',
      'meditation-start': 'Почати Медитацію',
      'meditation-pause': 'Пауза',
      'meditation-skip': 'Пропустити',
      'meditation-complete-title': 'Дякуємо за медитацію!',
      'meditation-complete-text': 'Ця картина може надихати вас щодня',
      'meditation-order': 'Замовити Картину',
      'stories-title': 'Історії Ваших Просторів',
      'stories-subtitle': 'Реальні історії клієнтів про трансформацію їхніх просторів',
      'stories-all': 'Усі історії',
      'stories-hotel': 'Готелі',
      'stories-medical': 'Медцентри',
      'stories-office': 'Офіси',
      'stories-wellness': 'Wellness',
      'story-card-1-title': 'Готель «Гармонія», Львів',
      'story-card-1-text': '«Після оновлення арт-простору гості відзначили, що почали проводити більше часу в лаунжі та частіше діляться фото в соцмережах.»',
      'story-card-2-title': 'Медичний центр «Здоров\'я», Київ',
      'story-card-2-text': '«Пацієнти стали спокійнішими під час очікування, а відгуки про атмосферу центру отримали нові 5★ оцінки.»',
      'story-card-3-title': 'Офіс IT-компанії, Вроцлав',
      'story-card-3-text': '«Команда щотижня проводить брейншторм без техніки, просто поруч із картиною — це стало новим ритуалом.»',
      'share-story': 'Поділіться Своєю Історією',
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
      'story-textarea-placeholder': 'Розкажіть, як наша картина змінила ваш простір...',
      'story-consent': 'Даю дозвіл на публікацію',
      'story-submit': 'Надіслати Історію',
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
      'business-form-title': 'Запит для Бізнесу',
      'company-name': 'Назва компанії',
      'space-type': 'Тип простору',
      'select-space': 'Оберіть тип',
      'business-space-hotel': 'Готель',
      'business-space-medical': 'Медичний центр',
      'business-space-office': 'Офіс',
      'business-space-wellness': 'Wellness центр',
      'business-space-restaurant': 'Ресторан',
      'business-space-retail': 'Роздрібна торгівля',
      'budget-range': 'Бюджет',
      'select-budget': 'Оберіть діапазон',
      'contact-email': 'Email',
      'project-details': 'Деталі проекту',
      'project-details-placeholder': 'Розкажіть про ваш простір та цілі...',
      'business-submit': 'Надіслати Запит',
      'virtual-tour-title': 'Віртуальний тур',
      'virtual-tour-subtitle': 'Подивіться, як виглядають наші картини у реальних просторах',
      'virtual-tour-btn': 'Розпочати віртуальний тур',
      'price-comparison-title': 'Порівняння вартості',
      'price-comparison-subtitle': 'Дізнайтеся вартість для вашого простору та порівняйте варіанти',
      'price-comparison-btn': 'Розрахувати вартість',
      'price-comp-subtitle': 'Оберіть розмір та тип картини для вашого простору',
      'gallery-alt-1': 'Лобі готелю з картинами Inner Garden',
      'gallery-alt-2': 'Зона очікування в медичному центрі з арт-інсталяцією',
      'gallery-alt-3': 'Креативний офіс з великою картиною',
      'mood-filter-title': 'Фільтр по настрою і кольорам',
      'mood-calm': 'Спокій',
      'mood-energy': 'Енергія',
      'mood-focus': 'Фокус',
      'mood-luxury': 'Розкіш',
      'mood-nature': 'Природа',
      'palette-warm': 'Тепла палітра',
      'palette-cool': 'Холодна палітра',
      'palette-neutral': 'Нейтральна палітра',
      'palette-vibrant': 'Яскрава палітра',
      'roi-calc-trigger': 'Розрахувати ROI для вашого простору',
      'roi-calc-title': 'Калькулятор ROI мистецтва',
      'roi-calc-subtitle': 'Дізнайтеся, як картини Inner Garden вплинуть на ваш бізнес',
      'roi-space-type-label': 'Тип вашого простору',
      'roi-space-hotel': 'Готель',
      'roi-space-medical': 'Медичний центр',
      'roi-space-office': 'Офіс',
      'roi-space-wellness': 'Wellness центр',
      'roi-space-restaurant': 'Ресторан',
      'roi-visitors-label': 'Кількість відвідувачів/клієнтів на місяць',
      'roi-avg-check-label': 'Середній чек / вартість послуги ($)',
      'roi-budget-label': 'Бюджет на мистецтво ($)',
      'roi-calculate-btn': 'Розрахувати ROI',
      'roi-results-title': 'Ваш прогнозований ROI',
      'roi-nps-growth': 'Зростання NPS',
      'roi-revenue-increase': 'Додатковий дохід/рік',
      'roi-client-satisfaction': 'Задоволеність клієнтів',
      'roi-payback': 'Окупність',
      'roi-breakdown-title': 'Детальний розрахунок:',
      'roi-ready-question': 'Готові покращити ваш простір?',
      'roi-consult-btn': 'Записатись на консультацію',
      'meditation-breathe-in': 'Вдихайте...',
      'meditation-hold': 'Затримайте...',
      'meditation-breathe-out': 'Видихайте...',
      'meditation-step-1': 'Заспокойте дихання',
      'meditation-step-2': 'Зосередьтесь на картині',
      'meditation-step-3': 'Відчуйте гармонію',
      'meditation-step-4': 'Дозвольте собі відпочити',
      'meditation-sound-nature': 'Природа',
      'meditation-sound-rain': 'Дощ',
      'meditation-sound-ocean': 'Океан',
      'meditation-sound-silence': 'Тиша',
      'meditation-complete-msg': 'Ви завершили медитацію!',
      'meditation-order-btn': 'Замовити цю картину',
      'tour-modal-title': 'Віртуальний тур по просторах',
      'tour-location-hotel': 'Готель - Лобі',
      'tour-location-medical': 'Медцентр - Очікування',
      'tour-location-office': 'Офіс - Переговорна',
      'tour-drag-hint': 'Перетягуйте для огляду',
      'tour-prev-btn': 'Попередня',
      'tour-next-btn': 'Наступна',
      'tour-details-btn': 'Детальніше про цей проект',
      'newsletter-title': 'Залишайтеся в Гармонії',
      'newsletter-subtitle': 'Отримуйте нові картини та інсайти про мистецтво у бізнесі',
      'newsletter-email-placeholder': 'Ваша email адреса',
      'newsletter-subscribe': 'Підписатися',
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
      'privacy-policy': 'Політика Конфіденційності',
      'terms-service': 'Умови Користування',
      'cookie-policy': 'Політика Cookies',
      'page-title': 'Inner Garden - Premium Abstract Art for Business Spaces | +40% ROI Proven | USA, EU, UK',
      'select-language': 'Обрати мову',
      'toggle-mobile-menu': 'Відкрити меню',
      'back-to-top': 'Нагору',
      'modal-close': 'Закрити',
      'lang-ukrainian': 'Українська',
      'lang-english': 'English',
      'lang-german': 'Deutsch',
      'budget-5k-15k': '$5,000 - $15,000',
      'budget-15k-50k': '$15,000 - $50,000',
      'budget-50k-plus': '$50,000+',
      'footer-brand-title': 'Inner Garden',
      'footer-email': 'Email: hello@inner-garden.art',
      'footer-telegram': 'Telegram: @inner_garden_support',
      'footer-copyright': '© 2024 Inner Garden.',
      'hero-alt': 'Абстрактне мистецтво Inner Garden для бізнес-просторів',
      'collection-item-1-alt': 'Картина внутрішня гармонія в м\'яких бурштинових тонах',
      'collection-item-2-alt': 'Заспокійлива мінімалістична картина в нейтральній палітрі',
      'collection-item-3-alt': 'Виразна абстрактна картина, натхненна європейським небосхилом',
      'artwork-card-1-alt': 'Картина з м\'якими блакитними відтінками',
      'artwork-card-2-alt': 'Яскрава робота з динамічними лініями',
      'artwork-card-3-alt': 'Абстрактна картина в золотистих тонах',
      'ar-preview-alt': 'Попередній перегляд картини',
      'ar-status-ready': 'Дозвольте доступ до камери, щоб приміряти картину.',
      'ar-status-loading': 'Запускаємо камеру…',
      'ar-status-error': 'Камеру заблоковано. Дозвольте доступ або завантажте фото кімнати.',
      'ar-status-upload': 'Завантажте фото кімнати, щоб приміряти картину.',
      'ar-status-uploaded': 'Використовується ваше фото кімнати.',
      'ar-status-camera-off': 'Камеру не вдалося запустити. Використайте фото кімнати або спробуйте знову.',
      'ar-upload': 'Додати кімнату',
      'ar-upload-success': 'Фон оновлено. Тепер картина адаптована під вашу кімнату.',
      'ar-upload-error': 'Будь ласка, оберіть зображення кімнати.',
      'ar-scale': 'Масштаб',
      'ar-rotation': 'Обертання',
      'ar-reset': 'Скинути',
      'ar-backdrop': 'Змінити фон',
      'ar-hint': 'Допоможіть камері знайти стіну',
      'ar-no-camera-hint': 'Увімкніть камеру або скористайтесь зразком інтер’єру.',
      'ar-camera-error': 'Потрібен доступ до камери для AR-примірки.',
      'ar-backdrop-camera-only': 'Фон доступний у режимі без камери.',
      'ar-snapshot-saved': 'Фото з AR успішно збережено.',
      'ar-capture-error': 'Не вдалося зберегти знімок.',
      'map-fallback-message': 'Не вдалося завантажити інтерактивну карту. Перевірте з’єднання з інтернетом.',
      'map-retry': 'Спробувати ще раз',
      'meditation-artwork-alt': 'Картина для медитації Inner Garden',
      'map-aria-label': 'Мапа представлених міст',
      'meditation-timer': '05:00'
    },
    en: {
      'site-title': 'Inner Garden',
      'choose-language': 'Choose Language / Оберіть мову',
      loading: 'Loading...',
      'skip-to-content': 'Skip to content',
      'nav-home': 'Home',
      'nav-map': 'Harmony Map',
      'nav-collection': 'Collection',
      'nav-quiz': 'Choose Atmosphere',
      'nav-artworks': 'Artworks',
      'nav-meditation': 'Meditation',
      'nav-stories': 'Stories',
      'nav-business': 'For Business',
      'nav-gallery': 'Gallery',
      'link-business': 'Art for Business',
      'link-home': 'Art for Home',
      'hero-title': 'Marina Kaminska',
      'hero-subtitle': 'Ukrainian abstract artist. Creating unique paintings for business and home.',
      'hero-description': 'Discover the world of abstract art that transforms business spaces into oases of tranquility and inspiration. Each painting is a portal to the inner harmony of your clients and employees.',
      'gallery-title': 'Art Gallery',
      'gallery-subtitle': 'Explore my unique abstract paintings',
      'hero-btn-quiz': 'Find My Painting',
      'hero-btn-artworks': 'View Collection',
      'scroll-explore': 'Explore',
      'map-title': 'Harmony Spaces',
      'map-subtitle': "A curated map of cities worldwide showcasing Marina Kaminska's artworks",
      'map-legend-title': 'Cities featuring the collection',
      'collection-title': 'Art Collection',
      'collection-subtitle': 'Explore our unique abstract works created specifically for harmonious business spaces',
      'search-placeholder': 'Search artworks...',
      'collection-filter-all': 'All Works',
      'collection-filter-abstract': 'Abstract',
      'collection-filter-nature': 'Nature',
      'collection-filter-geometric': 'Geometric',
      'collection-filter-minimalism': 'Minimalism',
      'collection-item-1-title': 'Inner Harmony',
      'collection-item-1-desc': 'A warm palette of sunlit tones that fills the room with a calm and grounded atmosphere.',
      'collection-item-1-meta': '120 × 80 cm · Acrylic on canvas',
      'collection-item-2-title': 'Zen Garden',
      'collection-item-2-desc': 'A minimalist composition that gives space to breathe – perfect for receptions and lounges.',
      'collection-item-2-meta': '100 × 90 cm · Mixed media',
      'collection-item-3-title': 'Urban Breeze',
      'collection-item-3-desc': 'Deep blue and silver strokes add momentum and keep meeting rooms vibrant.',
      'collection-item-3-meta': '140 × 100 cm · Acrylic with texture paste',
      'quiz-title': 'Choose Your Atmosphere',
      'quiz-subtitle': 'Let us find the perfect artwork for your space',
      'quiz-option-1-title': 'Hotel Lobby',
      'quiz-option-1-desc': 'A signature piece that creates the very first impression and supports premium service.',
      'quiz-option-1-tag-1': 'High traffic',
      'quiz-option-1-tag-2': 'Night lighting',
      'quiz-option-2-title': 'Medical Center',
      'quiz-option-2-desc': 'Maximum sense of calm and support for both guests and staff.',
      'quiz-option-2-tag-1': 'Soft palette',
      'quiz-option-2-tag-2': 'Anti-stress',
      'quiz-option-3-title': 'Creative Office',
      'quiz-option-3-desc': 'A focus on energy and inspiration for workshops and brainstorming.',
      'quiz-option-3-tag-1': 'Bold accents',
      'quiz-option-3-tag-2': 'Idea flow',
      'quiz-chip-any': 'Any',
      'quiz-refine-mood': 'Select mood',
      'quiz-refine-palette': 'Dominant palette',
      'quiz-results-heading': 'Recommended Artworks',
      'quiz-recommendations-empty': 'No exact matches yet.',
      'quiz-recommendations-empty-hint': 'Adjust the atmosphere or browse the full collection.',
      'quiz-action-view-all': 'View full collection',
      'quiz-action-reset': 'Clear selection',
      'quiz-meta-space': 'Space',
      'quiz-meta-mood': 'Mood',
      'quiz-meta-palette': 'Palette',
      'quiz-card-view-ar': 'View in AR',
      'quiz-result-creative-title': 'Creative Flow',
      'quiz-result-creative-desc': 'Dynamic piece packed with energy for collaborative zones.',
      'quiz-result-creative-alt': 'Creative Flow artwork displayed in a modern office',
      'quiz-result-meditative-title': 'Meditative Space',
      'quiz-result-meditative-desc': 'Soft gradients that support a calming, restorative ambience.',
      'quiz-result-meditative-alt': 'Meditative Space artwork placed in a relaxation room',
      'quiz-result-elegance-title': 'Hotel Elegance',
      'quiz-result-elegance-desc': 'Refined composition with subtle highlights for lobbies and lounges.',
      'quiz-result-elegance-alt': 'Hotel Elegance artwork featured in a lobby',
      'artworks-title': 'Touch the Art',
      'artworks-subtitle': 'Hover over the artwork to feel its energy',
      'artwork-card-1-title': 'Inner Peace',
      'artwork-card-1-desc': 'Gentle gradients reminiscent of the ocean tide bring breathing space to any room.',
      'artwork-card-2-title': 'Aurora Pulse',
      'artwork-card-2-desc': 'A glow of cool and warm hues that energises open offices and creative hubs.',
      'artwork-card-3-title': 'Golden Horizon',
      'artwork-card-3-desc': 'Layers of warm metallic strokes add a refined mood to lounges and boardrooms.',
      'artwork-card-cta': 'Book a consultation',
      'ar-title': 'See it in Your Space',
      'ar-instruction': 'Point your camera at a wall and place the artwork',
      'ar-fallback': 'For AR viewing, please use a mobile device with camera',
      'ar-capture': 'Save Photo',
      'ar-done': 'Done',
      'meditation-title': 'Real-Time Harmony',
      'meditation-subtitle': 'A 5-minute meditation experience with our art',
      'meditation-start': 'Start Meditation',
      'meditation-pause': 'Pause',
      'meditation-skip': 'Skip',
      'meditation-complete-title': 'Thank you for meditating!',
      'meditation-complete-text': 'This artwork can inspire you every day',
      'meditation-order': 'Order Artwork',
      'stories-title': 'Stories of Your Spaces',
      'stories-subtitle': 'Real client stories about transforming their spaces',
      'stories-all': 'All Stories',
      'stories-hotel': 'Hotels',
      'stories-medical': 'Medical Centers',
      'stories-office': 'Offices',
      'stories-wellness': 'Wellness',
      'story-card-1-title': '"Harmony" Hotel, Lviv',
      'story-card-1-text': '"Guests now spend more time in the lounge and love sharing the new art corners on social media."',
      'story-card-2-title': '"Health" Medical Center, Kyiv',
      'story-card-2-text': '"Visitors feel calmer while waiting, and our atmosphere ratings jumped to five-star feedback."',
      'story-card-3-title': 'IT Office, Wrocław',
      'story-card-3-text': '"The team holds weekly screen-free brainstorms right next to the artwork – it became a ritual."',
      'share-story': 'Share Your Story',
      'story-form-title': 'Share Your Story',
      'story-name-label': 'Name',
      'story-space-label': 'Space Type',
      'story-space-select': 'Select type',
      'story-space-hotel': 'Hotel',
      'story-space-medical': 'Medical Center',
      'story-space-office': 'Office',
      'story-space-wellness': 'Wellness Center',
      'story-photo-label': 'Space Photo',
      'story-text-label': 'Your Story',
      'story-textarea-placeholder': 'Tell us how our artwork transformed your space...',
      'story-consent': 'I consent to publication',
      'story-submit': 'Submit Story',
      'story-form-success': 'Thank you for sharing! We will get back to you within two days.',
      'business-title': 'Art ROI',
      'business-subtitle': 'Art is an investment, not an expense',
      'roi-nps': 'NPS Growth',
      'roi-productivity': 'Productivity',
      'roi-stress': 'Stress Level',
      'roi-satisfaction': 'Customer Satisfaction',
      'testimonial-1': '"After installing Inner Garden artworks in our lobby, guest ratings increased by 25%. People genuinely feel the difference in atmosphere."',
      'testimonial-1-author': '- Anna Petrova, "Harmony" Hotel',
      'consultation-title': 'Free Consultation',
      'consultation-text': 'Get personalized recommendations for art in your space',
      'consultation-btn': 'Book a Consultation',
      'business-form-title': 'Business Inquiry',
      'company-name': 'Company Name',
      'space-type': 'Space Type',
      'select-space': 'Select type',
      'business-space-hotel': 'Hotel',
      'business-space-medical': 'Medical Center',
      'business-space-office': 'Office',
      'business-space-wellness': 'Wellness Center',
      'business-space-restaurant': 'Restaurant',
      'business-space-retail': 'Retail',
      'budget-range': 'Budget',
      'select-budget': 'Select range',
      'contact-email': 'Email',
      'project-details': 'Project Details',
      'project-details-placeholder': 'Tell us about your space and goals...',
      'business-submit': 'Submit Inquiry',
      'virtual-tour-title': 'Virtual Tour',
      'virtual-tour-subtitle': 'See how our artworks look in real spaces',
      'virtual-tour-btn': 'Start Virtual Tour',
      'price-comparison-title': 'Price Comparison',
      'price-comparison-subtitle': 'Discover pricing for your space and compare options',
      'price-comparison-btn': 'Calculate Cost',
      'price-comp-subtitle': 'Choose the size and type of artwork for your space',
      'gallery-alt-1': 'Hotel lobby with Inner Garden artworks',
      'gallery-alt-2': 'Medical center waiting area with art installation',
      'gallery-alt-3': 'Creative office with large painting',
      'mood-filter-title': 'Filter by Mood & Colors',
      'mood-calm': 'Calm',
      'mood-energy': 'Energy',
      'mood-focus': 'Focus',
      'mood-luxury': 'Luxury',
      'mood-nature': 'Nature',
      'palette-warm': 'Warm palette',
      'palette-cool': 'Cool palette',
      'palette-neutral': 'Neutral palette',
      'palette-vibrant': 'Vibrant palette',
      'roi-calc-trigger': 'Calculate ROI for Your Space',
      'roi-calc-title': 'Art ROI Calculator',
      'roi-calc-subtitle': 'Discover how Inner Garden artworks will impact your business',
      'roi-space-type-label': 'Your Space Type',
      'roi-space-hotel': 'Hotel',
      'roi-space-medical': 'Medical Center',
      'roi-space-office': 'Office',
      'roi-space-wellness': 'Wellness Center',
      'roi-space-restaurant': 'Restaurant',
      'roi-visitors-label': 'Monthly Visitors/Clients',
      'roi-avg-check-label': 'Average Check / Service Cost ($)',
      'roi-budget-label': 'Art Budget ($)',
      'roi-calculate-btn': 'Calculate ROI',
      'roi-results-title': 'Your Projected ROI',
      'roi-nps-growth': 'NPS Growth',
      'roi-revenue-increase': 'Additional Revenue/Year',
      'roi-client-satisfaction': 'Customer Satisfaction',
      'roi-payback': 'Payback Period',
      'roi-breakdown-title': 'Detailed Calculation:',
      'roi-ready-question': 'Ready to improve your space?',
      'roi-consult-btn': 'Book a Consultation',
      'meditation-breathe-in': 'Breathe in...',
      'meditation-hold': 'Hold...',
      'meditation-breathe-out': 'Breathe out...',
      'meditation-step-1': 'Calm your breathing',
      'meditation-step-2': 'Focus on the artwork',
      'meditation-step-3': 'Feel the harmony',
      'meditation-step-4': 'Allow yourself to rest',
      'meditation-sound-nature': 'Nature',
      'meditation-sound-rain': 'Rain',
      'meditation-sound-ocean': 'Ocean',
      'meditation-sound-silence': 'Silence',
      'meditation-complete-msg': 'You completed the meditation!',
      'meditation-order-btn': 'Order this Artwork',
      'tour-modal-title': 'Virtual Tour of Spaces',
      'tour-location-hotel': 'Hotel - Lobby',
      'tour-location-medical': 'Medical Center - Waiting Area',
      'tour-location-office': 'Office - Meeting Room',
      'tour-drag-hint': 'Drag to explore',
      'tour-prev-btn': 'Previous',
      'tour-next-btn': 'Next',
      'tour-details-btn': 'Learn more about this project',
      'newsletter-title': 'Stay in Harmony',
      'newsletter-subtitle': 'Receive new artworks and insights about art in business',
      'newsletter-email-placeholder': 'Your email address',
      'newsletter-subscribe': 'Subscribe',
      'footer-description': 'Creating harmonious spaces through abstract art',
      'footer-quick-links': 'Quick Links',
      'footer-collection': 'Collection',
      'footer-business': 'For Business',
      'footer-stories': 'Stories',
      'footer-meditation': 'Meditation',
      'footer-legal-info': 'Legal Information',
      'footer-privacy': 'Privacy Policy',
      'footer-terms': 'Terms of Service',
      'footer-cookies': 'Cookie Policy',
      'footer-contact-title': 'Contact',
      'footer-rights': 'All rights reserved.',
      'privacy-policy': 'Privacy Policy',
      'terms-service': 'Terms of Service',
      'cookie-policy': 'Cookie Policy',
      'page-title': 'Inner Garden - Premium Abstract Art for Business Spaces | +40% ROI Proven | USA, EU, UK',
      'select-language': 'Select language',
      'toggle-mobile-menu': 'Toggle mobile menu',
      'back-to-top': 'Back to top',
      'modal-close': 'Close',
      'lang-ukrainian': 'Українська',
      'lang-english': 'English',
      'lang-german': 'Deutsch',
      'budget-5k-15k': '$5,000 - $15,000',
      'budget-15k-50k': '$15,000 - $50,000',
      'budget-50k-plus': '$50,000+',
      'footer-brand-title': 'Inner Garden',
      'footer-email': 'Email: hello@inner-garden.art',
      'footer-telegram': 'Telegram: @inner_garden_support',
      'footer-copyright': '© 2024 Inner Garden.',
      'hero-alt': 'Abstract harmony artwork - Inner Garden collection for business spaces',
      'collection-item-1-alt': 'Inner harmony painting in soft amber tones',
      'collection-item-2-alt': 'Calming minimalist artwork in neutral palette',
      'collection-item-3-alt': 'Expressive abstract artwork inspired by European skyline',
      'artwork-card-1-alt': 'Painting with soft blue tones',
      'artwork-card-2-alt': 'Vibrant artwork with dynamic lines',
      'artwork-card-3-alt': 'Abstract painting in golden tones',
      'ar-preview-alt': 'Artwork preview',
      'ar-status-ready': 'Allow camera access to try the artwork in your room.',
      'ar-status-loading': 'Starting camera…',
      'ar-status-error': 'Camera access is blocked. Allow permissions or upload a room photo.',
      'ar-status-upload': 'Upload a room photo to preview the artwork.',
      'ar-status-uploaded': 'Your room photo is now in use.',
      'ar-status-camera-off': 'The camera could not start. Use a room photo or try again.',
      'ar-upload': 'Add room photo',
      'ar-upload-success': 'Background updated. The artwork now fits your room.',
      'ar-upload-error': 'Please choose a room image.',
      'ar-scale': 'Scale',
      'ar-rotation': 'Rotation',
      'ar-reset': 'Reset',
      'ar-backdrop': 'Change background',
      'ar-hint': 'Move your device to find a flat wall',
      'ar-no-camera-hint': 'Upload a room photo or use the sample interior.',
      'ar-camera-error': 'Camera access is required for AR preview.',
      'ar-backdrop-camera-only': 'Background is available in fallback mode only.',
      'ar-snapshot-saved': 'AR preview saved to your device.',
      'ar-capture-error': 'Could not save the snapshot.',
      'map-fallback-message': 'We could not load the interactive map. Check your internet connection and try again.',
      'map-retry': 'Try again',
      'meditation-artwork-alt': 'Meditation artwork for Inner Garden relaxation experience',
      'map-aria-label': 'Map of featured cities',
      'meditation-timer': '05:00'
    },
    de: {
      'site-title': 'Inner Garden',
      'choose-language': 'Sprache wählen / Choose Language',
      loading: 'Laden...',
      'skip-to-content': 'Zum Inhalt springen',
      'nav-home': 'Home',
      'nav-map': 'Harmonie-Karte',
      'nav-collection': 'Kollektion',
      'nav-quiz': 'Atmosphäre wählen',
      'nav-artworks': 'Kunstwerke',
      'nav-meditation': 'Meditation',
      'nav-stories': 'Geschichten',
      'nav-business': 'Für Unternehmen',
      'nav-gallery': 'Galerie',
      'link-business': 'Kunst für Unternehmen',
      'link-home': 'Kunst für Zuhause',
      'hero-title': 'Marina Kaminska',
      'hero-subtitle': 'Ukrainische abstrakte Künstlerin. Einzigartige Gemälde für Unternehmen und Zuhause.',
      'hero-description': 'Entdecken Sie die Welt der abstrakten Kunst, die Geschäftsräume in Oasen der Ruhe und Inspiration verwandelt. Jedes Gemälde ist ein Portal zur inneren Harmonie Ihrer Kunden und Mitarbeiter.',
      'gallery-title': 'Kunstgalerie',
      'gallery-subtitle': 'Entdecken Sie meine einzigartigen abstrakten Gemälde',
      'hero-btn-quiz': 'Mein Gemälde finden',
      'hero-btn-artworks': 'Kollektion ansehen',
      'scroll-explore': 'Erkunden',
      'map-title': 'Harmonie-Räume',
      'map-subtitle': 'Eine kuratierte Karte mit Städten weltweit, in denen Werke von Marina Kaminska zu sehen sind',
      'map-legend-title': 'Städte mit ausgestellter Kunst',
      'collection-title': 'Kunstkollektion',
      'collection-subtitle': 'Entdecken Sie unsere einzigartigen abstrakten Werke, speziell für harmonische Geschäftsräume geschaffen',
      'search-placeholder': 'Kunstwerke suchen...',
      'collection-filter-all': 'Alle Werke',
      'collection-filter-abstract': 'Abstrakt',
      'collection-filter-nature': 'Natur',
      'collection-filter-geometric': 'Geometrisch',
      'collection-filter-minimalism': 'Minimalismus',
      'collection-item-1-title': 'Innere Harmonie',
      'collection-item-1-desc': 'Warme, sonnige Töne, die Räume mit Ruhe und Beständigkeit füllen.',
      'collection-item-1-meta': '120 × 80 cm · Acryl auf Leinwand',
      'collection-item-2-title': 'Zen-Garten',
      'collection-item-2-desc': 'Eine minimalistische Komposition, die Luft zum Atmen lässt – ideal für Rezeptionen und Lounges.',
      'collection-item-2-meta': '100 × 90 cm · Mischtechnik',
      'collection-item-3-title': 'Städtische Brise',
      'collection-item-3-desc': 'Kräftige Blau- und Silbernuancen bringen Dynamik in Besprechungs- und Wartebereiche.',
      'collection-item-3-meta': '140 × 100 cm · Acryl mit Strukturpaste',
      'quiz-title': 'Wählen Sie Ihre Atmosphäre',
      'quiz-subtitle': 'Lassen Sie uns das perfekte Kunstwerk für Ihren Raum finden',
      'quiz-option-1-title': 'Hotel-Lobby',
      'quiz-option-1-desc': 'Ein Statement-Piece, das den ersten Eindruck prägt und Premium-Service unterstützt.',
      'quiz-option-1-tag-1': 'Hohe Frequenz',
      'quiz-option-1-tag-2': 'Abendbeleuchtung',
      'quiz-option-2-title': 'Medizinisches Zentrum',
      'quiz-option-2-desc': 'Maximale Ruhe und Unterstützung für Besucher und Team.',
      'quiz-option-2-tag-1': 'Helle Palette',
      'quiz-option-2-tag-2': 'Stressabbau',
      'quiz-option-3-title': 'Kreativbüro',
      'quiz-option-3-desc': 'Fokus auf Energie und Inspiration für Workshops und Brainstormings.',
      'quiz-option-3-tag-1': 'Kräftige Akzente',
      'quiz-option-3-tag-2': 'Ideenfluss',
      'quiz-chip-any': 'Beliebig',
      'quiz-refine-mood': 'Stimmung wählen',
      'quiz-refine-palette': 'Dominante Farbpalette',
      'quiz-results-heading': 'Empfohlene Kunstwerke',
      'quiz-recommendations-empty': 'Noch keine exakte Übereinstimmung.',
      'quiz-recommendations-empty-hint': 'Passen Sie die Atmosphäre an oder sehen Sie sich die gesamte Kollektion an.',
      'quiz-action-view-all': 'Gesamte Kollektion ansehen',
      'quiz-action-reset': 'Auswahl zurücksetzen',
      'quiz-meta-space': 'Raum',
      'quiz-meta-mood': 'Stimmung',
      'quiz-meta-palette': 'Palette',
      'quiz-card-view-ar': 'In AR ansehen',
      'quiz-result-creative-title': 'Creative Flow',
      'quiz-result-creative-desc': 'Dynamisches Werk voller Energie für kollaborative Bereiche.',
      'quiz-result-creative-alt': 'Creative Flow Kunstwerk in einem modernen Büro',
      'quiz-result-meditative-title': 'Meditativer Raum',
      'quiz-result-meditative-desc': 'Sanfte Verläufe, die eine beruhigende Atmosphäre unterstützen.',
      'quiz-result-meditative-alt': 'Meditativer Raum Kunstwerk im Ruheraum',
      'quiz-result-elegance-title': 'Hotel-Eleganz',
      'quiz-result-elegance-desc': 'Feine Komposition mit subtilen Highlights für Lobbys und Lounges.',
      'quiz-result-elegance-alt': 'Hotel-Eleganz Kunstwerk in einer Lobby',
      'artworks-title': 'Kunst berühren',
      'artworks-subtitle': 'Bewegen Sie den Cursor über das Kunstwerk, um seine Energie zu spüren',
      'artwork-card-1-title': 'Innerer Frieden',
      'artwork-card-1-desc': 'Sanfte Farbverläufe wie Ebbe und Flut schenken Räumen eine ruhige Atmung.',
      'artwork-card-2-title': 'Aurora-Puls',
      'artwork-card-2-desc': 'Das Leuchten aus kühlen und warmen Tönen vitalisiert offene Büros und Kreativräume.',
      'artwork-card-3-title': 'Goldener Horizont',
      'artwork-card-3-desc': 'Warme metallische Schichten verleihen Lounges und Chefetagen eine exklusive Note.',
      'artwork-card-cta': 'Beratung anfragen',
      'ar-title': 'In Ihrem Raum sehen',
      'ar-instruction': 'Richten Sie die Kamera auf eine Wand und platzieren Sie das Kunstwerk',
      'ar-fallback': 'Für AR-Ansicht verwenden Sie bitte ein mobiles Gerät mit Kamera',
      'ar-capture': 'Foto speichern',
      'ar-done': 'Fertig',
      'meditation-title': 'Echtzeit-Harmonie',
      'meditation-subtitle': 'Ein 5-minütiges Meditationserlebnis mit unserer Kunst',
      'meditation-start': 'Meditation beginnen',
      'meditation-pause': 'Pause',
      'meditation-skip': 'Überspringen',
      'meditation-complete-title': 'Danke fürs Meditieren!',
      'meditation-complete-text': 'Dieses Kunstwerk kann Sie jeden Tag inspirieren',
      'meditation-order': 'Kunstwerk bestellen',
      'stories-title': 'Geschichten Ihrer Räume',
      'stories-subtitle': 'Echte Kundengeschichten über die Transformation ihrer Räume',
      'stories-all': 'Alle Geschichten',
      'stories-hotel': 'Hotels',
      'stories-medical': 'Medizinzentren',
      'stories-office': 'Büros',
      'stories-wellness': 'Wellness',
      'story-card-1-title': 'Hotel „Harmony", Lwiw',
      'story-card-1-text': '„Gäste verbringen mehr Zeit in der Lounge und teilen die neuen Kunstbereiche begeistert online."',
      'story-card-2-title': 'Medizinzentrum „Gesundheit", Kyjiw',
      'story-card-2-text': '„Unsere Besucher sind gelassener, und die Bewertungen zur Atmosphäre stiegen auf fünf Sterne."',
      'story-card-3-title': 'IT-Büro, Breslau',
      'story-card-3-text': '„Das Team hält wöchentliche Brainstormings ohne Technik direkt bei dem Kunstwerk – ein neues Ritual."',
      'share-story': 'Teilen Sie Ihre Geschichte',
      'story-form-title': 'Ihre Geschichte teilen',
      'story-name-label': 'Name',
      'story-space-label': 'Raumtyp',
      'story-space-select': 'Typ auswählen',
      'story-space-hotel': 'Hotel',
      'story-space-medical': 'Medizinzentrum',
      'story-space-office': 'Büro',
      'story-space-wellness': 'Wellness-Zentrum',
      'story-photo-label': 'Raumfoto',
      'story-text-label': 'Ihre Geschichte',
      'story-textarea-placeholder': 'Erzählen Sie uns, wie unser Kunstwerk Ihren Raum verwandelt hat...',
      'story-consent': 'Ich stimme der Veröffentlichung zu',
      'story-submit': 'Geschichte absenden',
      'story-form-success': 'Vielen Dank für Ihre Geschichte! Wir melden uns innerhalb von zwei Tagen.',
      'business-title': 'Kunst-ROI',
      'business-subtitle': 'Kunst ist eine Investition, keine Ausgabe',
      'roi-nps': 'NPS-Wachstum',
      'roi-productivity': 'Produktivität',
      'roi-stress': 'Stresslevel',
      'roi-satisfaction': 'Kundenzufriedenheit',
      'testimonial-1': '„Nach Installation der Inner Garden Kunstwerke in unserer Lobby stiegen die Gästebewertungen um 25%. Die Menschen spüren wirklich den Unterschied in der Atmosphäre."',
      'testimonial-1-author': '- Anna Petrova, Hotel „Harmony"',
      'consultation-title': 'Kostenlose Beratung',
      'consultation-text': 'Erhalten Sie personalisierte Empfehlungen für Kunst in Ihrem Raum',
      'consultation-btn': 'Beratung buchen',
      'business-form-title': 'Geschäftsanfrage',
      'company-name': 'Firmenname',
      'space-type': 'Raumtyp',
      'select-space': 'Typ auswählen',
      'business-space-hotel': 'Hotel',
      'business-space-medical': 'Medizinzentrum',
      'business-space-office': 'Büro',
      'business-space-wellness': 'Wellness-Zentrum',
      'business-space-restaurant': 'Restaurant',
      'business-space-retail': 'Einzelhandel',
      'budget-range': 'Budget',
      'select-budget': 'Bereich auswählen',
      'contact-email': 'E-Mail',
      'project-details': 'Projektdetails',
      'project-details-placeholder': 'Erzählen Sie uns über Ihren Raum und Ihre Ziele...',
      'business-submit': 'Anfrage absenden',
      'virtual-tour-title': 'Virtuelle Tour',
      'virtual-tour-subtitle': 'Sehen Sie, wie unsere Kunstwerke in echten Räumen aussehen',
      'virtual-tour-btn': 'Virtuelle Tour starten',
      'price-comparison-title': 'Preisvergleich',
      'price-comparison-subtitle': 'Entdecken Sie die Preise für Ihren Raum und vergleichen Sie Optionen',
      'price-comparison-btn': 'Kosten berechnen',
      'price-comp-subtitle': 'Wählen Sie die Größe und Art des Kunstwerks für Ihren Raum',
      'gallery-alt-1': 'Hotel-Lobby mit Inner Garden Kunstwerken',
      'gallery-alt-2': 'Wartebereich im Medizinzentrum mit Kunstinstallation',
      'gallery-alt-3': 'Kreatives Büro mit großem Gemälde',
      'mood-filter-title': 'Filter nach Stimmung & Farben',
      'mood-calm': 'Ruhe',
      'mood-energy': 'Energie',
      'mood-focus': 'Fokus',
      'mood-luxury': 'Luxus',
      'mood-nature': 'Natur',
      'palette-warm': 'Warme Palette',
      'palette-cool': 'Kühle Palette',
      'palette-neutral': 'Neutrale Palette',
      'palette-vibrant': 'Leuchtende Palette',
      'roi-calc-trigger': 'ROI für Ihren Raum berechnen',
      'roi-calc-title': 'Kunst-ROI-Rechner',
      'roi-calc-subtitle': 'Erfahren Sie, wie Inner Garden Kunstwerke Ihr Geschäft beeinflussen',
      'roi-space-type-label': 'Ihr Raumtyp',
      'roi-space-hotel': 'Hotel',
      'roi-space-medical': 'Medizinzentrum',
      'roi-space-office': 'Büro',
      'roi-space-wellness': 'Wellness-Center',
      'roi-space-restaurant': 'Restaurant',
      'roi-visitors-label': 'Monatliche Besucher/Kunden',
      'roi-avg-check-label': 'Durchschnittlicher Bon / Servicekosten ($)',
      'roi-budget-label': 'Kunstbudget ($)',
      'roi-calculate-btn': 'ROI berechnen',
      'roi-results-title': 'Ihr prognostizierter ROI',
      'roi-nps-growth': 'NPS-Wachstum',
      'roi-revenue-increase': 'Zusätzlicher Umsatz/Jahr',
      'roi-client-satisfaction': 'Kundenzufriedenheit',
      'roi-payback': 'Amortisationszeit',
      'roi-breakdown-title': 'Detaillierte Berechnung:',
      'roi-ready-question': 'Bereit, Ihren Raum zu verbessern?',
      'roi-consult-btn': 'Beratung buchen',
      'meditation-breathe-in': 'Einatmen...',
      'meditation-hold': 'Halten...',
      'meditation-breathe-out': 'Ausatmen...',
      'meditation-step-1': 'Beruhigen Sie Ihre Atmung',
      'meditation-step-2': 'Konzentrieren Sie sich auf das Kunstwerk',
      'meditation-step-3': 'Fühlen Sie die Harmonie',
      'meditation-step-4': 'Erlauben Sie sich zu ruhen',
      'meditation-sound-nature': 'Natur',
      'meditation-sound-rain': 'Regen',
      'meditation-sound-ocean': 'Ozean',
      'meditation-sound-silence': 'Stille',
      'meditation-complete-msg': 'Sie haben die Meditation abgeschlossen!',
      'meditation-order-btn': 'Dieses Kunstwerk bestellen',
      'tour-modal-title': 'Virtuelle Tour durch Räume',
      'tour-location-hotel': 'Hotel - Lobby',
      'tour-location-medical': 'Medizinzentrum - Wartebereich',
      'tour-location-office': 'Büro - Besprechungsraum',
      'tour-drag-hint': 'Ziehen zum Erkunden',
      'tour-prev-btn': 'Zurück',
      'tour-next-btn': 'Weiter',
      'tour-details-btn': 'Mehr über dieses Projekt erfahren',
      'newsletter-title': 'Bleiben Sie in Harmonie',
      'newsletter-subtitle': 'Erhalten Sie neue Kunstwerke und Einblicke in Kunst im Business',
      'newsletter-email-placeholder': 'Ihre E-Mail-Adresse',
      'newsletter-subscribe': 'Abonnieren',
      'footer-description': 'Harmonische Räume durch abstrakte Kunst schaffen',
      'footer-quick-links': 'Schnelllinks',
      'footer-collection': 'Kollektion',
      'footer-business': 'Für Unternehmen',
      'footer-stories': 'Geschichten',
      'footer-meditation': 'Meditation',
      'footer-legal-info': 'Rechtliche Informationen',
      'footer-privacy': 'Datenschutzerklärung',
      'footer-terms': 'Nutzungsbedingungen',
      'footer-cookies': 'Cookie-Richtlinie',
      'footer-contact-title': 'Kontakt',
      'footer-rights': 'Alle Rechte vorbehalten.',
      'privacy-policy': 'Datenschutzerklärung',
      'terms-service': 'Nutzungsbedingungen',
      'cookie-policy': 'Cookie-Richtlinie',
      'page-title': 'Inner Garden - Premium Abstract Art for Business Spaces | +40% ROI Proven | USA, EU, UK',
      'select-language': 'Sprache wählen',
      'toggle-mobile-menu': 'Menü öffnen',
      'back-to-top': 'Nach oben',
      'modal-close': 'Schließen',
      'lang-ukrainian': 'Українська',
      'lang-english': 'English',
      'lang-german': 'Deutsch',
      'budget-5k-15k': '$5,000 - $15,000',
      'budget-15k-50k': '$15,000 - $50,000',
      'budget-50k-plus': '$50,000+',
      'footer-brand-title': 'Inner Garden',
      'footer-email': 'Email: hello@inner-garden.art',
      'footer-telegram': 'Telegram: @inner_garden_support',
      'footer-copyright': '© 2024 Inner Garden.',
      'hero-alt': 'Abstrakte Kunst von Inner Garden für Geschäftsräume',
      'collection-item-1-alt': 'Gemälde innere Harmonie in sanften Bernsteintönen',
      'collection-item-2-alt': 'Beruhigendes minimalistisches Kunstwerk in neutraler Palette',
      'collection-item-3-alt': 'Ausdrucksstarkes abstraktes Kunstwerk inspiriert von europäischer Skyline',
      'artwork-card-1-alt': 'Gemälde mit sanften blauen Tönen',
      'artwork-card-2-alt': 'Lebendiges Werk mit dynamischen Linien',
      'artwork-card-3-alt': 'Abstraktes Gemälde in goldenen Tönen',
      'ar-preview-alt': 'Kunstwerk-Vorschau',
      'ar-status-ready': 'Erlauben Sie den Kamerazugriff, um das Kunstwerk in Ihrem Raum zu testen.',
      'ar-status-loading': 'Kamera wird gestartet…',
      'ar-status-error': 'Kamerazugriff blockiert. Erteilen Sie die Freigabe oder laden Sie ein Raumfoto hoch.',
      'ar-status-upload': 'Laden Sie ein Raumfoto hoch, um das Kunstwerk anzuzeigen.',
      'ar-status-uploaded': 'Ihr Raumfoto wird nun verwendet.',
      'ar-status-camera-off': 'Die Kamera konnte nicht gestartet werden. Verwenden Sie ein Raumfoto oder versuchen Sie es erneut.',
      'ar-upload': 'Raumfoto hinzufügen',
      'ar-upload-success': 'Hintergrund aktualisiert. Das Kunstwerk passt jetzt zu Ihrem Raum.',
      'ar-upload-error': 'Bitte wählen Sie ein Raumfoto aus.',
      'ar-scale': 'Skalierung',
      'ar-rotation': 'Rotation',
      'ar-reset': 'Zurücksetzen',
      'ar-backdrop': 'Hintergrund wechseln',
      'ar-hint': 'Bewegen Sie Ihr Gerät, um eine ebene Wand zu finden',
      'ar-no-camera-hint': 'Laden Sie ein Raumfoto hoch oder nutzen Sie das Beispielinterieur.',
      'ar-camera-error': 'Für die AR-Vorschau wird Kamerazugriff benötigt.',
      'ar-backdrop-camera-only': 'Der Hintergrund steht nur im Fallback-Modus zur Verfügung.',
      'ar-snapshot-saved': 'AR-Vorschau wurde gespeichert.',
      'ar-capture-error': 'Screenshot konnte nicht gespeichert werden.',
      'map-fallback-message': 'Die interaktive Karte konnte nicht geladen werden. Bitte Internetverbindung prüfen.',
      'map-retry': 'Erneut versuchen',
      'meditation-artwork-alt': 'Meditationskunstwerk für Inner Garden Entspannungserlebnis',
      'map-aria-label': 'Karte der vorgestellten Städte',
      'meditation-timer': '05:00'
    }
  };

  const loadedLanguages = new Set();
  const languageLoaders = new Map();

  const mergeTranslations = async (lang, url, silent404 = false) => {
    if (!lang || !url) {
      return;
    }
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        if (silent404 && response.status === 404) {
          return;
        }
        console.warn(`[i18n] ${url} responded with status ${response.status}`);
        return;
      }
      const data = await response.json();
      translations[lang] = translations[lang] || {};
      Object.assign(translations[lang], data);
    } catch (error) {
      if (silent404) {
        return;
      }
      console.warn(`[i18n] Failed to load ${url}`, error);
    }
  };

  const ensureLanguageLoaded = async (lang) => {
    if (!lang) {
      return;
    }
    if (loadedLanguages.has(lang)) {
      return;
    }

    if (!languageLoaders.has(lang)) {
      languageLoaders.set(lang, (async () => {
        translations[lang] = translations[lang] || {};
        await mergeTranslations(lang, `${TRANSLATION_BASE_PATH}/${lang}.json`);
        if (PAGE_ID && PAGE_ID !== 'default') {
          await mergeTranslations(lang, `${TRANSLATION_BASE_PATH}/${PAGE_ID}-${lang}.json`, true);
        }
      })());
    }

    try {
      await languageLoaders.get(lang);
    } catch (error) {
      console.warn('[i18n] Language load encountered an error', error);
    }

    loadedLanguages.add(lang);
  };

  let currentLanguage = DEFAULT_LANGUAGE;
  let headerControlsBound = false;
  let translationObserver = null;

  const getTranslation = (lang, key) => {
    return translations[lang]?.[key];
  };

  const translateForDom = (key) => {
    return getTranslation(currentLanguage, key) ?? getTranslation('uk', key);
  };

  const translateWithFallback = (key) => {
    return translateForDom(key) ?? key;
  };

  const applyAttributeTranslations = (element) => {
    const attrSpec = element.getAttribute('data-i18n-attrs');
    if (!attrSpec) {
      return;
    }

    attrSpec.split(/[,;]/).forEach((mapping) => {
      const [attribute, attrKey] = (mapping || '').split(':').map((part) => part && part.trim());
      if (!attribute || !attrKey) {
        return;
      }

      const attrValue = translateForDom(attrKey);
      if (typeof attrValue === 'undefined') {
        return;
      }

      if (attribute in element) {
        try {
          element[attribute] = attrValue;
          return;
        } catch (error) {
          // Fall back to setAttribute below
        }
      }

      element.setAttribute(attribute, attrValue);
    });
  };

  const shouldSkipTextUpdate = (element) => {
    const flag = element?.dataset?.i18nText;
    return flag === 'false' || flag === '0';
  };

  const getPreferredMode = (element) => {
    const mode = element?.dataset?.i18nMode;
    if (mode) {
      return mode.toLowerCase();
    }
    if (element?.dataset?.i18nHtml === 'true') {
      return 'html';
    }
    return 'text';
  };

  const translateElement = (element) => {
    if (!(element instanceof Element)) {
      return;
    }

    applyAttributeTranslations(element);

    const key = element.getAttribute('data-key');
    if (!key) {
      return;
    }

    const value = translateForDom(key);
    if (typeof value === 'undefined') {
      return;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const target = element.dataset?.i18nMode || element.dataset?.i18nTarget;

      if (target === 'value') {
        element.value = value;
        return;
      }

      if (element.type === 'submit' || element.type === 'button') {
        element.value = value;
      } else {
        element.placeholder = value;
      }
      return;
    }

    if (element instanceof HTMLImageElement) {
      element.alt = value;
      return;
    }

    if (shouldSkipTextUpdate(element)) {
      return;
    }

    const mode = getPreferredMode(element);
    if (mode === 'html') {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  };

  const translateTree = (root) => {
    if (!root) {
      return;
    }

    if (root instanceof Element) {
      translateElement(root);
    }

    root.querySelectorAll('[data-key], [data-i18n-attrs]').forEach((node) => {
      translateElement(node);
    });
  };

  window.translateTree = translateTree;

  const updateContent = () => {
    translateTree(document.body);

    const title = translateForDom('page-title') || translateForDom('site-title');
    if (title) {
      document.title = title;
    }
  };

  const updateLanguageUI = () => {
    const langMeta = {
      uk: { flag: '🇺🇦', short: 'УКР' },
      en: { flag: '🇺🇸', short: 'ENG' },
      de: { flag: '🇩🇪', short: 'DEU' }
    };

    document.querySelectorAll('.lang-toggle').forEach((toggle) => {
      const icon = toggle.querySelector('.lang-icon');
      const text = toggle.querySelector('.lang-text');
      if (icon) {
        icon.textContent = langMeta[currentLanguage].flag;
      }
      if (text) {
        text.textContent = langMeta[currentLanguage].short;
      }
    });

    document.querySelectorAll('.lang-option').forEach((option) => {
      option.classList.toggle('active', option.dataset.lang === currentLanguage);
    });

    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === currentLanguage);
    });
  };

  const dispatchLanguageEvent = (lang) => {
    const event = new CustomEvent('language:change', { detail: { lang } });
    window.dispatchEvent(event);
  };

  const setLanguage = async (lang, { silent = false, skipUpdate = false } = {}) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`[i18n] Unsupported language requested: ${lang}`);
      return false;
    }

    await ensureLanguageLoaded(lang);

    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    if (!skipUpdate) {
      updateContent();
      updateLanguageUI();
    }

    if (!silent) {
      dispatchLanguageEvent(lang);
    }

    return true;
  };

  const resolveInitialLanguage = () => {
    const browser = navigator.language?.split('-')[0];
    if (browser && SUPPORTED_LANGUAGES.includes(browser)) {
      return browser;
    }
    return DEFAULT_LANGUAGE;
  };

  const bindHeaderControls = () => {
    if (headerControlsBound) {
      return;
    }
    headerControlsBound = true;

    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('.lang-toggle');
      if (toggle) {
        event.preventDefault();
        document.getElementById('lang-dropdown')?.classList.toggle('active');
        return;
      }

      const option = event.target.closest('.lang-option');
      if (option) {
        event.preventDefault();
        const lang = option.dataset.lang;
        if (lang) {
          setLanguage(lang);
        }
        document.getElementById('lang-dropdown')?.classList.remove('active');
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.language-selector')) {
        document.getElementById('lang-dropdown')?.classList.remove('active');
      }
    });
  };

  const startTranslationObserver = () => {
    if (translationObserver || typeof MutationObserver === 'undefined') {
      return;
    }

    if (!document.body) {
      return;
    }

    translationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              translateTree(node);
            }
          });
        } else if (mutation.type === 'attributes') {
          if (mutation.target instanceof Element) {
            translateElement(mutation.target);
          }
        }
      });
    });

    translationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'data-key',
        'data-i18n-attrs',
        'data-i18n-mode',
        'data-i18n-html',
        'data-i18n-text'
      ]
    });
  };

  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  const hasStoredLanguage = storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage);
  if (hasStoredLanguage) {
    currentLanguage = storedLanguage;
  } else {
    currentLanguage = resolveInitialLanguage();
  }
  document.documentElement.lang = currentLanguage;

  // Глобальні функції
  window.setLanguage = (lang, options) => setLanguage(lang, options);
  window.getTranslation = (key) => translateWithFallback(key);
  window.applyTranslations = () =>
    ensureLanguageLoaded(currentLanguage).then(() => {
      startTranslationObserver();
      updateContent();
      updateLanguageUI();
      bindHeaderControls();
      return true;
    });
  window.t = (key) => translateWithFallback(key);
  window.simpleI18n = {
    getLanguage: () => currentLanguage,
    setLanguage,
    translate: translateWithFallback,
    translations
  };

  const initTranslations = async () => {
    if (hasStoredLanguage) {
      document.body.classList.add('language-selected');
    }
    await window.applyTranslations();
    dispatchLanguageEvent(currentLanguage);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initTranslations().catch((error) => {
        console.error('[i18n] Initialisation failed', error);
      });
    });
  } else {
    initTranslations().catch((error) => {
      console.error('[i18n] Initialisation failed', error);
    });
  }
})();
