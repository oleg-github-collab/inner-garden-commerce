// Inner Garden - Meditation Experience with Artwork

class MeditationExperience {
  constructor() {
    this.isActive = false;
    this.duration = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.currentTime = 0;
    this.interval = null;
    this.video = null;
    this.audio = null;
    this.modal = null;
    this.currentArtwork = null;
    
    this.artworkVideos = [];
    this.meditationTracks = [];
    
    this.init();
  }

  init() {
    this.loadMeditationContent();
    this.bindEvents();
    this.setupVideoPreloading();
  }

  loadMeditationContent() {
    // Meditation artwork videos with multilingual support
    this.artworkVideos = [
      {
        id: 1,
        title: {
          uk: 'Внутрішній Спокій',
          en: 'Inner Peace',
          de: 'Innerer Frieden'
        },
        videoUrl: 'assets/video/inner-peace-meditation.mp4',
        posterUrl: 'assets/images/meditation/inner-peace-poster.jpg',
        audioUrl: 'assets/audio/meditation/inner-peace-meditation.mp3',
        voiceoverUrl: {
          uk: 'assets/audio/meditation/inner-peace-voiceover-uk.mp3',
          en: 'assets/audio/meditation/inner-peace-voiceover-en.mp3',
          de: 'assets/audio/meditation/inner-peace-voiceover-de.mp3'
        },
        description: {
          uk: 'Розслабляюча подорож у глибини внутрішнього спокою через абстрактні форми та кольори',
          en: 'Relaxing journey into the depths of inner peace through abstract forms and colors',
          de: 'Entspannende Reise in die Tiefen des inneren Friedens durch abstrakte Formen und Farben'
        },
        affirmations: {
          uk: [
            'Я знаходжу спокій у цю мить',
            'Моє дихання приносить мені гармонію',
            'Я відпускаю всі турботи та напругу',
            'Внутрішній спокій - моя природна сутність'
          ],
          en: [
            'I find peace in this moment',
            'My breathing brings me harmony',
            'I release all worries and tension',
            'Inner peace is my natural essence'
          ],
          de: [
            'Ich finde Frieden in diesem Moment',
            'Mein Atem bringt mir Harmonie',
            'Ich lasse alle Sorgen und Anspannungen los',
            'Innerer Frieden ist meine natürliche Essenz'
          ]
        },
        breathingPattern: {
          inhale: 4,
          hold: 4,
          exhale: 6,
          pause: 2
        },
        colors: ['#4a90e2', '#7fbeed', '#a8d0f0', '#d4e8f7'],
        chakra: 'throat',
        intentions: {
          uk: ['спокій', 'розслаблення', 'ясність розуму'],
          en: ['peace', 'relaxation', 'mental clarity'],
          de: ['frieden', 'entspannung', 'mentale klarheit']
        }
      },
      {
        id: 2,
        title: 'Енергія Відновлення',
        videoUrl: 'assets/video/energy-restoration.mp4',
        posterUrl: 'assets/images/meditation/energy-poster.jpg',
        audioUrl: 'assets/audio/meditation/energy-restoration.mp3',
        voiceoverUrl: 'assets/audio/meditation/energy-voiceover-uk.mp3',
        description: 'Активуюча медитація для відновлення життєвої енергії та внутрішньої сили',
        affirmations: [
          'Я повний життєвої енергії',
          'Кожен мій вдих наповнює мене силою',
          'Я відчуваю потужний потік енергії в собі',
          'Моя енергія відновлюється з кожною хвилиною'
        ],
        breathingPattern: {
          inhale: 6,
          hold: 2,
          exhale: 4,
          pause: 1
        },
        colors: ['#f39c12', '#e67e22', '#d35400', '#ff6b35'],
        chakra: 'solar_plexus',
        intentions: ['енергія', 'сила', 'мотивація']
      },
      {
        id: 3,
        title: 'Гармонія Природи',
        videoUrl: 'assets/video/nature-harmony.mp4',
        posterUrl: 'assets/images/meditation/nature-poster.jpg',
        audioUrl: 'assets/audio/meditation/nature-harmony.mp3',
        voiceoverUrl: 'assets/audio/meditation/nature-voiceover-uk.mp3',
        description: 'Зв\'язок з природними ритмами через медитативні образи лісу та води',
        affirmations: [
          'Я - частина природи, природа - частина мене',
          'Я дихаю в ритмі з землею',
          'Природна мудрість тече через мене',
          'Я знаходжу баланс у природних циклах'
        ],
        breathingPattern: {
          inhale: 5,
          hold: 3,
          exhale: 5,
          pause: 3
        },
        colors: ['#27ae60', '#2ecc71', '#52c88a', '#7dd3a3'],
        chakra: 'heart',
        intentions: ['зв\'язок', 'заземлення', 'природність']
      }
    ];

    // Set default artwork
    this.currentArtwork = this.artworkVideos[0];
  }

