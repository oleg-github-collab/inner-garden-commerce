/* Inner Garden – Progressive map loader with graceful fallbacks */
(function () {
  'use strict';

  const MAP_CONTAINER_ID = 'harmony-world-map';
  const MAP_SECTION_ID = 'harmony-map';
  const CITY_LIST_ID = 'map-city-list';
  const MAP_TYPE_ID = 'map-type-legend';
  const LEAFLET_VERSION = '1.9.4';
  const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
  const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
  const LOAD_TIMEOUT = 10000;
  const LANGUAGE_STORAGE_KEY = 'innerGarden_language';

  const TYPE_META = {
    main: {
      icon: 'fa-star',
      labels: {
        uk: 'Головна галерея',
        en: 'Main gallery',
        de: 'Hauptgalerie'
      }
    },
    gallery: {
      icon: 'fa-palette',
      labels: {
        uk: 'Галерея',
        en: 'Gallery',
        de: 'Galerie'
      }
    },
    exhibition: {
      icon: 'fa-image',
      labels: {
        uk: 'Виставка',
        en: 'Exhibition',
        de: 'Ausstellung'
      }
    },
    mural: {
      icon: 'fa-paint-roller',
      labels: {
        uk: 'Настінний розпис',
        en: 'Wall mural',
        de: 'Wandmalerei'
      }
    }
  };

  const CITY_LOCATIONS = [
    {
      coordinates: [50.4501, 30.5234],
      type: 'main',
      city: { uk: 'Київ', en: 'Kyiv', de: 'Kiew' },
      country: { uk: 'Україна', en: 'Ukraine', de: 'Ukraine' }
    },
    {
      coordinates: [49.2331, 28.4682],
      type: 'gallery',
      city: { uk: 'Вінниця', en: 'Vinnytsia', de: 'Winnyzja' },
      country: { uk: 'Україна', en: 'Ukraine', de: 'Ukraine' }
    },
    {
      coordinates: [49.8397, 24.0297],
      type: 'gallery',
      city: { uk: 'Львів', en: 'Lviv', de: 'Lwiw' },
      country: { uk: 'Україна', en: 'Ukraine', de: 'Ukraine' }
    },
    {
      coordinates: [48.2082, 16.3738],
      type: 'exhibition',
      city: { uk: 'Відень', en: 'Vienna', de: 'Wien' },
      country: { uk: 'Австрія', en: 'Austria', de: 'Österreich' }
    },
    {
      coordinates: [51.1079, 17.0385],
      type: 'gallery',
      city: { uk: 'Вроцлав', en: 'Wrocław', de: 'Breslau' },
      country: { uk: 'Польща', en: 'Poland', de: 'Polen' }
    },
    {
      coordinates: [50.0647, 19.945],
      type: 'gallery',
      city: { uk: 'Краків', en: 'Kraków', de: 'Krakau' },
      country: { uk: 'Польща', en: 'Poland', de: 'Polen' }
    },
    {
      coordinates: [47.0707, 15.4395],
      type: 'exhibition',
      city: { uk: 'Грац', en: 'Graz', de: 'Graz' },
      country: { uk: 'Австрія', en: 'Austria', de: 'Österreich' }
    },
    {
      coordinates: [43.6511, -79.3839],
      type: 'gallery',
      city: { uk: 'Торонто', en: 'Toronto', de: 'Toronto' },
      country: { uk: 'Канада', en: 'Canada', de: 'Kanada' }
    },
    {
      coordinates: [43.2557, -79.0717],
      type: 'exhibition',
      city: { uk: 'Niagara-on-the-Lake', en: 'Niagara-on-the-Lake', de: 'Niagara-on-the-Lake' },
      country: { uk: 'Канада', en: 'Canada', de: 'Kanada' }
    },
    {
      coordinates: [51.9607, 7.6261],
      type: 'gallery',
      city: { uk: 'Мюнстер', en: 'Münster', de: 'Münster' },
      country: { uk: 'Німеччина', en: 'Germany', de: 'Deutschland' }
    },
    {
      coordinates: [52.2689, 10.5268],
      type: 'gallery',
      city: { uk: 'Брауншвайг', en: 'Braunschweig', de: 'Braunschweig' },
      country: { uk: 'Німеччина', en: 'Germany', de: 'Deutschland' }
    },
    {
      coordinates: [52.52, 13.405],
      type: 'main',
      city: { uk: 'Берлін', en: 'Berlin', de: 'Berlin' },
      country: { uk: 'Німеччина', en: 'Germany', de: 'Deutschland' }
    },
    {
      coordinates: [48.1351, 11.582],
      type: 'gallery',
      city: { uk: 'Мюнхен', en: 'Munich', de: 'München' },
      country: { uk: 'Німеччина', en: 'Germany', de: 'Deutschland' }
    },
    {
      coordinates: [48.8566, 2.3522],
      type: 'main',
      city: { uk: 'Париж', en: 'Paris', de: 'Paris' },
      country: { uk: 'Франція', en: 'France', de: 'Frankreich' }
    },
    {
      coordinates: [39.4699, -0.3763],
      type: 'exhibition',
      city: { uk: 'Валенсія', en: 'Valencia', de: 'Valencia' },
      country: { uk: 'Іспанія', en: 'Spain', de: 'Spanien' }
    },
    {
      coordinates: [52.4227, 10.7865],
      type: 'mural',
      city: { uk: 'Вольфсбург', en: 'Wolfsburg', de: 'Wolfsburg' },
      country: { uk: 'Німеччина', en: 'Germany', de: 'Deutschland' }
    }
  ];

  const TYPE_COLORS = {
    main: '#e67e22',
    gallery: '#2c3e50',
    exhibition: '#f39c12',
    mural: '#9b59b6'
  };

  const TYPE_ORDER = ['main', 'gallery', 'exhibition', 'mural'];

  const tooltipOptions = {
    permanent: false,
    direction: 'top',
    offset: [0, -10]
  };

  let leafletPromise = null;
  let mapInstance = null;
  let markerStore = [];
  let activeCityIndex = null;
  let currentLanguage = detectLanguage();
  let resizeHandler = null;
  let languageHandler = null;

  function detectLanguage() {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored) {
        return stored.slice(0, 2);
      }
    } catch (error) {
      console.warn('[harmony-map] Unable to read stored language', error);
    }

    return (document.documentElement.lang || 'uk').slice(0, 2);
  }

  function translateKey(key, fallback) {
    if (typeof window.t === 'function') {
      const value = window.t(key);
      if (value && value !== key) {
        return value;
      }
    }
    return fallback;
  }

  function getCityLabel(city) {
    const lang = currentLanguage;
    const cityName = city.city[lang] || city.city.uk;
    const countryName = city.country[lang] || city.country.uk;
    return `${cityName}, ${countryName}`;
  }

  function getTypeLabel(type) {
    const meta = TYPE_META[type];
    if (!meta) {
      return '';
    }
    return meta.labels[currentLanguage] || meta.labels.uk;
  }

  function getCityNames(city) {
    const lang = currentLanguage;
    return {
      city: city.city[lang] || city.city.uk,
      country: city.country[lang] || city.country.uk
    };
  }

  function setActiveCity(index) {
    if (typeof index !== 'number' || Number.isNaN(index)) {
      activeCityIndex = null;
      return;
    }

    activeCityIndex = index;

    const buttons = document.querySelectorAll('.map-city-button');
    buttons.forEach((button) => {
      const buttonIndex = Number(button.dataset.cityIndex);
      const isActive = buttonIndex === index;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function renderTypeLegend() {
    const container = document.getElementById(MAP_TYPE_ID);
    if (!container) {
      return;
    }

    container.innerHTML = '';

    TYPE_ORDER.forEach((type) => {
      const meta = resolveTypeMeta(type);
      const pill = document.createElement('span');
      pill.className = 'map-type-pill';
      pill.style.setProperty('--marker-color', TYPE_COLORS[type] || TYPE_COLORS.gallery);
      pill.innerHTML = `
        <span class="map-type-icon">
          <i class="fas ${meta.icon || 'fa-map-marker-alt'}" aria-hidden="true"></i>
        </span>
        ${getTypeLabel(type)}
      `;
      container.appendChild(pill);
    });
  }

  function ensureLeaflet() {
    if (typeof L !== 'undefined') {
      return Promise.resolve(L);
    }

    if (leafletPromise) {
      return leafletPromise;
    }

    leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS;
        link.setAttribute('data-leaflet', 'true');
        document.head.appendChild(link);
      }

      const script = document.createElement('script');
      script.src = LEAFLET_JS;
      script.async = true;

      const timeout = window.setTimeout(() => {
        script.remove();
        reject(new Error('leaflet:timeout'));
      }, LOAD_TIMEOUT);

      script.onload = () => {
        window.clearTimeout(timeout);
        if (typeof L !== 'undefined') {
          resolve(L);
        } else {
          reject(new Error('leaflet:missing'));
        }
      };

      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('leaflet:error'));
      };

      document.head.appendChild(script);
    });

    leafletPromise.catch(() => {
      leafletPromise = null;
    });

    return leafletPromise;
  }

  function resolveTypeMeta(type) {
    return TYPE_META[type] || TYPE_META.gallery;
  }

  function buildMarkerHtml(city) {
    const color = TYPE_COLORS[city.type] || TYPE_COLORS.gallery;
    const iconClass = resolveTypeMeta(city.type).icon || 'fa-map-marker-alt';

    return `
      <span class="map-marker" data-marker-type="${city.type}" style="--marker-color:${color}">
        <span class="map-marker__pulse"></span>
        <span class="map-marker__pin">
          <span class="map-marker__icon">
            <i class="fas ${iconClass}" aria-hidden="true"></i>
          </span>
        </span>
        <span class="map-marker__shadow"></span>
      </span>
    `;
  }

  function createMarkerEntry(city) {
    const marker = L.marker(city.coordinates, {
      icon: L.divIcon({
        className: 'map-marker-wrapper',
        html: buildMarkerHtml(city),
        iconSize: [52, 64],
        iconAnchor: [26, 56],
        popupAnchor: [0, -48],
        tooltipAnchor: [0, -36]
      })
    }).bindTooltip(getCityLabel(city), tooltipOptions);

    marker.on('mouseover', () => marker.openTooltip());

    return { city, marker };
  }

  function renderLegend() {
    const listElement = document.getElementById(CITY_LIST_ID);
    if (!listElement) {
      return;
    }

    listElement.innerHTML = '';

    markerStore.forEach(({ city }, index) => {
      const item = document.createElement('li');
      item.className = 'map-city-item';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'city-link map-city-button';
      button.setAttribute('aria-label', getCityLabel(city));
       button.dataset.cityIndex = String(index);
       button.dataset.cityType = city.type;
       button.setAttribute('aria-pressed', 'false');

      const iconClass = resolveTypeMeta(city.type).icon || 'fa-map-marker-alt';
      const color = TYPE_COLORS[city.type] || TYPE_COLORS.gallery;

      button.style.setProperty('--marker-color', color);

      const names = getCityNames(city);

      button.innerHTML = `
        <span class="city-icon">
          <i class="fas ${iconClass}" aria-hidden="true"></i>
        </span>
        <span class="city-labels">
          <span class="city-name">${names.city}</span>
          <span class="city-country">${names.country}</span>
        </span>
        <span class="city-type">${getTypeLabel(city.type)}</span>
      `;

      button.addEventListener('click', () => {
        focusCity(index);
      });

      item.appendChild(button);
      listElement.appendChild(item);
    });

    const initialIndex = typeof activeCityIndex === 'number' ? activeCityIndex : 0;
    setActiveCity(initialIndex);
  }

  function updateTooltips() {
    markerStore.forEach(({ city, marker }) => {
      marker.unbindTooltip();
      marker.bindTooltip(getCityLabel(city), tooltipOptions);
    });
  }

  function fitToMarkers(map) {
    if (!markerStore.length) {
      map.setView([50, 10], 4);
      return;
    }

    const featureGroup = L.featureGroup(markerStore.map(({ marker }) => marker));
    const bounds = featureGroup.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2));
      if (map.getZoom() > 7) {
        map.setZoom(7);
      }
    } else {
      map.setView([50, 10], 4);
    }
  }

  function focusCity(index) {
    if (!mapInstance) {
      return;
    }

    const entry = markerStore[index];
    if (!entry) {
      return;
    }

    const [lat, lng] = entry.city.coordinates;
    const targetZoom = Math.min(Math.max(mapInstance.getZoom(), 6), 10);

    mapInstance.flyTo([lat, lng], targetZoom, {
      duration: 1.5,
      easeLinearity: 0.4
    });

    entry.marker.openTooltip();
    setActiveCity(index);

    window.setTimeout(() => entry.marker.closeTooltip(), 2400);
  }

  function showFallback(errorKey) {
    const container = document.getElementById(MAP_CONTAINER_ID);
    if (!container) {
      return;
    }

    container.classList.add('map-fallback');
    container.removeAttribute('data-map-ready');
    container.innerHTML = `
      <div class="map-fallback-content">
        <p data-key="map-fallback-message">
          ${translateKey('map-fallback-message', 'Не вдалося завантажити інтерактивну карту. Перевірте з’єднання з інтернетом.')}
        </p>
        <button type="button" class="btn btn-outline map-retry" data-key="map-retry">
          ${translateKey('map-retry', 'Спробувати ще раз')}
        </button>
      </div>
    `;

    const retryButton = container.querySelector('.map-retry');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        container.classList.remove('map-fallback');
        container.innerHTML = '';
        initialise(true);
      });
    }

    if (errorKey) {
      console.error(`[harmony-map] ${errorKey}`);
    }
  }

  function destroyMap() {
    if (languageHandler) {
      window.removeEventListener('language:change', languageHandler);
      languageHandler = null;
    }

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }

    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    markerStore = [];
    activeCityIndex = null;

    const container = document.getElementById(MAP_CONTAINER_ID);
    if (container) {
      container.removeAttribute('data-map-ready');
      container.innerHTML = '';
    }

    const typeLegend = document.getElementById(MAP_TYPE_ID);
    if (typeLegend) {
      typeLegend.innerHTML = '';
    }
  }

  function setupEventListeners() {
    languageHandler = (event) => {
      const lang = event?.detail?.lang;
      currentLanguage = lang || detectLanguage();
      renderLegend();
      renderTypeLegend();
      updateTooltips();
      if (typeof window.translateTree === 'function') {
        window.translateTree(document.getElementById(CITY_LIST_ID));
      } else if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }
    };

    resizeHandler = () => {
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
    };

    window.addEventListener('language:change', languageHandler);
    window.addEventListener('resize', resizeHandler);
  }

  function initialiseMap() {
    const container = document.getElementById(MAP_CONTAINER_ID);
    if (!container) {
      return;
    }

    if (container.dataset.mapReady === 'true') {
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
      return;
    }

    container.dataset.mapReady = 'true';

    mapInstance = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
      worldCopyJump: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    markerStore = CITY_LOCATIONS.map((city) => {
      const entry = createMarkerEntry(city);
      entry.marker.addTo(mapInstance);
      return entry;
    });

    fitToMarkers(mapInstance);
    if (activeCityIndex === null && markerStore.length) {
      activeCityIndex = 0;
    }
    renderLegend();
    renderTypeLegend();

    setupEventListeners();

    // ensure proper sizing after modal / layout shifts
    window.setTimeout(() => {
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
    }, 250);

    window.harmonyMap = {
      map: mapInstance,
      markers: markerStore,
      refresh: () => {
        renderLegend();
        renderTypeLegend();
        updateTooltips();
      },
      flyToCity: focusCity,
      focusCity,
      destroy: destroyMap
    };
  }

  function loadMapAssets() {
    ensureLeaflet()
      .then(() => {
        initialiseMap();
      })
      .catch((error) => {
        showFallback(error?.message || 'leaflet:unknown');
      });
  }

  function initialise(forceLoad = false) {
    try {
      const section = document.getElementById(MAP_SECTION_ID);
      if (!section) {
        console.warn('[harmony-map] Map section not found');
        return;
      }

      if (forceLoad) {
        loadMapAssets();
        return;
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              obs.disconnect();
              loadMapAssets();
            }
          });
        }, {
          rootMargin: '200px 0px',
          threshold: 0.1
        });

        observer.observe(section);
      } else {
        loadMapAssets();
      }
    } catch (error) {
      console.error('[harmony-map] Initialization error:', error);
    }
  }

  function safeInit() {
    // Wait a bit for DOM to be fully ready
    if (document.getElementById(MAP_SECTION_ID)) {
      initialise(false);
    } else {
      console.warn('[harmony-map] Section not available yet, retrying...');
      setTimeout(safeInit, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(safeInit, 0);
  }
})();
