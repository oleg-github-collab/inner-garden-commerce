// Inner Garden - Artworks with Touch-to-Awaken Audio Feature

// Unique stylesheet for artworks module
const artworksStyleSheet = (() => {
  const style = document.createElement('style');
  style.textContent = `
    .artwork-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      padding: 2rem;
    }
    .artwork-card {
      background: var(--color-surface);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .artwork-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);
  return style;
})();

class ArtworkGallery {
  constructor() {
    this.container = null;
    this.artworks = [];
    this.currentAudio = null;
    this.audioContext = null;
    this.userHasInteracted = false;
    
    this.init();
  }

  init() {
    this.container = document.getElementById('artworks-grid');
    if (!this.container) return;

    this.loadArtworks();
    this.setupAudioContext();
    this.renderArtworks();
    this.bindEvents();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // Handle artwork loading errors
    this.errorHandler = window.InnerGarden?.errorHandler;
    
    if (this.errorHandler) {
      this.errorHandler.logInfo('ArtworkGallery initialized');
    }
    
    // Handle audio loading errors
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'AUDIO') {
        this.handleAudioError(event.target);
      }
    }, true);
  }

  handleAudioError(audioElement) {
    console.warn('Audio loading failed:', audioElement.src);
    if (this.errorHandler) {
      this.errorHandler.handleResourceError(audioElement, 'artwork audio');
    }
    
    // Provide silent fallback
    audioElement.src = 'assets/audio/placeholder-silence.mp3';
  }

  loadArtworks() {
    // Enhanced artwork data with multilingual support
    this.artworks = [
      {
        id: 1,
        title: {
          uk: 'Внутрішній Спокій',
          en: 'Inner Peace',
          de: 'Innerer Frieden'
        },
        price: '$2,500',
        image: 'assets/images/artworks/inner-peace.jpg',
        audioUrl: 'assets/audio/nature-water.mp3',
        quote: {
          uk: 'Спокій - це не відсутність буревію, а тиша серед нього',
          en: 'Peace is not the absence of storm, but silence within it',
          de: 'Frieden ist nicht die Abwesenheit von Sturm, sondern Stille in ihm'
        },
        author: {
          uk: 'Марина Камінська',
          en: 'Marina Kaminska',
          de: 'Marina Kaminska'
        },
        description: {
          uk: 'Заспокійлива абстракція в блакитних тонах, що створює відчуття глибокого умиротворення',
          en: 'Soothing abstraction in blue tones that creates a sense of deep tranquility',
          de: 'Beruhigende Abstraktion in blauen Tönen, die ein Gefühl tiefer Ruhe schafft'
        },
        tags: {
          uk: ['спокій', 'медитація', 'офіс', 'блакитний'],
          en: ['peace', 'meditation', 'office', 'blue'],
          de: ['frieden', 'meditation', 'büro', 'blau']
        },
        dimensions: '80x120 см',
        technique: {
          uk: 'Акрил на полотні',
          en: 'Acrylic on canvas',
          de: 'Acryl auf Leinwand'
        },
        year: '2024',
        emotions: {
          uk: ['умиротворення', 'баланс', 'гармонія'],
          en: ['tranquility', 'balance', 'harmony'],
          de: ['ruhe', 'gleichgewicht', 'harmonie']
        }
      },
      {
        id: 2,
        title: 'Енергія Сонця',
        price: '$3,200',
        image: 'assets/images/artworks/sun-energy.jpg',
        audioUrl: 'assets/audio/nature-wind.mp3',
        quote: 'Енергія мистецтва здатна запалити серця і надихнути душі',
        author: 'Марина Камінська',
        description: 'Динамічна композиція в теплих тонах, що заряджає енергією та оптимізмом',
        tags: ['енергія', 'мотивація', 'офіс', 'жовтий', 'помаранчевий'],
        dimensions: '100x100 см',
        technique: 'Змішана техніка',
        year: '2024',
        emotions: ['радість', 'ентузіазм', 'натхнення']
      },
      {
        id: 3,
        title: 'Гармонія Природи',
        price: '$2,800',
        image: 'assets/images/artworks/nature-harmony.jpg',
        audioUrl: 'assets/audio/nature-forest.mp3',
        quote: 'Природа - найкращий вчитель гармонії та балансу',
        author: 'Марина Камінська',
        description: 'Збалансована композиція природних форм у зелено-коричневій гамі',
        tags: ['природа', 'баланс', 'wellness', 'зелений'],
        dimensions: '90x120 см',
        technique: 'Акрил на полотні',
        year: '2024',
        emotions: ['заземлення', 'стабільність', 'зв\'язок']
      },
      {
        id: 4,
        title: 'Креативний Потік',
        price: '$3,500',
        image: 'assets/images/artworks/creative-flow.jpg',
        audioUrl: 'assets/audio/nature-rain.mp3',
        quote: 'Творчість - це міст між мрією та реальністю',
        author: 'Марина Камінська',
        description: 'Натхненна робота з динамічними елементами, що стимулює креативне мислення',
        tags: ['творчість', 'інновації', 'офіс', 'різнокольоровий'],
        dimensions: '120x160 см',
        technique: 'Акрил, колаж',
        year: '2024',
        emotions: ['натхнення', 'новаторство', 'свобода']
      },
      {
        id: 5,
        title: 'Медитативний Простір',
        price: '$2,900',
        image: 'assets/images/artworks/meditative-space.jpg',
        audioUrl: 'assets/audio/nature-ocean.mp3',
        quote: 'У тиші знаходимо найглибші відповіді на свої питання',
        author: 'Марина Камінська',
        description: 'Умиротворяюча картина для медитації та внутрішнього споглядання',
        tags: ['медитація', 'лікування', 'медцентр', 'фіолетовий'],
        dimensions: '70x100 см',
        technique: 'Акварель, акрил',
        year: '2024',
        emotions: ['спокій', 'рефлексія', 'глибина']
      },
      {
        id: 6,
        title: 'Готельна Елегантність',
        price: '$4,000',
        image: 'assets/images/artworks/hotel-elegance.jpg',
        audioUrl: 'assets/audio/nature-birds.mp3',
        quote: 'Елегантність - це не привертання уваги, а запам\'ятовування',
        author: 'Марина Камінська',
        description: 'Витончена робота для готельних просторів з нотками розкоші',
        tags: ['елегантність', 'розкіш', 'готель', 'золотий'],
        dimensions: '100x140 см',
        technique: 'Акрил, сусальне золото',
        year: '2024',
        emotions: ['витонченість', 'престиж', 'комфорт']
      }
    ];
  }

  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }

    // Check for user interaction
    const enableAudio = () => {
      this.userHasInteracted = true;
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
  }

  renderArtworks() {
    this.container.innerHTML = '';

    this.artworks.forEach((artwork, index) => {
      const card = this.createArtworkCard(artwork, index);
      this.container.appendChild(card);

      // Animate cards on scroll
      this.observeArtworkCard(card);
    });
  }

  createArtworkCard(artwork, index) {
    // Get current language and localized content
    const lang = window.ultraI18n ? window.ultraI18n.getCurrentLanguage() : 'uk';
    const title = artwork.title[lang] || artwork.title.uk || artwork.title;
    const description = artwork.description[lang] || artwork.description.uk || artwork.description;
    const quote = artwork.quote[lang] || artwork.quote.uk || artwork.quote;
    const author = artwork.author[lang] || artwork.author.uk || artwork.author;
    const tags = artwork.tags[lang] || artwork.tags.uk || artwork.tags;
    const emotions = artwork.emotions[lang] || artwork.emotions.uk || artwork.emotions;
    const technique = artwork.technique[lang] || artwork.technique.uk || artwork.technique;

    const card = document.createElement('div');
    card.className = 'artwork-card';
    card.setAttribute('data-artwork-id', artwork.id);
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';

    const emotionsLabel = window.ultraI18n ? window.ultraI18n.translate('emotions') : 'Емоції';
    const playSoundTitle = window.ultraI18n ? window.ultraI18n.translate('play-sound') : 'Послухати звуки';
    const viewArTitle = window.ultraI18n ? window.ultraI18n.translate('view-ar') : 'Переглянути в AR';
    const artworkTouchTitle = window.ultraI18n ? window.ultraI18n.translate('artwork-touch') : 'Доторкніться';

    card.innerHTML = `
      <div class="artwork-image">
        <img src="${artwork.image}" 
             alt="${title}" 
             loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBsYWNlaG9sZGVyR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjlmYTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlOWVjZWY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwbGFjZWhvbGRlckdyYWQpIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGVlMmU2IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxMjUiIHk9IjE3MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNmM3NTdkIiByeD0iNCIvPjxjaXJjbGUgY3g9IjEzNSIgY3k9IjE4NSIgcj0iOCIgZmlsbD0iI2FkYjViZCIvPjx0ZXh0IHg9IjE1MCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM3NTdkIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        
        <div class="artwork-overlay">
          <div class="artwork-actions">
            <button class="artwork-action-btn play-sound-btn" title="${playSoundTitle}">
              <i class="fas fa-volume-up"></i>
            </button>
            <button class="artwork-action-btn view-ar-btn" title="${viewArTitle}">
              <i class="fas fa-mobile-alt"></i>
            </button>
          </div>
        </div>

        <div class="artwork-quote">
          <blockquote>"${quote}"</blockquote>
          <cite>— ${author}</cite>
        </div>

        <!-- Audio visualizer -->
        <canvas class="audio-visualizer" width="300" height="60"></canvas>
      </div>

      <div class="artwork-content">
        <div class="artwork-header">
          <h3 class="artwork-title">${title}</h3>
          <div class="artwork-price">${artwork.price}</div>
        </div>
        
        <p class="artwork-description">${description}</p>
        
        <div class="artwork-tags">
          ${tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>

        <div class="artwork-emotions">
          <span class="emotions-label">${emotionsLabel}:</span>
          ${emotions.map(emotion => `<span class="emotion-chip">${emotion}</span>`).join('')}
        </div>

        <div class="artwork-buttons">
          <button class="btn btn-primary view-ar-btn" data-artwork-id="${artwork.id}">
            <i class="fas fa-mobile-alt"></i>
            <span data-key="artwork-view-ar">Побачити в AR</span>
          </button>
          <button class="btn btn-outline artwork-details-btn" data-artwork-id="${artwork.id}">
            <i class="fas fa-info-circle"></i>
            <span data-key="artwork-details">Деталі</span>
          </button>
        </div>
      </div>
    `;

    this.bindCardEvents(card, artwork);
    return card;
  }

  bindCardEvents(card, artwork) {
    // Hover effects with audio
    card.addEventListener('mouseenter', () => {
      this.onArtworkHover(card, artwork);
    });

    card.addEventListener('mouseleave', () => {
      this.onArtworkLeave(card, artwork);
    });

    // Touch events for mobile
    card.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.onArtworkTouch(card, artwork);
    });

    // Audio buttons
    const playSoundBtn = card.querySelector('.play-sound-btn');
    playSoundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.playArtworkAudio(artwork, card);
    });

    // AR view buttons
    const arBtns = card.querySelectorAll('.view-ar-btn');
    arBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showArtworkInAR(artwork);
      });
    });

    // Details button
    const detailsBtn = card.querySelector('.artwork-details-btn');
    detailsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showArtworkDetails(artwork);
    });
  }

  onArtworkHover(card, artwork) {
    // Add hover class for animations
    card.classList.add('artwork-hovered');
    
    // Show quote with delay
    setTimeout(() => {
      const quote = card.querySelector('.artwork-quote');
      if (quote) {
        quote.style.opacity = '1';
        quote.style.transform = 'translateY(0)';
      }
    }, 300);

    // Play subtle ambient audio if user has interacted
    if (this.userHasInteracted) {
      this.playArtworkAudio(artwork, card, { volume: 0.1, fadeIn: true });
    }

    // Update custom cursor
    if (window.customCursor) {
      window.customCursor.showText(i18n.translate('artwork-touch') || 'Доторкніться');
    }
  }

  onArtworkLeave(card, artwork) {
    card.classList.remove('artwork-hovered');
    
    // Hide quote
    const quote = card.querySelector('.artwork-quote');
    if (quote) {
      quote.style.opacity = '0';
      quote.style.transform = 'translateY(20px)';
    }

    // Stop audio with fade out
    this.stopCurrentAudio(true);

    // Stop visualizer
    this.stopAudioVisualizer(card);
  }

  onArtworkTouch(card, artwork) {
    // Mobile touch interaction
    this.playArtworkAudio(artwork, card);
    
    // Haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Show quote immediately on mobile
    const quote = card.querySelector('.artwork-quote');
    if (quote) {
      quote.style.opacity = '1';
      quote.style.transform = 'translateY(0)';
    }
  }

  async playArtworkAudio(artwork, card, options = {}) {
    const { 
      volume = 0.3, 
      fadeIn = false, 
      loop = false,
      visualize = true 
    } = options;

    // Stop current audio
    this.stopCurrentAudio();

    if (!this.userHasInteracted) {
      this.showToast(i18n.translate('click-to-enable-audio') || 'Клікніть, щоб увімкнути звук');
      return;
    }

    try {
      // Create audio element
      const audio = new Audio(artwork.audioUrl);
      audio.volume = fadeIn ? 0 : volume;
      audio.loop = loop;
      
      // Store current audio reference
      this.currentAudio = {
        element: audio,
        artwork: artwork,
        card: card,
        targetVolume: volume
      };

      // Update button state
      const playBtn = card.querySelector('.play-sound-btn');
      if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
      }

      // Start playback
      await audio.play();

      // Fade in effect
      if (fadeIn) {
        this.fadeInAudio(audio, volume, 1000);
      }

      // Start visualizer
      if (visualize) {
        this.startAudioVisualizer(audio, card);
      }

      // Handle audio end
      audio.addEventListener('ended', () => {
        this.onAudioEnded(card);
      });

      // Handle errors
      audio.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        this.onAudioEnded(card);
        this.showToast(i18n.translate('audio-error') || 'Помилка відтворення аудіо');
      });

    } catch (error) {
      console.warn('Audio playback failed:', error);
      this.showToast(i18n.translate('audio-not-supported') || 'Аудіо не підтримується');
    }
  }

  stopCurrentAudio(fadeOut = false) {
    if (this.currentAudio && this.currentAudio.element) {
      const audio = this.currentAudio.element;
      const card = this.currentAudio.card;

      if (fadeOut) {
        this.fadeOutAudio(audio, 500, () => {
          audio.pause();
          this.resetAudioButton(card);
        });
      } else {
        audio.pause();
        this.resetAudioButton(card);
      }

      this.stopAudioVisualizer(card);
      this.currentAudio = null;
    }
  }

  fadeInAudio(audio, targetVolume, duration) {
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(volumeStep * currentStep, targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  fadeOutAudio(audio, duration, callback) {
    const steps = 20;
    const stepTime = duration / steps;
    const initialVolume = audio.volume;
    const volumeStep = initialVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(initialVolume - (volumeStep * currentStep), 0);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, stepTime);
  }

  startAudioVisualizer(audio, card) {
    const canvas = card.querySelector('.audio-visualizer');
    if (!canvas || !this.audioContext) return;

    const ctx = canvas.getContext('2d');
    const analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaElementSource(audio);
    
    source.connect(analyser);
    analyser.connect(this.audioContext.destination);
    
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.currentAudio) return;
      
      requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(230, 126, 34, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bufferLength;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(230, 126, 34, 0.8)');
        gradient.addColorStop(1, 'rgba(243, 156, 18, 0.4)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };

    // Make canvas visible
    canvas.style.opacity = '1';
    draw();
  }

  stopAudioVisualizer(card) {
    const canvas = card.querySelector('.audio-visualizer');
    if (canvas) {
      canvas.style.opacity = '0';
    }
  }

  onAudioEnded(card) {
    this.resetAudioButton(card);
    this.stopAudioVisualizer(card);
    this.currentAudio = null;
  }

  resetAudioButton(card) {
    const playBtn = card.querySelector('.play-sound-btn');
    if (playBtn) {
      playBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      playBtn.classList.remove('playing');
    }
  }

  showArtworkInAR(artwork) {
    if (window.arViewer) {
      window.arViewer.showArtwork(artwork);
    } else {
      // Fallback: show AR modal
      this.showARModal(artwork);
    }
  }

  showARModal(artwork) {
    const modal = document.getElementById('ar-modal');
    if (modal) {
      // Set artwork data
      const fallbackImage = modal.querySelector('#ar-fallback-image');
      if (fallbackImage) {
        fallbackImage.src = artwork.image;
        fallbackImage.alt = artwork.title;
      }

      modal.classList.add('open');
      document.body.classList.add('modal-open');
    }
  }

  showArtworkDetails(artwork) {
    const modal = document.createElement('div');
    modal.className = 'modal artwork-detail-modal open';
    modal.innerHTML = `
      <div class="modal-content artwork-modal-content">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="artwork-detail-container">
          <div class="artwork-detail-image">
            <img src="${artwork.image}" alt="${artwork.title}">
            <button class="detail-play-audio" data-artwork-id="${artwork.id}">
              <i class="fas fa-play"></i>
              <span>Послухати звуки картини</span>
            </button>
          </div>
          
          <div class="artwork-detail-info">
            <div class="artwork-detail-header">
              <h2>${artwork.title}</h2>
              <div class="artwork-price-large">${artwork.price}</div>
            </div>
            
            <div class="artwork-meta">
              <div class="meta-item">
                <strong>Розміри:</strong> ${artwork.dimensions}
              </div>
              <div class="meta-item">
                <strong>Техніка:</strong> ${artwork.technique}
              </div>
              <div class="meta-item">
                <strong>Рік:</strong> ${artwork.year}
              </div>
            </div>
            
            <div class="artwork-description-full">
              <p>${artwork.description}</p>
            </div>
            
            <div class="artwork-quote-detail">
              <blockquote>"${artwork.quote}"</blockquote>
              <cite>— ${artwork.author}</cite>
            </div>
            
            <div class="artwork-emotions-detail">
              <h4>Емоційний вплив:</h4>
              <div class="emotions-grid">
                ${artwork.emotions.map(emotion => `
                  <span class="emotion-badge">${emotion}</span>
                `).join('')}
              </div>
            </div>
            
            <div class="artwork-actions-detail">
              <button class="btn btn-primary btn-large order-btn">
                <i class="fas fa-shopping-cart"></i>
                Замовити картину
              </button>
              <button class="btn btn-outline view-ar-detail-btn" data-artwork-id="${artwork.id}">
                <i class="fas fa-mobile-alt"></i>
                Переглянути в AR
              </button>
              <button class="btn btn-outline share-btn" data-artwork-id="${artwork.id}">
                <i class="fas fa-share"></i>
                Поділитися
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Bind events
    this.bindModalEvents(modal, artwork);
  }

  bindModalEvents(modal, artwork) {
    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      this.closeModal(modal);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    // Audio play button
    const playBtn = modal.querySelector('.detail-play-audio');
    playBtn.addEventListener('click', () => {
      // Create fake card for audio system
      const fakeCard = { querySelector: () => playBtn };
      this.playArtworkAudio(artwork, fakeCard, { volume: 0.5, visualize: false });
    });

    // AR button
    const arBtn = modal.querySelector('.view-ar-detail-btn');
    arBtn.addEventListener('click', () => {
      this.showArtworkInAR(artwork);
    });

    // Share button
    const shareBtn = modal.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
      this.shareArtwork(artwork);
    });

    // Order button
    const orderBtn = modal.querySelector('.order-btn');
    orderBtn.addEventListener('click', () => {
      this.orderArtwork(artwork);
    });

    // ESC key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  closeModal(modal) {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    
    setTimeout(() => {
      modal.remove();
    }, 300);

    // Stop any playing audio
    this.stopCurrentAudio();
  }

  shareArtwork(artwork) {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: `${window.location.origin}/?artwork=${artwork.id}`
      }).catch(console.error);
    } else {
      // Fallback: copy link
      const url = `${window.location.origin}/?artwork=${artwork.id}`;
      navigator.clipboard.writeText(url).then(() => {
        this.showToast(i18n.translate('link-copied') || 'Посилання скопійовано');
      });
    }
  }

  orderArtwork(artwork) {
    // Redirect to business form or external order system
    const businessSection = document.getElementById('business');
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill form with artwork info
      setTimeout(() => {
        const detailsField = document.getElementById('project-details');
        if (detailsField) {
          detailsField.value = `Замовлення картини "${artwork.title}" (${artwork.price})`;
          detailsField.focus();
        }
      }, 1000);
    }
  }

  observeArtworkCard(card) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate card appearance
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, Math.random() * 300);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    observer.observe(card);
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  bindEvents() {
    // Global event listeners
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopCurrentAudio();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentAudio) {
        this.stopCurrentAudio();
      }
    });
  }

  // Public methods
  getArtworkById(id) {
    return this.artworks.find(artwork => artwork.id === parseInt(id));
  }

  filterArtworks(criteria) {
    // Filter artworks by tags, price, etc.
    return this.artworks.filter(artwork => {
      return criteria.tags?.every(tag => artwork.tags.includes(tag)) ?? true;
    });
  }

  addArtwork(artworkData) {
    this.artworks.push(artworkData);
    const card = this.createArtworkCard(artworkData, this.artworks.length - 1);
    this.container.appendChild(card);
    this.observeArtworkCard(card);
  }

  updateAudioEnabled(enabled) {
    this.userHasInteracted = enabled;
    if (!enabled) {
      this.stopCurrentAudio();
    }
  }
}

