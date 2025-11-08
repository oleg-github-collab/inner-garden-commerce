// Inner Garden - UGC Story Sharing System

// Unique stylesheet for stories module
const storiesStyleSheet = (() => {
  const style = document.createElement('style');
  style.textContent = `
    .stories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }
    .story-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    .story-card:hover {
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
  `;
  document.head.appendChild(style);
  return style;
})();

class StorySharing {
  constructor() {
    this.stories = [];
    this.currentFilter = 'all';
    this.modal = null;
    this.uploadProgress = 0;
    this.maxFileSize = 5 * 1024 * 1024; // 5MB max file size
    this.allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    
    this.init();
  }

  init() {
    this.loadStoriesFromStorage();
    this.bindEvents();
    this.renderStories();
    this.setupImageOptimization();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.errorHandler = window.InnerGarden?.errorHandler;
    
    if (this.errorHandler) {
      this.errorHandler.logInfo('StorySharing initialized');
    }
    
    // Handle image upload errors
    this.handleImageUploadErrors();
  }

  handleImageUploadErrors() {
    // Handle file upload validation
    document.addEventListener('change', (event) => {
      if (event.target.type === 'file' && event.target.closest('#share-story-form')) {
        const file = event.target.files[0];
        if (file && !this.allowedFormats.includes(file.type)) {
          if (this.errorHandler) {
            this.errorHandler.logWarn('Invalid file format', { type: file.type, name: file.name });
          }
          this.showUploadError('Підтримуються лише формати: JPG, PNG, WebP');
        }
        if (file && file.size > this.maxFileSize) {
          if (this.errorHandler) {
            this.errorHandler.logWarn('File too large', { size: file.size, max: this.maxFileSize });
          }
          this.showUploadError('Максимальний розмір файлу: 5MB');
        }
      }
    });
  }

  showUploadError(message) {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'upload-error';
    errorDiv.style.cssText = `
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      border-left: 3px solid #f44336;
    `;
    errorDiv.textContent = message;
    
    const form = document.getElementById('share-story-form');
    if (form) {
      form.insertBefore(errorDiv, form.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
  }

  loadStoriesFromStorage() {
    // Load sample stories and any user-submitted stories from localStorage
    const sampleStories = [
      {
        id: 'sample-1',
        name: 'Анна Петрова',
        spaceType: 'hotel',
        image: 'assets/images/stories/hotel-story-1.jpg',
        story: 'Після встановлення картини "Внутрішній Спокій" в нашому лобі, гості стали залишатися довше та частіше хвалять атмосферу готелю. Оцінки в Booking.com зросли на 0.8 балів!',
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        approved: true,
        featured: true,
        likes: 24,
        avatar: 'A',
        location: 'Київ, Україна'
      },
      {
        id: 'sample-2',
        name: 'Др. Олексій Коваленко',
        spaceType: 'medical',
        image: 'assets/images/stories/medical-story-1.jpg',
        story: 'Картини в залі очікування створили дивовижний ефект - пацієнти стали менше нервувати перед процедурами. Навіть медсестри відзначають більш спокійну атмосферу.',
        timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
        approved: true,
        featured: false,
        likes: 18,
        avatar: 'О',
        location: 'Львів, Україна'
      },
      {
        id: 'sample-3',
        name: 'Марія Іваненко',
        spaceType: 'office',
        image: 'assets/images/stories/office-story-1.jpg',
        story: 'Креативний відділ нашої IT-компанії тепер має нове джерело натхнення! Команда каже, що картина допомагає "розблокувати" творче мислення під час мозкових штурмів.',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        approved: true,
        featured: true,
        likes: 31,
        avatar: 'М',
        location: 'Вінниця, Україна'
      },
      {
        id: 'sample-4',
        name: 'Світлана Мельник',
        spaceType: 'wellness',
        image: 'assets/images/stories/wellness-story-1.jpg',
        story: 'У нашому spa-центрі картини створили унікальну атмосферу гармонії. Клієнти часто питають про художника та відзначають, що відчувають себе більш розслабленими.',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        approved: true,
        featured: false,
        likes: 27,
        avatar: 'С',
        location: 'Одеса, Україна'
      }
    ];

    // Load user stories from localStorage
    const userStories = JSON.parse(localStorage.getItem('inner-garden-stories') || '[]');
    
    // Combine and sort by timestamp
    this.stories = [...sampleStories, ...userStories].sort((a, b) => b.timestamp - a.timestamp);
  }

  bindEvents() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.stories-filters .filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Share story button
    const shareBtn = document.getElementById('share-story-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.openStoryModal();
      });
    }

