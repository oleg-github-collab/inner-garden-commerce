/* Inner Garden - SEO Meta Tag Manager */
/* Dynamic meta tags based on language selection */

(function() {
  'use strict';

  const META_TRANSLATIONS = {
    uk: {
      title: 'Inner Garden - Преміум Абстрактне Мистецтво для Бізнесу | +40% ROI | США, ЄС, Україна',
      description: 'Inner Garden ⭐ Преміум абстрактне мистецтво для бізнес-просторів з доведеним ROI +40%. Трансформуйте готелі, офіси та медичні центри в оази гармонії. AR-перегляд, безкоштовна консультація. Марина Камінська - 12 років досвіду. Доставка: ЄС, США, Україна.',
      keywords: 'абстрактне мистецтво для бізнесу, корпоративна арт-колекція, мистецтво для готелів, дизайн офісу, декор медичних центрів, мистецтво для wellness, бізнес-дизайн інтер\'єру, ROI мистецтва, AR-перегляд картин, арт-терапія, продуктивність, NPS зростання, зниження стресу, Марина Камінська, українське мистецтво',
      ogTitle: 'Inner Garden - Преміум Абстрактне Мистецтво для Бізнесу | +40% ROI Доведено',
      ogDescription: 'Трансформуйте ваш бізнес-простір з Inner Garden. Доведені результати: +40% задоволеність клієнтів, +22% NPS, -30% стрес співробітників. AR-перегляд. Доставка: США, ЄС, Україна.',
      twitterTitle: 'Inner Garden - Преміум Абстрактне Мистецтво | +40% ROI',
      twitterDescription: 'Трансформуйте готелі, офіси та медцентри з доведеним ROI. AR-перегляд. Доставка: США, ЄС, Україна. Безкоштовна консультація.',
      canonical: 'https://inner-garden.art/uk/'
    },
    en: {
      title: 'Inner Garden - Premium Abstract Art for Business Spaces | +40% ROI Proven | USA, EU, UK',
      description: 'Inner Garden ⭐ Premium abstract art for business spaces with proven +40% ROI. Transform hotels, offices & medical centers into harmony oases. AR preview, free consultation. Marina Kaminska - 12 years experience. Worldwide shipping: EU, USA, UK.',
      keywords: 'abstract art for business, corporate art collection, hotel artwork, office art design, medical center decor, wellness space art, business interior design, art ROI, corporate design, AR art preview, art therapy, productivity art, NPS growth, stress reduction art, luxury business art, European art market, American art buyers',
      ogTitle: 'Inner Garden - Premium Abstract Art for Business Spaces | +40% ROI Proven',
      ogDescription: 'Transform your business space with Inner Garden premium art. Proven results: +40% client satisfaction, +22% NPS, -30% employee stress. AR preview available. Worldwide shipping: USA, EU, UK.',
      twitterTitle: 'Inner Garden - Premium Abstract Art for Business | +40% ROI',
      twitterDescription: 'Transform hotels, offices & medical centers with proven ROI art. AR preview. Worldwide shipping: USA, EU, UK. Free consultation.',
      canonical: 'https://inner-garden.art/en/'
    },
    de: {
      title: 'Inner Garden - Premium Abstrakte Kunst für Geschäftsräume | +40% ROI Bewiesen | USA, EU, DE',
      description: 'Inner Garden ⭐ Premium abstrakte Kunst für Geschäftsräume mit bewiesenem +40% ROI. Verwandeln Sie Hotels, Büros und medizinische Zentren in Harmonie-Oasen. AR-Vorschau, kostenlose Beratung. Marina Kaminska - 12 Jahre Erfahrung. Weltweiter Versand: EU, USA, DE.',
      keywords: 'abstrakte Kunst für Unternehmen, Firmenkunstsammlung, Hotelkunst, Bürokunst-Design, Medizinzentrum-Dekor, Wellness-Raumkunst, Geschäftsinnenarchitektur, Kunst-ROI, Unternehmensdesign, AR-Kunstvorschau, Kunsttherapie, Produktivitätskunst, NPS-Wachstum, Stressreduktionskunst, Luxus-Geschäftskunst, europäischer Kunstmarkt',
      ogTitle: 'Inner Garden - Premium Abstrakte Kunst für Geschäftsräume | +40% ROI Bewiesen',
      ogDescription: 'Verwandeln Sie Ihren Geschäftsraum mit Inner Garden Premium-Kunst. Bewiesene Ergebnisse: +40% Kundenzufriedenheit, +22% NPS, -30% Mitarbeiterstress. AR-Vorschau verfügbar. Weltweiter Versand: USA, EU, DE.',
      twitterTitle: 'Inner Garden - Premium Abstrakte Kunst | +40% ROI',
      twitterDescription: 'Verwandeln Sie Hotels, Büros und medizinische Zentren mit bewiesenem ROI. AR-Vorschau. Weltweiter Versand: USA, EU, DE. Kostenlose Beratung.',
      canonical: 'https://inner-garden.art/de/'
    }
  };

  class SEOMetaManager {
    constructor() {
      this.currentLang = 'uk';
      this.init();
    }

    init() {
      // Listen for language changes
      window.addEventListener('language:change', (e) => {
        const lang = e.detail?.lang || document.documentElement.lang || 'uk';
        this.updateMeta(lang);
      });

      // Update on page load
      const initialLang = document.documentElement.lang || 'uk';
      this.updateMeta(initialLang);
    }

    updateMeta(lang) {
      if (this.currentLang === lang) return;

      const meta = META_TRANSLATIONS[lang] || META_TRANSLATIONS.uk;
      this.currentLang = lang;

      // Update title
      this.updateTag('title', meta.title);

      // Update meta description
      this.updateMetaTag('name', 'description', meta.description);
      this.updateMetaTag('name', 'keywords', meta.keywords);

      // Update Open Graph tags
      this.updateMetaTag('property', 'og:title', meta.ogTitle);
      this.updateMetaTag('property', 'og:description', meta.ogDescription);
      this.updateMetaTag('property', 'og:url', meta.canonical);
      this.updateMetaTag('property', 'og:locale', this.getOGLocale(lang));

      // Update Twitter tags
      this.updateMetaTag('property', 'twitter:title', meta.twitterTitle);
      this.updateMetaTag('property', 'twitter:description', meta.twitterDescription);
      this.updateMetaTag('property', 'twitter:url', meta.canonical);

      // Update canonical URL
      this.updateCanonical(meta.canonical);

      // Update html lang attribute
      document.documentElement.lang = lang;

      // Dispatch event for analytics
      this.trackMetaUpdate(lang);

      console.log(`🔍 SEO meta tags updated for language: ${lang}`);
    }

    updateTag(selector, content) {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = content;
      }
    }

    updateMetaTag(attribute, name, content) {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    }

    updateCanonical(url) {
      let canonical = document.querySelector('link[rel="canonical"]');

      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }

      canonical.setAttribute('href', url);
    }

    getOGLocale(lang) {
      const locales = {
        uk: 'uk_UA',
        en: 'en_US',
        de: 'de_DE'
      };
      return locales[lang] || 'en_US';
    }

    trackMetaUpdate(lang) {
      // Track meta updates for analytics
      if (typeof gtag === 'function') {
        gtag('event', 'seo_meta_update', {
          event_category: 'SEO',
          event_label: lang,
          value: 1
        });
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('seo:meta-updated', {
        detail: { lang, timestamp: Date.now() }
      }));
    }

    // Public API
    getCurrentLang() {
      return this.currentLang;
    }

    getMeta(lang = this.currentLang) {
      return META_TRANSLATIONS[lang] || META_TRANSLATIONS.uk;
    }
  }

  // =====================================================
  // STRUCTURED DATA MANAGER
  // =====================================================

  class StructuredDataManager {
    constructor() {
      this.init();
    }

    init() {
      // Listen for language changes to update structured data
      window.addEventListener('language:change', (e) => {
        const lang = e.detail?.lang || 'uk';
        this.updateStructuredData(lang);
      });
    }

    updateStructuredData(lang) {
      // Update ArtGallery schema
      this.updateArtGallerySchema(lang);

      // Update WebSite schema
      this.updateWebSiteSchema(lang);

      console.log(`📊 Structured data updated for language: ${lang}`);
    }

    updateArtGallerySchema(lang) {
      const translations = {
        uk: {
          name: 'Inner Garden',
          alternateName: 'Внутрішній Сад',
          description: 'Абстрактні картини для гармонійних бізнес-просторів з доведеним ROI +40%'
        },
        en: {
          name: 'Inner Garden',
          alternateName: 'Inner Garden Art',
          description: 'Premium abstract art for harmonious business spaces with proven +40% ROI'
        },
        de: {
          name: 'Inner Garden',
          alternateName: 'Innerer Garten',
          description: 'Premium abstrakte Kunst für harmonische Geschäftsräume mit bewiesenem +40% ROI'
        }
      };

      const data = translations[lang] || translations.uk;

      // Find and update existing schema or create new one
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (scriptElement) {
        try {
          const schema = JSON.parse(scriptElement.textContent);
          if (schema['@graph'] && schema['@graph'][0]) {
            schema['@graph'][0].name = data.name;
            schema['@graph'][0].alternateName = data.alternateName;
            schema['@graph'][0].description = data.description;
            scriptElement.textContent = JSON.stringify(schema, null, 2);
          }
        } catch (error) {
          console.error('Failed to update structured data:', error);
        }
      }
    }

    updateWebSiteSchema(lang) {
      // Update website schema if needed
      // This can be expanded based on requirements
    }
  }

  // =====================================================
  // INITIALIZE MANAGERS
  // =====================================================

  const initSEOManagers = () => {
    window.seoMetaManager = new SEOMetaManager();
    window.structuredDataManager = new StructuredDataManager();

    console.log('🚀 SEO Managers initialized');
  };

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEOManagers);
  } else {
    initSEOManagers();
  }

})();