  bindEvents() {
    // Start meditation button
    const startBtn = document.getElementById('meditation-play-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startMeditation();
      });
    }

    // Modal close events
    const modal = document.getElementById('meditation-modal');
    if (modal) {
      const closeBtn = modal.querySelector('#meditation-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          this.closeMeditation();
        });
      }

      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeMeditation();
        }
      });
    }

    // Control buttons
    this.bindControlButtons();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.isActive) {
        switch (e.key) {
          case 'Escape':
            this.closeMeditation();
            break;
          case ' ':
            e.preventDefault();
            this.togglePlayPause();
            break;
          case 'ArrowLeft':
            this.skipTime(-30); // Skip back 30 seconds
            break;
          case 'ArrowRight':
            this.skipTime(30); // Skip forward 30 seconds
            break;
        }
      }
    });

    // Visibility change - pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isActive) {
        this.pauseMeditation();
      }
    });
  }

  bindControlButtons() {
    // Pause/Resume button
    const pauseBtn = document.getElementById('meditation-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    // Skip button
    const skipBtn = document.getElementById('meditation-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.completeMeditation();
      });
    }

    // Order button (shown after completion)
    const orderBtn = document.getElementById('meditation-order');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        this.orderArtwork();
      });
    }
  }

  setupVideoPreloading() {
    // Preload the first video for faster startup
    if (this.currentArtwork && this.currentArtwork.videoUrl) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = this.currentArtwork.videoUrl;
      video.load();
    }
  }

  async startMeditation(artworkId = null) {
    try {
      // Select artwork if specified
      if (artworkId) {
        const artwork = this.artworkVideos.find(a => a.id === artworkId);
        if (artwork) {
          this.currentArtwork = artwork;
        }
      }

      // Show modal
      this.modal = document.getElementById('meditation-modal');
      if (!this.modal) {
        console.error('Meditation modal not found');
        return;
      }

      this.modal.classList.add('open');
      document.body.classList.add('modal-open');

      // Initialize meditation
      await this.initializeMeditationSession();
      
      // Start the experience
      this.isActive = true;
      this.currentTime = 0;
      this.startTimer();
      
      // Play content
      await this.playMeditationContent();
      
      // Show breathing guide
      this.startBreathingGuide();
      
      // Track meditation start
      this.trackMeditationEvent('meditation_started', {
        artwork_title: this.currentArtwork.title,
        duration_minutes: this.duration / (60 * 1000)
      });

    } catch (error) {
      console.error('Failed to start meditation:', error);
      this.showError('Не вдалося запустити медитацію. Спробуйте ще раз.');
    }
  }

  async initializeMeditationSession() {
    const videoContainer = this.modal.querySelector('.meditation-video-container');
    if (!videoContainer) return;

    // Create video element
    this.video = document.createElement('video');
    this.video.id = 'meditation-video';
    this.video.className = 'meditation-video';
    this.video.src = this.currentArtwork.videoUrl;
    this.video.poster = this.currentArtwork.posterUrl;
    this.video.muted = true; // Video is muted, audio comes from separate track
    this.video.loop = true;
    this.video.playsInline = true;
    this.video.preload = 'auto';

    // Create audio element for meditation track
    this.audio = document.createElement('audio');
    this.audio.id = 'meditation-audio';
    this.audio.className = 'meditation-audio';
    this.audio.preload = 'auto';

    // Add elements to container
    videoContainer.innerHTML = '';
    videoContainer.appendChild(this.video);
    videoContainer.appendChild(this.audio);

    // Create breathing guide overlay
    this.createBreathingGuide(videoContainer);
    
    // Create progress visualization
    this.createProgressVisualization(videoContainer);

    // Load audio tracks
    await this.loadAudioTracks();
    
    // Setup video events
    this.setupMediaEvents();
  }

  createBreathingGuide(container) {
    const breathingGuide = document.createElement('div');
    breathingGuide.className = 'breathing-guide';
    breathingGuide.innerHTML = `
      <div class="breathing-circle" id="breathing-circle">
        <div class="breathing-text" id="breathing-text">Дихайте</div>
        <div class="breathing-count" id="breathing-count">4</div>
      </div>
      <div class="breathing-instructions" id="breathing-instructions">
        <span class="breath-phase" id="breath-phase">Підготовка</span>
        <span class="breath-guidance" id="breath-guidance">Знайдіть зручну позицію</span>
      </div>
    `;
    
    container.appendChild(breathingGuide);
    
    // Add breathing guide styles
    this.addBreathingStyles();
  }

  createProgressVisualization(container) {
    const progressViz = document.createElement('div');
    progressViz.className = 'meditation-progress-viz';
    progressViz.innerHTML = `
      <div class="progress-mandala" id="progress-mandala">
        <svg class="mandala-svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
          <circle cx="100" cy="100" r="90" fill="none" stroke="#e67e22" stroke-width="3" 
                  stroke-dasharray="565.48" stroke-dashoffset="565.48" id="progress-circle">
            <animate attributeName="stroke-dashoffset" dur="${this.duration}ms" 
                     from="565.48" to="0" begin="indefinite" id="progress-animation"/>
          </circle>
        </svg>
        <div class="mandala-center">
          <div class="time-display" id="meditation-time-display">05:00</div>
          <div class="mantra-display" id="mantra-display"></div>
        </div>
      </div>
    `;
    
    container.appendChild(progressViz);
  }

  async loadAudioTracks() {
    const audioSources = [];
    
    // Main meditation audio
    if (this.currentArtwork.audioUrl) {
      audioSources.push({
        src: this.currentArtwork.audioUrl,
        type: 'audio/mpeg'
      });
    }

    // Create audio source elements
    audioSources.forEach(source => {
      const sourceElement = document.createElement('source');
      sourceElement.src = source.src;
      sourceElement.type = source.type;
      this.audio.appendChild(sourceElement);
    });

    // Load voiceover separately for mixing
    if (this.currentArtwork.voiceoverUrl) {
      this.voiceoverAudio = document.createElement('audio');
      this.voiceoverAudio.src = this.currentArtwork.voiceoverUrl;
      this.voiceoverAudio.volume = 0.7;
      this.voiceoverAudio.preload = 'auto';
    }
  }

  setupMediaEvents() {
    // Video events
    this.video.addEventListener('loadstart', () => {
      this.showLoadingState();
    });

    this.video.addEventListener('canplaythrough', () => {
      this.hideLoadingState();
    });

    this.video.addEventListener('error', (e) => {
      console.error('Video error:', e);
      this.showError('Помилка завантаження відео');
    });

    // Audio events
    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.showError('Помилка завантаження аудіо');
    });

    // Sync video and audio
    this.video.addEventListener('timeupdate', () => {
      if (Math.abs(this.video.currentTime - this.audio.currentTime) > 0.3) {
        this.audio.currentTime = this.video.currentTime;
      }
    });
  }

  async playMeditationContent() {
    try {
      // Start video
      await this.video.play();
      
      // Start audio with slight delay for sync
      setTimeout(async () => {
        if (this.audio) {
          this.audio.volume = 0.6;
          await this.audio.play();
        }
      }, 100);

      // Start progress animation
      const progressAnimation = document.getElementById('progress-animation');
      if (progressAnimation) {
        progressAnimation.beginElement();
      }

    } catch (error) {
      console.error('Playback error:', error);
      this.showError('Не вдалося відтворити медитацію');
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.isActive) {
        this.currentTime += 100; // Update every 100ms
        this.updateTimeDisplay();
        this.updateProgressBar();
        this.updateMantras();
        
        // Check if meditation is complete
        if (this.currentTime >= this.duration) {
          this.completeMeditation();
        }
      }
    }, 100);
  }

  startBreathingGuide() {
    const pattern = this.currentArtwork.breathingPattern;
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');
    const count = document.getElementById('breathing-count');
    const phase = document.getElementById('breath-phase');
    const guidance = document.getElementById('breath-guidance');
    
    if (!circle || !text || !count || !phase || !guidance) return;

    const totalCycle = pattern.inhale + pattern.hold + pattern.exhale + pattern.pause;
    let currentStep = 0;
    let stepTime = 0;
    let currentPhase = 'inhale';

    const breathingLoop = setInterval(() => {
      if (!this.isActive) {
        clearInterval(breathingLoop);
        return;
      }

      stepTime++;
      
      // Determine current phase
      if (stepTime <= pattern.inhale) {
        if (currentPhase !== 'inhale') {
          currentPhase = 'inhale';
          phase.textContent = 'Вдих';
          guidance.textContent = 'Повільно вдихайте через ніс';
          circle.style.transform = 'scale(1.3)';
          circle.style.background = `radial-gradient(circle, ${this.currentArtwork.colors[0]}, ${this.currentArtwork.colors[1]})`;
        }
        count.textContent = pattern.inhale - stepTime + 1;
      } else if (stepTime <= pattern.inhale + pattern.hold) {
        if (currentPhase !== 'hold') {
          currentPhase = 'hold';
          phase.textContent = 'Затримка';
          guidance.textContent = 'Затримайте дихання';
          circle.style.transform = 'scale(1.3)';
        }
        count.textContent = pattern.inhale + pattern.hold - stepTime + 1;
      } else if (stepTime <= pattern.inhale + pattern.hold + pattern.exhale) {
        if (currentPhase !== 'exhale') {
          currentPhase = 'exhale';
          phase.textContent = 'Видих';
          guidance.textContent = 'Повільно видихайте через рот';
          circle.style.transform = 'scale(1)';
          circle.style.background = `radial-gradient(circle, ${this.currentArtwork.colors[2]}, ${this.currentArtwork.colors[3]})`;
        }
        count.textContent = pattern.inhale + pattern.hold + pattern.exhale - stepTime + 1;
      } else {
        if (currentPhase !== 'pause') {
          currentPhase = 'pause';
          phase.textContent = 'Пауза';
          guidance.textContent = 'Природна пауза';
          circle.style.transform = 'scale(1)';
        }
        count.textContent = totalCycle - stepTime + 1;
      }

      // Reset cycle
      if (stepTime >= totalCycle) {
        stepTime = 0;
      }
    }, 1000);
  }

  updateTimeDisplay() {
    const timeElement = document.getElementById('meditation-time-display');
    if (!timeElement) return;

    const remainingTime = Math.max(0, this.duration - this.currentTime);
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateProgressBar() {
    const progressElement = document.getElementById('meditation-progress');
    if (!progressElement) return;

    const progress = (this.currentTime / this.duration) * 100;
    progressElement.style.width = `${progress}%`;
  }

  updateMantras() {
    if (!this.currentArtwork.affirmations) return;

    const mantraElement = document.getElementById('mantra-display');
    if (!mantraElement) return;

    // Change mantra every 30 seconds
    const mantraInterval = 30 * 1000;
    const mantraIndex = Math.floor(this.currentTime / mantraInterval) % this.currentArtwork.affirmations.length;
    const currentMantra = this.currentArtwork.affirmations[mantraIndex];

    if (mantraElement.textContent !== currentMantra) {
      mantraElement.style.opacity = '0';
      setTimeout(() => {
        mantraElement.textContent = currentMantra;
        mantraElement.style.opacity = '1';
      }, 300);
    }

    // Play voiceover for affirmations (if available)
    if (this.voiceoverAudio && this.currentTime % mantraInterval < 100) {
      this.playAffirmationVoiceover(mantraIndex);
    }
  }

  playAffirmationVoiceover(index) {
    // In a real implementation, you'd have separate audio files for each affirmation
    if (this.voiceoverAudio && this.voiceoverAudio.paused) {
      this.voiceoverAudio.currentTime = index * 10; // Assume 10 seconds per affirmation
      this.voiceoverAudio.play().catch(console.error);
    }
  }

  togglePlayPause() {
    const pauseBtn = document.getElementById('meditation-pause');
    
    if (this.isActive) {
      this.pauseMeditation();
      if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Продовжити';
      }
    } else {
      this.resumeMeditation();
      if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
      }
    }
  }

  pauseMeditation() {
    this.isActive = false;
    
    if (this.video && !this.video.paused) {
      this.video.pause();
    }
    
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    
    if (this.voiceoverAudio && !this.voiceoverAudio.paused) {
      this.voiceoverAudio.pause();
    }
  }

  resumeMeditation() {
    this.isActive = true;
    
    if (this.video && this.video.paused) {
      this.video.play().catch(console.error);
    }
    
    if (this.audio && this.audio.paused) {
      this.audio.play().catch(console.error);
    }
    
    if (this.voiceoverAudio && this.voiceoverAudio.paused) {
      this.voiceoverAudio.play().catch(console.error);
    }
  }

  skipTime(seconds) {
    const newTime = Math.max(0, Math.min(this.duration, this.currentTime + (seconds * 1000)));
    this.currentTime = newTime;
    
    if (this.video) {
      this.video.currentTime = newTime / 1000;
    }
    
    if (this.audio) {
      this.audio.currentTime = newTime / 1000;
    }
    
    this.updateTimeDisplay();
    this.updateProgressBar();
  }

  completeMeditation() {
    this.isActive = false;
    
    // Stop all media
    if (this.video && !this.video.paused) {
      this.video.pause();
    }
    
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    
    if (this.voiceoverAudio && !this.voiceoverAudio.paused) {
      this.voiceoverAudio.pause();
    }
    
    // Clear interval
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    // Show completion screen
    this.showCompletionScreen();
    
    // Track completion
    this.trackMeditationEvent('meditation_completed', {
      artwork_title: this.currentArtwork.title,
      duration_completed: this.currentTime,
      completed_percentage: (this.currentTime / this.duration) * 100
    });
  }

  showCompletionScreen() {
    const completionElement = document.getElementById('meditation-complete');
    const playerElement = this.modal.querySelector('.meditation-player');
    
    if (completionElement && playerElement) {
      playerElement.style.opacity = '0';
      setTimeout(() => {
        playerElement.classList.add('hidden');
        completionElement.classList.remove('hidden');
        completionElement.style.opacity = '1';
        
        // Add celebration animation
        this.addCelebrationAnimation();
      }, 500);
    }
  }

  addCelebrationAnimation() {
    // Create floating particles animation
    const completionScreen = document.getElementById('meditation-complete');
    if (!completionScreen) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: ${this.currentArtwork.colors[i % this.currentArtwork.colors.length]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100%;
        opacity: 0.8;
        animation: floatUp 3s ease-out forwards;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      completionScreen.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) scale(0);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-100px) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-200px) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  closeMeditation() {
    this.isActive = false;
    
    // Stop all media
    if (this.video) {
      this.video.pause();
      this.video.src = '';
    }
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
    
    if (this.voiceoverAudio) {
      this.voiceoverAudio.pause();
      this.voiceoverAudio.src = '';
    }
    
    // Clear interval
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    // Close modal
    if (this.modal) {
      this.modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
    
    // Reset state
    this.currentTime = 0;
    this.video = null;
    this.audio = null;
    this.voiceoverAudio = null;

    // Track closure
    this.trackMeditationEvent('meditation_closed', {
      artwork_title: this.currentArtwork.title,
      duration_completed: this.currentTime,
      completion_percentage: (this.currentTime / this.duration) * 100
    });
  }

  orderArtwork() {
    // Close meditation modal
    this.closeMeditation();
    
    // Navigate to business section with pre-filled form
    const businessSection = document.getElementById('business');
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        const detailsField = document.getElementById('project-details');
        if (detailsField) {
          detailsField.value = `Замовлення картини "${this.currentArtwork.title}" після медитації. Картина створила глибокий емоційний зв'язок під час медитативної практики.`;
          detailsField.focus();
        }
      }, 1000);
    }
  }

  showLoadingState() {
    const loading = document.getElementById('ar-loading');
    if (loading) {
      loading.style.display = 'block';
    }
  }

  hideLoadingState() {
    const loading = document.getElementById('ar-loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  showError(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      toast.style.backgroundColor = 'var(--color-error)';
      setTimeout(() => {
        toast.classList.remove('show');
        toast.style.backgroundColor = 'var(--color-accent)';
      }, 4000);
    }
  }

  trackMeditationEvent(eventName, data) {
    // Track meditation events for analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'meditation',
        event_label: data.artwork_title,
        value: Math.round(data.duration_completed / 1000),
        custom_parameters: data
      });
    }
    
    console.log('Meditation Event:', eventName, data);
  }

  addBreathingStyles() {
    const styles = `
      .breathing-guide {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        text-align: center;
        color: white;
        opacity: 0.9;
      }

      .breathing-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        transition: all 2s ease-in-out;
        background: radial-gradient(circle, rgba(78, 144, 226, 0.6), rgba(127, 190, 237, 0.3));
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .breathing-text {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .breathing-count {
        font-size: 48px;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .breathing-instructions {
        background: rgba(0, 0, 0, 0.6);
        padding: 12px 20px;
        border-radius: 25px;
        backdrop-filter: blur(5px);
      }

      .breath-phase {
        display: block;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .breath-guidance {
        display: block;
        font-size: 14px;
        opacity: 0.9;
      }

      .meditation-progress-viz {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 20;
      }

      .progress-mandala {
        position: relative;
        width: 120px;
        height: 120px;
      }

      .mandala-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
      }

      .mandala-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white;
      }

      .time-display {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 4px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .mantra-display {
        font-size: 10px;
        max-width: 80px;
        line-height: 1.2;
        opacity: 0.8;
        transition: opacity 0.3s ease;
      }

      @media (max-width: 768px) {
        .breathing-circle {
          width: 120px;
          height: 120px;
        }
        
        .breathing-count {
          font-size: 36px;
        }
        
        .progress-mandala {
          width: 80px;
          height: 80px;
        }
        
        .time-display {
          font-size: 14px;
        }
        
        .mantra-display {
          font-size: 9px;
          max-width: 60px;
        }
        
        .breathing-instructions {
          padding: 8px 16px;
        }
        
        .breath-phase {
          font-size: 14px;
        }
        
        .breath-guidance {
          font-size: 12px;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Public methods
  selectArtwork(artworkId) {
    const artwork = this.artworkVideos.find(a => a.id === artworkId);
    if (artwork) {
      this.currentArtwork = artwork;
      return true;
    }
    return false;
  }

  getAvailableArtworks() {
    return this.artworkVideos.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      poster: artwork.posterUrl,
      intentions: artwork.intentions,
      chakra: artwork.chakra
    }));
  }

  getCurrentProgress() {
    return {
      isActive: this.isActive,
      currentTime: this.currentTime,
      totalDuration: this.duration,
      progressPercentage: (this.currentTime / this.duration) * 100,
      artwork: this.currentArtwork ? this.currentArtwork.title : null
    };
  }
}

// Initialize meditation experience when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.meditationExperience = new MeditationExperience();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MeditationExperience;
}