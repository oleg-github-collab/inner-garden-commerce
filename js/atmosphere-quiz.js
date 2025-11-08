// Inner Garden - Atmosphere Selection Quiz

class AtmosphereQuiz {
  constructor() {
    this.container = null;
    this.currentStep = 0;
    this.answers = {};
    this.questions = [];
    this.recommendations = [];
    
    this.init();
  }

  init() {
    this.container = document.getElementById('quiz-container');
    if (!this.container) return;

    this.setupQuestions();
    this.loadArtworkData();
    this.renderQuiz();
    this.bindEvents();
  }

  setupQuestions() {
    this.questions = [
      {
        id: 'effect',
        key: 'quiz-step1-title',
        options: [
          {
            id: 'calm',
            icon: '🧘‍♀️',
            titleKey: 'effect-calm',
            descKey: 'effect-calm-desc'
          },
          {
            id: 'inspiration',
            icon: '✨',
            titleKey: 'effect-inspiration',
            descKey: 'effect-inspiration-desc'
          },
          {
            id: 'energy',
            icon: '⚡',
            titleKey: 'effect-energy',
            descKey: 'effect-energy-desc'
          },
          {
            id: 'balance',
            icon: '⚖️',
            titleKey: 'effect-balance',
            descKey: 'effect-balance-desc'
          }
        ]
      },
      {
        id: 'space',
        key: 'quiz-step2-title',
        options: [
          {
            id: 'office',
            icon: '🏢',
            titleKey: 'space-office',
            descKey: 'space-office-desc'
          },
          {
            id: 'hotel',
            icon: '🏨',
            titleKey: 'space-hotel',
            descKey: 'space-hotel-desc'
          },
          {
            id: 'medical',
            icon: '🏥',
            titleKey: 'space-medical',
            descKey: 'space-medical-desc'
          },
          {
            id: 'wellness',
            icon: '🧘',
            titleKey: 'space-wellness',
            descKey: 'space-wellness-desc'
          }
        ]
      },
      {
        id: 'palette',
        key: 'quiz-step3-title',
        options: [
          {
            id: 'warm',
            icon: '🧡',
            titleKey: 'palette-warm',
            descKey: 'palette-warm-desc',
            colors: ['#e67e22', '#f39c12', '#e74c3c']
          },
          {
            id: 'cool',
            icon: '💙',
            titleKey: 'palette-cool',
            descKey: 'palette-cool-desc',
            colors: ['#3498db', '#2980b9', '#8e44ad']
          },
          {
            id: 'neutral',
            icon: '🤍',
            titleKey: 'palette-neutral',
            descKey: 'palette-neutral-desc',
            colors: ['#95a5a6', '#7f8c8d', '#bdc3c7']
          },
          {
            id: 'vibrant',
            icon: '🌈',
            titleKey: 'palette-vibrant',
            descKey: 'palette-vibrant-desc',
            colors: ['#e74c3c', '#f1c40f', '#2ecc71']
          }
        ]
      }
    ];
  }

  loadArtworkData() {
    // Sample artwork data - in production this would come from an API
    this.artworks = [
      {
        id: 1,
        title: 'Внутрішній Спокій',
        image: 'assets/images/artworks/inner-peace.jpg',
        price: '$2,500',
        tags: ['calm', 'office', 'cool'],
        description: 'Заспокійлива абстракція в блакитних тонах',
        audioUrl: 'assets/audio/nature-water.mp3'
      },
      {
        id: 2,
        title: 'Енергія Сонця',
        image: 'assets/images/artworks/sun-energy.jpg',
        price: '$3,200',
        tags: ['energy', 'office', 'warm'],
        description: 'Динамічна композиція в теплих тонах',
        audioUrl: 'assets/audio/nature-wind.mp3'
      },
      {
        id: 3,
        title: 'Гармонія Природи',
        image: 'assets/images/artworks/nature-harmony.jpg',
        price: '$2,800',
        tags: ['balance', 'wellness', 'neutral'],
        description: 'Збалансована композиція природних форм',
        audioUrl: 'assets/audio/nature-forest.mp3'
      },
      {
        id: 4,
        title: 'Креативний Потік',
        image: 'assets/images/artworks/creative-flow.jpg',
        price: '$3,500',
        tags: ['inspiration', 'office', 'vibrant'],
        description: 'Натхненна робота з динамічними елементами',
        audioUrl: 'assets/audio/nature-rain.mp3'
      },
      {
        id: 5,
        title: 'Медитативний Простір',
        image: 'assets/images/artworks/meditative-space.jpg',
        price: '$2,900',
        tags: ['calm', 'medical', 'cool'],
        description: 'Умиротворяюча картина для медитації',
        audioUrl: 'assets/audio/nature-ocean.mp3'
      },
      {
        id: 6,
        title: 'Готельна Елегантність',
        image: 'assets/images/artworks/hotel-elegance.jpg',
        price: '$4,000',
        tags: ['balance', 'hotel', 'neutral'],
        description: 'Витончена робота для готельних просторів',
        audioUrl: 'assets/audio/nature-birds.mp3'
      }
    ];
  }

