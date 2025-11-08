/* Inner Garden - Enhanced Features (Fixed) */
(function() {
  'use strict';

  // =====================================================
  // PRICE COMPARISON TOOL (замість віртуального туру)
  // =====================================================

  class PriceComparisonTool {
    constructor() {
      this.init();
    }

    init() {
      const storiesSection = document.querySelector('.stories-section');
      if (!storiesSection) return;

      const compButton = document.createElement('div');
      compButton.className = 'price-comparison-trigger';
      compButton.innerHTML = `
        <div class="section-header" style="margin-top: 4rem;">
          <h2 class="section-title" data-key="price-comparison-title">${window.t?.('price-comparison-title') || 'Порівняння вартості'}</h2>
          <div class="section-line"></div>
          <p class="section-subtitle" data-key="price-comparison-subtitle">${window.t?.('price-comparison-subtitle') || 'Дізнайтеся вартість для вашого простору та порівняйте варіанти'}</p>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary btn-large" id="price-comp-btn">
            <i class="fas fa-chart-bar"></i>
            <span data-key="price-comparison-btn">${window.t?.('price-comparison-btn') || 'Розрахувати вартість'}</span>
          </button>
        </div>
      `;

      storiesSection.querySelector('.story-submit').before(compButton);
      compButton.querySelector('#price-comp-btn').addEventListener('click', () => this.open());
    }

    open() {
      const modal = document.createElement('div');
      modal.className = 'modal price-comp-modal open';
      modal.innerHTML = `
        <div class="modal-content price-comp-content">
          <button class="modal-close">&times;</button>
          <div class="price-comp-container">
            <h2><i class="fas fa-chart-bar"></i> <span data-key="price-comparison-title">${window.t?.('price-comparison-title') || 'Порівняння вартості'}</span></h2>
            <p class="price-subtitle" data-key="price-comp-subtitle">${window.t?.('price-comp-subtitle') || 'Оберіть розмір та тип картини для вашого простору'}</p>

            <div class="price-options">
              <div class="price-card" data-size="small">
                <div class="price-card-header">
                  <h3>Малий формат</h3>
                  <div class="price-size">80 × 60 см</div>
                </div>
                <div class="price-card-body">
                  <div class="price-value">$2,500 - $4,000</div>
                  <ul class="price-features">
                    <li><i class="fas fa-check"></i> Ідеально для кабінетів</li>
                    <li><i class="fas fa-check"></i> Швидке виконання (2-3 тижні)</li>
                    <li><i class="fas fa-check"></i> Включає доставку в межах країни</li>
                  </ul>
                  <button class="btn btn-outline select-price-btn">Обрати</button>
                </div>
              </div>

              <div class="price-card featured" data-size="medium">
                <div class="price-badge">Популярний</div>
                <div class="price-card-header">
                  <h3>Середній формат</h3>
                  <div class="price-size">120 × 90 см</div>
                </div>
                <div class="price-card-body">
                  <div class="price-value">$5,000 - $8,000</div>
                  <ul class="price-features">
                    <li><i class="fas fa-check"></i> Для лобі та переговорних</li>
                    <li><i class="fas fa-check"></i> Виконання 3-4 тижні</li>
                    <li><i class="fas fa-check"></i> Безкоштовна доставка в EU/USA</li>
                    <li><i class="fas fa-check"></i> Безкоштовна консультація</li>
                  </ul>
                  <button class="btn btn-primary select-price-btn">Обрати</button>
                </div>
              </div>

              <div class="price-card" data-size="large">
                <div class="price-card-header">
                  <h3>Великий формат</h3>
                  <div class="price-size">180 × 120 см +</div>
                </div>
                <div class="price-card-body">
                  <div class="price-value">$10,000 - $25,000</div>
                  <ul class="price-features">
                    <li><i class="fas fa-check"></i> Для великих просторів</li>
                    <li><i class="fas fa-check"></i> Індивідуальний проект</li>
                    <li><i class="fas fa-check"></i> Міжнародна доставка включена</li>
                    <li><i class="fas fa-check"></i> Професійна інсталяція</li>
                    <li><i class="fas fa-check"></i> Сертифікат автентичності</li>
                  </ul>
                  <button class="btn btn-outline select-price-btn">Обрати</button>
                </div>
              </div>
            </div>

            <div class="price-note">
              <i class="fas fa-info-circle"></i>
              <p>Точна ціна залежить від складності роботи, терміну виконання та додаткових побажань. Зв'яжіться для детальної консультації.</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      modal.querySelector('.modal-close').addEventListener('click', () => this.close(modal));
      modal.querySelectorAll('.select-price-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          window.location.href = '#business';
          this.close(modal);
        });
      });
    }

    close(modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // =====================================================
  // DESKTOP GALLERY (замість AR на PC)
  // =====================================================

  class DesktopGallery {
    constructor() {
      this.currentIndex = 0;
      this.images = [
        { src: 'assets/images/artworks/inner-peace.jpg', title: 'Внутрішній Спокій', size: '120×80 см' },
        { src: 'assets/images/artworks/sun-energy.jpg', title: 'Пульс Аврори', size: '140×100 см' },
        { src: 'assets/images/artworks/harmony-flow.jpg', title: 'Золотий Горизонт', size: '150×100 см' },
        { src: 'assets/images/meditation-preview.jpg', title: 'Внутрішня Гармонія', size: '120×90 см' }
      ];
    }

    open(artworkId) {
      this.currentIndex = 0;
      const modal = document.createElement('div');
      modal.className = 'modal desktop-gallery-modal open';
      modal.innerHTML = `
        <div class="modal-content desktop-gallery-content">
          <button class="modal-close">&times;</button>
          <div class="gallery-container">
            <button class="gallery-nav gallery-prev"><i class="fas fa-chevron-left"></i></button>

            <div class="gallery-main">
              <div class="gallery-image-container">
                <img id="gallery-main-image" src="${this.images[0].src}" alt="${this.images[0].title}">
              </div>
              <div class="gallery-info">
                <h3 id="gallery-title">${this.images[0].title}</h3>
                <p id="gallery-size">${this.images[0].size}</p>
              </div>
            </div>

            <button class="gallery-nav gallery-next"><i class="fas fa-chevron-right"></i></button>
          </div>

          <div class="gallery-thumbs">
            ${this.images.map((img, idx) => `
              <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <img src="${img.src}" alt="${img.title}">
              </div>
            `).join('')}
          </div>

          <div class="gallery-actions">
            <button class="btn btn-primary" id="gallery-order-btn">
              <i class="fas fa-shopping-cart"></i>
              Замовити картину
            </button>
            <button class="btn btn-outline" id="gallery-consult-btn">
              <i class="fas fa-phone"></i>
              Консультація
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Navigation
      modal.querySelector('.gallery-prev').addEventListener('click', () => this.prev(modal));
      modal.querySelector('.gallery-next').addEventListener('click', () => this.next(modal));

      // Thumbnails
      modal.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.dataset.index);
          this.goTo(idx, modal);
        });
      });

      // Actions
      modal.querySelector('.modal-close').addEventListener('click', () => this.close(modal));
      modal.querySelector('#gallery-order-btn').addEventListener('click', () => {
        window.location.href = '#business';
        this.close(modal);
      });
      modal.querySelector('#gallery-consult-btn').addEventListener('click', () => {
        window.location.href = '#business';
        this.close(modal);
      });

      // Keyboard navigation
      const keyHandler = (e) => {
        if (e.key === 'ArrowLeft') this.prev(modal);
        if (e.key === 'ArrowRight') this.next(modal);
        if (e.key === 'Escape') {
          this.close(modal);
          document.removeEventListener('keydown', keyHandler);
        }
      };
      document.addEventListener('keydown', keyHandler);
    }

    goTo(index, modal) {
      this.currentIndex = index;
      const img = this.images[index];

      modal.querySelector('#gallery-main-image').src = img.src;
      modal.querySelector('#gallery-title').textContent = img.title;
      modal.querySelector('#gallery-size').textContent = img.size;

      modal.querySelectorAll('.gallery-thumb').forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === index);
      });
    }

    prev(modal) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.goTo(this.currentIndex, modal);
    }

    next(modal) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.goTo(this.currentIndex, modal);
    }

    close(modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // =====================================================
  // ADAPTIVE AR/GALLERY LAUNCHER
  // =====================================================

  window.launchArtViewer = function(artworkId) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && window.ARViewer) {
      // Mobile - use AR
      window.ARViewer.open(artworkId);
    } else {
      // Desktop - use Gallery
      if (!window.DesktopGalleryInstance) {
        window.DesktopGalleryInstance = new DesktopGallery();
      }
      window.DesktopGalleryInstance.open(artworkId);
    }
  };

  // =====================================================
  // INITIALIZE
  // =====================================================

  let enhancedFeaturesInitialized = false;

  const init = () => {
    if (enhancedFeaturesInitialized) return;
    enhancedFeaturesInitialized = true;

    new PriceComparisonTool();
    window.DesktopGalleryInstance = new DesktopGallery();
    console.log('✅ Enhanced features initialized');
  };

  // Чекаємо поки мова буде вибрана
  const checkAndInit = () => {
    if (window.t && typeof window.t === 'function') {
      init();
    } else {
      setTimeout(checkAndInit, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndInit);
  } else {
    checkAndInit();
  }

})();