// Enhanced artwork styles
const artworkStyles = `
  .artwork-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    cursor: pointer;
  }

  .artwork-card:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .artwork-card.artwork-hovered {
    z-index: 10;
  }

  .artwork-image {
    position: relative;
    overflow: hidden;
    height: 300px;
  }

  .artwork-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .artwork-card:hover .artwork-image img {
    transform: scale(1.1);
  }

  .artwork-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .artwork-card:hover .artwork-overlay {
    opacity: 1;
  }

  .artwork-actions {
    display: flex;
    gap: 15px;
  }

  .artwork-action-btn {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    color: var(--color-primary);
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .artwork-action-btn:hover {
    background: var(--color-accent);
    color: white;
    transform: scale(1.15);
  }

  .artwork-action-btn.playing {
    background: var(--color-accent);
    color: white;
    animation: audioPlaying 1.5s infinite;
  }

  @keyframes audioPlaying {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .artwork-quote {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 30px 20px 20px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
  }

  .artwork-quote blockquote {
    font-style: italic;
    font-size: 14px;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }

  .artwork-quote cite {
    font-size: 12px;
    opacity: 0.8;
    font-style: normal;
  }

  .audio-visualizer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .artwork-content {
    padding: 24px;
  }

  .artwork-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .artwork-title {
    flex: 1;
    margin: 0;
    font-size: 1.3rem;
    color: var(--color-primary);
  }

  .artwork-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--color-accent);
    margin-left: 16px;
  }

  .artwork-description {
    color: var(--color-text-light);
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .artwork-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }

  .tag {
    background: var(--color-off-white);
    color: var(--color-text);
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .artwork-emotions {
    margin-bottom: 20px;
    padding: 12px;
    background: var(--color-off-white);
    border-radius: 8px;
  }

  .emotions-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 8px;
  }

  .emotion-chip {
    display: inline-block;
    background: var(--color-accent);
    color: white;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 11px;
    margin-right: 6px;
    margin-bottom: 4px;
  }

  .artwork-buttons {
    display: flex;
    gap: 12px;
  }

  .artwork-buttons .btn {
    flex: 1;
    justify-content: center;
  }

  /* Modal Styles */
  .artwork-modal-content {
    max-width: 1000px;
    width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
  }

  .artwork-detail-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 30px;
  }

  .artwork-detail-image {
    position: relative;
  }

  .artwork-detail-image img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .detail-play-audio {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(230, 126, 34, 0.9);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .detail-play-audio:hover {
    background: var(--color-accent);
    transform: translateX(-50%) translateY(-3px);
  }

  .artwork-detail-info {
    display: flex;
    flex-direction: column;
  }

  .artwork-detail-header {
    margin-bottom: 24px;
  }

  .artwork-detail-header h2 {
    margin-bottom: 8px;
    font-size: 2rem;
  }

  .artwork-price-large {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--color-accent);
  }

  .artwork-meta {
    background: var(--color-off-white);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .meta-item {
    margin-bottom: 8px;
    color: var(--color-text);
  }

  .meta-item:last-child {
    margin-bottom: 0;
  }

  .artwork-description-full {
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .artwork-quote-detail {
    background: var(--color-off-white);
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid var(--color-accent);
    margin-bottom: 24px;
  }

  .artwork-quote-detail blockquote {
    font-style: italic;
    font-size: 1.1rem;
    margin: 0 0 12px 0;
    color: var(--color-text);
  }

  .artwork-quote-detail cite {
    color: var(--color-accent);
    font-weight: 500;
  }

  .artwork-emotions-detail h4 {
    margin-bottom: 12px;
    color: var(--color-primary);
  }

  .emotions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .emotion-badge {
    background: var(--color-accent);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
  }

  .artwork-actions-detail {
    display: flex;
    gap: 12px;
    margin-top: auto;
    padding-top: 24px;
  }

  .btn-large {
    padding: 16px 24px;
    font-size: 1.1rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .artwork-detail-container {
      grid-template-columns: 1fr;
      gap: 24px;
      padding: 20px;
    }

    .artwork-actions-detail {
      flex-direction: column;
    }

    .artwork-card:hover {
      transform: translateY(-8px) scale(1.01);
    }

    .artwork-actions {
      flex-direction: column;
      gap: 10px;
    }

    .artwork-action-btn {
      width: 50px;
      height: 50px;
      font-size: 18px;
    }
  }

  @media (max-width: 576px) {
    .artwork-buttons {
      flex-direction: column;
    }
    
    .artwork-detail-header h2 {
      font-size: 1.5rem;
    }
    
    .artwork-price-large {
      font-size: 1.4rem;
    }
  }
`;

// Inject styles
const artworksStyleSheetGlobal = document.createElement('style');
artworksStyleSheetGlobal.textContent = artworkStyles;
document.head.appendChild(artworksStyleSheetGlobal);

// Initialize artwork gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.artworkGallery = new ArtworkGallery();
});

// Handle URL parameters for direct artwork linking
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const artworkId = urlParams.get('artwork');
  
  if (artworkId && window.artworkGallery) {
    const artwork = window.artworkGallery.getArtworkById(parseInt(artworkId));
    if (artwork) {
      setTimeout(() => {
        window.artworkGallery.showArtworkDetails(artwork);
      }, 1000);
    }
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArtworkGallery;
}