  renderQuiz() {
    this.container.innerHTML = '';
    
    // Create progress indicator
    const progress = this.createProgressIndicator();
    this.container.appendChild(progress);

    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'quiz-steps';
    
    this.questions.forEach((question, index) => {
      const step = this.createQuizStep(question, index);
      stepsContainer.appendChild(step);
    });

    // Create results step
    const results = this.createResultsStep();
    stepsContainer.appendChild(results);

    this.container.appendChild(stepsContainer);

    // Show first step
    this.showStep(0);
  }

  createProgressIndicator() {
    const progress = document.createElement('div');
    progress.className = 'quiz-progress';
    progress.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(this.currentStep / this.questions.length) * 100}%"></div>
      </div>
      <div class="progress-text">
        <span class="current-step">${this.currentStep + 1}</span>
        <span class="separator">/</span>
        <span class="total-steps">${this.questions.length}</span>
      </div>
    `;
    return progress;
  }

  createQuizStep(question, index) {
    const step = document.createElement('div');
    step.className = `quiz-step ${index === 0 ? 'active' : ''}`;
    step.setAttribute('data-step', index);

    const title = document.createElement('h3');
    title.setAttribute('data-key', question.key);

    const options = document.createElement('div');
    options.className = 'quiz-options';

    question.options.forEach(option => {
      const optionElement = this.createQuizOption(option, question.id);
      options.appendChild(optionElement);
    });

    const buttons = document.createElement('div');
    buttons.className = 'quiz-buttons';
    
    if (index > 0) {
      const backBtn = document.createElement('button');
      backBtn.className = 'btn btn-outline quiz-back';
      backBtn.setAttribute('data-key', 'quiz-back');
      backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> <span data-key="quiz-back"></span>';
      backBtn.addEventListener('click', () => this.goBack());
      buttons.appendChild(backBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary quiz-next';
    nextBtn.setAttribute('data-key', 'quiz-next');
    nextBtn.innerHTML = '<span data-key="quiz-next"></span> <i class="fas fa-arrow-right"></i>';
    nextBtn.disabled = true;
    nextBtn.addEventListener('click', () => this.goNext());
    buttons.appendChild(nextBtn);

    step.appendChild(title);
    step.appendChild(options);
    step.appendChild(buttons);

    return step;
  }

  createQuizOption(option, questionId) {
    const optionElement = document.createElement('div');
    optionElement.className = 'quiz-option';
    optionElement.setAttribute('data-question', questionId);
    optionElement.setAttribute('data-value', option.id);

    let colorPreview = '';
    if (option.colors) {
      colorPreview = `
        <div class="color-preview">
          ${option.colors.map(color => `<div class="color-dot" style="background-color: ${color}"></div>`).join('')}
        </div>
      `;
    }

    optionElement.innerHTML = `
      <div class="quiz-option-icon">${option.icon}</div>
      <div class="quiz-option-content">
        <div class="quiz-option-title" data-key="${option.titleKey}"></div>
        <div class="quiz-option-description" data-key="${option.descKey}"></div>
        ${colorPreview}
      </div>
    `;

    optionElement.addEventListener('click', () => {
      this.selectOption(questionId, option.id, optionElement);
    });

    return optionElement;
  }

  createResultsStep() {
    const results = document.createElement('div');
    results.className = 'quiz-step quiz-results';
    results.innerHTML = `
      <div class="results-content">
        <h3 data-key="quiz-results"></h3>
        <p class="results-description" data-key="quiz-results-desc"></p>
        <div class="quiz-recommended" id="quiz-recommended">
          <!-- Recommendations will be inserted here -->
        </div>
        <div class="results-actions">
          <button class="btn btn-primary" onclick="this.scrollToArtworks()">
            <i class="fas fa-palette"></i>
            <span data-key="quiz-view-all"></span>
          </button>
          <button class="btn btn-outline" onclick="this.resetQuiz()">
            <i class="fas fa-redo"></i>
            <span data-key="quiz-retry"></span>
          </button>
        </div>
      </div>
    `;
    return results;
  }

  selectOption(questionId, value, element) {
    // Remove selection from other options in the same question
    const questionOptions = document.querySelectorAll(`[data-question="${questionId}"]`);
    questionOptions.forEach(opt => opt.classList.remove('selected'));

    // Select current option
    element.classList.add('selected');
    this.answers[questionId] = value;

    // Enable next button
    const currentStep = document.querySelector('.quiz-step.active');
    const nextBtn = currentStep.querySelector('.quiz-next');
    if (nextBtn) nextBtn.disabled = false;

    // Add selection animation
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 150);
  }

  goNext() {
    if (this.currentStep < this.questions.length) {
      this.animateStepTransition(this.currentStep, this.currentStep + 1);
      this.currentStep++;
      this.updateProgress();

      if (this.currentStep === this.questions.length) {
        this.generateRecommendations();
      }
    }
  }

  goBack() {
    if (this.currentStep > 0) {
      this.animateStepTransition(this.currentStep, this.currentStep - 1);
      this.currentStep--;
      this.updateProgress();
    }
  }

  animateStepTransition(fromStep, toStep) {
    const steps = document.querySelectorAll('.quiz-step');
    const currentStepEl = steps[fromStep];
    const nextStepEl = steps[toStep];

    // Animate out current step
    currentStepEl.style.transform = toStep > fromStep ? 'translateX(-100%)' : 'translateX(100%)';
    currentStepEl.style.opacity = '0';

    setTimeout(() => {
      currentStepEl.classList.remove('active');
      currentStepEl.style.display = 'none';

      // Prepare next step
      nextStepEl.style.display = 'block';
      nextStepEl.style.transform = toStep > fromStep ? 'translateX(100%)' : 'translateX(-100%)';
      nextStepEl.style.opacity = '0';

      // Animate in next step
      setTimeout(() => {
        nextStepEl.classList.add('active');
        nextStepEl.style.transform = 'translateX(0)';
        nextStepEl.style.opacity = '1';
      }, 50);
    }, 200);
  }

  updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const currentStepSpan = document.querySelector('.current-step');
    
    if (progressFill) {
      progressFill.style.width = `${(this.currentStep / this.questions.length) * 100}%`;
    }
    
    if (currentStepSpan) {
      currentStepSpan.textContent = Math.min(this.currentStep + 1, this.questions.length);
    }
  }

  generateRecommendations() {
    const { effect, space, palette } = this.answers;
    
    // Score artworks based on matches
    const scored = this.artworks.map(artwork => {
      let score = 0;
      
      // Perfect matches get high scores
      if (artwork.tags.includes(effect)) score += 3;
      if (artwork.tags.includes(space)) score += 3;
      if (artwork.tags.includes(palette)) score += 3;
      
      // Partial compatibility
      const compatibility = this.checkCompatibility(artwork.tags, { effect, space, palette });
      score += compatibility;
      
      return { ...artwork, score };
    });

    // Sort by score and take top 3
    this.recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    this.renderRecommendations();
  }

  checkCompatibility(artworkTags, answers) {
    let compatibility = 0;
    
    // Define compatibility rules
    const rules = {
      effect: {
        calm: ['balance'],
        energy: ['inspiration'],
        inspiration: ['energy', 'balance'],
        balance: ['calm', 'inspiration']
      },
      space: {
        office: ['hotel'],
        hotel: ['office', 'wellness'],
        medical: ['wellness'],
        wellness: ['medical', 'hotel']
      },
      palette: {
        warm: ['vibrant'],
        cool: ['neutral'],
        neutral: ['warm', 'cool'],
        vibrant: ['warm']
      }
    };

    Object.entries(answers).forEach(([key, value]) => {
      const compatibleValues = rules[key][value] || [];
      compatibleValues.forEach(compatibleValue => {
        if (artworkTags.includes(compatibleValue)) {
          compatibility += 1;
        }
      });
    });

    return compatibility;
  }

  renderRecommendations() {
    const container = document.getElementById('quiz-recommended');
    if (!container) return;

    container.innerHTML = '';

    this.recommendations.forEach((artwork, index) => {
      const card = this.createRecommendationCard(artwork, index);
      container.appendChild(card);

      // Animate card appearance
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  createRecommendationCard(artwork, index) {
    const card = document.createElement('div');
    card.className = 'recommended-artwork';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';

    const matchPercentage = Math.min(100, Math.round((artwork.score / 9) * 100));

    card.innerHTML = `
      <div class="recommendation-badge">
        <span class="match-percentage">${matchPercentage}<span data-key="quiz-match-percent"></span></span>
        ${index === 0 ? '<span class="best-match" data-key="quiz-best-match"></span>' : ''}
      </div>
      <div class="artwork-image-container">
        <img src="${artwork.image}" alt="${artwork.title}" 
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBsYWNlaG9sZGVyR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2Y4ZjlmYTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNlOWVjZWY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwbGFjZWhvbGRlckdyYWQpIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjM2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGVlMmU2IiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxMjUiIHk9IjE3MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNmM3NTdkIiByeD0iNCIvPjxjaXJjbGUgY3g9IjEzNSIgY3k9IjE4NSIgcj0iOCIgZmlsbD0iI2FkYjViZCIvPjx0ZXh0IHg9IjE1MCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM3NTdkIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI1MDAiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        <div class="artwork-overlay">
          <button class="play-audio-btn" data-audio="${artwork.audioUrl}">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      </div>
      <div class="recommended-content">
        <h4>${artwork.title}</h4>
        <p class="artwork-price">${artwork.price}</p>
        <p class="artwork-description">${artwork.description}</p>
        <div class="recommended-buttons">
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

