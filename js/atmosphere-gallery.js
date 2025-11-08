/* Inner Garden – Atmosphere-driven gallery recommendations */
(function () {
  'use strict';

  const translate = (key, fallback = '') => {
    if (typeof window.t === 'function') {
      const value = window.t(key);
      if (value && value !== key) {
        return value;
      }
    }
    return fallback || key;
  };

  const SPACE_DETAILS = {
    // Business spaces
    hotel: {
      titleKey: 'quiz-option-1-title',
      descriptionKey: 'quiz-option-1-desc',
      tagKeys: ['quiz-option-1-tag-1', 'quiz-option-1-tag-2'],
      defaultMood: 'luxury',
      defaultPalette: 'neutral'
    },
    medical: {
      titleKey: 'quiz-option-2-title',
      descriptionKey: 'quiz-option-2-desc',
      tagKeys: ['quiz-option-2-tag-1', 'quiz-option-2-tag-2'],
      defaultMood: 'calm',
      defaultPalette: 'cool'
    },
    office: {
      titleKey: 'quiz-option-3-title',
      descriptionKey: 'quiz-option-3-desc',
      tagKeys: ['quiz-option-3-tag-1', 'quiz-option-3-tag-2'],
      defaultMood: 'energy',
      defaultPalette: 'warm'
    },
    // Home spaces
    'living-room': {
      titleKey: 'quiz-home-option-1-title',
      descriptionKey: 'quiz-home-option-1-desc',
      tagKeys: ['quiz-home-option-1-tag-1', 'quiz-home-option-1-tag-2'],
      defaultMood: 'balance',
      defaultPalette: 'warm'
    },
    'bedroom': {
      titleKey: 'quiz-home-option-2-title',
      descriptionKey: 'quiz-home-option-2-desc',
      tagKeys: ['quiz-home-option-2-tag-1', 'quiz-home-option-2-tag-2'],
      defaultMood: 'calm',
      defaultPalette: 'cool'
    },
    'study': {
      titleKey: 'quiz-home-option-3-title',
      descriptionKey: 'quiz-home-option-3-desc',
      tagKeys: ['quiz-home-option-3-tag-1', 'quiz-home-option-3-tag-2'],
      defaultMood: 'focus',
      defaultPalette: 'neutral'
    }
  };

  const MOOD_PRESETS = [
    { id: 'any', key: 'quiz-chip-any' },
    { id: 'calm', key: 'mood-calm' },
    { id: 'energy', key: 'mood-energy' },
    { id: 'focus', key: 'mood-focus' },
    { id: 'luxury', key: 'mood-luxury' },
    { id: 'nature', key: 'mood-nature' },
    { id: 'balance', key: 'mood-balance' }
  ];

  const PALETTE_PRESETS = [
    { id: 'any', key: 'quiz-chip-any' },
    { id: 'warm', key: 'palette-warm' },
    { id: 'cool', key: 'palette-cool' },
    { id: 'neutral', key: 'palette-neutral' },
    { id: 'vibrant', key: 'palette-vibrant' }
  ];

  const ARTWORKS = [
    // ========================================
    // HOTEL SPACE - All Combinations
    // ========================================

    // HOTEL + CALM + COOL
    {
      slug: 'hotel-calm-cool-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/sulp2oyw2fibpaamjl9g.webp',
      titleKey: 'Лобі Спокою',
      descriptionKey: 'Прохолодні відтінки для релаксації гостей',
      altKey: 'Hotel calm cool artwork',
      arId: 'hotel-calm-cool-1',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-calm', 'palette-cool']
    },
    {
      slug: 'hotel-calm-cool-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/rpj7xhkpotscqnnlnyya.webp',
      titleKey: 'Блакитна Гармонія',
      descriptionKey: 'Ніжні блакитні тони для spa-зон',
      altKey: 'Hotel calm cool 2 artwork',
      arId: 'hotel-calm-cool-2',
      moods: ['calm', 'nature'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-calm', 'palette-cool', 'mood-nature']
    },

    // HOTEL + CALM + NEUTRAL
    {
      slug: 'hotel-calm-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ygljcsxleructfousvu6.webp',
      titleKey: 'Баланс Гостинності',
      descriptionKey: 'Нейтральна гармонія для reception',
      altKey: 'Hotel calm neutral artwork',
      arId: 'hotel-calm-neutral',
      moods: ['calm', 'balance'],
      palette: 'neutral',
      spaces: ['hotel'],
      badgeKeys: ['mood-calm', 'palette-neutral', 'quiz-option-1-tag-1']
    },

    // HOTEL + CALM + WARM
    {
      slug: 'hotel-calm-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bg1jkup457skyqresjjb.webp',
      titleKey: 'Теплий Прийом',
      descriptionKey: 'М\'які теплі відтінки для затишку',
      altKey: 'Hotel calm warm artwork',
      arId: 'hotel-calm-warm',
      moods: ['calm'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-calm', 'palette-warm']
    },

    // HOTEL + LUXURY + NEUTRAL
    {
      slug: 'hotel-luxury-neutral-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/cjdam66bgapeypc6jbmk.webp',
      titleKey: 'Готельна Елегантність',
      descriptionKey: 'Преміальна композиція для лобі та VIP-зон',
      altKey: 'Hotel luxury neutral artwork',
      arId: 'hotel-luxury-neutral-1',
      moods: ['luxury', 'balance'],
      palette: 'neutral',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-neutral', 'quiz-option-1-tag-1']
    },
    {
      slug: 'hotel-luxury-neutral-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ozjbkvbulpoallgbs7tf.webp',
      titleKey: 'П\'ятизіркова Розкіш',
      descriptionKey: 'Витончена нейтральність для люкс-сегменту',
      altKey: 'Hotel luxury neutral 2 artwork',
      arId: 'hotel-luxury-neutral-2',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },

    // HOTEL + LUXURY + WARM
    {
      slug: 'hotel-luxury-warm-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bophmlcfc59t2gbrojcj.webp',
      titleKey: 'Золотий Горизонт',
      descriptionKey: 'Розкішні золоті акценти для готелів класу люкс',
      altKey: 'Hotel luxury warm artwork',
      arId: 'hotel-luxury-warm-1',
      moods: ['luxury'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-warm', 'quiz-option-1-tag-2']
    },
    {
      slug: 'hotel-luxury-warm-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/uaxdkonmzrno2npnj0lw.webp',
      titleKey: 'Бронзовий Престиж',
      descriptionKey: 'Теплі металеві відтінки преміум-класу',
      altKey: 'Hotel luxury warm 2 artwork',
      arId: 'hotel-luxury-warm-2',
      moods: ['luxury'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-warm']
    },

    // HOTEL + LUXURY + COOL
    {
      slug: 'hotel-luxury-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/kgpsgogd0qbi8ubpq1ve.webp',
      titleKey: 'Срібна Елегантність',
      descriptionKey: 'Прохолодна розкіш для сучасних готелів',
      altKey: 'Hotel luxury cool artwork',
      arId: 'hotel-luxury-cool',
      moods: ['luxury'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-cool']
    },

    // HOTEL + BALANCE + NEUTRAL
    {
      slug: 'hotel-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ous8ji6yspy9jqooyyjy.webp',
      titleKey: 'Гармонія Простору',
      descriptionKey: 'Збалансована нейтральність для всіх зон',
      altKey: 'Hotel balance neutral artwork',
      arId: 'hotel-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['hotel'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },

    // HOTEL + ENERGY + VIBRANT
    {
      slug: 'hotel-energy-vibrant',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tnzr346cisgnqawzrun7.webp',
      titleKey: 'Динамічне Лобі',
      descriptionKey: 'Яскрава енергія для сучасних готелів',
      altKey: 'Hotel energy vibrant artwork',
      arId: 'hotel-energy-vibrant',
      moods: ['energy'],
      palette: 'vibrant',
      spaces: ['hotel'],
      badgeKeys: ['mood-energy', 'palette-vibrant']
    },

    // ========================================
    // MEDICAL SPACE - All Combinations
    // ========================================

    // MEDICAL + CALM + COOL
    {
      slug: 'medical-calm-cool-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/wyjweijtla7vmefwrgyf.webp',
      titleKey: 'Потік Зцілення',
      descriptionKey: 'М\'які прохолодні переливи для релаксації пацієнтів',
      altKey: 'Medical calm cool artwork',
      arId: 'medical-calm-cool-1',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-cool', 'quiz-option-2-tag-1']
    },
    {
      slug: 'medical-calm-cool-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/n1w550wvauam6ldnmvnk.webp',
      titleKey: 'Медитативне Зцілення',
      descriptionKey: 'Ніжні блакитні тони для зон очікування',
      altKey: 'Medical calm cool 2 artwork',
      arId: 'medical-calm-cool-2',
      moods: ['calm', 'nature'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-cool', 'quiz-option-2-tag-2']
    },
    {
      slug: 'medical-calm-cool-3',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjyoe8gclo0rx32tl2vu.webp',
      titleKey: 'Безпечний Простір',
      descriptionKey: 'Прохолодна атмосфера довіри та спокою',
      altKey: 'Medical calm cool 3 artwork',
      arId: 'medical-calm-cool-3',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-cool']
    },

    // MEDICAL + CALM + NEUTRAL
    {
      slug: 'medical-calm-neutral-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vjldxxai3uyhinhgifri.webp',
      titleKey: 'Нейтральний Спокій',
      descriptionKey: 'Збалансована атмосфера для медичних кабінетів',
      altKey: 'Medical calm neutral artwork',
      arId: 'medical-calm-neutral-1',
      moods: ['calm'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-neutral']
    },
    {
      slug: 'medical-calm-neutral-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/dhtjtso6nvc0qnxobvov.webp',
      titleKey: 'Гармонія Здоров\'я',
      descriptionKey: 'Нейтральні відтінки для реабілітації',
      altKey: 'Medical calm neutral 2 artwork',
      arId: 'medical-calm-neutral-2',
      moods: ['calm', 'balance'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-neutral']
    },

    // MEDICAL + CALM + WARM
    {
      slug: 'medical-calm-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/jbi0jjdszt7gc8k26wlr.webp',
      titleKey: 'Турбота і Тепло',
      descriptionKey: 'М\'які теплі тони для педіатричних відділень',
      altKey: 'Medical calm warm artwork',
      arId: 'medical-calm-warm',
      moods: ['calm'],
      palette: 'warm',
      spaces: ['medical'],
      badgeKeys: ['mood-calm', 'palette-warm']
    },

    // MEDICAL + NATURE + COOL
    {
      slug: 'medical-nature-cool-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bgrhzcnztxbn4cco8j0q.webp',
      titleKey: 'Природне Відновлення',
      descriptionKey: 'Зелені відтінки для wellness-центрів',
      altKey: 'Medical nature cool artwork',
      arId: 'medical-nature-cool-1',
      moods: ['nature', 'calm'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-nature', 'palette-cool', 'mood-calm']
    },
    {
      slug: 'medical-nature-cool-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/ymu2dpujrvowhrlnbbzf.webp',
      titleKey: 'Лікувальна Природа',
      descriptionKey: 'Природні мотиви для психотерапії',
      altKey: 'Medical nature cool 2 artwork',
      arId: 'medical-nature-cool-2',
      moods: ['nature'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },

    // MEDICAL + FOCUS + NEUTRAL
    {
      slug: 'medical-focus-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tdcuqjraki8tfaogokcj.webp',
      titleKey: 'Медична Концентрація',
      descriptionKey: 'Чіткість для операційних та лабораторій',
      altKey: 'Medical focus neutral artwork',
      arId: 'medical-focus-neutral',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },

    // ========================================
    // OFFICE SPACE - All Combinations
    // ========================================

    // OFFICE + ENERGY + VIBRANT
    {
      slug: 'office-energy-vibrant-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/t5bknydwmptzvchlzg0x.webp',
      titleKey: 'Креативна Енергія',
      descriptionKey: 'Динамічні яскраві кольори для творчих офісів',
      altKey: 'Office energy vibrant artwork',
      arId: 'office-energy-vibrant-1',
      moods: ['energy'],
      palette: 'vibrant',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-vibrant', 'quiz-option-3-tag-1']
    },
    {
      slug: 'office-energy-vibrant-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/blb3ggaxi4cqh8rhbvw7.webp',
      titleKey: 'Іскра Інновацій',
      descriptionKey: 'Яскраві акценти для брейнштормінгу',
      altKey: 'Office energy vibrant 2 artwork',
      arId: 'office-energy-vibrant-2',
      moods: ['energy'],
      palette: 'vibrant',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-vibrant']
    },

    // OFFICE + ENERGY + WARM
    {
      slug: 'office-energy-warm-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/hgbwalcmihucndkwkwmp.webp',
      titleKey: 'Динаміка Успіху',
      descriptionKey: 'Теплі енергійні відтінки для активних команд',
      altKey: 'Office energy warm artwork',
      arId: 'office-energy-warm-1',
      moods: ['energy'],
      palette: 'warm',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-warm', 'quiz-option-3-tag-2']
    },
    {
      slug: 'office-energy-warm-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/s8qogt2nk0l2cj9wo0jg.webp',
      titleKey: 'Потік Продуктивності',
      descriptionKey: 'Теплі динамічні мазки для робочих зон',
      altKey: 'Office energy warm 2 artwork',
      arId: 'office-energy-warm-2',
      moods: ['energy', 'focus'],
      palette: 'warm',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-warm']
    },

    // OFFICE + FOCUS + NEUTRAL
    {
      slug: 'office-focus-neutral-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/gd7rrqanoxtdv8bxl279.webp',
      titleKey: 'Професійна Концентрація',
      descriptionKey: 'Нейтральна чіткість для переговорних',
      altKey: 'Office focus neutral artwork',
      arId: 'office-focus-neutral-1',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },
    {
      slug: 'office-focus-neutral-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/blvif4pbzuquujvvywnk.webp',
      titleKey: 'Офісна Глибина',
      descriptionKey: 'Стримана елегантність для керівництва',
      altKey: 'Office focus neutral 2 artwork',
      arId: 'office-focus-neutral-2',
      moods: ['focus', 'luxury'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },

    // OFFICE + FOCUS + WARM
    {
      slug: 'office-focus-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/vvgl47pos8etxalpoxo8.webp',
      titleKey: 'Тепла Концентрація',
      descriptionKey: 'Фокус з відчуттям затишку для коворкінгів',
      altKey: 'Office focus warm artwork',
      arId: 'office-focus-warm',
      moods: ['focus'],
      palette: 'warm',
      spaces: ['office'],
      badgeKeys: ['mood-focus', 'palette-warm']
    },

    // OFFICE + FOCUS + COOL
    {
      slug: 'office-focus-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/spw3eqlbijdqi4hbfcnx.webp',
      titleKey: 'Технологічний Фокус',
      descriptionKey: 'Прохолодна концентрація для IT-компаній',
      altKey: 'Office focus cool artwork',
      arId: 'office-focus-cool',
      moods: ['focus'],
      palette: 'cool',
      spaces: ['office'],
      badgeKeys: ['mood-focus', 'palette-cool']
    },

    // OFFICE + ENERGY + COOL
    {
      slug: 'office-energy-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/oqbo7w0mxiregs2vvxcn.webp',
      titleKey: 'Свіжа Енергія',
      descriptionKey: 'Прохолодна динаміка для стартапів',
      altKey: 'Office energy cool artwork',
      arId: 'office-energy-cool',
      moods: ['energy'],
      palette: 'cool',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-cool']
    },

    // OFFICE + CALM + NEUTRAL
    {
      slug: 'office-calm-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/goury05ttnng7amufhjy.webp',
      titleKey: 'Збалансований Офіс',
      descriptionKey: 'Спокійна продуктивність для тихих зон',
      altKey: 'Office calm neutral artwork',
      arId: 'office-calm-neutral',
      moods: ['calm'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-calm', 'palette-neutral']
    },

    // OFFICE + LUXURY + NEUTRAL
    {
      slug: 'office-luxury-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tn9rnxkjfmxl4dksxwyt.webp',
      titleKey: 'Корпоративний Престиж',
      descriptionKey: 'Розкішна нейтральність для executive офісів',
      altKey: 'Office luxury neutral artwork',
      arId: 'office-luxury-neutral',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },

    // ========================================
    // LIVING ROOM - All Combinations
    // ========================================

    // LIVING + BALANCE + WARM
    {
      slug: 'living-balance-warm-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/sa8lp78s4uwfysodqj3t.webp',
      titleKey: 'Сімейна Гармонія',
      descriptionKey: 'Тепла збалансована атмосфера для родини',
      altKey: 'Living balance warm artwork',
      arId: 'living-balance-warm-1',
      moods: ['balance'],
      palette: 'warm',
      spaces: ['living-room'],
      badgeKeys: ['mood-balance', 'palette-warm', 'quiz-home-option-1-tag-1']
    },
    {
      slug: 'living-balance-warm-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/sxpva2nwwopdfuykkg83.webp',
      titleKey: 'Затишна Вітальня',
      descriptionKey: 'М\'які теплі відтінки для сімейних зустрічей',
      altKey: 'Living balance warm 2 artwork',
      arId: 'living-balance-warm-2',
      moods: ['balance', 'calm'],
      palette: 'warm',
      spaces: ['living-room'],
      badgeKeys: ['mood-balance', 'palette-warm', 'quiz-home-option-1-tag-2']
    },

    // LIVING + BALANCE + NEUTRAL
    {
      slug: 'living-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/egoyllyyytpaxho0uvov.webp',
      titleKey: 'Нейтральна Гармонія',
      descriptionKey: 'Універсальність для будь-якого інтер\'єру',
      altKey: 'Living balance neutral artwork',
      arId: 'living-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['living-room'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },

    // LIVING + CALM + WARM
    {
      slug: 'living-calm-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tvvr9qi4vl27yqc2iw4y.webp',
      titleKey: 'Тепло Вечора',
      descriptionKey: 'Спокійні теплі тони для релаксу',
      altKey: 'Living calm warm artwork',
      arId: 'living-calm-warm',
      moods: ['calm'],
      palette: 'warm',
      spaces: ['living-room'],
      badgeKeys: ['mood-calm', 'palette-warm']
    },

    // LIVING + CALM + COOL
    {
      slug: 'living-calm-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/k1exyxun7e1dvkatzr97.webp',
      titleKey: 'Прохолодний Спокій',
      descriptionKey: 'Свіжі відтінки для літнього комфорту',
      altKey: 'Living calm cool artwork',
      arId: 'living-calm-cool',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['living-room'],
      badgeKeys: ['mood-calm', 'palette-cool']
    },

    // LIVING + ENERGY + VIBRANT
    {
      slug: 'living-energy-vibrant',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/pjyyzmxl5qkog3fqbdsl.webp',
      titleKey: 'Динаміка Життя',
      descriptionKey: 'Яскрава енергія для активної родини',
      altKey: 'Living energy vibrant artwork',
      arId: 'living-energy-vibrant',
      moods: ['energy'],
      palette: 'vibrant',
      spaces: ['living-room'],
      badgeKeys: ['mood-energy', 'palette-vibrant']
    },

    // ========================================
    // BEDROOM - All Combinations
    // ========================================

    // BEDROOM + CALM + COOL
    {
      slug: 'bedroom-calm-cool-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/zexgajiullzotnlsadie.webp',
      titleKey: 'Спокій Сну',
      descriptionKey: 'Прохолодні відтінки для якісного відпочинку',
      altKey: 'Bedroom calm cool artwork',
      arId: 'bedroom-calm-cool-1',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['bedroom'],
      badgeKeys: ['mood-calm', 'palette-cool', 'quiz-home-option-2-tag-1']
    },
    {
      slug: 'bedroom-calm-cool-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/yx9odf0ylt4d1kwbsu2i.webp',
      titleKey: 'Мрії у Блакиті',
      descriptionKey: 'М\'які блакитні тони для глибокого сну',
      altKey: 'Bedroom calm cool 2 artwork',
      arId: 'bedroom-calm-cool-2',
      moods: ['calm', 'nature'],
      palette: 'cool',
      spaces: ['bedroom'],
      badgeKeys: ['mood-calm', 'palette-cool', 'quiz-home-option-2-tag-2']
    },

    // BEDROOM + CALM + NEUTRAL
    {
      slug: 'bedroom-calm-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/oiuhcnj1yxm10lylzkxc.webp',
      titleKey: 'Нейтральна Релаксація',
      descriptionKey: 'Спокійна нейтральність для спальні',
      altKey: 'Bedroom calm neutral artwork',
      arId: 'bedroom-calm-neutral',
      moods: ['calm'],
      palette: 'neutral',
      spaces: ['bedroom'],
      badgeKeys: ['mood-calm', 'palette-neutral']
    },

    // BEDROOM + CALM + WARM
    {
      slug: 'bedroom-calm-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/kgpsgogd0qbi8ubpq1ve.webp',
      titleKey: 'Теплі Сни',
      descriptionKey: 'М\'які теплі відтінки для затишку',
      altKey: 'Bedroom calm warm artwork',
      arId: 'bedroom-calm-warm',
      moods: ['calm'],
      palette: 'warm',
      spaces: ['bedroom'],
      badgeKeys: ['mood-calm', 'palette-warm']
    },

    // BEDROOM + NATURE + COOL
    {
      slug: 'bedroom-nature-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bgg3zbi1tya3ulkhambv.webp',
      titleKey: 'Природний Відпочинок',
      descriptionKey: 'Зелені відтінки для відновлення сил',
      altKey: 'Bedroom nature cool artwork',
      arId: 'bedroom-nature-cool',
      moods: ['nature', 'calm'],
      palette: 'cool',
      spaces: ['bedroom'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },

    // ========================================
    // STUDY - All Combinations
    // ========================================

    // STUDY + FOCUS + NEUTRAL
    {
      slug: 'study-focus-neutral-1',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/9_uwegmy.webp',
      titleKey: 'Концентрація Розуму',
      descriptionKey: 'Нейтральний фокус для домашнього офісу',
      altKey: 'Study focus neutral artwork',
      arId: 'study-focus-neutral-1',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-focus', 'palette-neutral', 'quiz-home-option-3-tag-1']
    },
    {
      slug: 'study-focus-neutral-2',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/26-1_lmigw1.webp',
      titleKey: 'Натхнення Роботи',
      descriptionKey: 'Збалансований фокус для продуктивності',
      altKey: 'Study focus neutral 2 artwork',
      arId: 'study-focus-neutral-2',
      moods: ['focus', 'energy'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-focus', 'palette-neutral', 'quiz-home-option-3-tag-2']
    },

    // STUDY + FOCUS + COOL
    {
      slug: 'study-focus-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/15_axedbv.webp',
      titleKey: 'Технологічна Ясність',
      descriptionKey: 'Прохолодний фокус для аналітичної роботи',
      altKey: 'Study focus cool artwork',
      arId: 'study-focus-cool',
      moods: ['focus'],
      palette: 'cool',
      spaces: ['study'],
      badgeKeys: ['mood-focus', 'palette-cool']
    },

    // STUDY + FOCUS + WARM
    {
      slug: 'study-focus-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/22_peebeg.webp',
      titleKey: 'Тепла Продуктивність',
      descriptionKey: 'Затишна концентрація для творчої роботи',
      altKey: 'Study focus warm artwork',
      arId: 'study-focus-warm',
      moods: ['focus'],
      palette: 'warm',
      spaces: ['study'],
      badgeKeys: ['mood-focus', 'palette-warm']
    },

    // STUDY + CALM + NEUTRAL
    {
      slug: 'study-calm-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/5_dzvxu4.webp',
      titleKey: 'Спокійна Робота',
      descriptionKey: 'Баланс між фокусом та релаксом',
      altKey: 'Study calm neutral artwork',
      arId: 'study-calm-neutral',
      moods: ['calm', 'focus'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-calm', 'palette-neutral']
    },

    // STUDY + ENERGY + VIBRANT
    {
      slug: 'study-energy-vibrant',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/7_vbzzyj.webp',
      titleKey: 'Креативний Вибух',
      descriptionKey: 'Яскрава енергія для мозкових штормів',
      altKey: 'Study energy vibrant artwork',
      arId: 'study-energy-vibrant',
      moods: ['energy'],
      palette: 'vibrant',
      spaces: ['study'],
      badgeKeys: ['mood-energy', 'palette-vibrant']
    },

    // ========================================
    // ДОДАТКОВІ КОМБІНАЦІЇ ДЛЯ ПОВНОГО ПОКРИТТЯ
    // ========================================

    // HOTEL + NATURE + COOL
    {
      slug: 'hotel-nature-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/oiuhcnj1yxm10lylzkxc.webp',
      titleKey: 'Природний Готель',
      descriptionKey: 'Зелені відтінки для еко-готелів',
      altKey: 'Hotel nature cool artwork',
      arId: 'hotel-nature-cool',
      moods: ['nature'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },
    // HOTEL + NATURE + WARM
    {
      slug: 'hotel-nature-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/zexgajiullzotnlsadie.webp',
      titleKey: 'Органічна Гостинність',
      descriptionKey: 'Природні теплі тони для wellness-готелів',
      altKey: 'Hotel nature warm artwork',
      arId: 'hotel-nature-warm',
      moods: ['nature'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-nature', 'palette-warm']
    },
    // HOTEL + FOCUS + NEUTRAL
    {
      slug: 'hotel-focus-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/yx9odf0ylt4d1kwbsu2i.webp',
      titleKey: 'Бізнес-Готель',
      descriptionKey: 'Фокус для конференц-залів',
      altKey: 'Hotel focus neutral artwork',
      arId: 'hotel-focus-neutral',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['hotel'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },
    // HOTEL + BALANCE + WARM
    {
      slug: 'hotel-balance-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/25_my6afc.webp',
      titleKey: 'Теплий Баланс',
      descriptionKey: 'Гармонія для ресторанів',
      altKey: 'Hotel balance warm artwork',
      arId: 'hotel-balance-warm',
      moods: ['balance'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-balance', 'palette-warm']
    },
    // HOTEL + BALANCE + COOL
    {
      slug: 'hotel-balance-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/4_oqebbp.webp',
      titleKey: 'Прохолодний Баланс',
      descriptionKey: 'Свіжість для літніх терас',
      altKey: 'Hotel balance cool artwork',
      arId: 'hotel-balance-cool',
      moods: ['balance'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-balance', 'palette-cool']
    },
    // HOTEL + ENERGY + WARM
    {
      slug: 'hotel-energy-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/1_tnz1om.webp',
      titleKey: 'Динамічний Лаунж',
      descriptionKey: 'Енергія для барів і лаунжів',
      altKey: 'Hotel energy warm artwork',
      arId: 'hotel-energy-warm',
      moods: ['energy'],
      palette: 'warm',
      spaces: ['hotel'],
      badgeKeys: ['mood-energy', 'palette-warm']
    },
    // HOTEL + ENERGY + COOL
    {
      slug: 'hotel-energy-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/2_pqhm0o.webp',
      titleKey: 'Свіжа Динаміка',
      descriptionKey: 'Прохолодна енергія для спорт-готелів',
      altKey: 'Hotel energy cool artwork',
      arId: 'hotel-energy-cool',
      moods: ['energy'],
      palette: 'cool',
      spaces: ['hotel'],
      badgeKeys: ['mood-energy', 'palette-cool']
    },
    // HOTEL + LUXURY + VIBRANT
    {
      slug: 'hotel-luxury-vibrant',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/3_srsm8u.webp',
      titleKey: 'Яскрава Розкіш',
      descriptionKey: 'Вибухова елегантність для бутік-готелів',
      altKey: 'Hotel luxury vibrant artwork',
      arId: 'hotel-luxury-vibrant',
      moods: ['luxury'],
      palette: 'vibrant',
      spaces: ['hotel'],
      badgeKeys: ['mood-luxury', 'palette-vibrant']
    },

    // MEDICAL + NATURE + NEUTRAL
    {
      slug: 'medical-nature-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/4_oqebbp.webp',
      titleKey: 'Природна Терапія',
      descriptionKey: 'Нейтральна природність для клінік',
      altKey: 'Medical nature neutral artwork',
      arId: 'medical-nature-neutral',
      moods: ['nature'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-nature', 'palette-neutral']
    },
    // MEDICAL + NATURE + WARM
    {
      slug: 'medical-nature-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/5_dzvxu4.webp',
      titleKey: 'Тепла Природа',
      descriptionKey: 'Теплі природні відтінки для реабілітації',
      altKey: 'Medical nature warm artwork',
      arId: 'medical-nature-warm',
      moods: ['nature'],
      palette: 'warm',
      spaces: ['medical'],
      badgeKeys: ['mood-nature', 'palette-warm']
    },
    // MEDICAL + BALANCE + COOL
    {
      slug: 'medical-balance-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/6_bh5ewb.webp',
      titleKey: 'Збалансоване Лікування',
      descriptionKey: 'Прохолодна гармонія для діагностики',
      altKey: 'Medical balance cool artwork',
      arId: 'medical-balance-cool',
      moods: ['balance'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-balance', 'palette-cool']
    },
    // MEDICAL + BALANCE + NEUTRAL
    {
      slug: 'medical-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/7_vbzzyj.webp',
      titleKey: 'Нейтральна Медицина',
      descriptionKey: 'Баланс для приватних палат',
      altKey: 'Medical balance neutral artwork',
      arId: 'medical-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },
    // MEDICAL + ENERGY + COOL
    {
      slug: 'medical-energy-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/8_x6n48z.webp',
      titleKey: 'Бадьорість Лікування',
      descriptionKey: 'Свіжа енергія для фізіотерапії',
      altKey: 'Medical energy cool artwork',
      arId: 'medical-energy-cool',
      moods: ['energy'],
      palette: 'cool',
      spaces: ['medical'],
      badgeKeys: ['mood-energy', 'palette-cool']
    },
    // MEDICAL + LUXURY + NEUTRAL
    {
      slug: 'medical-luxury-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/9_uwegmy.webp',
      titleKey: 'Преміум Клініка',
      descriptionKey: 'Розкіш приватної медицини',
      altKey: 'Medical luxury neutral artwork',
      arId: 'medical-luxury-neutral',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['medical'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },

    // OFFICE + BALANCE + NEUTRAL
    {
      slug: 'office-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/10_hbq9lq.webp',
      titleKey: 'Збалансований Простір',
      descriptionKey: 'Гармонія для open space',
      altKey: 'Office balance neutral artwork',
      arId: 'office-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },
    // OFFICE + BALANCE + WARM
    {
      slug: 'office-balance-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/11_hhphey.webp',
      titleKey: 'Теплий Баланс Офісу',
      descriptionKey: 'Затишна продуктивність',
      altKey: 'Office balance warm artwork',
      arId: 'office-balance-warm',
      moods: ['balance'],
      palette: 'warm',
      spaces: ['office'],
      badgeKeys: ['mood-balance', 'palette-warm']
    },
    // OFFICE + NATURE + COOL
    {
      slug: 'office-nature-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/12_zp7xoe.webp',
      titleKey: 'Еко-Офіс',
      descriptionKey: 'Зелені рішення для стійкого бізнесу',
      altKey: 'Office nature cool artwork',
      arId: 'office-nature-cool',
      moods: ['nature'],
      palette: 'cool',
      spaces: ['office'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },
    // OFFICE + NATURE + NEUTRAL
    {
      slug: 'office-nature-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/13_yqg97v.webp',
      titleKey: 'Природний Офіс',
      descriptionKey: 'Органічні мотиви для wellness-офісу',
      altKey: 'Office nature neutral artwork',
      arId: 'office-nature-neutral',
      moods: ['nature'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-nature', 'palette-neutral']
    },
    // OFFICE + CALM + COOL
    {
      slug: 'office-calm-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/14_p5pmkb.webp',
      titleKey: 'Тиха Зона',
      descriptionKey: 'Спокій для зон відпочинку',
      altKey: 'Office calm cool artwork',
      arId: 'office-calm-cool',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['office'],
      badgeKeys: ['mood-calm', 'palette-cool']
    },
    // OFFICE + ENERGY + NEUTRAL
    {
      slug: 'office-energy-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/15_axedbv.webp',
      titleKey: 'Нейтральна Енергія',
      descriptionKey: 'Стримана динаміка для sales-відділу',
      altKey: 'Office energy neutral artwork',
      arId: 'office-energy-neutral',
      moods: ['energy'],
      palette: 'neutral',
      spaces: ['office'],
      badgeKeys: ['mood-energy', 'palette-neutral']
    },
    // OFFICE + LUXURY + WARM
    {
      slug: 'office-luxury-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/16_xtqzzi.webp',
      titleKey: 'Престижний Кабінет',
      descriptionKey: 'Теплий престиж для керівництва',
      altKey: 'Office luxury warm artwork',
      arId: 'office-luxury-warm',
      moods: ['luxury'],
      palette: 'warm',
      spaces: ['office'],
      badgeKeys: ['mood-luxury', 'palette-warm']
    },
    // OFFICE + LUXURY + COOL
    {
      slug: 'office-luxury-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/17_jjzfzp.webp',
      titleKey: 'Прохолодна Розкіш',
      descriptionKey: 'Сучасний престиж для tech-компаній',
      altKey: 'Office luxury cool artwork',
      arId: 'office-luxury-cool',
      moods: ['luxury'],
      palette: 'cool',
      spaces: ['office'],
      badgeKeys: ['mood-luxury', 'palette-cool']
    },
    // OFFICE + FOCUS + VIBRANT
    {
      slug: 'office-focus-vibrant',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/18_wfgfwg.webp',
      titleKey: 'Яскравий Фокус',
      descriptionKey: 'Концентрація з яскравими акцентами',
      altKey: 'Office focus vibrant artwork',
      arId: 'office-focus-vibrant',
      moods: ['focus'],
      palette: 'vibrant',
      spaces: ['office'],
      badgeKeys: ['mood-focus', 'palette-vibrant']
    },

    // LIVING ROOM - додаткові
    // LIVING + NATURE + COOL
    {
      slug: 'living-nature-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/19_k2a1lk.webp',
      titleKey: 'Природна Вітальня',
      descriptionKey: 'Зелений затишок для родини',
      altKey: 'Living nature cool artwork',
      arId: 'living-nature-cool',
      moods: ['nature'],
      palette: 'cool',
      spaces: ['living-room'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },
    // LIVING + NATURE + WARM
    {
      slug: 'living-nature-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/20_ckqjwd.webp',
      titleKey: 'Органічне Тепло',
      descriptionKey: 'Природні теплі відтінки для дому',
      altKey: 'Living nature warm artwork',
      arId: 'living-nature-warm',
      moods: ['nature'],
      palette: 'warm',
      spaces: ['living-room'],
      badgeKeys: ['mood-nature', 'palette-warm']
    },
    // LIVING + FOCUS + NEUTRAL
    {
      slug: 'living-focus-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/21_hqo7sn.webp',
      titleKey: 'Творча Вітальня',
      descriptionKey: 'Простір для хобі та творчості',
      altKey: 'Living focus neutral artwork',
      arId: 'living-focus-neutral',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['living-room'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },
    // LIVING + LUXURY + NEUTRAL
    {
      slug: 'living-luxury-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/22_peebeg.webp',
      titleKey: 'Розкішна Вітальня',
      descriptionKey: 'Преміум для представницьких інтер\'єрів',
      altKey: 'Living luxury neutral artwork',
      arId: 'living-luxury-neutral',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['living-room'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },
    // LIVING + ENERGY + WARM
    {
      slug: 'living-energy-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/23_pqhm0o.webp',
      titleKey: 'Активна Родина',
      descriptionKey: 'Тепла енергія для дітей та дорослих',
      altKey: 'Living energy warm artwork',
      arId: 'living-energy-warm',
      moods: ['energy'],
      palette: 'warm',
      spaces: ['living-room'],
      badgeKeys: ['mood-energy', 'palette-warm']
    },
    // LIVING + BALANCE + COOL
    {
      slug: 'living-balance-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/24_vzkhhg.webp',
      titleKey: 'Свіжий Баланс',
      descriptionKey: 'Прохолодна гармонія для вітальні',
      altKey: 'Living balance cool artwork',
      arId: 'living-balance-cool',
      moods: ['balance'],
      palette: 'cool',
      spaces: ['living-room'],
      badgeKeys: ['mood-balance', 'palette-cool']
    },

    // BEDROOM - додаткові
    // BEDROOM + NATURE + NEUTRAL
    {
      slug: 'bedroom-nature-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/25_my6afc.webp',
      titleKey: 'Природний Сон',
      descriptionKey: 'Органічні відтінки для спокійного сну',
      altKey: 'Bedroom nature neutral artwork',
      arId: 'bedroom-nature-neutral',
      moods: ['nature'],
      palette: 'neutral',
      spaces: ['bedroom'],
      badgeKeys: ['mood-nature', 'palette-neutral']
    },
    // BEDROOM + NATURE + WARM
    {
      slug: 'bedroom-nature-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/26-1_lmigw1.webp',
      titleKey: 'Теплі Сновидіння',
      descriptionKey: 'Природне тепло для затишку',
      altKey: 'Bedroom nature warm artwork',
      arId: 'bedroom-nature-warm',
      moods: ['nature'],
      palette: 'warm',
      spaces: ['bedroom'],
      badgeKeys: ['mood-nature', 'palette-warm']
    },
    // BEDROOM + BALANCE + COOL
    {
      slug: 'bedroom-balance-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/26_f3vr4n.webp',
      titleKey: 'Збалансований Відпочинок',
      descriptionKey: 'Гармонія для глибокого сну',
      altKey: 'Bedroom balance cool artwork',
      arId: 'bedroom-balance-cool',
      moods: ['balance'],
      palette: 'cool',
      spaces: ['bedroom'],
      badgeKeys: ['mood-balance', 'palette-cool']
    },
    // BEDROOM + BALANCE + NEUTRAL
    {
      slug: 'bedroom-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/27_ihrddq.webp',
      titleKey: 'Нейтральна Гармонія Сну',
      descriptionKey: 'Універсальний спокій',
      altKey: 'Bedroom balance neutral artwork',
      arId: 'bedroom-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['bedroom'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },
    // BEDROOM + LUXURY + NEUTRAL
    {
      slug: 'bedroom-luxury-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/28_tlnbpq.webp',
      titleKey: 'Розкішна Спальня',
      descriptionKey: 'Преміум відпочинок',
      altKey: 'Bedroom luxury neutral artwork',
      arId: 'bedroom-luxury-neutral',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['bedroom'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },
    // BEDROOM + FOCUS + NEUTRAL
    {
      slug: 'bedroom-focus-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/29_eqasmv.webp',
      titleKey: 'Медитативна Спальня',
      descriptionKey: 'Фокус для практик перед сном',
      altKey: 'Bedroom focus neutral artwork',
      arId: 'bedroom-focus-neutral',
      moods: ['focus'],
      palette: 'neutral',
      spaces: ['bedroom'],
      badgeKeys: ['mood-focus', 'palette-neutral']
    },

    // STUDY - додаткові
    // STUDY + BALANCE + NEUTRAL
    {
      slug: 'study-balance-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/30_y8bntj.webp',
      titleKey: 'Збалансований Кабінет',
      descriptionKey: 'Гармонія праці та відпочинку',
      altKey: 'Study balance neutral artwork',
      arId: 'study-balance-neutral',
      moods: ['balance'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-balance', 'palette-neutral']
    },
    // STUDY + NATURE + COOL
    {
      slug: 'study-nature-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bophmlcfc59t2gbrojcj.webp',
      titleKey: 'Природний Офіс',
      descriptionKey: 'Зелені відтінки для натхнення',
      altKey: 'Study nature cool artwork',
      arId: 'study-nature-cool',
      moods: ['nature'],
      palette: 'cool',
      spaces: ['study'],
      badgeKeys: ['mood-nature', 'palette-cool']
    },
    // STUDY + NATURE + NEUTRAL
    {
      slug: 'study-nature-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/cjdam66bgapeypc6jbmk.webp',
      titleKey: 'Органічна Робота',
      descriptionKey: 'Природність для творчості',
      altKey: 'Study nature neutral artwork',
      arId: 'study-nature-neutral',
      moods: ['nature'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-nature', 'palette-neutral']
    },
    // STUDY + LUXURY + NEUTRAL
    {
      slug: 'study-luxury-neutral',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/goury05ttnng7amufhjy.webp',
      titleKey: 'Престижний Кабінет',
      descriptionKey: 'Розкіш домашнього офісу',
      altKey: 'Study luxury neutral artwork',
      arId: 'study-luxury-neutral',
      moods: ['luxury'],
      palette: 'neutral',
      spaces: ['study'],
      badgeKeys: ['mood-luxury', 'palette-neutral']
    },
    // STUDY + ENERGY + WARM
    {
      slug: 'study-energy-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/oqbo7w0mxiregs2vvxcn.webp',
      titleKey: 'Енергія Творчості',
      descriptionKey: 'Теплі тони для продуктивності',
      altKey: 'Study energy warm artwork',
      arId: 'study-energy-warm',
      moods: ['energy'],
      palette: 'warm',
      spaces: ['study'],
      badgeKeys: ['mood-energy', 'palette-warm']
    },
    // STUDY + ENERGY + COOL
    {
      slug: 'study-energy-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/spw3eqlbijdqi4hbfcnx.webp',
      titleKey: 'Свіжа Продуктивність',
      descriptionKey: 'Прохолодна енергія для роботи',
      altKey: 'Study energy cool artwork',
      arId: 'study-energy-cool',
      moods: ['energy'],
      palette: 'cool',
      spaces: ['study'],
      badgeKeys: ['mood-energy', 'palette-cool']
    },
    // STUDY + CALM + COOL
    {
      slug: 'study-calm-cool',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/tn9rnxkjfmxl4dksxwyt.webp',
      titleKey: 'Спокійна Робота',
      descriptionKey: 'Прохолодний спокій для концентрації',
      altKey: 'Study calm cool artwork',
      arId: 'study-calm-cool',
      moods: ['calm'],
      palette: 'cool',
      spaces: ['study'],
      badgeKeys: ['mood-calm', 'palette-cool']
    },
    // STUDY + CALM + WARM
    {
      slug: 'study-calm-warm',
      image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/wyjweijtla7vmefwrgyf.webp',
      titleKey: 'Затишний Кабінет',
      descriptionKey: 'Теплий спокій для домашньої роботи',
      altKey: 'Study calm warm artwork',
      arId: 'study-calm-warm',
      moods: ['calm'],
      palette: 'warm',
      spaces: ['study'],
      badgeKeys: ['mood-calm', 'palette-warm']
    },

  ];

  class AtmosphereGallery {
    constructor() {
      this.container = document.getElementById('quiz-container');
      this.panel = document.getElementById('quiz-results-panel');
      this.options = [];
      this.state = {
        space: null,
        mood: 'any',
        palette: 'any'
      };
      this.nodes = {};

      this.handleLanguageChange = this.handleLanguageChange.bind(this);

      this.init();
    }

    init() {
      if (!this.container || !this.panel) {
        return;
      }

      this.options = Array.from(this.container.querySelectorAll('.quiz-option'));
      if (!this.options.length) {
        return;
      }

      this.buildPanel();
      this.bindOptionEvents();
      this.bindPanelEvents();

      const defaultSpace = this.options[0].dataset.space || 'hotel';
      this.onSpaceSelect(defaultSpace, this.options[0], { scroll: false, preserveFilters: false });

      window.addEventListener('language:change', this.handleLanguageChange);
    }

    destroy() {
      window.removeEventListener('language:change', this.handleLanguageChange);
    }

    buildPanel() {
      this.panel.innerHTML = `
        <div class="quiz-results-header">
          <h3 class="quiz-results-title" data-role="title"></h3>
          <p class="quiz-results-description" data-role="description"></p>
        </div>
        <div class="quiz-refinements">
          <div class="quiz-refinement-group">
            <span class="quiz-refinement-label" data-key="quiz-refine-mood"></span>
            <div class="quiz-chips" data-role="mood-chips"></div>
          </div>
          <div class="quiz-refinement-group">
            <span class="quiz-refinement-label" data-key="quiz-refine-palette"></span>
            <div class="quiz-chips" data-role="palette-chips"></div>
          </div>
        </div>
        <div class="quiz-results-meta" data-role="meta"></div>
        <div class="quiz-recommendations" data-role="recommendations"></div>
        <div class="quiz-empty" data-role="empty" hidden>
          <p data-key="quiz-recommendations-empty"></p>
          <p data-key="quiz-recommendations-empty-hint"></p>
        </div>
        <div class="quiz-results-actions">
          <button class="btn btn-primary" data-role="view-all">
            <i class="fas fa-palette"></i>
            <span data-key="quiz-action-view-all"></span>
          </button>
          <button class="btn btn-outline" data-role="reset">
            <i class="fas fa-sync"></i>
            <span data-key="quiz-action-reset"></span>
          </button>
        </div>
      `;

      this.nodes = {
        title: this.panel.querySelector('[data-role="title"]'),
        description: this.panel.querySelector('[data-role="description"]'),
        meta: this.panel.querySelector('[data-role="meta"]'),
        recommendations: this.panel.querySelector('[data-role="recommendations"]'),
        empty: this.panel.querySelector('[data-role="empty"]'),
        viewAll: this.panel.querySelector('[data-role="view-all"]'),
        reset: this.panel.querySelector('[data-role="reset"]'),
        moodChipsContainer: this.panel.querySelector('[data-role="mood-chips"]'),
        paletteChipsContainer: this.panel.querySelector('[data-role="palette-chips"]')
      };

      this.buildChips(this.nodes.moodChipsContainer, MOOD_PRESETS, 'mood');
      this.buildChips(this.nodes.paletteChipsContainer, PALETTE_PRESETS, 'palette');

      if (typeof window.translateTree === 'function') {
        window.translateTree(this.panel);
      } else if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }
    }

    buildChips(container, presets, type) {
      if (!container) return;
      container.innerHTML = '';

      presets.forEach((preset) => {
        const chip = document.createElement('button');
        chip.className = 'quiz-chip';
        chip.type = 'button';
        chip.dataset.value = preset.id;
        chip.dataset.group = type;
        chip.textContent = translate(preset.key, preset.id);
        chip.addEventListener('click', () => this.onChipSelect(type, preset.id));
        container.appendChild(chip);
      });
    }

    bindOptionEvents() {
      this.options.forEach((option) => {
        option.addEventListener('click', () => {
          const spaceId = option.dataset.space || 'hotel';
          this.onSpaceSelect(spaceId, option);
        });
      });
    }

    bindPanelEvents() {
      this.nodes.viewAll?.addEventListener('click', () => {
        const target = document.getElementById('collection');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.hash = '#collection';
        }
      });

      this.nodes.reset?.addEventListener('click', () => {
        const activeOption = this.options.find((opt) => opt.classList.contains('selected')) || this.options[0];
        const spaceId = activeOption?.dataset.space || 'hotel';
        this.onSpaceSelect(spaceId, activeOption, { preserveFilters: false });
      });
    }

    onSpaceSelect(spaceId, optionElement, { scroll = true, preserveFilters = false } = {}) {
      const spaceConfig = SPACE_DETAILS[spaceId] || SPACE_DETAILS.hotel;
      const previousSpace = this.state.space;
      this.state.space = spaceId;

      if (!preserveFilters || previousSpace !== spaceId) {
        this.state.mood = spaceConfig.defaultMood || 'any';
        this.state.palette = spaceConfig.defaultPalette || 'any';
      }

      this.options.forEach((option) => {
        const isActive = option === optionElement;
        option.classList.toggle('selected', isActive);
        option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      this.updateChips();
      this.renderResults();

      if (scroll) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        this.panel.scrollIntoView({ behavior, block: 'start' });
      }
    }

    onChipSelect(type, value) {
      if (type === 'mood') {
        this.state.mood = value;
      } else if (type === 'palette') {
        this.state.palette = value;
      }
      this.updateChips();
      this.renderResults();
    }

    updateChips() {
      const moodValue = this.state.mood;
      const paletteValue = this.state.palette;

      this.updateChipGroup(this.nodes.moodChipsContainer, moodValue);
      this.updateChipGroup(this.nodes.paletteChipsContainer, paletteValue);
    }

    updateChipGroup(container, activeValue) {
      if (!container) return;
      Array.from(container.children).forEach((chip) => {
        const isActive = chip.dataset.value === activeValue;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    renderResults() {
      const space = SPACE_DETAILS[this.state.space] || SPACE_DETAILS.hotel;
      const titleBase = translate('quiz-results-heading', 'Рекомендовані картини');
      const spaceName = translate(space.titleKey, this.state.space);

      if (this.nodes.title) {
        this.nodes.title.textContent = `${titleBase} · ${spaceName}`;
      }

      if (this.nodes.description) {
        this.nodes.description.textContent = translate(space.descriptionKey, '');
      }

      this.renderMeta();
      this.renderRecommendations();

      if (typeof window.translateTree === 'function') {
        window.translateTree(this.panel);
      } else if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }
    }

    renderMeta() {
      if (!this.nodes.meta) return;

      const space = SPACE_DETAILS[this.state.space] || SPACE_DETAILS.hotel;
      const moodPreset = MOOD_PRESETS.find((preset) => preset.id === this.state.mood);
      const palettePreset = PALETTE_PRESETS.find((preset) => preset.id === this.state.palette);

      const moodLabel = this.state.mood === 'any'
        ? translate('quiz-chip-any', 'Будь-який')
        : translate(moodPreset?.key || 'quiz-chip-any', this.state.mood);

      const paletteLabel = this.state.palette === 'any'
        ? translate('quiz-chip-any', 'Будь-яка')
        : translate(palettePreset?.key || 'quiz-chip-any', this.state.palette);

      const parts = [
        `${translate('quiz-meta-space', 'Простір')}: ${translate(space.titleKey, this.state.space)}`,
        `${translate('quiz-meta-mood', 'Настрій')}: ${moodLabel}`,
        `${translate('quiz-meta-palette', 'Палітра')}: ${paletteLabel}`
      ];

      this.nodes.meta.textContent = parts.join(' • ');
    }

    renderRecommendations() {
      if (!this.nodes.recommendations) return;
      this.nodes.recommendations.innerHTML = '';

      const filtered = this.getFilteredArtworks();

      if (!filtered.length) {
        if (this.nodes.empty) {
          this.nodes.empty.hidden = false;
        }
        return;
      }

      if (this.nodes.empty) {
        this.nodes.empty.hidden = true;
      }

      filtered.slice(0, 3).forEach((item) => {
        const card = this.createArtworkCard(item.art, item.score);
        this.nodes.recommendations.appendChild(card);
      });

      const arButtons = this.nodes.recommendations.querySelectorAll('.quiz-card-ar');
      arButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const slug = button.dataset.artwork;
          const art = ARTWORKS.find((entry) => entry.slug === slug);
          if (!art) {
            return;
          }
          this.launchAR(art);
        });
      });
    }

    getFilteredArtworks() {
      const { space, mood, palette } = this.state;

      // STRICT FILTERING: Only artworks matching space
      let filtered = ARTWORKS.filter((art) => art.spaces.includes(space));

      // Apply mood filter (STRICT - must match)
      if (mood !== 'any') {
        filtered = filtered.filter((art) => art.moods.includes(mood));
      }

      // Apply palette filter (STRICT - must match)
      if (palette !== 'any') {
        filtered = filtered.filter((art) => art.palette === palette);
      }

      // Score remaining artworks for ranking
      const withScores = filtered.map((art) => {
        let score = 0;

        // Exact mood match = +3 points
        if (mood !== 'any' && art.moods.includes(mood)) {
          score += 3;
        }

        // Exact palette match = +2 points
        if (palette !== 'any' && art.palette === palette) {
          score += 2;
        }

        // Tag match = +1 point each
        if (SPACE_DETAILS[space]?.tagKeys) {
          SPACE_DETAILS[space].tagKeys.forEach((key) => {
            if (art.badgeKeys.includes(key)) {
              score += 1;
            }
          });
        }

        // Primary mood = +0.5 bonus
        if (art.moods[0] === mood) {
          score += 0.5;
        }

        return { art, score };
      });

      // Sort by score (highest first)
      return withScores.sort((a, b) => b.score - a.score);
    }

    createArtworkCard(art, score) {
      const card = document.createElement('article');
      card.className = 'quiz-card';

      const imageAlt = translate(art.altKey, translate(art.titleKey, art.slug));

      const badgeKeys = new Set(art.badgeKeys);
      const spaceConfig = SPACE_DETAILS[this.state.space];
      if (spaceConfig?.titleKey) {
        badgeKeys.add(spaceConfig.titleKey);
      }

      if (this.state.mood !== 'any') {
        badgeKeys.add(MOOD_PRESETS.find((preset) => preset.id === this.state.mood)?.key || '');
      }
      if (this.state.palette !== 'any') {
        badgeKeys.add(PALETTE_PRESETS.find((preset) => preset.id === this.state.palette)?.key || '');
      }

      const badgesHtml = Array.from(badgeKeys)
        .filter(Boolean)
        .map((key) => `<li>${translate(key, key)}</li>`)
        .join('');

      const emphasisClass = score >= 3 ? 'btn btn-primary' : 'btn btn-outline';

      card.innerHTML = `
        <div class="quiz-card-image">
          <img src="${art.image}" alt="${imageAlt}" loading="lazy" decoding="async">
          <div class="quiz-card-actions">
            <button class="${emphasisClass} quiz-card-ar" type="button" data-artwork="${art.slug}">
              <i class="fas fa-mobile-alt"></i>
              <span data-key="quiz-card-view-ar"></span>
            </button>
          </div>
        </div>
        <div class="quiz-card-body">
          <h4 class="quiz-card-title">${translate(art.titleKey, art.slug)}</h4>
          <p class="quiz-card-description">${translate(art.descriptionKey, '')}</p>
          <ul class="quiz-card-tags">
            ${badgesHtml}
          </ul>
        </div>
      `;

      return card;
    }

    launchAR(art) {
      if (window.ARViewer && typeof window.ARViewer.open === 'function') {
        window.ARViewer.open({
          image: art.image,
          title: translate(art.titleKey, art.slug),
          alt: translate(art.altKey, art.slug),
          id: art.arId || art.slug
        });
      } else if (typeof window.showToast === 'function') {
        window.showToast(translate('ar-status-ready', 'AR зараз завантажується. Спробуйте ще раз за мить.'), 2800);
      }
    }

    handleLanguageChange() {
      this.renderResults();
      this.updateChips();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AtmosphereGallery());
  } else {
    new AtmosphereGallery();
  }
})();
