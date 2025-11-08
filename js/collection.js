/* Inner Garden – Smart Art Collection Explorer
 * Advanced filtering, weighted search relevance, and localisation-aware rendering
 */
(function() {
  'use strict';

  const DEFAULT_LANGUAGE = 'uk';
  const FAVORITES_STORAGE_KEY = 'innerGarden_collectionFavorites';
  const COMMON_LANGUAGES = ['uk', 'en', 'de'];
  const TOKEN_REGEX = /[\p{L}\p{N}]+/gu;

  const CATEGORY_OPTIONS = [
    { id: 'all', labelKey: 'collection-filter-all', fallback: 'Всі роботи' },
    { id: 'abstract', labelKey: 'collection-filter-abstract', fallback: 'Абстракція' },
    { id: 'nature', labelKey: 'collection-filter-nature', fallback: 'Природа' },
    { id: 'geometric', labelKey: 'collection-filter-geometric', fallback: 'Геометрія' },
    { id: 'minimalism', labelKey: 'collection-filter-minimalism', fallback: 'Мінімалізм' }
  ];

  const MOOD_OPTIONS = [
    { id: 'all', labelKey: 'filter-mood-all', fallback: 'Усі настрої' },
    { id: 'calm', labelKey: 'filter-mood-calm', fallback: 'Спокій' },
    { id: 'energy', labelKey: 'filter-mood-energy', fallback: 'Енергія' },
    { id: 'focus', labelKey: 'filter-mood-focus', fallback: 'Фокус' },
    { id: 'luxury', labelKey: 'filter-mood-luxury', fallback: 'Розкіш' },
    { id: 'nature', labelKey: 'filter-mood-nature', fallback: 'Природа' },
    { id: 'balance', labelKey: 'filter-mood-balance', fallback: 'Баланс' }
  ];

  const PALETTE_OPTIONS = [
    { id: 'warm', labelKey: 'filter-palette-warm', fallback: 'Теплі' },
    { id: 'cool', labelKey: 'filter-palette-cool', fallback: 'Холодні' },
    { id: 'neutral', labelKey: 'filter-palette-neutral', fallback: 'Нейтральні' },
    { id: 'vibrant', labelKey: 'filter-palette-vibrant', fallback: 'Яскраві' }
  ];

  const SPACE_OPTIONS = [
    { id: 'corporate', labelKey: 'filter-space-corporate', fallback: 'Корпоративні простори' },
    { id: 'hospitality', labelKey: 'filter-space-hospitality', fallback: 'Готелі та ресторани' },
    { id: 'wellness', labelKey: 'filter-space-wellness', fallback: 'Wellness / медичні' },
    { id: 'residential', labelKey: 'filter-space-residential', fallback: 'Житлові інтерʼєри' }
  ];

  const AVAILABILITY_OPTIONS = [
    { id: 'available', labelKey: 'filter-availability-available', fallback: 'У наявності' },
    { id: 'reserved', labelKey: 'filter-availability-reserved', fallback: 'Резерв' },
    { id: 'sold', labelKey: 'filter-availability-sold', fallback: 'Продано' }
  ];

  const PRICE_OPTIONS = [
    { id: 'any', labelKey: 'filter-price-any', fallback: 'Будь-який бюджет', min: 0, max: Infinity },
    { id: 'under-2500', labelKey: 'filter-price-under-2500', fallback: 'До €2 500', min: 0, max: 2500 },
    { id: '2500-3500', labelKey: 'filter-price-2500-3500', fallback: '€2 500 – €3 500', min: 2500, max: 3500 },
    { id: '3500-4500', labelKey: 'filter-price-3500-4500', fallback: '€3 500 – €4 500', min: 3500, max: 4500 },
    { id: 'over-4500', labelKey: 'filter-price-over-4500', fallback: 'Понад €4 500', min: 4500, max: Infinity }
  ];

  const SORT_OPTIONS = [
    { id: 'featured', labelKey: 'sort-featured', fallback: 'Рекомендовані' },
    { id: 'relevance', labelKey: 'sort-relevance', fallback: 'Відповідність пошуку', hidden: true },
    { id: 'price-asc', labelKey: 'sort-price-asc', fallback: 'Ціна ↑' },
    { id: 'price-desc', labelKey: 'sort-price-desc', fallback: 'Ціна ↓' },
    { id: 'year-desc', labelKey: 'sort-year-desc', fallback: 'Нові' },
    { id: 'year-asc', labelKey: 'sort-year-asc', fallback: 'Рік ↑' },
    { id: 'size-desc', labelKey: 'sort-size-desc', fallback: 'Найбільші' },
    { id: 'size-asc', labelKey: 'sort-size-asc', fallback: 'Найкомпактніші' },
    { id: 'name-asc', labelKey: 'sort-name-asc', fallback: 'Назва A-Z' }
  ];

  const MOOD_LABELS = {
    calm: { uk: 'спокій', en: 'calm', de: 'ruhe' },
    energy: { uk: 'енергія', en: 'energy', de: 'energie' },
    focus: { uk: 'фокус', en: 'focus', de: 'fokus' },
    luxury: { uk: 'розкіш', en: 'luxury', de: 'luxus' },
    nature: { uk: 'природа', en: 'nature', de: 'natur' },
    balance: { uk: 'баланс', en: 'balance', de: 'balance' }
  };

  const PALETTE_LABELS = {
    warm: { uk: 'тепла палітра', en: 'warm palette', de: 'warme palette' },
    cool: { uk: 'холодна палітра', en: 'cool palette', de: 'kühle palette' },
    neutral: { uk: 'нейтральні тони', en: 'neutral tones', de: 'neutrale töne' },
    vibrant: { uk: 'яскраві кольори', en: 'vibrant colours', de: 'kräftige farben' }
  };

  const SPACE_LABELS = {
    corporate: { uk: 'офісні простори', en: 'corporate spaces', de: 'geschäftsräume' },
    hospitality: { uk: 'готельні простори', en: 'hospitality spaces', de: 'hotellerie' },
    wellness: { uk: 'wellness / медичні', en: 'wellness & medical', de: 'wellness & medizinisch' },
    residential: { uk: 'житлові інтерʼєри', en: 'residential interiors', de: 'wohnräume' }
  };

  const AVAILABILITY_LABELS = {
    available: { uk: 'у наявності', en: 'available', de: 'verfügbar' },
    reserved: { uk: 'зарезервовано', en: 'reserved', de: 'reserviert' },
    sold: { uk: 'продано', en: 'sold', de: 'verkauft' },
    unavailable: { uk: 'недоступно', en: 'unavailable', de: 'nicht verfügbar' }
  };

  const RAW_ARTWORKS = [
    {
      id: 'golden-wave',
      slug: 'golden-wave',
      title: {
        uk: 'Золота Хвиля',
        en: 'Golden Wave',
        de: 'Goldene Welle'
      },
      excerpt: {
        uk: 'Теплі золотаві переливи, що підкреслюють преміальні лаунж-зони.',
        en: 'Warm gold gradients that emphasise premium lounge areas.',
        de: 'Warme Goldverläufe, die Premium-Lounges betonen.'
      },
      description: {
        uk: 'Насичені мазки золота створюють ритм хвилі, надаючи простору розкоші й мʼякості. Картина ідеально підкреслює атмосферу готельних лаунжів та бізнес-просторів преміум-класу.',
        en: 'Saturated gold strokes create a wave-like rhythm, bringing luxury and softness to premium lounges and executive business spaces.',
        de: 'Gesättigte Goldstriche erzeugen einen wellenartigen Rhythmus und verleihen Premium-Lounges sowie Business-Räumen Luxus und Sanftheit.'
      },
      category: 'abstract',
      moods: ['luxury', 'energy'],
      palette: 'warm',
      spaces: ['hospitality', 'corporate'],
      price: {
        amount: 3900,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил та золота фольга на полотні',
        en: 'Acrylic and gold leaf on canvas',
        de: 'Acryl und Blattgold auf Leinwand'
      },
      dimensions: { width: 130, height: 90, depth: 2 },
      year: 2024,
      tags: {
        uk: ['лаунж', 'преміум', 'тепло'],
        en: ['lounge', 'premium', 'warmth'],
        de: ['lounge', 'premium', 'wärme']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bophmlcfc59t2gbrojcj.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bophmlcfc59t2gbrojcj.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bophmlcfc59t2gbrojcj.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/bophmlcfc59t2gbrojcj.webp'
      },
      priority: 5
    },
    {
      id: 'inner-peace',
      slug: 'inner-peace',
      title: {
        uk: 'Внутрішня Гармонія',
        en: 'Inner Harmony',
        de: 'Innere Harmonie'
      },
      excerpt: {
        uk: 'Мʼякі пастельні хвилі налаштовують reception та зони очікування на спокій.',
        en: 'Soft pastel waves soothe receptions and waiting lounges.',
        de: 'Sanfte Pastellwellen beruhigen Rezeptionen und Lounges.'
      },
      description: {
        uk: 'Гра світла та плавних ліній створює візуальне відчуття глибокого дихання. Робота підходить для готельних reception, spa-зон та бізнес-лаунжів, де потрібна атмосфера довіри.',
        en: 'The play of light and fluid lines delivers a visual sense of deep breathing. Perfect for hotel receptions, spa areas, and lounges where a sense of trust is essential.',
        de: 'Das Spiel aus Licht und fließenden Linien vermittelt ein visuelles Gefühl tiefen Atems. Ideal für Hotelrezeptionen, Spa-Bereiche und Lounges, in denen Vertrauen gefragt ist.'
      },
      category: 'abstract',
      moods: ['calm', 'balance'],
      palette: 'warm',
      spaces: ['hospitality', 'wellness'],
      price: {
        amount: 2800,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил на полотні',
        en: 'Acrylic on canvas',
        de: 'Acryl auf Leinwand'
      },
      dimensions: { width: 120, height: 80, depth: 2 },
      year: 2024,
      tags: {
        uk: ['спокій', 'рецепція', 'лаунж'],
        en: ['calm', 'reception', 'lounge'],
        de: ['ruhe', 'rezeption', 'lounge']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ous8ji6yspy9jqooyyjy.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ous8ji6yspy9jqooyyjy.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ous8ji6yspy9jqooyyjy.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/ous8ji6yspy9jqooyyjy.webp'
      },
      priority: 4
    },
    {
      id: 'zen-garden',
      slug: 'zen-garden',
      title: {
        uk: 'Дзен Сад',
        en: 'Zen Garden',
        de: 'Zen-Garten'
      },
      excerpt: {
        uk: 'Натхненна японськими кьотськими садами композиція для медитаційних зон.',
        en: 'A Kyoto-inspired composition crafted for meditation corners.',
        de: 'Eine von Kyotos Gärten inspirierte Komposition für Meditationsbereiche.'
      },
      description: {
        uk: 'Лаконічні мазки та прозорі шари створюють простір для усвідомлення. Картина підтримує зосередженість у spa-зонах, кабінетах психологів та приватних студіях.',
        en: 'Minimal gestures and translucent layers invite mindful focus. Ideal for spa areas, therapy rooms, and private studios seeking stillness.',
        de: 'Minimale Gesten und transparente Schichten fördern achtsame Konzentration. Perfekt für Spa-Bereiche, Therapieräume und private Studios.'
      },
      category: 'minimalism',
      moods: ['calm', 'focus'],
      palette: 'neutral',
      spaces: ['wellness', 'residential'],
      price: {
        amount: 3200,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил і туш на полотні',
        en: 'Acrylic and ink on canvas',
        de: 'Acryl und Tusche auf Leinwand'
      },
      dimensions: { width: 100, height: 90, depth: 2 },
      year: 2024,
      tags: {
        uk: ['дзен', 'мінімалізм', 'спокій'],
        en: ['zen', 'minimalism', 'calm'],
        de: ['zen', 'minimalismus', 'ruhe']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/n1w550wvauam6ldnmvnk.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/n1w550wvauam6ldnmvnk.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/n1w550wvauam6ldnmvnk.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/n1w550wvauam6ldnmvnk.webp'
      },
      priority: 4
    },
    {
      id: 'city-breeze',
      slug: 'city-breeze',
      title: {
        uk: 'Міський Бриз',
        en: 'Urban Breeze',
        de: 'Städtische Brise'
      },
      excerpt: {
        uk: 'Динамічні лінії та прохолодні тони додають руху переговорним зонам.',
        en: 'Dynamic lines and cool tones energise meeting spaces.',
        de: 'Dynamische Linien und kühle Töne beleben Besprechungsräume.'
      },
      description: {
        uk: 'Композиція поєднує архітектурні силуети з ритмічними мазками, створюючи відчуття руху. Вона активує креативність у коворкінгах та офісних просторах.',
        en: 'Architectural silhouettes blend with rhythmic strokes to evoke motion, activating creativity in coworking hubs and offices.',
        de: 'Architektonische Silhouetten verschmelzen mit rhythmischen Strichen, wecken Bewegung und Kreativität in Coworking-Spaces und Büros.'
      },
      category: 'abstract',
      moods: ['energy', 'focus'],
      palette: 'cool',
      spaces: ['corporate', 'hospitality'],
      price: {
        amount: 3400,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Змішана техніка на полотні',
        en: 'Mixed media on canvas',
        de: 'Mischtechnik auf Leinwand'
      },
      dimensions: { width: 140, height: 100, depth: 3 },
      year: 2023,
      tags: {
        uk: ['офіс', 'переговори', 'динаміка'],
        en: ['office', 'meeting', 'dynamic'],
        de: ['büro', 'meeting', 'dynamik']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjyoe8gclo0rx32tl2vu.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjyoe8gclo0rx32tl2vu.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjyoe8gclo0rx32tl2vu.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/vjyoe8gclo0rx32tl2vu.webp'
      },
      priority: 3
    },
    {
      id: 'pulse-of-focus',
      slug: 'pulse-of-focus',
      title: {
        uk: 'Пульс Фокусу',
        en: 'Pulse of Focus',
        de: 'Fokus-Puls'
      },
      excerpt: {
        uk: 'Структуровані форми та сміливі акценти для стратегічних кімнат.',
        en: 'Structured forms with bold accents for strategy rooms.',
        de: 'Strukturierte Formen mit kräftigen Akzenten für Strategieräume.'
      },
      description: {
        uk: 'Смілива композиція з геометричними шарами та металевими відблисками концентрує увагу. Підходить для переговорних, boardroom та executive lounge.',
        en: 'A bold composition of geometric layers and metallic reflections that commands focus. Tailored for boardrooms, executive lounges, and strategic hubs.',
        de: 'Eine kräftige Komposition aus geometrischen Schichten und metallischen Reflexionen lenkt die Aufmerksamkeit. Ideal für Boardrooms und Executive Lounges.'
      },
      category: 'geometric',
      moods: ['focus', 'luxury'],
      palette: 'neutral',
      spaces: ['corporate'],
      price: {
        amount: 4100,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил, текстурна паста, металік',
        en: 'Acrylic, texture paste, metallic finish',
        de: 'Acryl, Strukturpaste, Metallic-Finish'
      },
      dimensions: { width: 135, height: 95, depth: 3 },
      year: 2024,
      tags: {
        uk: ['стратегія', 'концентрація', 'метал'],
        en: ['strategy', 'concentration', 'metallic'],
        de: ['strategie', 'konzentration', 'metallisch']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjldxxai3uyhinhgifri.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjldxxai3uyhinhgifri.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjldxxai3uyhinhgifri.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/vjldxxai3uyhinhgifri.webp'
      },
      priority: 4
    },
    {
      id: 'forest-whisper',
      slug: 'forest-whisper',
      title: {
        uk: 'Шепіт Лісу',
        en: 'Forest Whisper',
        de: 'Waldgeflüster'
      },
      excerpt: {
        uk: 'Органічні текстури та глибокі зелені для wellness-просторів.',
        en: 'Organic textures and deep greens for wellness spaces.',
        de: 'Organische Texturen und tiefe Grüntöne für Wellness-Bereiche.'
      },
      description: {
        uk: 'Текстурована поверхня та природні пігменти відтворюють цілющу енергію лісу. Створює відчуття заземлення у медичних та wellness-просторах.',
        en: 'Textured surfaces and natural pigments channel the restorative energy of the forest, grounding medical and wellness environments.',
        de: 'Texturierte Oberflächen und natürliche Pigmente spiegeln die heilende Energie des Waldes wider und erden Wellness- und Praxisräume.'
      },
      category: 'nature',
      moods: ['nature', 'calm'],
      palette: 'neutral',
      spaces: ['wellness', 'residential'],
      price: {
        amount: 1800,
        currency: 'EUR',
        available: false,
        sold: true
      },
      materials: {
        uk: 'Змішана техніка на деревʼяній основі',
        en: 'Mixed media on wood panel',
        de: 'Mischtechnik auf Holztafel'
      },
      dimensions: { width: 80, height: 100, depth: 3 },
      year: 2023,
      tags: {
        uk: ['натхнення природою', 'спа', 'заземлення'],
        en: ['nature-inspired', 'spa', 'grounding'],
        de: ['naturinspiriert', 'spa', 'erdung']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/dhtjtso6nvc0qnxobvov.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/dhtjtso6nvc0qnxobvov.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/dhtjtso6nvc0qnxobvov.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/dhtjtso6nvc0qnxobvov.webp'
      },
      priority: 3
    },
    {
      id: 'aurora-balance',
      slug: 'aurora-balance',
      title: {
        uk: 'Полярна Рівновага',
        en: 'Aurora Balance',
        de: 'Aurora Balance'
      },
      excerpt: {
        uk: 'Північне сяйво в холодній палітрі для підкреслення VIP-зон.',
        en: 'Nordic aurora tones underline VIP lounges.',
        de: 'Nordische Aurora-Töne akzentuieren VIP-Lounges.'
      },
      description: {
        uk: 'Холодні переливи синього та срібного створюють ефект легкого сяйва. Картина працює як центр уваги у преміальних лаунжах та готельних апартаментах.',
        en: 'Cool gradients of blue and silver deliver a subtle glow, serving as a focal point in premium lounges and hotel suites.',
        de: 'Kühle Blau- und Silbertöne erzeugen ein sanftes Leuchten und bilden den Fokus in Premium-Lounges und Hotelsuiten.'
      },
      category: 'abstract',
      moods: ['luxury', 'balance'],
      palette: 'cool',
      spaces: ['hospitality', 'corporate'],
      price: {
        amount: 4200,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил, перламутрені пігменти, лак',
        en: 'Acrylic, pearlescent pigments, varnish',
        de: 'Acryl, perlmuttfarbene Pigmente, Lack'
      },
      dimensions: { width: 150, height: 100, depth: 3 },
      year: 2024,
      tags: {
        uk: ['преміум', 'срібло', 'нічне освітлення'],
        en: ['premium', 'silver', 'night-light'],
        de: ['premium', 'silber', 'abendlicht']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/jbi0jjdszt7gc8k26wlr.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/jbi0jjdszt7gc8k26wlr.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/jbi0jjdszt7gc8k26wlr.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/jbi0jjdszt7gc8k26wlr.webp'
      },
      priority: 5
    },
    {
      id: 'mountain-silence',
      slug: 'mountain-silence',
      title: {
        uk: 'Гірська Тиша',
        en: 'Mountain Silence',
        de: 'Bergstille'
      },
      excerpt: {
        uk: 'Мʼякі тумани і холодні тони для заземлення переговорних.',
        en: 'Soft mists and cool tones ground meeting areas.',
        de: 'Sanfte Nebel und kühle Töne erden Besprechungsbereiche.'
      },
      description: {
        uk: 'Картина поєднує холодні блакитні мазки з теплими акцентами світла, створюючи ефект гірського ранку. Чудово працює у бізнес-просторах, що потребують гармонії.',
        en: 'Cool blue strokes blend with warm light accents, evoking a mountain dawn. Excellent for business environments seeking harmony.',
        de: 'Kühle Blauzüge verbinden sich mit warmen Lichtakzenten und rufen einen Bergmorgen hervor. Ideal für Business-Umgebungen, die Harmonie suchen.'
      },
      category: 'nature',
      moods: ['balance', 'nature'],
      palette: 'cool',
      spaces: ['corporate', 'wellness'],
      price: {
        amount: 3000,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил на полотні',
        en: 'Acrylic on canvas',
        de: 'Acryl auf Leinwand'
      },
      dimensions: { width: 110, height: 85, depth: 2 },
      year: 2023,
      tags: {
        uk: ['гори', 'ранок', 'спокій'],
        en: ['mountain', 'dawn', 'serenity'],
        de: ['berg', 'morgengrauen', 'ruhe']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bgrhzcnztxbn4cco8j0q.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bgrhzcnztxbn4cco8j0q.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bgrhzcnztxbn4cco8j0q.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/bgrhzcnztxbn4cco8j0q.webp'
      },
      priority: 3
    },
    {
      id: 'fjord-light',
      slug: 'fjord-light',
      title: {
        uk: 'Світло Фʼордів',
        en: 'Fjord Light',
        de: 'Fjordlicht'
      },
      excerpt: {
        uk: 'Північні відблиски для скандинавських інтерʼєрів і бізнес-лонжів.',
        en: 'Nordic reflections for Scandinavian-inspired interiors.',
        de: 'Nordische Reflexe für skandinavisch inspirierte Räume.'
      },
      description: {
        uk: 'Комбінація глибоких бірюз та приглушених графітових тонів створює відчуття свіжого повітря. Чудово працює у світлих коворкінгах та арт-просторах.',
        en: 'Deep teals meet muted graphite tones, delivering an impression of fresh air. Designed for airy coworking and art-driven environments.',
        de: 'Tiefe Petroltöne treffen auf gedämpftes Graphit und vermitteln frische Luft – ideal für lichtdurchflutete Coworking- und Kunsträume.'
      },
      category: 'nature',
      moods: ['nature', 'calm'],
      palette: 'cool',
      spaces: ['corporate', 'residential'],
      price: {
        amount: 2950,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил, крейдяна пастель',
        en: 'Acrylic, chalk pastel',
        de: 'Acryl, Kreidepastell'
      },
      dimensions: { width: 115, height: 90, depth: 2 },
      year: 2024,
      tags: {
        uk: ['скандинавський стиль', 'подих', 'легкість'],
        en: ['scandinavian', 'breath', 'lightness'],
        de: ['skandinavisch', 'atem', 'leichtigkeit']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ymu2dpujrvowhrlnbbzf.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ymu2dpujrvowhrlnbbzf.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ymu2dpujrvowhrlnbbzf.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/ymu2dpujrvowhrlnbbzf.webp'
      },
      priority: 2
    },
    {
      id: 'precision-grid',
      slug: 'precision-grid',
      title: {
        uk: 'Сітка Точності',
        en: 'Precision Grid',
        de: 'Präzisionsraster'
      },
      excerpt: {
        uk: 'Геометрія та структурні ритми для інноваційних офісів.',
        en: 'Geometric structure that supports innovative offices.',
        de: 'Geometrische Struktur für innovative Büros.'
      },
      description: {
        uk: 'Чіткі лінії та мідні акценти налаштовують команди на скоординовану роботу. Робота добре виглядає у переговорних та зонах проєктного менеджменту.',
        en: 'Precise lines with copper highlights align teams for coordinated work. Excellent for project management zones and boardrooms.',
        de: 'Präzise Linien mit Kupferakzenten richten Teams auf koordinierte Arbeit aus. Perfekt für Projektmanagementbereiche und Boardrooms.'
      },
      category: 'geometric',
      moods: ['focus', 'balance'],
      palette: 'neutral',
      spaces: ['corporate'],
      price: {
        amount: 3600,
        currency: 'EUR',
        available: false,
        reserved: true
      },
      materials: {
        uk: 'Акрил, мідна фольга',
        en: 'Acrylic, copper leaf',
        de: 'Acryl, Kupferblatt'
      },
      dimensions: { width: 125, height: 95, depth: 3 },
      year: 2024,
      tags: {
        uk: ['точність', 'мідь', 'архітектура'],
        en: ['precision', 'copper', 'architecture'],
        de: ['präzision', 'kupfer', 'architektur']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tdcuqjraki8tfaogokcj.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tdcuqjraki8tfaogokcj.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tdcuqjraki8tfaogokcj.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/tdcuqjraki8tfaogokcj.webp'
      },
      priority: 3
    },
    {
      id: 'ember-motion',
      slug: 'ember-motion',
      title: {
        uk: 'Полумʼяний Рух',
        en: 'Ember Motion',
        de: 'Glutfunkeln'
      },
      excerpt: {
        uk: 'Яскрава енергія для креативних коворкінгів та лаунжів.',
        en: 'Vivid energy tailored for creative coworking lounges.',
        de: 'Lebendige Energie für kreative Coworking-Lounges.'
      },
      description: {
        uk: 'Контрастні теплі мазки та графічні елементи стимулюють рух і натхнення. Підходить для командних просторів, де важлива швидка генерація ідей.',
        en: 'Contrasting warm strokes with graphic accents ignite movement and inspiration. Perfect for team hubs where rapid ideation is key.',
        de: 'Kontrastierende warme Pinselstriche mit grafischen Akzenten entfachen Bewegung und Inspiration. Ideal für Teamräume mit schnellen Ideenprozessen.'
      },
      category: 'abstract',
      moods: ['energy', 'focus'],
      palette: 'vibrant',
      spaces: ['corporate', 'hospitality'],
      price: {
        amount: 3300,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил, маркери, лак',
        en: 'Acrylic, markers, varnish',
        de: 'Acryl, Marker, Lack'
      },
      dimensions: { width: 118, height: 88, depth: 2 },
      year: 2024,
      tags: {
        uk: ['креативність', 'двигун', 'джаз'],
        en: ['creativity', 'motion', 'jazz'],
        de: ['kreativität', 'bewegung', 'jazz']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/s8qogt2nk0l2cj9wo0jg.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/s8qogt2nk0l2cj9wo0jg.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/s8qogt2nk0l2cj9wo0jg.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/s8qogt2nk0l2cj9wo0jg.webp'
      },
      priority: 4
    },
    {
      id: 'marble-symmetry',
      slug: 'marble-symmetry',
      title: {
        uk: 'Мармурова Симетрія',
        en: 'Marble Symmetry',
        de: 'Marmorsymmetrie'
      },
      excerpt: {
        uk: 'Розкішні текстури для reception і приватних кабінетів.',
        en: 'Luxurious textures for receptions and private offices.',
        de: 'Luxuriöse Texturen für Rezeptionen und private Büros.'
      },
      description: {
        uk: 'Мармурові прожилки поєднані зі стриманою геометрією створюють вишуканий акцент. Робота завершує образ преміальних приймалень та executive office.',
        en: 'Marble veins meet restrained geometry, crafting a refined focal point for premium receptions and executive offices.',
        de: 'Marmoradern treffen auf zurückhaltende Geometrie und setzen einen fein abgestimmten Fokus in Premium-Rezeptionen und Executive Offices.'
      },
      category: 'minimalism',
      moods: ['luxury', 'balance'],
      palette: 'neutral',
      spaces: ['hospitality', 'corporate'],
      price: {
        amount: 4800,
        currency: 'EUR',
        available: true
      },
      materials: {
        uk: 'Акрил, мармуровий пил, лак',
        en: 'Acrylic, marble dust, varnish',
        de: 'Acryl, Marmormehl, Lack'
      },
      dimensions: { width: 140, height: 100, depth: 3 },
      year: 2024,
      tags: {
        uk: ['мармур', 'преміум', 'баланс'],
        en: ['marble', 'premium', 'balance'],
        de: ['marmor', 'premium', 'balance']
      },
      images: {
        main: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/blvif4pbzuquujvvywnk.webp',
        detail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/blvif4pbzuquujvvywnk.webp',
        room: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/blvif4pbzuquujvvywnk.webp',
        thumbnail: 'https://res.cloudinary.com/djdc6wcpg/image/upload/c_fill,h_320,w_480,q_auto/blvif4pbzuquujvvywnk.webp'
      },
      priority: 5
    }
  ];

  function toLocaleLower(value, lang = DEFAULT_LANGUAGE) {
    if (!value) {
      return '';
    }
    const locale = lang === 'en' ? 'en-US' : (lang === 'de' ? 'de-DE' : 'uk-UA');
    try {
      return String(value).toLocaleLowerCase(locale);
    } catch (_) {
      return String(value).toLowerCase();
    }
  }

  function translate(key, fallback) {
    if (window.simpleI18n?.translate) {
      const value = window.simpleI18n.translate(key);
      if (value && value !== key) return value;
    }
    if (window.ultraI18n?.translate) {
      const value = window.ultraI18n.translate(key);
      if (value && value !== key) return value;
    }
    if (typeof window.getTranslation === 'function') {
      const value = window.getTranslation(key);
      if (value && value !== key) return value;
    }
    return fallback;
  }

  function getLanguage() {
    return window.simpleI18n?.getLanguage?.() ||
      window.ultraI18n?.getCurrentLanguage?.() ||
      document.documentElement.lang ||
      DEFAULT_LANGUAGE;
  }

  function prepareArtwork(data) {
    const price = data.price || {};
    const dimensions = data.dimensions || {};
    const width = Number(dimensions.width) || 0;
    const height = Number(dimensions.height) || 0;
    const depth = Number(dimensions.depth) || 0;
    const area = width * height;

    const availability = price.sold
      ? 'sold'
      : price.reserved
        ? 'reserved'
        : price.available === false
          ? 'unavailable'
          : 'available';

    const normalized = {
      ...data,
      price,
      dimensions: { width, height, depth },
      area,
      availability,
      priority: typeof data.priority === 'number' ? data.priority : 1
    };

    normalized.searchIndex = buildSearchIndex(normalized);
    return normalized;
  }

  function buildSearchIndex(artwork) {
    const index = new Map();

    COMMON_LANGUAGES.forEach((lang) => {
      const collected = [];

      const pushText = (value) => {
        if (!value) return;
        collected.push(toLocaleLower(value, lang));
      };

      const collectField = (field) => {
        if (!field) return;
        const preferred = field[lang];
        if (preferred) pushText(preferred);
        COMMON_LANGUAGES.forEach((fallbackLang) => {
          if (fallbackLang !== lang) {
            const fallbackValue = field[fallbackLang];
            if (fallbackValue) pushText(fallbackValue);
          }
        });
      };

      collectField(artwork.title);
      collectField(artwork.excerpt);
      collectField(artwork.description);
      collectField(artwork.materials);

      if (artwork.tags) {
        const tags = artwork.tags[lang] || artwork.tags.uk || artwork.tags.en || [];
        pushText(Array.isArray(tags) ? tags.join(' ') : tags);
      }

      (artwork.moods || []).forEach((mood) => {
        const label = MOOD_LABELS[mood];
        if (label) {
          pushText(label[lang]);
          COMMON_LANGUAGES.forEach((fallbackLang) => {
            if (label[fallbackLang]) pushText(label[fallbackLang]);
          });
        } else {
          pushText(mood);
        }
      });

      if (artwork.palette) {
        const paletteLabel = PALETTE_LABELS[artwork.palette];
        if (paletteLabel) {
          pushText(paletteLabel[lang]);
          COMMON_LANGUAGES.forEach((fallbackLang) => {
            if (paletteLabel[fallbackLang]) pushText(paletteLabel[fallbackLang]);
          });
        } else {
          pushText(artwork.palette);
        }
      }

      (artwork.spaces || []).forEach((space) => {
        const label = SPACE_LABELS[space];
        if (label) {
          pushText(label[lang]);
          COMMON_LANGUAGES.forEach((fallbackLang) => {
            if (label[fallbackLang]) pushText(label[fallbackLang]);
          });
        } else {
          pushText(space);
        }
      });

      const availabilityLabel = AVAILABILITY_LABELS[artwork.availability];
      if (availabilityLabel) {
        pushText(availabilityLabel[lang]);
        COMMON_LANGUAGES.forEach((fallbackLang) => {
          if (availabilityLabel[fallbackLang]) pushText(availabilityLabel[fallbackLang]);
        });
      }

      const text = collected.join(' ');
      const tokens = (text.match(TOKEN_REGEX) || []).map((token) => token.toLowerCase());
      index.set(lang, {
        text,
        tokens,
        tokenSet: new Set(tokens)
      });
    });

    return index;
  }

  const ARTWORKS = RAW_ARTWORKS.map(prepareArtwork);

  class ArtCollection {
    constructor(section) {
      this.section = section;
      this.artworks = ARTWORKS.map((item) => ({ ...item }));
      this.favorites = this.loadFavorites();
      this.filterState = {
        categories: new Set(),
        moods: new Set(),
        palettes: new Set(),
        spaces: new Set(),
        availability: new Set(),
        priceRange: 'any',
        searchQuery: '',
        sortBy: 'featured'
      };
      this.userSelectedSort = false;
      this.searchDebounce = null;
      this.categoryButtons = new Map();
      this.moodButtons = new Map();
      this.paletteButtons = new Map();
      this.spaceButtons = new Map();
      this.availabilityButtons = new Map();
      this.priceButtons = new Map();
      this.sortOptionsRendered = new Map();

      this.buildLayout();
      this.cacheElements();
      this.renderQuickFilters();
      this.renderAdvancedFilters();
      this.bindEvents();
      this.render();

      window.addEventListener('language:change', () => {
        this.renderQuickFilters();
        this.renderAdvancedFilters();
        this.render();
      }, { passive: true });
    }

    buildLayout() {
      if (!this.section) return;
      this.section.innerHTML = `
        <div class="collection-enhanced container">
          <div class="collection-header">
            <h2 class="section-title" data-key="collection-title">${translate('collection-title', 'Колекція Картин')}</h2>
            <p class="section-subtitle" data-key="collection-subtitle">${translate('collection-subtitle', 'Досліджуйте наші унікальні абстрактні роботи, створені для гармонійних просторів')}</p>
          </div>

          <div class="collection-toolbar">
            <div class="collection-search-group">
              <i class="fas fa-search" aria-hidden="true"></i>
              <input
                id="collection-search"
                class="collection-search-input"
                type="search"
                autocomplete="off"
                data-key="search-placeholder"
                placeholder="${translate('search-placeholder', 'Пошук картин...')}"
                aria-label="${translate('search-placeholder', 'Пошук картин...')}">
              <button id="collection-search-clear" class="collection-search-clear" type="button" aria-label="${translate('search-clear', 'Очистити пошук')}">
                &times;
              </button>
            </div>

            <div class="collection-toolbar-divider" aria-hidden="true"></div>

            <div class="collection-sort">
              <label for="collection-sort-select" class="collection-sort-label" data-key="sort-label">${translate('sort-label', 'Сортування')}</label>
              <select id="collection-sort-select" class="collection-sort-select"></select>
            </div>

            <button id="collection-advanced-toggle" class="collection-advanced-toggle" type="button" aria-expanded="false">
              <i class="fas fa-sliders-h" aria-hidden="true"></i>
              <span data-key="advanced-filters-toggle">${translate('advanced-filters-toggle', 'Додаткові фільтри')}</span>
            </button>
          </div>

          <div class="collection-quick-filters">
            <div class="filter-group">
              <p class="filter-title" data-key="filter-categories">${translate('filter-categories', 'Категорії')}</p>
              <div class="filter-chips" id="category-filter-chips"></div>
            </div>
            <div class="filter-group">
              <p class="filter-title" data-key="filter-moods">${translate('filter-moods', 'Настрої')}</p>
              <div class="filter-chips" id="mood-filter-chips"></div>
            </div>
          </div>

          <div class="collection-active-filters">
            <div class="active-filters-list" id="active-filter-chips"></div>
            <button class="active-filters-clear" id="active-filters-clear" type="button">
              <i class="fas fa-times" aria-hidden="true"></i>
              <span data-key="filters-clear-all">${translate('filters-clear-all', 'Скинути все')}</span>
            </button>
          </div>

          <div class="collection-advanced" id="collection-advanced" hidden>
            <div class="collection-advanced-inner">
              <div class="filter-group">
                <p class="filter-title" data-key="filter-palette">${translate('filter-palette', 'Палітра')}</p>
                <div class="filter-chips" id="palette-filter-chips"></div>
              </div>
              <div class="filter-group">
                <p class="filter-title" data-key="filter-spaces">${translate('filter-spaces', 'Тип простору')}</p>
                <div class="filter-chips" id="space-filter-chips"></div>
              </div>
              <div class="filter-group">
                <p class="filter-title" data-key="filter-availability">${translate('filter-availability', 'Статус')}</p>
                <div class="filter-chips" id="availability-filter-chips"></div>
              </div>
              <div class="filter-group">
                <p class="filter-title" data-key="filter-price">${translate('filter-price', 'Бюджет')}</p>
                <div class="filter-chips filter-chips-single" id="price-filter-chips"></div>
              </div>
            </div>
          </div>

          <div class="collection-results-meta" aria-live="polite">
            <span class="results-count" id="collection-results-count">0</span>
            <span class="results-label" data-key="results-label">${translate('results-label', 'підібрані роботи')}</span>
          </div>

          <div class="collection-grid" id="collection-grid" role="list"></div>

          <div class="collection-empty" id="collection-empty" hidden>
            <div class="collection-empty-inner">
              <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
              <h3 data-key="results-empty-title">${translate('results-empty-title', 'Немає збігів')}</h3>
              <p data-key="results-empty-body">${translate('results-empty-body', 'Спробуйте змінити фільтри або пошуковий запит, щоб знайти ідеальну картину')}</p>
              <button class="btn-secondary" id="collection-empty-reset" type="button">
                <span data-key="results-empty-reset">${translate('results-empty-reset', 'Скинути фільтри')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    cacheElements() {
      if (!this.section) return;

      this.gridEl = this.section.querySelector('#collection-grid');
      this.emptyStateEl = this.section.querySelector('#collection-empty');
      this.emptyResetBtn = this.section.querySelector('#collection-empty-reset');
      this.resultCountEl = this.section.querySelector('#collection-results-count');
      this.searchInput = this.section.querySelector('#collection-search');
      this.clearSearchBtn = this.section.querySelector('#collection-search-clear');
      this.sortSelect = this.section.querySelector('#collection-sort-select');
      this.advancedToggle = this.section.querySelector('#collection-advanced-toggle');
      this.advancedPanel = this.section.querySelector('#collection-advanced');
      this.activeFiltersContainer = this.section.querySelector('#active-filter-chips');
      this.activeFiltersClearBtn = this.section.querySelector('#active-filters-clear');

      this.categoryChipsContainer = this.section.querySelector('#category-filter-chips');
      this.moodChipsContainer = this.section.querySelector('#mood-filter-chips');
      this.paletteChipsContainer = this.section.querySelector('#palette-filter-chips');
      this.spaceChipsContainer = this.section.querySelector('#space-filter-chips');
      this.availabilityChipsContainer = this.section.querySelector('#availability-filter-chips');
      this.priceChipsContainer = this.section.querySelector('#price-filter-chips');
    }

    bindEvents() {
      if (!this.section) return;

      if (this.searchInput) {
        this.searchInput.addEventListener('input', (event) => this.handleSearchInput(event));
      }

      if (this.clearSearchBtn) {
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
      }

      if (this.sortSelect) {
        this.sortSelect.addEventListener('change', (event) => this.handleSortChange(event));
      }

      if (this.advancedToggle && this.advancedPanel) {
        this.advancedToggle.addEventListener('click', () => this.toggleAdvancedPanel());
      }

      if (this.activeFiltersClearBtn) {
        this.activeFiltersClearBtn.addEventListener('click', () => this.resetAllFilters());
      }

      if (this.emptyResetBtn) {
        this.emptyResetBtn.addEventListener('click', () => this.resetAllFilters());
      }

      if (this.gridEl) {
        this.gridEl.addEventListener('click', (event) => {
          const favoriteBtn = event.target.closest('[data-action="favorite"]');
          if (favoriteBtn) {
            event.preventDefault();
            this.toggleFavorite(favoriteBtn.dataset.id);
            return;
          }

          const detailBtn = event.target.closest('[data-action="detail"]');
          const card = event.target.closest('.collection-card');

          if (detailBtn) {
            event.preventDefault();
            this.showArtworkDetail(detailBtn.dataset.id);
            return;
          }

          if (card && !event.target.closest('button')) {
            this.showArtworkDetail(card.dataset.id);
          }
        });
      }
    }

    handleSearchInput(event) {
      const value = event.target.value.trim();
      if (this.searchDebounce) {
        clearTimeout(this.searchDebounce);
      }
      this.searchDebounce = setTimeout(() => {
        this.filterState.searchQuery = value;
        if (!value) {
          this.clearSearchBtn?.classList.remove('is-visible');
        } else {
          this.clearSearchBtn?.classList.add('is-visible');
        }
        this.userSelectedSort = false;
        this.render();
      }, 180);
    }

    clearSearch() {
      if (this.searchDebounce) {
        clearTimeout(this.searchDebounce);
      }
      if (this.searchInput) {
        this.searchInput.value = '';
      }
      this.filterState.searchQuery = '';
      this.clearSearchBtn?.classList.remove('is-visible');
      this.userSelectedSort = false;
      this.render();
    }

    handleSortChange(event) {
      const value = event.target.value;
      this.filterState.sortBy = value;
      this.userSelectedSort = value === 'relevance' ? this.userSelectedSort : true;
      this.render();
    }

    toggleAdvancedPanel() {
      if (!this.advancedPanel || !this.advancedToggle) return;
      const isOpen = !this.advancedPanel.hasAttribute('hidden');
      if (isOpen) {
        this.advancedPanel.setAttribute('hidden', 'hidden');
        this.advancedToggle.setAttribute('aria-expanded', 'false');
        this.advancedToggle.classList.remove('is-open');
      } else {
        this.advancedPanel.removeAttribute('hidden');
        this.advancedToggle.setAttribute('aria-expanded', 'true');
        this.advancedToggle.classList.add('is-open');
      }
    }

    renderQuickFilters() {
      if (!this.categoryChipsContainer || !this.moodChipsContainer) return;

      if (!this.categoryButtons.size) {
        CATEGORY_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'category');
          this.categoryButtons.set(option.id, button);
          this.categoryChipsContainer.appendChild(button);
        });
      }

      if (!this.moodButtons.size) {
        MOOD_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'mood');
          this.moodButtons.set(option.id, button);
          this.moodChipsContainer.appendChild(button);
        });
      }

      CATEGORY_OPTIONS.forEach((option) => {
        const button = this.categoryButtons.get(option.id);
        if (!button) return;
        const isActive = option.id === 'all'
          ? this.filterState.categories.size === 0
          : this.filterState.categories.has(option.id);
        button.classList.toggle('active', isActive);
        button.setAttribute('data-key', option.labelKey);
        button.textContent = translate(option.labelKey, option.fallback);
      });

      MOOD_OPTIONS.forEach((option) => {
        const button = this.moodButtons.get(option.id);
        if (!button) return;
        const isActive = option.id === 'all'
          ? this.filterState.moods.size === 0
          : this.filterState.moods.has(option.id);
        button.classList.toggle('active', isActive);
        button.setAttribute('data-key', option.labelKey);
        button.textContent = translate(option.labelKey, option.fallback);
      });
    }

    renderAdvancedFilters() {
      if (!this.paletteButtons.size && this.paletteChipsContainer) {
        PALETTE_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'palette');
          this.paletteButtons.set(option.id, button);
          this.paletteChipsContainer.appendChild(button);
        });
      }

      if (!this.spaceButtons.size && this.spaceChipsContainer) {
        SPACE_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'space');
          this.spaceButtons.set(option.id, button);
          this.spaceChipsContainer.appendChild(button);
        });
      }

      if (!this.availabilityButtons.size && this.availabilityChipsContainer) {
        AVAILABILITY_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'availability');
          this.availabilityButtons.set(option.id, button);
          this.availabilityChipsContainer.appendChild(button);
        });
      }

      if (!this.priceButtons.size && this.priceChipsContainer) {
        PRICE_OPTIONS.forEach((option) => {
          const button = this.createFilterButton(option, 'price');
          this.priceButtons.set(option.id, button);
          this.priceChipsContainer.appendChild(button);
        });
      }

      this.updateAdvancedFilterButtons();
    }

    createFilterButton(option, type) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.dataset.filter = type;
      button.dataset.value = option.id;
      button.setAttribute('data-key', option.labelKey);
      button.textContent = translate(option.labelKey, option.fallback);

      button.addEventListener('click', () => {
        switch (type) {
          case 'category':
            this.toggleSetFilter(this.filterState.categories, option.id);
            break;
          case 'mood':
            this.toggleSetFilter(this.filterState.moods, option.id);
            break;
          case 'palette':
            this.toggleSetFilter(this.filterState.palettes, option.id);
            break;
          case 'space':
            this.toggleSetFilter(this.filterState.spaces, option.id);
            break;
          case 'availability':
            this.toggleSetFilter(this.filterState.availability, option.id);
            break;
          case 'price':
            this.togglePriceFilter(option.id);
            break;
          default:
            break;
        }
        this.renderQuickFilters();
        this.updateAdvancedFilterButtons();
        this.render();
      });

      return button;
    }

    toggleSetFilter(set, value) {
      if (!set) return;
      if (value === 'all') {
        set.clear();
        return;
      }
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
    }

    togglePriceFilter(id) {
      if (id === 'any') {
        this.filterState.priceRange = 'any';
        return;
      }
      this.filterState.priceRange = this.filterState.priceRange === id ? 'any' : id;
    }

    updateAdvancedFilterButtons() {
      PALETTE_OPTIONS.forEach((option) => {
        const button = this.paletteButtons.get(option.id);
        if (button) {
          button.classList.toggle('active', this.filterState.palettes.has(option.id));
          button.textContent = translate(option.labelKey, option.fallback);
        }
      });

      SPACE_OPTIONS.forEach((option) => {
        const button = this.spaceButtons.get(option.id);
        if (button) {
          button.classList.toggle('active', this.filterState.spaces.has(option.id));
          button.textContent = translate(option.labelKey, option.fallback);
        }
      });

      AVAILABILITY_OPTIONS.forEach((option) => {
        const button = this.availabilityButtons.get(option.id);
        if (button) {
          button.classList.toggle('active', this.filterState.availability.has(option.id));
          button.textContent = translate(option.labelKey, option.fallback);
        }
      });

      PRICE_OPTIONS.forEach((option) => {
        const button = this.priceButtons.get(option.id);
        if (button) {
          const isActive = this.filterState.priceRange === option.id ||
            (option.id === 'any' && this.filterState.priceRange === 'any');
          button.classList.toggle('active', isActive);
          button.textContent = translate(option.labelKey, option.fallback);
        }
      });
    }

    renderActiveFilterChips() {
      if (!this.activeFiltersContainer) return;

      const chips = [];
      const lang = getLanguage();

      this.filterState.categories.forEach((value) => {
        const option = CATEGORY_OPTIONS.find((item) => item.id === value);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.categories.delete(value);
              this.render();
            }
          ));
        }
      });

      this.filterState.moods.forEach((value) => {
        const option = MOOD_OPTIONS.find((item) => item.id === value);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.moods.delete(value);
              this.render();
            }
          ));
        }
      });

      this.filterState.palettes.forEach((value) => {
        const option = PALETTE_OPTIONS.find((item) => item.id === value);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.palettes.delete(value);
              this.render();
            }
          ));
        } else {
          const label = PALETTE_LABELS[value]?.[lang] || value;
          chips.push(this.createActiveChip(label, () => {
            this.filterState.palettes.delete(value);
            this.render();
          }));
        }
      });

      this.filterState.spaces.forEach((value) => {
        const option = SPACE_OPTIONS.find((item) => item.id === value);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.spaces.delete(value);
              this.render();
            }
          ));
        } else {
          const label = SPACE_LABELS[value]?.[lang] || value;
          chips.push(this.createActiveChip(label, () => {
            this.filterState.spaces.delete(value);
            this.render();
          }));
        }
      });

      this.filterState.availability.forEach((value) => {
        const option = AVAILABILITY_OPTIONS.find((item) => item.id === value);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.availability.delete(value);
              this.render();
            }
          ));
        }
      });

      if (this.filterState.priceRange && this.filterState.priceRange !== 'any') {
        const option = PRICE_OPTIONS.find((item) => item.id === this.filterState.priceRange);
        if (option) {
          chips.push(this.createActiveChip(
            translate(option.labelKey, option.fallback),
            () => {
              this.filterState.priceRange = 'any';
              this.render();
            }
          ));
        }
      }

      if (this.filterState.searchQuery) {
        chips.push(this.createActiveChip(`“${this.filterState.searchQuery}”`, () => this.clearSearch()));
      }

      if (!chips.length) {
        this.activeFiltersContainer.innerHTML = `<span class="no-active-filters" data-key="filters-none">${translate('filters-none', 'Фільтри не застосовано')}</span>`;
        this.activeFiltersClearBtn?.setAttribute('disabled', 'disabled');
      } else {
        this.activeFiltersContainer.innerHTML = '';
        chips.forEach((chip) => this.activeFiltersContainer.appendChild(chip));
        this.activeFiltersClearBtn?.removeAttribute('disabled');
      }
    }

    createActiveChip(label, onRemove) {
      const wrapper = document.createElement('div');
      wrapper.className = 'active-filter-chip';

      const text = document.createElement('span');
      text.textContent = label;
      wrapper.appendChild(text);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'active-filter-chip-remove';
      removeBtn.setAttribute('aria-label', translate('filters-remove', 'Прибрати фільтр'));
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        onRemove();
      });

      wrapper.appendChild(removeBtn);
      return wrapper;
    }

    resetAllFilters() {
      this.filterState.categories.clear();
      this.filterState.moods.clear();
      this.filterState.palettes.clear();
      this.filterState.spaces.clear();
      this.filterState.availability.clear();
      this.filterState.priceRange = 'any';
      this.filterState.searchQuery = '';
      this.filterState.sortBy = 'featured';
      this.userSelectedSort = false;

      if (this.searchInput) {
        this.searchInput.value = '';
      }

      this.clearSearchBtn?.classList.remove('is-visible');

      if (this.sortSelect) {
        this.sortSelect.value = 'featured';
      }

      this.renderQuickFilters();
      this.renderAdvancedFilters();
      this.render();
    }

    render() {
      if (!this.gridEl) return;

      const lang = getLanguage();
      const searchTokens = this.tokenize(this.filterState.searchQuery);
      const hasSearch = searchTokens.length > 0;

      this.updateSortOptions(hasSearch);

      const filtered = this.applyFilters(searchTokens, lang);
      const sorted = this.sortArtworks(filtered);

      this.updateResultCount(sorted.length);
      this.updateEmptyState(sorted.length === 0);
      this.renderActiveFilterChips();

      const fragment = document.createDocumentFragment();
      sorted.forEach((item) => {
        const card = this.createCard(item.artwork, lang);
        fragment.appendChild(card);
      });

      this.gridEl.innerHTML = '';
      this.gridEl.appendChild(fragment);
    }

    updateSortOptions(hasSearch) {
      if (!this.sortSelect) return;

      if (!this.sortOptionsRendered.size) {
        SORT_OPTIONS.forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option.id;
          opt.setAttribute('data-key', option.labelKey);
          opt.textContent = translate(option.labelKey, option.fallback);
          opt.hidden = Boolean(option.hidden);
          this.sortSelect.appendChild(opt);
          this.sortOptionsRendered.set(option.id, opt);
        });
      } else {
        SORT_OPTIONS.forEach((option) => {
          const opt = this.sortOptionsRendered.get(option.id);
          if (!opt) return;
          opt.textContent = translate(option.labelKey, option.fallback);
        });
      }

      const relevanceOption = this.sortOptionsRendered.get('relevance');
      if (relevanceOption) {
        relevanceOption.hidden = !hasSearch;
      }

      if (hasSearch) {
        if (!this.userSelectedSort) {
          this.filterState.sortBy = 'relevance';
          this.sortSelect.value = 'relevance';
        }
      } else if (this.filterState.sortBy === 'relevance') {
        this.filterState.sortBy = 'featured';
        this.sortSelect.value = 'featured';
      } else {
        this.sortSelect.value = this.filterState.sortBy;
      }
    }

    applyFilters(tokens, lang) {
      return this.artworks.reduce((acc, artwork) => {
        if (!this.matchesFilterCriteria(artwork)) {
          return acc;
        }

        const { score, matchedTokens } = this.computeSearchScore(artwork, tokens, lang);
        const hasSearch = tokens.length > 0;

        if (hasSearch && matchedTokens.size !== tokens.length) {
          return acc;
        }

        const affinity = this.computeFilterAffinity(artwork);
        const totalScore = score + affinity;

        acc.push({ artwork, score: totalScore, baseScore: score, matchedTokens });
        return acc;
      }, []);
    }

    matchesFilterCriteria(artwork) {
      const { categories, moods, palettes, spaces, availability, priceRange } = this.filterState;

      if (categories.size && !categories.has(artwork.category)) {
        return false;
      }

      if (moods.size && !artwork.moods.some((mood) => moods.has(mood))) {
        return false;
      }

      if (palettes.size && !palettes.has(artwork.palette)) {
        return false;
      }

      if (spaces.size && !artwork.spaces.some((space) => spaces.has(space))) {
        return false;
      }

      if (availability.size && !availability.has(artwork.availability)) {
        return false;
      }

      if (priceRange && priceRange !== 'any') {
        const selectedRange = PRICE_OPTIONS.find((option) => option.id === priceRange);
        if (selectedRange) {
          const amount = typeof artwork.price?.amount === 'number' ? artwork.price.amount : null;
          if (amount === null) {
            return false;
          }
          if (amount < selectedRange.min || amount > selectedRange.max) {
            return false;
          }
        }
      }

      return true;
    }

    computeFilterAffinity(artwork) {
      let affinity = 0;
      const { categories, moods, palettes, spaces, availability, priceRange } = this.filterState;

      if (categories.size && categories.has(artwork.category)) {
        affinity += 2;
      }
      if (moods.size) {
        affinity += artwork.moods.filter((mood) => moods.has(mood)).length * 1.5;
      }
      if (palettes.size && palettes.has(artwork.palette)) {
        affinity += 1;
      }
      if (spaces.size) {
        affinity += artwork.spaces.filter((space) => spaces.has(space)).length;
      }
      if (availability.size && availability.has(artwork.availability)) {
        affinity += 1.5;
      }
      if (priceRange && priceRange !== 'any') {
        const selectedRange = PRICE_OPTIONS.find((option) => option.id === priceRange);
        if (selectedRange && typeof artwork.price?.amount === 'number') {
          const amount = artwork.price.amount;
          if (amount >= selectedRange.min && amount <= selectedRange.max) {
            affinity += 1.5;
          }
        }
      }

      affinity += artwork.priority || 0;
      return affinity;
    }

    computeSearchScore(artwork, tokens, lang) {
      if (!tokens.length) {
        return { score: 0, matchedTokens: new Set() };
      }

      const matchedTokens = new Set();
      let score = 0;

      const languagesToCheck = [lang];
      if (!languagesToCheck.includes('uk')) languagesToCheck.push('uk');
      if (!languagesToCheck.includes('en')) languagesToCheck.push('en');

      tokens.forEach((token) => {
        let tokenScore = 0;

        languagesToCheck.forEach((language) => {
          const entry = artwork.searchIndex.get(language);
          if (!entry) return;

          if (entry.tokenSet.has(token)) {
            tokenScore = Math.max(tokenScore, 6);
          } else if (entry.text.includes(token)) {
            tokenScore = Math.max(tokenScore, 3);
          }
        });

        if (tokenScore > 0) {
          matchedTokens.add(token);
          score += tokenScore;
        }
      });

      return { score, matchedTokens };
    }

    sortArtworks(items) {
      const sortBy = this.filterState.sortBy || 'featured';

      const getPrice = (artwork) => {
        const amount = artwork.price?.amount;
        if (typeof amount === 'number') {
          return amount;
        }
        return artwork.price?.contact ? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
      };

      const compareByName = (a, b) => {
        const lang = getLanguage();
        const titleA = this.getLocalized(a.artwork.title, lang);
        const titleB = this.getLocalized(b.artwork.title, lang);
        return titleA.localeCompare(titleB, lang);
      };

      return items.sort((a, b) => {
        switch (sortBy) {
          case 'relevance':
            return (b.score - a.score) ||
              (b.artwork.priority - a.artwork.priority) ||
              (b.artwork.year - a.artwork.year);
          case 'price-asc':
            return getPrice(a.artwork) - getPrice(b.artwork);
          case 'price-desc':
            return getPrice(b.artwork) - getPrice(a.artwork);
          case 'year-desc':
            return (b.artwork.year || 0) - (a.artwork.year || 0);
          case 'year-asc':
            return (a.artwork.year || 0) - (b.artwork.year || 0);
          case 'size-desc':
            return (b.artwork.area || 0) - (a.artwork.area || 0);
          case 'size-asc':
            return (a.artwork.area || 0) - (b.artwork.area || 0);
          case 'name-asc':
            return compareByName(a, b);
          case 'featured':
          default:
            return (b.artwork.priority - a.artwork.priority) ||
              (b.baseScore - a.baseScore) ||
              (b.artwork.year - a.artwork.year);
        }
      });
    }

    createCard(artwork, lang) {
      const card = document.createElement('article');
      card.className = 'collection-card';
      card.dataset.id = artwork.id;
      card.dataset.category = artwork.category;
      card.dataset.moods = (artwork.moods || []).join(',');
      card.dataset.palette = artwork.palette || '';
      card.dataset.spaces = (artwork.spaces || []).join(',');
      card.dataset.availability = artwork.availability || '';

      const title = this.getLocalized(artwork.title, lang);
      const excerpt = this.getLocalized(artwork.excerpt, lang);
      const materials = this.getLocalized(artwork.materials, lang);
      const priceText = this.formatPrice(artwork.price);
      const statusLabel = AVAILABILITY_LABELS[artwork.availability]?.[lang] ||
        AVAILABILITY_LABELS[artwork.availability]?.uk ||
        translate(`availability-${artwork.availability}`, artwork.availability);
      const paletteLabel = PALETTE_LABELS[artwork.palette]?.[lang] || artwork.palette;
      const spaceLabels = artwork.spaces
        .map((space) => SPACE_LABELS[space]?.[lang] || space)
        .join(' • ');
      const moodLabels = artwork.moods
        .map((mood) => MOOD_LABELS[mood]?.[lang] || mood)
        .join(', ');

      const dimensions = `${artwork.dimensions.width} × ${artwork.dimensions.height} см`;

      card.innerHTML = `
        <div class="collection-card-image">
          <img
            src="${artwork.images.thumbnail || artwork.images.main}"
            alt="${title}"
            loading="lazy"
            decoding="async">
          <span class="collection-card-status availability-${artwork.availability}">
            ${statusLabel}
          </span>
        </div>
        <div class="collection-card-body">
          <div class="collection-card-header">
            <h3>${title}</h3>
            <button
              class="collection-card-favorite ${this.isFavorite(artwork.id) ? 'is-active' : ''}"
              data-action="favorite"
              data-id="${artwork.id}"
              type="button"
              aria-pressed="${this.isFavorite(artwork.id)}"
              aria-label="${translate('collection-favorite-toggle', 'Додати до обраного')}">
              <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
          </div>
          <p class="collection-card-excerpt">${excerpt}</p>
          <dl class="collection-card-meta">
            <div>
              <dt data-key="card-dimensions">${translate('card-dimensions', 'Розмір')}</dt>
              <dd>${dimensions}</dd>
            </div>
            <div>
              <dt data-key="card-materials">${translate('card-materials', 'Матеріали')}</dt>
              <dd>${materials}</dd>
            </div>
            <div>
              <dt data-key="card-price">${translate('card-price', 'Ціна')}</dt>
              <dd>${priceText}</dd>
            </div>
          </dl>
          <ul class="collection-card-tags">
            <li>${paletteLabel}</li>
            ${moodLabels ? `<li>${moodLabels}</li>` : ''}
            ${spaceLabels ? `<li>${spaceLabels}</li>` : ''}
          </ul>
          <div class="collection-card-actions">
            <button
              class="btn-primary"
              data-action="detail"
              data-id="${artwork.id}"
              type="button">
              <span data-key="collection-view-details">${translate('collection-view-details', 'Переглянути деталі')}</span>
            </button>
            <button
              class="btn-outline"
              data-action="favorite"
              data-id="${artwork.id}"
              type="button">
              <span>${this.isFavorite(artwork.id) ? translate('collection-favorite-remove', 'В обраному') : translate('collection-favorite-add', 'Додати в обране')}</span>
            </button>
          </div>
        </div>
      `;

      return card;
    }

    showArtworkDetail(id) {
      const artwork = this.artworks.find((item) => item.id === id);
      if (!artwork) return;

      const lang = getLanguage();
      const title = this.getLocalized(artwork.title, lang);
      const description = this.getLocalized(artwork.description, lang);
      const materials = this.getLocalized(artwork.materials, lang);
      const priceText = this.formatPrice(artwork.price);
      const availability = AVAILABILITY_LABELS[artwork.availability]?.[lang] || artwork.availability;
      const palette = PALETTE_LABELS[artwork.palette]?.[lang] || artwork.palette;
      const spaceLabels = artwork.spaces
        .map((space) => SPACE_LABELS[space]?.[lang] || space)
        .join(', ');
      const moodLabels = artwork.moods
        .map((mood) => MOOD_LABELS[mood]?.[lang] || mood)
        .join(', ');

      let modal = document.getElementById('collection-modal');
      if (modal) {
        modal.remove();
      }

      modal = document.createElement('div');
      modal.id = 'collection-modal';
      modal.className = 'collection-modal';
      modal.innerHTML = `
        <div class="collection-modal-backdrop" data-modal-close></div>
        <div class="collection-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="collection-modal-title">
          <button class="collection-modal-close" data-modal-close aria-label="${translate('modal-close', 'Закрити')}">
            &times;
          </button>
          <div class="collection-modal-content">
            <div class="collection-modal-image">
              <img src="${artwork.images.main}" alt="${title}">
            </div>
            <div class="collection-modal-details">
              <h3 id="collection-modal-title">${title}</h3>
              <p class="collection-modal-description">${description}</p>

              <dl class="collection-modal-specs">
                <div>
                  <dt data-key="modal-price">${translate('modal-price', 'Ціна')}</dt>
                  <dd>${priceText}</dd>
                </div>
                <div>
                  <dt data-key="modal-availability">${translate('modal-availability', 'Статус')}</dt>
                  <dd>${availability}</dd>
                </div>
                <div>
                  <dt data-key="modal-dimensions">${translate('modal-dimensions', 'Розміри')}</dt>
                  <dd>${artwork.dimensions.width} × ${artwork.dimensions.height} × ${artwork.dimensions.depth} см</dd>
                </div>
                <div>
                  <dt data-key="modal-materials">${translate('modal-materials', 'Матеріали')}</dt>
                  <dd>${materials}</dd>
                </div>
                <div>
                  <dt data-key="modal-spaces">${translate('modal-spaces', 'Рекомендовані простори')}</dt>
                  <dd>${spaceLabels}</dd>
                </div>
                <div>
                  <dt data-key="modal-moods">${translate('modal-moods', 'Настрої')}</dt>
                  <dd>${moodLabels}</dd>
                </div>
                <div>
                  <dt data-key="modal-palette">${translate('modal-palette', 'Палітра')}</dt>
                  <dd>${palette}</dd>
                </div>
                <div>
                  <dt data-key="modal-year">${translate('modal-year', 'Рік')}</dt>
                  <dd>${artwork.year}</dd>
                </div>
              </dl>

              <div class="collection-modal-actions">
                <button
                  class="btn-primary"
                  data-action="favorite"
                  data-id="${artwork.id}"
                  type="button">
                  ${this.isFavorite(artwork.id)
        ? translate('collection-favorite-remove', 'В обраному')
        : translate('collection-favorite-add', 'Додати в обране')}
                </button>
                <button class="btn-outline" data-modal-close type="button">
                  ${translate('modal-close', 'Закрити')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('collection-modal-open');

      const closeModal = () => {
        modal.remove();
        document.body.classList.remove('collection-modal-open');
      };

      modal.querySelectorAll('[data-modal-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
      });

      modal.addEventListener('click', (event) => {
        if (event.target.classList.contains('collection-modal')) {
          closeModal();
        }
      });

      document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', onKeydown);
        }
      }, { once: true });
    }

    updateEmptyState(isEmpty) {
      if (!this.gridEl || !this.emptyStateEl) return;
      this.gridEl.hidden = isEmpty;
      this.emptyStateEl.hidden = !isEmpty;
    }

    updateResultCount(count) {
      if (!this.resultCountEl) return;
      this.resultCountEl.textContent = String(count);
    }

    loadFavorites() {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!stored) return new Set();
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      } catch (error) {
        console.warn('Failed to load favorites', error);
      }
      return new Set();
    }

    saveFavorites() {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(this.favorites)));
      } catch (error) {
        console.warn('Failed to save favorites', error);
      }
    }

    toggleFavorite(id) {
      if (!id) return;
      if (this.favorites.has(id)) {
        this.favorites.delete(id);
      } else {
        this.favorites.add(id);
      }
      this.saveFavorites();
      this.render();
    }

    isFavorite(id) {
      return this.favorites.has(id);
    }

    tokenize(query) {
      if (!query) return [];
      const lang = getLanguage();
      const lowered = toLocaleLower(query, lang);
      return (lowered.match(TOKEN_REGEX) || []).map((token) => token.toLowerCase());
    }

    getLocalized(field, lang) {
      if (!field) return '';
      if (field[lang]) return field[lang];
      if (field.uk) return field.uk;
      if (field.en) return field.en;
      if (field.de) return field.de;
      const first = Object.values(field)[0];
      return first || '';
    }

    formatPrice(price) {
      if (!price) return '';
      if (price.contact) {
        return translate('artwork-contact-price', 'Ціна за запитом');
      }
      if (typeof price.amount === 'number') {
        try {
          return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: price.currency || 'EUR',
            maximumFractionDigits: 0
          }).format(price.amount);
        } catch (error) {
          return `${price.amount} ${price.currency || 'EUR'}`;
        }
      }
      return '';
    }

    addArtwork(artworkData) {
      const id = artworkData.id || `artwork-${Date.now()}`;
      const prepared = prepareArtwork({ ...artworkData, id });
      this.artworks.unshift(prepared);
      this.render();
      return prepared;
    }

    updateArtwork(id, updates) {
      const index = this.artworks.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const merged = { ...this.artworks[index], ...updates };
      const prepared = prepareArtwork(merged);
      this.artworks[index] = prepared;
      this.render();
      return prepared;
    }

    deleteArtwork(id) {
      const index = this.artworks.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const [removed] = this.artworks.splice(index, 1);
      this.favorites.delete(id);
      this.saveFavorites();
      this.render();
      return removed;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const collectionSection = document.getElementById('collection');
    if (!collectionSection) return;
    window.artCollection = new ArtCollection(collectionSection);
  });
})();