    // Form submission
    const form = document.getElementById('story-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitStory(form);
      });
    }

    // Modal events
    this.bindModalEvents();
    
    // Instagram integration
    this.setupInstagramIntegration();
  }

  bindModalEvents() {
    const modal = document.getElementById('story-modal');
    if (!modal) return;

    // Close button
    const closeBtn = modal.querySelector('#story-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeStoryModal();
      });
    }

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeStoryModal();
      }
    });

    // File upload events
    const fileInput = document.getElementById('story-photo');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        this.handleFileSelect(e);
      });
    }

    // Drag and drop
    this.setupDragAndDrop();
  }

  setupDragAndDrop() {
    const fileInput = document.getElementById('story-photo');
    const formGroup = fileInput?.closest('.form-group');
    
    if (!formGroup) return;

    // Create drop zone
    const dropZone = document.createElement('div');
    dropZone.className = 'file-drop-zone';
    dropZone.innerHTML = `
      <div class="drop-zone-content">
        <i class="fas fa-cloud-upload-alt drop-icon"></i>
        <p class="drop-text">Перетягніть фото сюди або клікніть для вибору</p>
        <p class="drop-hint">Максимальний розмір: 5МБ | Формати: JPG, PNG, WebP</p>
      </div>
      <div class="file-preview hidden" id="file-preview">
        <img class="preview-image" id="preview-image" alt="Preview">
        <div class="preview-info">
          <span class="file-name" id="file-name"></span>
          <span class="file-size" id="file-size"></span>
        </div>
        <button type="button" class="remove-file-btn" id="remove-file">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    formGroup.appendChild(dropZone);
    fileInput.style.display = 'none';

    // Drop zone events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
    dropZone.addEventListener('drop', this.handleDrop.bind(this));
    dropZone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
      }
    });

    // Remove file button
    document.getElementById('remove-file')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeSelectedFile();
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    // Validate file
    if (!this.validateFile(file)) {
      return;
    }

    // Show preview
    this.showFilePreview(file);
    
    // Optimize image
    this.optimizeImage(file).then(optimizedFile => {
      // Store optimized file for submission
      this.selectedFile = optimizedFile;
    });
  }

  validateFile(file) {
    // Check file type
    if (!this.allowedFormats.includes(file.type)) {
      this.showError('Дозволені формати: JPG, PNG, WebP');
      return false;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      this.showError('Максимальний розмір файлу: 5МБ');
      return false;
    }

    return true;
  }

  showFilePreview(file) {
    const preview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const dropZone = preview.closest('.file-drop-zone');

    if (preview && previewImage && fileName && fileSize) {
      // Create file URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        preview.classList.remove('hidden');
        dropZone.querySelector('.drop-zone-content').style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile() {
    const preview = document.getElementById('file-preview');
    const dropZone = preview.closest('.file-drop-zone');
    const fileInput = document.getElementById('story-photo');
    
    preview.classList.add('hidden');
    dropZone.querySelector('.drop-zone-content').style.display = 'block';
    fileInput.value = '';
    this.selectedFile = null;
  }

  async optimizeImage(file) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          const optimizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(optimizedFile);
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  setupImageOptimization() {
    // Service worker for image optimization if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Send optimization tasks to service worker
      });
    }
  }

  renderStories() {
    const container = document.getElementById('stories-grid');
    if (!container) return;

    container.innerHTML = '';
    
    const filteredStories = this.currentFilter === 'all' 
      ? this.stories 
      : this.stories.filter(story => story.spaceType === this.currentFilter);

    if (filteredStories.length === 0) {
      container.innerHTML = `
        <div class="no-stories">
          <i class="fas fa-images"></i>
          <h3>Поки немає історій</h3>
          <p>Станьте першим, хто поділиться своєю історією!</p>
          <button class="btn btn-primary" onclick="storySharing.openStoryModal()">
            <i class="fas fa-plus"></i>
            Додати історію
          </button>
        </div>
      `;
      return;
    }

    filteredStories.forEach((story, index) => {
      const card = this.createStoryCard(story, index);
      container.appendChild(card);
    });

    // Animate cards
    this.animateStoryCards();
  }

  createStoryCard(story, index) {
    const card = document.createElement('div');
    card.className = `story-card ${story.featured ? 'featured' : ''}`;
    card.setAttribute('data-story-id', story.id);

    const timeAgo = this.getTimeAgo(story.timestamp);
    const spaceTypeLabel = this.getSpaceTypeLabel(story.spaceType);

    card.innerHTML = `
      ${story.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Популярна історія</div>' : ''}
      
      <div class="story-image-container">
        <img src="${story.image}" 
             alt="${story.name} - ${spaceTypeLabel}" 
             class="story-image"
             loading="lazy"
             onerror="this.src='assets/images/placeholder-story.jpg'">
        <div class="story-overlay">
          <div class="story-type-badge">${spaceTypeLabel}</div>
        </div>
      </div>

      <div class="story-content">
        <div class="story-author">
          <div class="story-avatar">${story.avatar}</div>
          <div class="story-meta">
            <div class="story-name">${story.name}</div>
            <div class="story-location">
              <i class="fas fa-map-marker-alt"></i>
              ${story.location || 'Україна'}
            </div>
            <div class="story-time">${timeAgo}</div>
          </div>
        </div>
        
        <div class="story-text-container">
          <p class="story-text">${story.story}</p>
        </div>
        
        <div class="story-actions">
          <button class="story-action-btn like-btn ${story.userLiked ? 'liked' : ''}" 
                  data-story-id="${story.id}">
            <i class="fas fa-heart"></i>
            <span class="like-count">${story.likes}</span>
          </button>
          <button class="story-action-btn share-btn" data-story-id="${story.id}">
            <i class="fas fa-share"></i>
            Поділитися
          </button>
          <button class="story-action-btn read-more-btn" data-story-id="${story.id}">
            <i class="fas fa-expand-alt"></i>
            Детальніше
          </button>
        </div>
      </div>
    `;

    this.bindStoryCardEvents(card, story);
    return card;
  }

  bindStoryCardEvents(card, story) {
    // Like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLike(story.id);
    });

    // Share button
    const shareBtn = card.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.shareStory(story);
    });

    // Read more button
    const readMoreBtn = card.querySelector('.read-more-btn');
    readMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showStoryDetails(story);
    });

    // Card click
    card.addEventListener('click', () => {
      this.showStoryDetails(story);
    });
  }

  animateStoryCards() {
    const cards = document.querySelectorAll('.story-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return diffHours === 0 ? 'Щойно' : `${diffHours} год тому`;
    } else if (diffDays === 1) {
      return 'Вчора';
    } else if (diffDays < 7) {
      return `${diffDays} днів тому`;
    } else if (diffWeeks === 1) {
      return 'Тиждень тому';
    } else if (diffWeeks < 4) {
      return `${diffWeeks} тижнів тому`;
    } else if (diffMonths === 1) {
      return 'Місяць тому';
    } else {
      return `${diffMonths} місяців тому`;
    }
  }

  getSpaceTypeLabel(type) {
    const labels = {
      hotel: 'Готель',
      medical: 'Медцентр',
      office: 'Офіс',
      wellness: 'Wellness'
    };
    return labels[type] || type;
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.renderStories();
  }

  toggleLike(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    if (!story) return;

    if (story.userLiked) {
      story.likes--;
      story.userLiked = false;
    } else {
      story.likes++;
      story.userLiked = true;
      
      // Add heart animation
      this.showHeartAnimation();
    }

    // Update UI
    const likeBtn = document.querySelector(`[data-story-id="${storyId}"].like-btn`);
    if (likeBtn) {
      likeBtn.classList.toggle('liked', story.userLiked);
      likeBtn.querySelector('.like-count').textContent = story.likes;
    }

    // Save to localStorage
    this.saveStoriesToStorage();
  }

  showHeartAnimation() {
    const hearts = ['💖', '💕', '💗', '❤️', '🧡', '💛'];
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = randomHeart;
    heart.style.cssText = `
      position: fixed;
      left: ${Math.random() * window.innerWidth}px;
      top: ${window.innerHeight}px;
      font-size: 24px;
      pointer-events: none;
      z-index: 9999;
      animation: floatHeart 3s ease-out forwards;
    `;

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 3000);

    // Add animation keyframes if not exist
    if (!document.getElementById('heart-animation-style')) {
      const style = document.createElement('style');
      style.id = 'heart-animation-style';
      style.textContent = `
        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(0.8);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  shareStory(story) {
    const shareData = {
      title: `Історія від ${story.name}`,
      text: story.story,
      url: `${window.location.origin}/?story=${story.id}`
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(shareData.url).then(() => {
        this.showToast('Посилання скопійовано!');
      });
    }
  }

  showStoryDetails(story) {
    const modal = document.createElement('div');
    modal.className = 'modal story-detail-modal open';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="story-detail-container">
          <div class="story-detail-image">
            <img src="${story.image}" alt="${story.name}">
            <div class="story-type-overlay">${this.getSpaceTypeLabel(story.spaceType)}</div>
          </div>
          
          <div class="story-detail-content">
            <div class="story-detail-header">
              <div class="story-author-large">
                <div class="story-avatar-large">${story.avatar}</div>
                <div class="author-info">
                  <h3>${story.name}</h3>
                  <p class="location"><i class="fas fa-map-marker-alt"></i> ${story.location || 'Україна'}</p>
                  <p class="timestamp">${this.getTimeAgo(story.timestamp)}</p>
                </div>
              </div>
              
              ${story.featured ? '<div class="featured-label"><i class="fas fa-star"></i> Популярна історія</div>' : ''}
            </div>
            
            <div class="story-full-text">
              <p>${story.story}</p>
            </div>
            
            <div class="story-detail-actions">
              <button class="btn btn-primary like-btn-large ${story.userLiked ? 'liked' : ''}" 
                      data-story-id="${story.id}">
                <i class="fas fa-heart"></i>
                <span>${story.likes} вподобань</span>
              </button>
              <button class="btn btn-outline share-btn-large" data-story-id="${story.id}">
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
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('modal-open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.body.classList.remove('modal-open');
      }
    });

    modal.querySelector('.like-btn-large').addEventListener('click', () => {
      this.toggleLike(story.id);
      modal.querySelector('.like-btn-large .fa-heart').classList.toggle('liked', story.userLiked);
      modal.querySelector('.like-btn-large span').textContent = `${story.likes} вподобань`;
    });

    modal.querySelector('.share-btn-large').addEventListener('click', () => {
      this.shareStory(story);
    });
  }

  openStoryModal() {
    this.modal = document.getElementById('story-modal');
    if (this.modal) {
      this.modal.classList.add('open');
      document.body.classList.add('modal-open');
      
      // Reset form
      const form = document.getElementById('story-form');
      if (form) {
        form.reset();
        this.removeSelectedFile();
      }
    }
  }

  closeStoryModal() {
    if (this.modal) {
      this.modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      this.modal = null;
    }
  }

  async submitStory(form) {
    const formData = new FormData(form);
    const storyData = {
      name: formData.get('name'),
      spaceType: formData.get('spaceType'),
      story: formData.get('story'),
      consent: formData.get('consent')
    };

    // Validation
    if (!this.validateStoryData(storyData)) {
      return;
    }

    if (!this.selectedFile) {
      this.showError('Будь ласка, додайте фото вашого простору');
      return;
    }

    try {
      // Show loading state
      this.showSubmitProgress(true);
      
      // Convert file to base64 for storage
      const imageDataUrl = await this.fileToDataUrl(this.selectedFile);
      
      // Create story object
      const newStory = {
        id: `user-${Date.now()}`,
        name: storyData.name,
        spaceType: storyData.spaceType,
        image: imageDataUrl,
        story: storyData.story,
        timestamp: Date.now(),
        approved: false, // Requires moderation
        featured: false,
        likes: 0,
        userLiked: false,
        avatar: storyData.name.charAt(0).toUpperCase(),
        location: 'Україна'
      };

      // Add to stories array
      this.stories.unshift(newStory);
      
      // Save to localStorage
      this.saveStoriesToStorage();
      
      // Close modal
      this.closeStoryModal();
      
      // Show success message
      this.showSuccess();
      
      // Refresh display
      this.renderStories();
      
      // Track submission
      this.trackStorySubmission(newStory);

    } catch (error) {
      console.error('Story submission failed:', error);
      this.showError('Помилка надсилання історії. Спробуйте ще раз.');
    } finally {
      this.showSubmitProgress(false);
    }
  }

  validateStoryData(data) {
    if (!data.name || data.name.length < 2) {
      this.showError('Введіть ваше ім\'я (мінімум 2 символи)');
      return false;
    }

    if (!data.spaceType) {
      this.showError('Оберіть тип простору');
      return false;
    }

    if (!data.story || data.story.length < 20) {
      this.showError('Розкажіть вашу історію (мінімум 20 символів)');
      return false;
    }

    if (!data.consent) {
      this.showError('Необхідно дати дозвіл на публікацію');
      return false;
    }

    return true;
  }

  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  showSubmitProgress(show) {
    const submitBtn = document.querySelector('#story-form button[type="submit"]');
    if (!submitBtn) return;

    if (show) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Надсилання...';
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Надіслати Історію';
      submitBtn.disabled = false;
    }
  }

  showSuccess() {
    this.showToast('Дякуємо! Ваша історія надіслана на модерацію та з\'явиться на сайті після перевірки.', 'success');
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.className = 'toast show';
      
      if (type === 'error') {
        toast.style.backgroundColor = 'var(--color-error)';
      } else if (type === 'success') {
        toast.style.backgroundColor = 'var(--color-success)';
      } else {
        toast.style.backgroundColor = 'var(--color-accent)';
      }
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, type === 'success' ? 4000 : 3000);
    }
  }

  saveStoriesToStorage() {
    // Save only user-created stories to localStorage
    const userStories = this.stories.filter(story => story.id.startsWith('user-'));
    localStorage.setItem('inner-garden-stories', JSON.stringify(userStories));
  }

  setupInstagramIntegration() {
    // Placeholder for Instagram integration
    // This would require Instagram Graph API and proper authentication
    this.loadInstagramStories();
  }

  async loadInstagramStories() {
    // Mock Instagram integration
    // In production, this would fetch posts with #ПростірУГармонії hashtag
    try {
      // const instagramStories = await fetch('/api/instagram/stories');
      // Process and add to stories array
      console.log('Instagram integration placeholder');
    } catch (error) {
      console.warn('Instagram integration not available:', error);
    }
  }

  trackStorySubmission(story) {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'story_submission', {
        event_category: 'user_generated_content',
        event_label: story.spaceType,
        value: 1
      });
    }
  }

  // Public methods
  getStoryById(id) {
    return this.stories.find(story => story.id === id);
  }

  moderateStory(storyId, approved) {
    const story = this.stories.find(s => s.id === storyId);
    if (story) {
      story.approved = approved;
      this.saveStoriesToStorage();
      this.renderStories();
    }
  }

  addFeaturedStory(storyId) {
    const story = this.stories.find(s => s.id === storyId);
    if (story) {
      story.featured = true;
      this.saveStoriesToStorage();
      this.renderStories();
    }
  }
}

