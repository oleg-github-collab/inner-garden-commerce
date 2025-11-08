/* Inner Garden - WOW Business Features */
(function() {
  'use strict';

  // =====================================================
  // ENHANCED MEDITATION EXPERIENCE
  // =====================================================

  class MeditationExperience {
    constructor() {
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 300; // 5 minutes
      this.init();
    }

    init() {
      const playBtn = document.getElementById('meditation-play-btn');
      if (!playBtn) return;

      playBtn.addEventListener('click', () => this.start());
    }

    start() {
      const modal = document.createElement('div');
      modal.className = 'modal meditation-modal-ultra open';
      modal.innerHTML = `
        <div class="modal-content meditation-modal-ultra-content">
          <button class="modal-close meditation-ultra-close">&times;</button>

          <div class="meditation-container-ultra">
            <!-- Breathing Circle -->
            <div class="meditation-breathing-circle">
              <svg viewBox="0 0 200 200" class="breathing-svg">
                <defs>
                  <radialGradient id="breathGrad">
                    <stop offset="0%" style="stop-color:#e67e22;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#f39c12;stop-opacity:0.3" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#breathGrad)" class="breath-circle"/>
              </svg>
              <div class="breath-text">
                <span class="breath-instruction" data-key="meditation-breathe-in">Вдихайте...</span>
              </div>
            </div>

            <!-- Artwork Display -->
            <div class="meditation-artwork-display">
              <img src="assets/images/meditation-preview.jpg" alt="Meditation artwork" class="meditation-art">
              <div class="meditation-overlay"></div>
            </div>

            <!-- Audio Controls -->
            <div class="meditation-audio-controls">
              <button class="meditation-control-btn" id="med-play-pause">
                <i class="fas fa-pause"></i>
              </button>
              <div class="meditation-timeline">
                <div class="timeline-progress" id="med-progress"></div>
                <div class="timeline-marker" id="med-marker"></div>
              </div>
              <div class="meditation-time">
                <span id="med-current-time">0:00</span> / <span>5:00</span>
              </div>
            </div>

            <!-- Meditation Steps -->
            <div class="meditation-steps">
              <div class="meditation-step active" data-step="1">
                <div class="step-number">1</div>
                <p data-key="meditation-step-1">Заспокойте дихання</p>
              </div>
              <div class="meditation-step" data-step="2">
                <div class="step-number">2</div>
                <p data-key="meditation-step-2">Зосередьтесь на картині</p>
              </div>
              <div class="meditation-step" data-step="3">
                <div class="step-number">3</div>
                <p data-key="meditation-step-3">Відчуйте гармонію</p>
              </div>
              <div class="meditation-step" data-step="4">
                <div class="step-number">4</div>
                <p data-key="meditation-step-4">Дозвольте собі відпочити</p>
              </div>
            </div>

            <!-- Sound Options -->
            <div class="meditation-sound-options">
              <button class="sound-option-btn active" data-sound="nature">
                <i class="fas fa-leaf"></i>
                <span data-key="meditation-sound-nature">Природа</span>
              </button>
              <button class="sound-option-btn" data-sound="rain">
                <i class="fas fa-cloud-rain"></i>
                <span data-key="meditation-sound-rain">Дощ</span>
              </button>
              <button class="sound-option-btn" data-sound="ocean">
                <i class="fas fa-water"></i>
                <span data-key="meditation-sound-ocean">Океан</span>
              </button>
              <button class="sound-option-btn" data-sound="silence">
                <i class="fas fa-volume-mute"></i>
                <span data-key="meditation-sound-silence">Тиша</span>
              </button>
            </div>

            <!-- Exit -->
            <div class="meditation-footer">
              <button class="btn btn-outline meditation-skip-btn" data-key="meditation-skip">Пропустити</button>
              <button class="btn btn-primary meditation-complete-btn hidden">
                <i class="fas fa-heart"></i>
                <span data-key="meditation-order-btn">Замовити цю картину</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Apply translations to dynamically created content
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }

      this.startMeditation(modal);

      // Close handlers
      modal.querySelector('.meditation-ultra-close').addEventListener('click', () => this.close(modal));
      modal.querySelector('.meditation-skip-btn').addEventListener('click', () => this.close(modal));
      modal.querySelector('.meditation-complete-btn').addEventListener('click', () => {
        window.location.href = '#business';
        this.close(modal);
      });
    }

    startMeditation(modal) {
      const breathCircle = modal.querySelector('.breath-circle');
      const breathText = modal.querySelector('.breath-instruction');
      const playPauseBtn = modal.querySelector('#med-play-pause');
      const progress = modal.querySelector('#med-progress');
      const marker = modal.querySelector('#med-marker');
      const timeDisplay = modal.querySelector('#med-current-time');
      const completeBtn = modal.querySelector('.meditation-complete-btn');
      const steps = modal.querySelectorAll('.meditation-step');

      let time = 0;
      let breathPhase = 'inhale'; // inhale, hold, exhale

      const getTranslation = (key) => {
        if (typeof window.getTranslation === 'function') {
          return window.getTranslation(key);
        }
        const fallbacks = {
          'meditation-breathe-in': 'Вдихайте...',
          'meditation-hold': 'Затримайте...',
          'meditation-breathe-out': 'Видихайте...'
        };
        return fallbacks[key] || key;
      };

      const breathCycle = () => {
        if (breathPhase === 'inhale') {
          breathCircle.style.transform = 'scale(1.5)';
          breathText.textContent = getTranslation('meditation-breathe-in');
          setTimeout(() => { breathPhase = 'hold'; breathCycle(); }, 4000);
        } else if (breathPhase === 'hold') {
          breathText.textContent = getTranslation('meditation-hold');
          setTimeout(() => { breathPhase = 'exhale'; breathCycle(); }, 2000);
        } else {
          breathCircle.style.transform = 'scale(1)';
          breathText.textContent = getTranslation('meditation-breathe-out');
          setTimeout(() => { breathPhase = 'inhale'; breathCycle(); }, 6000);
        }
      };

      breathCycle();

      const meditationTimer = setInterval(() => {
        if (!this.isPlaying) return;

        time++;
        this.currentTime = time;

        // Update progress
        const percent = (time / this.duration) * 100;
        progress.style.width = `${percent}%`;
        marker.style.left = `${percent}%`;

        // Update time display
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        timeDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Update steps
        const currentStep = Math.floor((time / this.duration) * 4) + 1;
        steps.forEach((step, idx) => {
          step.classList.toggle('active', idx + 1 === currentStep);
        });

        // Complete
        if (time >= this.duration) {
          clearInterval(meditationTimer);
          this.complete(modal, completeBtn);
        }
      }, 1000);

      this.isPlaying = true;

      // Play/Pause
      playPauseBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playPauseBtn.querySelector('i').className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
      });

      // Sound options
      modal.querySelectorAll('.sound-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.querySelectorAll('.sound-option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          window.showToast(`Звук змінено на: ${btn.textContent.trim()}`, 2000);
        });
      });
    }

    complete(modal, completeBtn) {
      const getTranslation = (key) => {
        if (typeof window.getTranslation === 'function') {
          return window.getTranslation(key);
        }
        return key;
      };

      modal.querySelector('.meditation-artwork-display').classList.add('complete');
      modal.querySelector('.breath-text').innerHTML = `<h3>✨ ${getTranslation('meditation-complete-msg')}</h3>`;
      completeBtn.classList.remove('hidden');
      window.showToast('Чудова робота! Ви відчули гармонію.', 3000);
    }

    close(modal) {
      this.isPlaying = false;
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // =====================================================
  // BUSINESS ROI CALCULATOR
  // =====================================================

  class ROICalculator {
    constructor() {
      this.init();
    }

    init() {
      // Add ROI Calculator button to business section
      const businessSection = document.querySelector('.business-section');
      if (!businessSection) return;

      const calcButton = document.createElement('div');
      calcButton.className = 'roi-calculator-trigger';
      calcButton.innerHTML = `
        <button class="btn btn-primary btn-large" id="roi-calc-btn">
          <i class="fas fa-calculator"></i>
          <span data-key="roi-calc-trigger">Розрахувати ROI для вашого простору</span>
        </button>
      `;

      const consultation = businessSection.querySelector('.business-consultation');
      if (consultation) {
        consultation.after(calcButton);
      }

      // Apply translations to dynamically created content
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }

      calcButton.addEventListener('click', () => this.open());
    }

    open() {
      const modal = document.createElement('div');
      modal.className = 'modal roi-calculator-modal open';
      modal.innerHTML = `
        <div class="modal-content roi-calculator-content">
          <button class="modal-close roi-calc-close">&times;</button>

          <div class="roi-calculator-container">
            <h2><i class="fas fa-chart-line"></i> <span data-key="roi-calc-title">Калькулятор ROI мистецтва</span></h2>
            <p class="roi-subtitle" data-key="roi-calc-subtitle">Дізнайтеся, як картини Inner Garden вплинуть на ваш бізнес</p>

            <div class="roi-form">
              <div class="form-group">
                <label data-key="roi-space-type-label">Тип вашого простору</label>
                <select id="roi-space-type">
                  <option value="hotel" data-key="roi-space-hotel">Готель</option>
                  <option value="medical" data-key="roi-space-medical">Медичний центр</option>
                  <option value="office" data-key="roi-space-office">Офіс</option>
                  <option value="wellness" data-key="roi-space-wellness">Wellness центр</option>
                  <option value="restaurant" data-key="roi-space-restaurant">Ресторан</option>
                </select>
              </div>

              <div class="form-group">
                <label data-key="roi-visitors-label">Кількість відвідувачів/клієнтів на місяць</label>
                <input type="number" id="roi-visitors" min="10" value="500" step="10">
              </div>

              <div class="form-group">
                <label data-key="roi-avg-check-label">Середній чек / вартість послуги ($)</label>
                <input type="number" id="roi-avg-check" min="1" value="100" step="1">
              </div>

              <div class="form-group">
                <label data-key="roi-budget-label">Бюджет на мистецтво ($)</label>
                <input type="number" id="roi-budget" min="1000" value="10000" step="1000">
              </div>

              <button class="btn btn-primary btn-large" id="roi-calculate-btn">
                <i class="fas fa-calculator"></i>
                <span data-key="roi-calculate-btn">Розрахувати ROI</span>
              </button>
            </div>

            <div class="roi-results hidden" id="roi-results">
              <h3>📊 <span data-key="roi-results-title">Ваш прогнозований ROI</span></h3>

              <div class="roi-metrics-grid">
                <div class="roi-metric-card">
                  <div class="metric-icon">📈</div>
                  <div class="metric-value" id="roi-nps-increase">+0%</div>
                  <div class="metric-label" data-key="roi-nps-growth">Зростання NPS</div>
                </div>

                <div class="roi-metric-card">
                  <div class="metric-icon">💰</div>
                  <div class="metric-value" id="roi-revenue-increase">$0</div>
                  <div class="metric-label" data-key="roi-revenue-increase">Додатковий дохід/рік</div>
                </div>

                <div class="roi-metric-card">
                  <div class="metric-icon">😊</div>
                  <div class="metric-value" id="roi-satisfaction">+0%</div>
                  <div class="metric-label" data-key="roi-client-satisfaction">Задоволеність клієнтів</div>
                </div>

                <div class="roi-metric-card">
                  <div class="metric-icon">⏱️</div>
                  <div class="metric-value" id="roi-payback">0 міс</div>
                  <div class="metric-label" data-key="roi-payback">Окупність</div>
                </div>
              </div>

              <div class="roi-breakdown">
                <h4 data-key="roi-breakdown-title">Детальний розрахунок:</h4>
                <ul id="roi-breakdown-list"></ul>
              </div>

              <div class="roi-action">
                <p><strong data-key="roi-ready-question">Готові покращити ваш простір?</strong></p>
                <button class="btn btn-primary btn-large" id="roi-consult-btn">
                  <i class="fas fa-calendar"></i>
                  <span data-key="roi-consult-btn">Записатись на консультацію</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Apply translations to dynamically created content
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }

      // Calculate button
      modal.querySelector('#roi-calculate-btn').addEventListener('click', () => this.calculate(modal));

      // Close handlers
      modal.querySelector('.roi-calc-close').addEventListener('click', () => this.close(modal));
      modal.querySelector('#roi-consult-btn')?.addEventListener('click', () => {
        window.location.href = '#business';
        this.close(modal);
      });
    }

    calculate(modal) {
      const spaceType = modal.querySelector('#roi-space-type').value;
      const visitors = parseInt(modal.querySelector('#roi-visitors').value);
      const avgCheck = parseInt(modal.querySelector('#roi-avg-check').value);
      const budget = parseInt(modal.querySelector('#roi-budget').value);

      // ROI Coefficients based on our data
      const coefficients = {
        hotel: { nps: 22, satisfaction: 40, revenue: 0.15 },
        medical: { nps: 18, satisfaction: 35, revenue: 0.12 },
        office: { nps: 15, satisfaction: 30, revenue: 0.10 },
        wellness: { nps: 25, satisfaction: 45, revenue: 0.18 },
        restaurant: { nps: 20, satisfaction: 38, revenue: 0.14 }
      };

      const coef = coefficients[spaceType];

      // Calculations
      const monthlyRevenue = visitors * avgCheck;
      const annualRevenue = monthlyRevenue * 12;
      const revenueIncrease = annualRevenue * coef.revenue;
      const paybackMonths = Math.ceil(budget / (revenueIncrease / 12));

      // Display results
      const results = modal.querySelector('#roi-results');
      results.classList.remove('hidden');

      modal.querySelector('#roi-nps-increase').textContent = `+${coef.nps}%`;
      modal.querySelector('#roi-revenue-increase').textContent = `$${revenueIncrease.toLocaleString()}`;
      modal.querySelector('#roi-satisfaction').textContent = `+${coef.satisfaction}%`;
      modal.querySelector('#roi-payback').textContent = `${paybackMonths} міс`;

      // Breakdown
      const breakdown = modal.querySelector('#roi-breakdown-list');
      breakdown.innerHTML = `
        <li>Щомісячний дохід: <strong>$${monthlyRevenue.toLocaleString()}</strong></li>
        <li>Річний дохід: <strong>$${annualRevenue.toLocaleString()}</strong></li>
        <li>Приріст доходу (+${coef.revenue * 100}%): <strong>$${revenueIncrease.toLocaleString()}</strong></li>
        <li>Інвестиція в мистецтво: <strong>$${budget.toLocaleString()}</strong></li>
        <li>Окупність: <strong>${paybackMonths} місяців</strong></li>
        <li>ROI за перший рік: <strong>${Math.round((revenueIncrease / budget) * 100)}%</strong></li>
      `;

      // Scroll to results
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      window.showToast('Розрахунок завершено! Перегляньте результати нижче.', 3000);
    }

    close(modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // =====================================================
  // VIRTUAL TOUR 360° (для готелів та бізнесів)
  // =====================================================

  class VirtualTour {
    constructor() {
      this.init();
    }

    init() {
      // Add Virtual Tour buttons to relevant sections
      const storiesSection = document.querySelector('.stories-section');
      if (!storiesSection) return;

      const tourButton = document.createElement('div');
      tourButton.className = 'virtual-tour-trigger';
      tourButton.innerHTML = `
        <div class="section-header" style="margin-top: 4rem;">
          <h2 class="section-title" data-key="virtual-tour-title">${window.t?.('virtual-tour-title') || 'Віртуальний тур'}</h2>
          <div class="section-line"></div>
          <p class="section-subtitle" data-key="virtual-tour-subtitle">${window.t?.('virtual-tour-subtitle') || 'Подивіться, як виглядають наші картини у реальних просторах'}</p>
        </div>
        <div style="text-align: center; margin-top: 2rem;">
          <button class="btn btn-primary btn-large" id="virtual-tour-btn">
            <i class="fas fa-vr-cardboard"></i>
            <span data-key="virtual-tour-btn">${window.t?.('virtual-tour-btn') || 'Розпочати віртуальний тур'}</span>
          </button>
        </div>
      `;

      storiesSection.querySelector('.story-submit').before(tourButton);

      tourButton.querySelector('#virtual-tour-btn').addEventListener('click', () => this.start());
    }

    start() {
      const modal = document.createElement('div');
      modal.className = 'modal virtual-tour-modal open';
      modal.innerHTML = `
        <div class="modal-content virtual-tour-content">
          <button class="modal-close tour-close">&times;</button>

          <div class="tour-container">
            <h2><i class="fas fa-vr-cardboard"></i> <span data-key="tour-modal-title">${window.t?.('tour-modal-title') || 'Віртуальний тур по просторах'}</span></h2>

            <div class="tour-locations">
              <button class="tour-location-btn active" data-location="hotel-lobby">
                <div class="location-icon">🏨</div>
                <span data-key="tour-location-hotel">${window.t?.('tour-location-hotel') || 'Готель - Лобі'}</span>
              </button>
              <button class="tour-location-btn" data-location="medical-waiting">
                <div class="location-icon">🏥</div>
                <span data-key="tour-location-medical">${window.t?.('tour-location-medical') || 'Медцентр - Очікування'}</span>
              </button>
              <button class="tour-location-btn" data-location="office-meeting">
                <div class="location-icon">🏢</div>
                <span data-key="tour-location-office">${window.t?.('tour-location-office') || 'Офіс - Переговорна'}</span>
              </button>
            </div>

            <div class="tour-viewer">
              <div class="tour-360-container" id="tour-360-view">
                <img src="assets/images/360/hotel-lobby.jpg" alt="360 view" class="tour-360-image">
                <div class="tour-360-hint">
                  <i class="fas fa-arrows-alt"></i>
                  <p data-key="tour-drag-hint">${window.t?.('tour-drag-hint') || 'Перетягуйте для огляду'}</p>
                </div>
              </div>
            </div>

            <div class="tour-info">
              <h3 id="tour-location-name">Готель "Гармонія" - Лобі</h3>
              <p id="tour-location-desc">Розмір картини: 180×120 см. NPS зріс на 25% після встановлення.</p>
            </div>

            <div class="tour-footer">
              <button class="btn btn-outline tour-prev-btn">
                <i class="fas fa-arrow-left"></i>
                <span data-key="tour-prev-btn">${window.t?.('tour-prev-btn') || 'Попередня'}</span>
              </button>
              <button class="btn btn-primary">
                <i class="fas fa-info-circle"></i>
                <span data-key="tour-details-btn">${window.t?.('tour-details-btn') || 'Детальніше про цей проект'}</span>
              </button>
              <button class="btn btn-outline tour-next-btn">
                <span data-key="tour-next-btn">${window.t?.('tour-next-btn') || 'Наступна'}</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.classList.add('modal-open');

      // Apply translations to dynamically created content
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }

      // Location buttons
      modal.querySelectorAll('.tour-location-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.querySelectorAll('.tour-location-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const location = btn.dataset.location;
          this.changeLocation(modal, location);
        });
      });

      // Close handler
      modal.querySelector('.tour-close').addEventListener('click', () => this.close(modal));
    }

    changeLocation(modal, location) {
      const locations = {
        'hotel-lobby': {
          name: 'Готель "Гармонія" - Лобі',
          desc: 'Розмір картини: 180×120 см. NPS зріс на 25% після встановлення.',
          image: 'hotel-lobby.jpg'
        },
        'medical-waiting': {
          name: 'Медичний центр "Здоров\'я" - Зона очікування',
          desc: 'Розмір картини: 150×100 см. Рівень стресу пацієнтів знизився на 30%.',
          image: 'medical-waiting.jpg'
        },
        'office-meeting': {
          name: 'IT Офіс - Переговорна',
          desc: 'Розмір картини: 200×140 см. Продуктивність зустрічей зросла на 15%.',
          image: 'office-meeting.jpg'
        }
      };

      const loc = locations[location];
      modal.querySelector('#tour-location-name').textContent = loc.name;
      modal.querySelector('#tour-location-desc').textContent = loc.desc;
      modal.querySelector('.tour-360-image').src = `assets/images/360/${loc.image}`;

      window.showToast(`Локація змінена: ${loc.name}`, 2000);
    }

    close(modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      setTimeout(() => modal.remove(), 300);
    }
  }

  // =====================================================
  // COLOR MOOD SELECTOR
  // =====================================================

  class ColorMoodSelector {
    constructor() {
      this.init();
    }

    init() {
      const artworksSection = document.querySelector('.artworks-section');
      if (!artworksSection) return;

      const selectorDiv = document.createElement('div');
      selectorDiv.className = 'color-mood-selector';
      selectorDiv.innerHTML = `
        <div class="mood-selector-header">
          <h3><i class="fas fa-palette"></i> <span data-key="mood-filter-title">Фільтр по настрою і кольорам</span></h3>
        </div>
        <div class="mood-options">
          <button class="mood-btn" data-mood="calm" style="--mood-color: #87CEEB">
            <span class="mood-emoji">😌</span>
            <span data-key="mood-calm">Спокій</span>
          </button>
          <button class="mood-btn" data-mood="energy" style="--mood-color: #FF6B6B">
            <span class="mood-emoji">⚡</span>
            <span data-key="mood-energy">Енергія</span>
          </button>
          <button class="mood-btn" data-mood="focus" style="--mood-color: #4ECDC4">
            <span class="mood-emoji">🎯</span>
            <span data-key="mood-focus">Фокус</span>
          </button>
          <button class="mood-btn" data-mood="luxury" style="--mood-color: #F4A460">
            <span class="mood-emoji">✨</span>
            <span data-key="mood-luxury">Розкіш</span>
          </button>
          <button class="mood-btn" data-mood="nature" style="--mood-color: #90EE90">
            <span class="mood-emoji">🌿</span>
            <span data-key="mood-nature">Природа</span>
          </button>
        </div>
      `;

      artworksSection.querySelector('.section-header').after(selectorDiv);

      // Apply translations to dynamically created content
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
      }

      selectorDiv.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectorDiv.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mood = btn.dataset.mood;
          this.filterByMood(mood);
        });
      });
    }

    filterByMood(mood) {
      window.showToast(`Фільтр застосовано: ${this.getMoodName(mood)}`, 2000);
      // Here you would filter artwork cards
    }

    getMoodName(mood) {
      const names = {
        calm: 'Спокій',
        energy: 'Енергія',
        focus: 'Фокус',
        luxury: 'Розкіш',
        nature: 'Природа'
      };
      return names[mood] || mood;
    }
  }

  // =====================================================
  // INITIALIZE ALL WOW FEATURES
  // =====================================================

  let featuresInitialized = false;

  const initWowFeatures = () => {
    if (featuresInitialized) return;
    featuresInitialized = true;

    new MeditationExperience();
    new ROICalculator();
    new VirtualTour();
    new ColorMoodSelector();

    console.log('✨ All WOW business features initialized');
  };

  // Чекаємо поки мова буде вибрана
  const checkAndInit = () => {
    if (window.t && typeof window.t === 'function') {
      initWowFeatures();
    } else {
      // Якщо t() ще не готова, чекаємо
      setTimeout(checkAndInit, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndInit);
  } else {
    checkAndInit();
  }

})();
