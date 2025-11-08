/* Inner Garden - Ultra Features System */
(function() {
  'use strict';

  // =====================================================
  // INTERACTIVE MAP WITH SMOOTH NAVIGATION
  // =====================================================

  const cities = [
    { name: 'Київ', country: 'Україна', lat: 50.4501, lng: 30.5234, type: 'main' },
    { name: 'Вінниця', country: 'Україна', lat: 49.2331, lng: 28.4682, type: 'gallery' },
    { name: 'Львів', country: 'Україна', lat: 49.8397, lng: 24.0297, type: 'gallery' },
    { name: 'Відень', country: 'Австрія', lat: 48.2082, lng: 16.3738, type: 'exhibition' },
    { name: 'Вроцлав', country: 'Польща', lat: 51.1079, lng: 17.0385, type: 'gallery' },
    { name: 'Краків', country: 'Польща', lat: 50.0647, lng: 19.9450, type: 'gallery' },
    { name: 'Грац', country: 'Австрія', lat: 47.0707, lng: 15.4395, type: 'exhibition' },
    { name: 'Торонто', country: 'Канада', lat: 43.6532, lng: -79.3832, type: 'gallery' },
    { name: 'Niagara-on-the-Lake', country: 'Канада', lat: 43.2557, lng: -79.0717, type: 'exhibition' },
    { name: 'Мюнстер', country: 'Німеччина', lat: 51.9607, lng: 7.6261, type: 'gallery' },
    { name: 'Брауншвайг', country: 'Німеччина', lat: 52.2689, lng: 10.5268, type: 'gallery' },
    { name: 'Берлін', country: 'Німеччина', lat: 52.5200, lng: 13.4050, type: 'main' },
    { name: 'Мюнхен', country: 'Німеччина', lat: 48.1351, lng: 11.5820, type: 'gallery' },
    { name: 'Париж', country: 'Франція', lat: 48.8566, lng: 2.3522, type: 'main' },
    { name: 'Валенсія', country: 'Іспанія', lat: 39.4699, lng: -0.3763, type: 'exhibition' },
    { name: 'Вольфсбург', country: 'Німеччина', lat: 52.4227, lng: 10.7865, type: 'mural' }
  ];

  const cityTranslations = {
    uk: {
      'Київ': 'Київ', 'Вінниця': 'Вінниця', 'Львів': 'Львів',
      'Відень': 'Відень', 'Вроцлав': 'Вроцлав', 'Краків': 'Краків',
      'Грац': 'Грац', 'Торонто': 'Торонто', 'Niagara-on-the-Lake': 'Niagara-on-the-Lake',
      'Мюнстер': 'Мюнстер', 'Брауншвайг': 'Брауншвайг', 'Берлін': 'Берлін',
      'Мюнхен': 'Мюнхен', 'Париж': 'Париж', 'Валенсія': 'Валенсія',
      'Вольфсбург': 'Вольфсбург (розпис стін)',
      'Україна': 'Україна', 'Австрія': 'Австрія', 'Польща': 'Польща',
      'Канада': 'Канада', 'Німеччина': 'Німеччина', 'Франція': 'Франція',
      'Іспанія': 'Іспанія'
    },
    en: {
      'Київ': 'Kyiv', 'Вінниця': 'Vinnytsia', 'Львів': 'Lviv',
      'Відень': 'Vienna', 'Вроцлав': 'Wrocław', 'Краків': 'Kraków',
      'Грац': 'Graz', 'Торонто': 'Toronto', 'Niagara-on-the-Lake': 'Niagara-on-the-Lake',
      'Мюнстер': 'Münster', 'Брауншвайг': 'Braunschweig', 'Берлін': 'Berlin',
      'Мюнхен': 'Munich', 'Париж': 'Paris', 'Валенсія': 'Valencia',
      'Вольфсбург': 'Wolfsburg (mural)',
      'Україна': 'Ukraine', 'Австрія': 'Austria', 'Польща': 'Poland',
      'Канада': 'Canada', 'Німеччина': 'Germany', 'Франція': 'France',
      'Іспанія': 'Spain'
    },
    de: {
      'Київ': 'Kiew', 'Вінниця': 'Winnyzja', 'Львів': 'Lwiw',
      'Відень': 'Wien', 'Вроцлав': 'Breslau', 'Краків': 'Krakau',
      'Грац': 'Graz', 'Торонто': 'Toronto', 'Niagara-on-the-Lake': 'Niagara-on-the-Lake',
      'Мюнстер': 'Münster', 'Брауншвайг': 'Braunschweig', 'Берлін': 'Berlin',
      'Мюнхен': 'München', 'Париж': 'Paris', 'Валенсія': 'Valencia',
      'Вольфсбург': 'Wolfsburg (Wandmalerei)',
      'Україна': 'Ukraine', 'Австрія': 'Österreich', 'Польща': 'Polen',
      'Канада': 'Kanada', 'Німеччина': 'Deutschland', 'Франція': 'Frankreich',
      'Іспанія': 'Spanien'
    }
  };

  class InteractiveMap {
    constructor() {
      this.map = null;
      this.markers = [];
      this.currentLang = localStorage.getItem('innerGarden_language') || 'uk';
      this.init();
    }

    init() {
      const mapContainer = document.getElementById('harmony-world-map');
      if (!mapContainer) return;

      // Initialize Leaflet map
      this.map = L.map('harmony-world-map', {
        center: [50.0, 15.0],
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(this.map);

      // Add markers
      this.addMarkers();

      // Create city list
      this.createCityList();

      // Listen for language changes
      window.addEventListener('language:change', (e) => {
        this.currentLang = e.detail.lang;
        this.updateCityList();
      });
    }

    addMarkers() {
      const iconColors = {
        main: '#e67e22',
        gallery: '#2c3e50',
        exhibition: '#f39c12',
        mural: '#9b59b6'
      };

      cities.forEach(city => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="marker-pin" style="background-color: ${iconColors[city.type]}">
              <i class="fas fa-palette"></i>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        const marker = L.marker([city.lat, city.lng], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="map-popup">
              <h4>${this.translateCity(city.name)}</h4>
              <p>${this.translateCountry(city.country)}</p>
              <span class="city-type">${this.getCityTypeLabel(city.type)}</span>
            </div>
          `);

        this.markers.push({ marker, city });
      });
    }

    createCityList() {
      const listContainer = document.getElementById('map-city-list');
      if (!listContainer) return;

      listContainer.innerHTML = '';

      cities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'map-city-item';
        li.innerHTML = `
          <button class="city-link" data-lat="${city.lat}" data-lng="${city.lng}">
            <span class="city-icon">
              <i class="fas ${this.getCityIcon(city.type)}"></i>
            </span>
            <span class="city-name">${this.translateCity(city.name)}, ${this.translateCountry(city.country)}</span>
          </button>
        `;

        const button = li.querySelector('.city-link');
        button.addEventListener('click', () => this.flyToCity(city.lat, city.lng));

        listContainer.appendChild(li);
      });
    }

    updateCityList() {
      this.createCityList();
      // Update marker popups
      this.markers.forEach(({ marker, city }) => {
        marker.setPopupContent(`
          <div class="map-popup">
            <h4>${this.translateCity(city.name)}</h4>
            <p>${this.translateCountry(city.country)}</p>
            <span class="city-type">${this.getCityTypeLabel(city.type)}</span>
          </div>
        `);
      });
    }

    flyToCity(lat, lng) {
      this.map.flyTo([lat, lng], 10, {
        duration: 2,
        easeLinearity: 0.25
      });
    }

    translateCity(cityName) {
      return cityTranslations[this.currentLang][cityName] || cityName;
    }

    translateCountry(countryName) {
      return cityTranslations[this.currentLang][countryName] || countryName;
    }

    getCityIcon(type) {
      const icons = {
        main: 'fa-star',
        gallery: 'fa-palette',
        exhibition: 'fa-image',
        mural: 'fa-paint-roller'
      };
      return icons[type] || 'fa-map-marker';
    }

    getCityTypeLabel(type) {
      const labels = {
        uk: { main: 'Головна галерея', gallery: 'Галерея', exhibition: 'Виставка', mural: 'Розпис стін' },
        en: { main: 'Main Gallery', gallery: 'Gallery', exhibition: 'Exhibition', mural: 'Mural' },
        de: { main: 'Hauptgalerie', gallery: 'Galerie', exhibition: 'Ausstellung', mural: 'Wandmalerei' }
      };
      return labels[this.currentLang][type] || type;
    }
  }

  // =====================================================
  // ATMOSPHERE QUIZ - ART SELECTION
  // =====================================================

  class AtmosphereQuiz {
    constructor() {
      this.recommendations = {
        hotel: [
          { id: 1, title: 'Внутрішня Гармонія', image: 'inner-harmony.jpg', description: 'Теплі тони для лобі' },
          { id: 2, title: 'Золотий Горизонт', image: 'golden-horizon.jpg', description: 'Преміальна атмосфера' }
        ],
        medical: [
          { id: 3, title: 'Внутрішній Спокій', image: 'inner-peace.jpg', description: 'Заспокійливі кольори' },
          { id: 4, title: 'Дзен Сад', image: 'zen-garden.jpg', description: 'Мінімалістична гармонія' }
        ],
        office: [
          { id: 5, title: 'Пульс Аврори', image: 'aurora-pulse.jpg', description: 'Енергія та натхнення' },
          { id: 6, title: 'Міський Бриз', image: 'urban-breeze.jpg', description: 'Динаміка креативу' }
        ]
      };
      this.init();
    }

    init() {
      const quizOptions = document.querySelectorAll('.quiz-option');
      quizOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
          const types = ['hotel', 'medical', 'office'];
          this.showRecommendations(types[index]);
        });
      });
    }

    showRecommendations(type) {
      const recommendations = this.recommendations[type];

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'modal quiz-results-modal open';
      modal.innerHTML = `
        <div class="modal-content quiz-results-content">
          <button class="modal-close quiz-modal-close">&times;</button>
          <h2 class="quiz-results-title">Рекомендовані картини для вашого простору</h2>
          <div class="quiz-results-grid">
            ${recommendations.map(art => `
              <div class="quiz-result-card">
                <div class="result-image">
                  <img src="assets/images/artworks/${art.image}" alt="${art.title}" loading="lazy">
                </div>
                <div class="result-info">
                  <h3>${art.title}</h3>
                  <p>${art.description}</p>
                  <div class="result-actions">
                    <button class="btn btn-primary view-ar-btn" data-artwork="${art.id}">
                      <i class="fas fa-camera"></i>
                      Примірити в AR
                    </button>
                    <button class="btn btn-outline">
                      <i class="fas fa-info-circle"></i>
                      Детальніше
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="quiz-results-footer">
            <p>Потрібна консультація?</p>
            <a href="#business" class="btn btn-primary">
              <i class="fas fa-phone"></i>
              Записатись на консультацію
            </a>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Close modal
      modal.querySelector('.quiz-modal-close').addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        setTimeout(() => modal.remove(), 300);
      });

      // AR buttons
      modal.querySelectorAll('.view-ar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const artworkId = btn.dataset.artwork;
          this.launchAR(artworkId);
        });
      });
    }

    launchAR(artworkId) {
      if (window.ARViewer) {
        window.ARViewer.open(artworkId);
      } else {
        window.showToast('AR функція завантажується...', 2000);
      }
    }
  }

  // =====================================================
  // ENHANCED AR VIEWER FOR MOBILE
  // =====================================================

  class ARViewer {
    constructor() {
      this.isSupported = this.checkSupport();
      this.init();
    }

    checkSupport() {
      // Check if device supports AR
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      return isMobile && hasCamera;
    }

    init() {
      window.ARViewer = this;
    }

    async open(artworkId) {
      if (!this.isSupported) {
        this.showFallback(artworkId);
        return;
      }

      // Create AR modal
      const modal = document.createElement('div');
      modal.className = 'modal ar-modal open';
      modal.innerHTML = `
        <div class="modal-content ar-modal-content">
          <button class="modal-close ar-modal-close">&times;</button>
          <div class="ar-container">
            <div class="ar-header">
              <h3>AR Примірка</h3>
              <p>Наведіть камеру на стіну для розміщення картини</p>
            </div>

            <div class="ar-viewer-container">
              <video id="ar-video" autoplay playsinline></video>
              <canvas id="ar-canvas"></canvas>
              <div class="ar-controls-overlay">
                <button class="ar-control-btn" id="ar-rotate">
                  <i class="fas fa-redo"></i>
                </button>
                <button class="ar-control-btn" id="ar-scale">
                  <i class="fas fa-expand"></i>
                </button>
                <button class="ar-control-btn" id="ar-capture">
                  <i class="fas fa-camera"></i>
                </button>
              </div>
            </div>

            <div class="ar-instructions">
              <div class="ar-instruction">
                <i class="fas fa-hand-pointer"></i>
                <span>Торкніться екрану для розміщення</span>
              </div>
              <div class="ar-instruction">
                <i class="fas fa-arrows-alt"></i>
                <span>Перетягуйте для переміщення</span>
              </div>
              <div class="ar-instruction">
                <i class="fas fa-search-plus"></i>
                <span>Pinch для масштабування</span>
              </div>
            </div>

            <div class="ar-footer">
              <button class="btn btn-outline" id="ar-close-btn">Закрити</button>
              <button class="btn btn-primary" id="ar-order-btn">Замовити картину</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Start camera
      await this.startCamera();

      // Event listeners
      modal.querySelector('.ar-modal-close').addEventListener('click', () => this.close(modal));
      modal.querySelector('#ar-close-btn').addEventListener('click', () => this.close(modal));
      modal.querySelector('#ar-order-btn').addEventListener('click', () => {
        window.location.href = '#business';
        this.close(modal);
      });
    }

    async startCamera() {
      try {
        const video = document.getElementById('ar-video');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        video.srcObject = stream;
        this.stream = stream;
      } catch (error) {
        console.error('Camera access denied:', error);
        window.showToast('Потрібен доступ до камери для AR', 3000);
      }
    }

    close(modal) {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }

    showFallback(artworkId) {
      window.showToast('AR доступно тільки на мобільних пристроях', 3000);
      // Show 2D preview instead
      this.show2DPreview(artworkId);
    }

    show2DPreview(artworkId) {
      const modal = document.createElement('div');
      modal.className = 'modal preview-modal open';
      modal.innerHTML = `
        <div class="modal-content preview-modal-content">
          <button class="modal-close">&times;</button>
          <div class="preview-container">
            <h3>Попередній перегляд картини</h3>
            <img src="assets/images/artworks/preview-${artworkId}.jpg" alt="Artwork preview">
            <div class="preview-actions">
              <button class="btn btn-primary">Замовити картину</button>
              <button class="btn btn-outline">Більше інформації</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        setTimeout(() => modal.remove(), 300);
      });
    }
  }

  // =====================================================
  // INITIALIZE ALL FEATURES
  // =====================================================

  const initFeatures = () => {
    // Wait for DOM and dependencies
    if (typeof L === 'undefined') {
      console.log('Waiting for Leaflet...');
      setTimeout(initFeatures, 100);
      return;
    }

    new InteractiveMap();
    new AtmosphereQuiz();
    new ARViewer();

    console.log('✅ All ultra features initialized');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeatures);
  } else {
    initFeatures();
  }

})();