// Story sharing styles
const storyStyles = `
  .story-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
  }

  .story-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  .story-card.featured {
    border: 2px solid var(--color-accent);
  }

  .featured-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--color-accent);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(230, 126, 34, 0.3);
  }

  .story-image-container {
    position: relative;
    height: 250px;
    overflow: hidden;
  }

  .story-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .story-card:hover .story-image {
    transform: scale(1.05);
  }

  .story-overlay {
    position: absolute;
    top: 0;
    right: 0;
    padding: 12px;
  }

  .story-type-badge {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-primary);
  }

  .story-content {
    padding: 24px;
  }

  .story-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .story-avatar {
    width: 45px;
    height: 45px;
    background: var(--color-accent);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }

  .story-meta {
    flex: 1;
  }

  .story-name {
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 2px;
  }

  .story-location,
  .story-time {
    font-size: 12px;
    color: var(--color-text-light);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .story-text {
    color: var(--color-text);
    line-height: 1.6;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .story-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .story-action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: var(--color-off-white);
    border: none;
    border-radius: 20px;
    color: var(--color-text);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .story-action-btn:hover {
    background: var(--color-accent);
    color: white;
  }

  .like-btn.liked {
    background: var(--color-error);
    color: white;
  }

  .file-drop-zone {
    border: 2px dashed var(--color-light-gray);
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-drop-zone:hover,
  .file-drop-zone.drag-over {
    border-color: var(--color-accent);
    background: rgba(230, 126, 34, 0.05);
  }

  .drop-zone-content {
    pointer-events: none;
  }

  .drop-icon {
    font-size: 48px;
    color: var(--color-accent);
    margin-bottom: 16px;
  }

  .drop-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 8px;
  }

  .drop-hint {
    font-size: 12px;
    color: var(--color-text-light);
  }

  .file-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
  }

  .preview-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  .preview-info {
    flex: 1;
  }

  .file-name {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .file-size {
    font-size: 12px;
    color: var(--color-text-light);
  }

  .remove-file-btn {
    background: var(--color-error);
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-stories {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 40px;
    color: var(--color-text-light);
  }

  .no-stories i {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.5;
  }

  .no-stories h3 {
    margin-bottom: 16px;
    color: var(--color-text);
  }

  @media (max-width: 768px) {
    .story-actions {
      flex-wrap: wrap;
    }
    
    .story-action-btn {
      font-size: 12px;
      padding: 6px 10px;
    }
    
    .file-drop-zone {
      padding: 20px 10px;
      min-height: 150px;
    }
    
    .drop-icon {
      font-size: 36px;
    }
  }
`;

// Inject styles
const storiesStyleSheetGlobal = document.createElement('style');
storiesStyleSheetGlobal.textContent = storyStyles;
document.head.appendChild(storiesStyleSheetGlobal);

// Initialize story sharing when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.storySharing = new StorySharing();
});

// Handle URL parameters for direct story linking
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('story');
  
  if (storyId && window.storySharing) {
    const story = window.storySharing.getStoryById(storyId);
    if (story) {
      setTimeout(() => {
        window.storySharing.showStoryDetails(story);
      }, 1000);
    }
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorySharing;
}