    // Bind events
    this.bindRecommendationEvents(card, artwork);

    return card;
  }

  bindRecommendationEvents(card, artwork) {
    // Audio play button
    const audioBtn = card.querySelector('.play-audio-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playArtworkAudio(artwork.audioUrl, audioBtn);
      });
    }

    // AR view button
    const arBtn = card.querySelector('.view-ar-btn');
    if (arBtn) {
      arBtn.addEventListener('click', () => {
        if (window.arViewer) {
          window.arViewer.showArtworkInAR(artwork);
        }
      });
    }

    // Details button
    const detailsBtn = card.querySelector('.artwork-details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', () => {
        this.showArtworkDetails(artwork);
      });
    }
  }

  playArtworkAudio(audioUrl, button) {
    // Stop any currently playing audio
    const currentAudio = document.querySelector('.artwork-audio-playing');
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      currentAudio.remove();
    }

    // Create and play new audio
    const audio = document.createElement('audio');
    audio.className = 'artwork-audio-playing';
    audio.src = audioUrl;
    audio.volume = 0.3;
    
    // Update button state
    button.innerHTML = '<i class="fas fa-pause"></i>';
    button.classList.add('playing');

    audio.play().catch(() => {
      // Handle audio play error
      this.showToast(window.ultraI18n?.translate('audio-play-error') || 'Could not play audio');
    });

    // Reset button when audio ends
    audio.addEventListener('ended', () => {
      button.innerHTML = '<i class="fas fa-volume-up"></i>';
      button.classList.remove('playing');
      audio.remove();
    });

    document.body.appendChild(audio);
  }

  showArtworkDetails(artwork) {
    // Create detailed modal
    const modal = document.createElement('div');
    modal.className = 'modal artwork-detail-modal open';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <button class="modal-close">&times;</button>
        <div class="artwork-detail-content" style="padding: 24px;">
          <div class="artwork-image-container" style="margin-bottom: 20px;">
            <img src="${artwork.image}" alt="${artwork.title}" 
                 style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px;">
          </div>
          <div class="artwork-info">
            <h3>${artwork.title}</h3>
            <p class="price" style="font-size: 24px; color: var(--color-accent); font-weight: bold; margin: 10px 0;">${artwork.price}</p>
            <p style="margin-bottom: 20px; line-height: 1.6;">${artwork.description}</p>
            
            <div class="artwork-tags" style="margin-bottom: 20px;">
              ${artwork.tags.map(tag => `<span class="tag" style="background: var(--color-light-gray); padding: 4px 12px; border-radius: 20px; margin-right: 8px; font-size: 12px;">${tag}</span>`).join('')}
            </div>
            
            <div class="artwork-actions" style="display: flex; gap: 12px;">
              <button class="btn btn-primary">
                <i class="fas fa-shopping-cart"></i>
                <span data-key="artwork-order"></span>
              </button>
              <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                <i class="fas fa-times"></i>
                <span data-key="artwork-close"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind close events
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  bindEvents() {
    // Global result actions
    window.resetQuiz = () => {
      this.currentStep = 0;
      this.answers = {};
      this.renderQuiz();
    };

    window.scrollToArtworks = () => {
      const artworksSection = document.getElementById('artworks');
      if (artworksSection) {
        artworksSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  // Public methods
  getUserAnswers() {
    return { ...this.answers };
  }

  getRecommendations() {
    return [...this.recommendations];
  }

  resetToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.questions.length) {
      this.currentStep = stepIndex;
      this.showStep(stepIndex);
      this.updateProgress();
    }
  }

  showStep(stepIndex) {
    const steps = document.querySelectorAll('.quiz-step');
    steps.forEach((step, index) => {
      if (index === stepIndex) {
        step.classList.add('active');
        step.style.display = 'block';
        step.style.transform = 'translateX(0)';
        step.style.opacity = '1';
      } else {
        step.classList.remove('active');
        step.style.display = 'none';
      }
    });
  }
}

// Enhanced CSS animations
const quizStyles = `
  .quiz-progress {
    margin-bottom: 2rem;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--color-light-gray);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
    transition: width 0.5s ease;
    border-radius: 4px;
  }

  .progress-text {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  .quiz-step {
    display: none;
    animation: slideInRight 0.5s ease;
  }

  .quiz-step.active {
    display: block;
  }

  .quiz-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .quiz-option {
    background: white;
    border: 2px solid var(--color-light-gray);
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .quiz-option:hover {
    border-color: var(--color-accent);
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .quiz-option.selected {
    border-color: var(--color-accent);
    background: rgba(230, 126, 34, 0.1);
    box-shadow: 0 8px 25px rgba(230, 126, 34, 0.3);
  }

  .quiz-option.selected::after {
    content: '✓';
    position: absolute;
    top: 10px;
    right: 15px;
    background: var(--color-accent);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }

  .quiz-option-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .quiz-option-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .quiz-option-description {
    color: var(--color-text-light);
    font-size: 0.9rem;
  }

  .color-preview {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 1rem;
  }

  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .quiz-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
  }

  .quiz-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .recommended-artwork {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .recommended-artwork:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .recommendation-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .match-percentage {
    background: var(--color-accent);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
  }

  .best-match {
    background: var(--color-success);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
    text-align: center;
  }

  .artwork-image-container {
    position: relative;
    overflow: hidden;
  }

  .artwork-image-container img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .recommended-artwork:hover .artwork-image-container img {
    transform: scale(1.05);
  }

  .artwork-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .recommended-artwork:hover .artwork-overlay {
    opacity: 1;
  }

  .play-audio-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .play-audio-btn:hover {
    background: var(--color-accent);
    color: white;
    transform: scale(1.1);
  }

  .play-audio-btn.playing {
    background: var(--color-accent);
    color: white;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    .quiz-options {
      grid-template-columns: 1fr;
    }
    
    .quiz-buttons {
      flex-direction: column;
    }
    
    .quiz-recommended {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = quizStyles;
document.head.appendChild(styleSheet);

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.atmosphereQuiz = new AtmosphereQuiz();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtmosphereQuiz;
}