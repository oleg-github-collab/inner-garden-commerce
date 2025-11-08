// Inner Garden - Admin Panel for Marina Kaminska

class AdminPanel {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.currentView = 'dashboard';
    this.apiUrl = '/api/admin'; // Would connect to backend API
    this.uploadUrl = '/api/upload';
    this.tempData = this.initializeTempData(); // For demo purposes
    
    this.init();
  }

  init() {
    this.checkAuthentication();
    this.bindEvents();
    this.createAdminInterface();
  }

  initializeTempData() {
    // Initialize with local storage for demo - in production would use backend
    return {
      artworks: JSON.parse(localStorage.getItem('admin-artworks') || '[]'),
      locations: JSON.parse(localStorage.getItem('admin-locations') || '[]'),
      categories: JSON.parse(localStorage.getItem('admin-categories') || '["abstract", "nature", "geometric", "minimalism"]'),
      orders: JSON.parse(localStorage.getItem('admin-orders') || '[]'),
      analytics: JSON.parse(localStorage.getItem('admin-analytics') || '{}')
    };
  }

  checkAuthentication() {
    const token = localStorage.getItem('admin-token');
    const adminUser = localStorage.getItem('admin-user');
    
    if (token && adminUser) {
      try {
        this.currentUser = JSON.parse(adminUser);
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    }
  }

  bindEvents() {
    // Global admin access key combination (Ctrl+Shift+A)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (this.isAuthenticated) {
          this.showAdminPanel();
        } else {
          this.showLoginModal();
        }
      }
    });

    // Admin menu button (if exists)
    document.addEventListener('click', (e) => {
      if (e.target.matches('.admin-access-btn')) {
        e.preventDefault();
        if (this.isAuthenticated) {
          this.showAdminPanel();
        } else {
          this.showLoginModal();
        }
      }
    });
  }

  showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal admin-login-modal open';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="admin-login-container">
          <div class="admin-login-header">
            <h2 data-key="admin-login">Увійти в Адмінку</h2>
            <p>Панель керування Inner Garden</p>
          </div>
          
          <form id="admin-login-form" class="admin-login-form">
            <div class="form-group">
              <label for="admin-email">Email:</label>
              <input type="email" id="admin-email" name="email" required 
                     placeholder="marina@inner-garden.art" autocomplete="username">
            </div>
            
            <div class="form-group">
              <label for="admin-password">Пароль:</label>
              <div class="password-input-container">
                <input type="password" id="admin-password" name="password" required 
                       placeholder="Введіть пароль" autocomplete="current-password">
                <button type="button" class="password-toggle" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'; this.innerHTML = this.previousElementSibling.type === 'password' ? '<i class=\"fas fa-eye\"></i>' : '<i class=\"fas fa-eye-slash\"></i>'">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" name="remember" id="remember-me">
                <span class="checkmark"></span>
                Запам'ятати мене
              </label>
            </div>
            
            <div class="admin-login-actions">
              <button type="submit" class="btn btn-primary" id="login-submit">
                <i class="fas fa-sign-in-alt"></i>
                Увійти
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">
                Скасувати
              </button>
            </div>
          </form>
          
          <div class="admin-login-help">
            <p><small>Для демонстрації: marina@inner-garden.art / admin123</small></p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Bind login form
    const loginForm = modal.querySelector('#admin-login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin(loginForm);
    });

    // Focus email input
    modal.querySelector('#admin-email').focus();
  }

  async handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    const submitBtn = form.querySelector('#login-submit');
    const originalText = submitBtn.innerHTML;
    
    try {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вхід...';
      submitBtn.disabled = true;

      // Demo authentication - in production would call backend API
      if (email === 'marina@inner-garden.art' && password === 'admin123') {
        const userData = {
          id: '1',
          name: 'Marina Kaminska',
          email: email,
          role: 'admin',
          avatar: 'assets/images/marina-avatar.jpg',
          lastLogin: new Date().toISOString()
        };

        // Store authentication
        const token = 'demo-admin-token-' + Date.now();
        localStorage.setItem('admin-token', token);
        localStorage.setItem('admin-user', JSON.stringify(userData));
        
        if (remember) {
          localStorage.setItem('admin-remember', 'true');
        }

        this.currentUser = userData;
        this.isAuthenticated = true;

        // Close modal
        form.closest('.modal').remove();
        document.body.classList.remove('modal-open');

        // Show admin panel
        setTimeout(() => {
          this.showAdminPanel();
        }, 300);

        // Show success message
        if (window.globalErrorHandler) {
          window.globalErrorHandler.showToast('Успішно увійшли в адмінку', 'success');
        }

      } else {
        throw new Error('Невірний email або пароль');
      }

    } catch (error) {
      if (window.globalErrorHandler) {
        window.globalErrorHandler.showToast(error.message, 'error');
      }
      console.error('Login error:', error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  showAdminPanel() {
    if (!this.isAuthenticated) {
      this.showLoginModal();
      return;
    }

    const adminPanel = document.createElement('div');
    adminPanel.id = 'admin-panel';
    adminPanel.className = 'admin-panel-overlay';
    adminPanel.innerHTML = `
      <div class="admin-panel-container">
        <div class="admin-sidebar">
          <div class="admin-header">
            <div class="admin-logo">
              <i class="fas fa-palette"></i>
              <span>Inner Garden Admin</span>
            </div>
            <div class="admin-user">
              <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="user-avatar" onerror="this.src='assets/images/default-avatar.jpg'">
              <div class="user-info">
                <div class="user-name">${this.currentUser.name}</div>
                <div class="user-role">${this.currentUser.role}</div>
              </div>
            </div>
          </div>
          
          <nav class="admin-nav">
            <button class="admin-nav-item active" data-view="dashboard">
              <i class="fas fa-tachometer-alt"></i>
              <span data-key="admin-dashboard">Головна панель</span>
            </button>
            <button class="admin-nav-item" data-view="artworks">
              <i class="fas fa-images"></i>
              <span data-key="admin-artworks">Керування картинами</span>
            </button>
            <button class="admin-nav-item" data-view="map">
              <i class="fas fa-map-marked-alt"></i>
              <span data-key="admin-map">Керування картою</span>
            </button>
            <button class="admin-nav-item" data-view="categories">
              <i class="fas fa-tags"></i>
              <span data-key="admin-categories">Категорії</span>
            </button>
            <button class="admin-nav-item" data-view="orders">
              <i class="fas fa-shopping-bag"></i>
              <span data-key="admin-orders">Замовлення</span>
            </button>
            <button class="admin-nav-item" data-view="analytics">
              <i class="fas fa-chart-bar"></i>
              <span data-key="admin-analytics">Аналітика</span>
            </button>
            <button class="admin-nav-item" data-view="settings">
              <i class="fas fa-cog"></i>
              <span data-key="admin-settings">Налаштування</span>
            </button>
          </nav>
          
          <div class="admin-actions">
            <button class="admin-logout-btn" onclick="window.adminPanel.logout()">
              <i class="fas fa-sign-out-alt"></i>
              <span data-key="admin-logout">Вийти</span>
            </button>
          </div>
        </div>
        
        <div class="admin-main">
          <div class="admin-main-header">
            <h1 id="admin-main-title">Головна панель</h1>
            <button class="admin-close-btn" onclick="window.adminPanel.hideAdminPanel()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="admin-content" id="admin-content">
            <!-- Content will be loaded here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(adminPanel);
    document.body.classList.add('admin-panel-open');

    // Bind navigation
    adminPanel.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        this.switchView(view);
      });
    });

    // Load dashboard by default
    this.switchView('dashboard');
  }

  switchView(view) {
    this.currentView = view;
    
    // Update navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === view);
    });

    // Update title
    const titles = {
      dashboard: 'Головна панель',
      artworks: 'Керування картинами',
      map: 'Керування картою',
      categories: 'Категорії',
      orders: 'Замовлення',
      analytics: 'Аналітика',
      settings: 'Налаштування'
    };
    
    document.getElementById('admin-main-title').textContent = titles[view] || view;

    // Load content
    this.loadViewContent(view);
  }

  loadViewContent(view) {
    const contentContainer = document.getElementById('admin-content');
    if (!contentContainer) return;

    switch (view) {
      case 'dashboard':
        this.loadDashboard(contentContainer);
        break;
      case 'artworks':
        this.loadArtworksManager(contentContainer);
        break;
      case 'map':
        this.loadMapManager(contentContainer);
        break;
      case 'categories':
        this.loadCategoriesManager(contentContainer);
        break;
      case 'orders':
        this.loadOrdersManager(contentContainer);
        break;
      case 'analytics':
        this.loadAnalytics(contentContainer);
        break;
      case 'settings':
        this.loadSettings(contentContainer);
        break;
      default:
        contentContainer.innerHTML = '<p>Вміст завантажується...</p>';
    }
  }

  loadDashboard(container) {
    const stats = this.getDashboardStats();
    
    container.innerHTML = `
      <div class="admin-dashboard">
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-images"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.artworks}</div>
              <div class="stat-label">Картин у колекції</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.locations}</div>
              <div class="stat-label">Локацій на карті</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.orders}</div>
              <div class="stat-label">Нових запитів</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-eye"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${stats.views}</div>
              <div class="stat-label">Переглядів сьогодні</div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="dashboard-section">
            <h3>Швидкі дії</h3>
            <div class="quick-actions">
              <button class="quick-action-btn" onclick="window.adminPanel.switchView('artworks')">
                <i class="fas fa-plus"></i>
                Додати нову картину
              </button>
              <button class="quick-action-btn" onclick="window.adminPanel.switchView('map')">
                <i class="fas fa-map-pin"></i>
                Додати локацію
              </button>
              <button class="quick-action-btn" onclick="window.adminPanel.switchView('orders')">
                <i class="fas fa-envelope-open"></i>
                Переглянути запити
              </button>
            </div>
          </div>
          
          <div class="dashboard-section">
            <h3>Останні дії</h3>
            <div class="recent-activity">
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-plus-circle"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Додано нову картину "Космічний танець"</div>
                  <div class="activity-time">2 години тому</div>
                </div>
              </div>
              
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-edit"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">Оновлено інформацію про готель у Києві</div>
                  <div class="activity-time">1 день тому</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  loadArtworksManager(container) {
    container.innerHTML = `
      <div class="admin-artworks">
        <div class="artworks-header">
          <h3>Керування колекцією</h3>
          <button class="btn btn-primary" onclick="window.adminPanel.showAddArtworkModal()">
            <i class="fas fa-plus"></i>
            Додати картину
          </button>
        </div>
        
        <div class="artworks-filters">
          <input type="text" placeholder="Пошук картин..." class="search-input" id="admin-artwork-search">
          <select class="filter-select" id="admin-artwork-filter">
            <option value="all">Всі категорії</option>
            <option value="abstract">Абстракція</option>
            <option value="nature">Природа</option>
            <option value="geometric">Геометрія</option>
            <option value="minimalism">Мінімалізм</option>
          </select>
        </div>
        
        <div class="artworks-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Зображення</th>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Рік</th>
                <th>Ціна</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody id="artworks-table-body">
              ${this.generateArtworksTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind search and filter
    document.getElementById('admin-artwork-search')?.addEventListener('input', (e) => {
      this.filterArtworksTable(e.target.value);
    });

    document.getElementById('admin-artwork-filter')?.addEventListener('change', (e) => {
      this.filterArtworksTable('', e.target.value);
    });
  }

  generateArtworksTableRows() {
    // Get artworks from collection or temp data
    const artworks = window.artCollection?.artworks || [];
    
    if (artworks.length === 0) {
      return '<tr><td colspan="7" class="no-data">Немає картин у колекції</td></tr>';
    }

    return artworks.map(artwork => {
      const title = artwork.title.uk || artwork.title.en || 'Без назви';
      const price = artwork.price?.amount ? 
        `${artwork.price.amount} ${artwork.price.currency}` : 
        (artwork.price?.contact ? 'За запитом' : 'Не вказано');
      const status = artwork.price?.sold ? 'Продана' : 
        (artwork.price?.available ? 'Доступна' : 'Недоступна');

      return `
        <tr data-artwork-id="${artwork.id}">
          <td>
            <img src="${artwork.images.thumbnail}" alt="${title}" class="artwork-thumb">
          </td>
          <td><strong>${title}</strong></td>
          <td>${artwork.category}</td>
          <td>${artwork.year}</td>
          <td>${price}</td>
          <td>
            <span class="status-badge ${artwork.price?.sold ? 'sold' : (artwork.price?.available ? 'available' : 'unavailable')}">
              ${status}
            </span>
          </td>
          <td class="table-actions">
            <button class="action-btn edit" onclick="window.adminPanel.editArtwork('${artwork.id}')" title="Редагувати">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn view" onclick="window.artCollection?.showArtworkDetail('${artwork.id}')" title="Переглянути">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn delete" onclick="window.adminPanel.deleteArtwork('${artwork.id}')" title="Видалити">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  showAddArtworkModal() {
    const modal = document.createElement('div');
    modal.className = 'modal admin-artwork-modal open';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="artwork-form-container">
          <h3>Додати нову картину</h3>
          <form id="admin-artwork-form" class="admin-form">
            <div class="form-row">
              <div class="form-group">
                <label for="artwork-title-uk">Назва (українською):</label>
                <input type="text" id="artwork-title-uk" name="titleUk" required>
              </div>
              <div class="form-group">
                <label for="artwork-title-en">Назва (англійською):</label>
                <input type="text" id="artwork-title-en" name="titleEn" required>
              </div>
              <div class="form-group">
                <label for="artwork-title-de">Назва (німецькою):</label>
                <input type="text" id="artwork-title-de" name="titleDe" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="artwork-description-uk">Опис (українською):</label>
              <textarea id="artwork-description-uk" name="descriptionUk" rows="3" required></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="artwork-category">Категорія:</label>
                <select id="artwork-category" name="category" required>
                  <option value="abstract">Абстракція</option>
                  <option value="nature">Природа</option>
                  <option value="geometric">Геометрія</option>
                  <option value="minimalism">Мінімалізм</option>
                </select>
              </div>
              <div class="form-group">
                <label for="artwork-year">Рік створення:</label>
                <input type="number" id="artwork-year" name="year" min="2000" max="${new Date().getFullYear()}" value="${new Date().getFullYear()}" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="artwork-width">Ширина (см):</label>
                <input type="number" id="artwork-width" name="width" min="10" required>
              </div>
              <div class="form-group">
                <label for="artwork-height">Висота (см):</label>
                <input type="number" id="artwork-height" name="height" min="10" required>
              </div>
              <div class="form-group">
                <label for="artwork-depth">Глибина (см):</label>
                <input type="number" id="artwork-depth" name="depth" min="1" value="2">
              </div>
            </div>
            
            <div class="form-group">
              <label for="artwork-materials-uk">Матеріали (українською):</label>
              <input type="text" id="artwork-materials-uk" name="materialsUk" placeholder="Акрил на полотні" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="artwork-price">Ціна (EUR):</label>
                <input type="number" id="artwork-price" name="price" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label for="artwork-status">Статус:</label>
                <select id="artwork-status" name="status">
                  <option value="available">Доступна</option>
                  <option value="sold">Продана</option>
                  <option value="commission">На замовлення</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="artwork-image">Головне зображення:</label>
              <div class="file-upload-area" onclick="document.getElementById('artwork-image').click()">
                <input type="file" id="artwork-image" name="image" accept="image/*" style="display: none;">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Клікніть або перетягніть файл сюди</p>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i>
                Зберегти картину
              </button>
              <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove(); document.body.classList.remove('modal-open');">
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Bind form submission
    modal.querySelector('#admin-artwork-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleArtworkSubmission(e.target, modal);
    });

    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('modal-open');
    });
  }

  async handleArtworkSubmission(form, modal) {
    try {
      const formData = new FormData(form);
      
      const artworkData = {
        title: {
          uk: formData.get('titleUk'),
          en: formData.get('titleEn'),
          de: formData.get('titleDe')
        },
        description: {
          uk: formData.get('descriptionUk'),
          en: formData.get('descriptionUk'), // Would need separate fields
          de: formData.get('descriptionUk')  // Would need separate fields
        },
        category: formData.get('category'),
        year: parseInt(formData.get('year')),
        dimensions: {
          width: parseInt(formData.get('width')),
          height: parseInt(formData.get('height')),
          depth: parseInt(formData.get('depth'))
        },
        materials: {
          uk: formData.get('materialsUk'),
          en: formData.get('materialsUk'), // Would need separate fields
          de: formData.get('materialsUk')  // Would need separate fields
        },
        price: {
          amount: parseFloat(formData.get('price')) || null,
          currency: 'EUR',
          available: formData.get('status') === 'available',
          sold: formData.get('status') === 'sold',
          contact: formData.get('status') === 'commission'
        },
        images: {
          main: 'assets/images/collection/placeholder-main.jpg', // Would upload file
          thumbnail: 'assets/images/collection/placeholder-thumb.jpg',
          detail: 'assets/images/collection/placeholder-detail.jpg',
          room: 'assets/images/collection/placeholder-room.jpg'
        },
        tags: [],
        location: {
          type: 'studio',
          available: formData.get('status') === 'available'
        }
      };

      // Add artwork to collection
      if (window.artCollection) {
        window.artCollection.addArtwork(artworkData);
      }

      // Close modal
      modal.remove();
      document.body.classList.remove('modal-open');

      // Refresh artworks view
      if (this.currentView === 'artworks') {
        this.loadArtworksManager(document.getElementById('admin-content'));
      }

      // Show success message
      if (window.globalErrorHandler) {
        window.globalErrorHandler.showToast('Картину успішно додано!', 'success');
      }

    } catch (error) {
      console.error('Error adding artwork:', error);
      if (window.globalErrorHandler) {
        window.globalErrorHandler.showToast('Помилка додавання картини', 'error');
      }
    }
  }

  loadMapManager(container) {
    container.innerHTML = `
      <div class="admin-map">
        <div class="map-header">
          <h3>Керування картою гармонії</h3>
          <button class="btn btn-primary" onclick="window.adminPanel.showAddLocationModal()">
            <i class="fas fa-plus"></i>
            Додати локацію
          </button>
        </div>
        
        <div class="map-content">
          <div class="map-locations-list">
            <h4>Поточні локації</h4>
            <div class="locations-grid" id="admin-locations-grid">
              ${this.generateLocationsGrid()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateLocationsGrid() {
    // Get locations from harmony map or temp data
    const locations = window.harmonyMap?.projects || [];
    
    if (locations.length === 0) {
      return '<p class="no-data">Немає локацій на карті</p>';
    }

    return locations.map(location => `
      <div class="location-card" data-location-id="${location.id}">
        <div class="location-image">
          <img src="${location.images?.[0] || 'assets/images/placeholder-location.jpg'}" alt="${location.name}">
        </div>
        <div class="location-info">
          <h5>${location.name}</h5>
          <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
          <p><i class="fas fa-tag"></i> ${location.type}</p>
          <div class="location-actions">
            <button class="action-btn edit" onclick="window.adminPanel.editLocation('${location.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="window.adminPanel.deleteLocation('${location.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  getDashboardStats() {
    return {
      artworks: window.artCollection?.artworks?.length || 0,
      locations: window.harmonyMap?.projects?.length || 0,
      orders: this.tempData.orders.length,
      views: Math.floor(Math.random() * 1000) + 500 // Demo data
    };
  }

  logout() {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    localStorage.removeItem('admin-remember');
    
    this.isAuthenticated = false;
    this.currentUser = null;
    
    this.hideAdminPanel();
    
    if (window.globalErrorHandler) {
      window.globalErrorHandler.showToast('Ви вийшли з адмінки', 'info');
    }
  }

  hideAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
      panel.remove();
      document.body.classList.remove('admin-panel-open');
    }
  }

  createAdminInterface() {
    // Add admin access button to footer (hidden by default)
    const footer = document.querySelector('.footer');
    if (footer && !document.querySelector('.admin-access-btn')) {
      const adminBtn = document.createElement('button');
      adminBtn.className = 'admin-access-btn';
      adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
      adminBtn.title = 'Адмін панель (Ctrl+Shift+A)';
      adminBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0.1;
        transition: opacity 0.3s ease;
        z-index: 999;
      `;
      
      adminBtn.addEventListener('mouseenter', () => {
        adminBtn.style.opacity = '1';
      });
      
      adminBtn.addEventListener('mouseleave', () => {
        adminBtn.style.opacity = this.isAuthenticated ? '0.7' : '0.1';
      });
      
      document.body.appendChild(adminBtn);
      
      if (this.isAuthenticated) {
        adminBtn.style.opacity = '0.7';
      }
    }
  }

  // Additional methods would be implemented here for other admin functions...
}

// Admin panel styles
const adminStyles = `
  .admin-panel-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    display: flex;
  }

  .admin-panel-container {
    width: 100%;
    height: 100%;
    display: flex;
    background: #f8f9fa;
  }

  .admin-sidebar {
    width: 280px;
    background: #2c3e50;
    color: white;
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    padding: 20px;
    border-bottom: 1px solid #34495e;
  }

  .admin-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .admin-user {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-name {
    font-weight: 600;
    font-size: 14px;
  }

  .user-role {
    font-size: 12px;
    opacity: 0.7;
  }

  .admin-nav {
    flex: 1;
    padding: 20px 0;
  }

  .admin-nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: none;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .admin-nav-item:hover,
  .admin-nav-item.active {
    background: #34495e;
  }

  .admin-nav-item i {
    width: 20px;
  }

  .admin-actions {
    padding: 20px;
    border-top: 1px solid #34495e;
  }

  .admin-logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #e74c3c;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .admin-logout-btn:hover {
    background: #c0392b;
  }

  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .admin-main-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px;
    background: white;
    border-bottom: 1px solid #dee2e6;
  }

  .admin-close-btn {
    background: #6c757d;
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .admin-close-btn:hover {
    background: #5a6268;
  }

  .admin-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    background: #f8f9fa;
  }

  /* Login Modal */
  .admin-login-modal .modal-content {
    max-width: 400px;
  }

  .admin-login-container {
    padding: 40px 30px;
    text-align: center;
  }

  .admin-login-header h2 {
    margin: 0 0 8px 0;
    color: var(--color-primary);
  }

  .admin-login-form {
    margin-top: 30px;
    text-align: left;
  }

  .password-input-container {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-light);
    cursor: pointer;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .admin-login-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .admin-login-help {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--color-light-gray);
    color: var(--color-text-light);
  }

  /* Dashboard */
  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--color-accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-number {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-primary);
  }

  .stat-label {
    color: var(--color-text-light);
    font-size: 14px;
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .dashboard-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .dashboard-section h3 {
    margin: 0 0 20px 0;
    color: var(--color-primary);
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--color-off-white);
    border: 1px solid var(--color-light-gray);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .quick-action-btn:hover {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  /* Artworks Manager */
  .artworks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .artworks-filters {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    padding: 20px;
    background: white;
    border-radius: 8px;
  }

  .artworks-table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
  }

  .admin-table th,
  .admin-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }

  .admin-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: var(--color-text);
  }

  .artwork-thumb {
    width: 50px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .status-badge.available {
    background: #d4edda;
    color: #155724;
  }

  .status-badge.sold {
    background: #f8d7da;
    color: #721c24;
  }

  .status-badge.unavailable {
    background: #e2e3e5;
    color: #383d41;
  }

  .table-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn.edit {
    background: #e3f2fd;
    color: #1976d2;
  }

  .action-btn.edit:hover {
    background: #1976d2;
    color: white;
  }

  .action-btn.view {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .action-btn.view:hover {
    background: #7b1fa2;
    color: white;
  }

  .action-btn.delete {
    background: #ffebee;
    color: #d32f2f;
  }

  .action-btn.delete:hover {
    background: #d32f2f;
    color: white;
  }

  @media (max-width: 768px) {
    .admin-panel-container {
      flex-direction: column;
    }

    .admin-sidebar {
      width: 100%;
      height: auto;
    }

    .dashboard-stats {
      grid-template-columns: 1fr;
    }

    .dashboard-content {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject admin styles
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminStyles;
document.head.appendChild(adminStyleSheet);

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminPanel;
}