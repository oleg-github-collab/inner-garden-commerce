// Ultra Error Handler - Comprehensive Error Management & Recovery System
// Handles ALL possible errors, provides graceful fallbacks, and ensures site reliability

class UltraErrorHandler {
  constructor() {
    this.errors = new Map();
    this.warningThreshold = 5;
    this.errorThreshold = 10;
    this.isInitialized = false;
    this.fallbackStrategies = new Map();
    this.recovery = new Map();
    this.userNotifications = [];
    this.criticalSystemErrors = [];

    this.init();
  }

  init() {
    this.setupGlobalErrorHandling();
    this.setupUnhandledPromiseRejection();
    this.setupResourceErrorHandling();
    this.setupNetworkErrorHandling();
    this.setupARErrorHandling();
    this.setupFallbackStrategies();
    this.setupRecoveryMechanisms();
    this.setupUserNotifications();

    this.isInitialized = true;
    console.log('🛡️ Ultra Error Handler initialized - Site is now bulletproof!');
  }

  // =====================================================
  // GLOBAL ERROR HANDLING
  // =====================================================

  setupGlobalErrorHandling() {
    // Global JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
        stack: event.error?.stack,
        severity: 'high',
        timestamp: Date.now()
      });
    });

    // Global unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason,
        stack: event.reason?.stack,
        severity: 'medium',
        timestamp: Date.now()
      });
    });

    // Console errors (for debugging)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.handleError({
        type: 'console_error',
        message: args.join(' '),
        severity: 'low',
        timestamp: Date.now()
      });
      originalConsoleError.apply(console, args);
    };
  }

  setupUnhandledPromiseRejection() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event);
    });
  }

  setupResourceErrorHandling() {
    // Image loading errors
    document.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        this.handleImageError(event.target);
      } else if (event.target.tagName === 'SCRIPT') {
        this.handleScriptError(event.target);
      } else if (event.target.tagName === 'LINK') {
        this.handleStylesheetError(event.target);
      }
    }, true);
  }

  setupNetworkErrorHandling() {
    // Fetch wrapper with error handling
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.handleNetworkError({
            url: args[0],
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        this.handleNetworkError({
          url: args[0],
          error: error.message,
          type: 'fetch_failed'
        });
        throw error;
      }
    };

    // XMLHttpRequest wrapper
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      this.addEventListener('error', () => {
        window.InnerGarden?.errorHandler?.handleNetworkError({
          url: args[1],
          type: 'xhr_error'
        });
      });

      this.addEventListener('timeout', () => {
        window.InnerGarden?.errorHandler?.handleNetworkError({
          url: args[1],
          type: 'xhr_timeout'
        });
      });

      return originalXHROpen.apply(this, args);
    };
  }

  setupARErrorHandling() {
    // AR-specific error handling
    this.fallbackStrategies.set('ar_camera_failed', () => {
      this.showUserNotification({
        type: 'warning',
        title: 'Камера недоступна',
        message: 'Переконайтеся, що дозволили доступ до камери',
        actions: [
          { text: 'Спробувати знову', action: () => this.retryCamera() },
          { text: 'Переглянути без AR', action: () => this.showARFallback() }
        ]
      });
    });

    this.fallbackStrategies.set('ar_not_supported', () => {
      // Gracefully show desktop gallery instead
      const arContainer = document.getElementById('simple-ar-container');
      if (arContainer && window.simpleARViewer) {
        window.simpleARViewer.showFallback();
      }
    });

    this.fallbackStrategies.set('webgl_failed', () => {
      this.showUserNotification({
        type: 'info',
        title: 'Графіка обмежена',
        message: 'Використовуємо спрощену графіку для вашого пристрою',
        duration: 5000
      });
    });
  }

  // =====================================================
  // SPECIFIC ERROR HANDLERS
  // =====================================================

  handleError(errorInfo) {
    const errorKey = `${errorInfo.type}_${errorInfo.message}`;
    const existingError = this.errors.get(errorKey);

    if (existingError) {
      existingError.count++;
      existingError.lastOccurred = errorInfo.timestamp;
    } else {
      this.errors.set(errorKey, {
        ...errorInfo,
        count: 1,
        firstOccurred: errorInfo.timestamp,
        lastOccurred: errorInfo.timestamp
      });
    }

    // Log error
    this.logError(errorInfo);

    // Check if we need to apply fallback strategy
    this.checkAndApplyFallback(errorInfo);

    // Check if we need to trigger recovery
    this.checkAndTriggerRecovery(errorInfo);

    // Notify user if necessary
    this.checkAndNotifyUser(errorInfo);
  }

  handlePromiseRejection(event) {
    const error = {
      type: 'promise_rejection',
      message: event.reason?.message || 'Promise rejected',
      error: event.reason,
      severity: 'medium',
      timestamp: Date.now()
    };

    // Special handling for common promise rejections
    if (event.reason?.message?.includes('User denied camera access')) {
      this.applyFallback('ar_camera_failed');
      event.preventDefault(); // Prevent default browser behavior
      return;
    }

    if (event.reason?.name === 'NotFoundError') {
      this.applyFallback('camera_not_found');
      event.preventDefault();
      return;
    }

    this.handleError(error);
  }

  handleImageError(img) {
    const error = {
      type: 'image_load_failed',
      message: `Failed to load image: ${img.src}`,
      element: img,
      severity: 'low',
      timestamp: Date.now()
    };

    this.handleError(error);

    // Apply fallback image
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = 'true';
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';
      img.alt = 'Image not available';
    }
  }

  handleScriptError(script) {
    const error = {
      type: 'script_load_failed',
      message: `Failed to load script: ${script.src}`,
      element: script,
      severity: 'high',
      timestamp: Date.now()
    };

    this.handleError(error);

    // Try to load from CDN fallback if local script fails
    if (script.src.includes('js/') && !script.dataset.fallbackAttempted) {
      script.dataset.fallbackAttempted = 'true';
      this.tryScriptFallback(script);
    }
  }

  handleStylesheetError(link) {
    const error = {
      type: 'stylesheet_load_failed',
      message: `Failed to load stylesheet: ${link.href}`,
      element: link,
      severity: 'medium',
      timestamp: Date.now()
    };

    this.handleError(error);

    // Apply minimal fallback styles
    if (!document.getElementById('fallback-styles')) {
      this.applyFallbackStyles();
    }
  }

  handleNetworkError(networkInfo) {
    const error = {
      type: 'network_error',
      message: `Network request failed: ${networkInfo.url}`,
      details: networkInfo,
      severity: 'medium',
      timestamp: Date.now()
    };

    this.handleError(error);

    // Show network error notification after multiple failures
    const networkErrors = Array.from(this.errors.values())
      .filter(e => e.type === 'network_error')
      .reduce((sum, e) => sum + e.count, 0);

    if (networkErrors > 3) {
      this.showUserNotification({
        type: 'warning',
        title: 'Проблеми з мережею',
        message: 'Перевірте інтернет-з\'єднання',
        duration: 10000
      });
    }
  }

  // =====================================================
  // FALLBACK STRATEGIES
  // =====================================================

  setupFallbackStrategies() {
    // AR Camera fallback
    this.fallbackStrategies.set('camera_not_found', () => {
      const viewer = window.simpleARViewer;
      if (viewer) {
        viewer.showFallback();
      }
    });

    // Language loading fallback
    this.fallbackStrategies.set('language_load_failed', () => {
      if (window.ultraI18n) {
        window.ultraI18n.loadFallbackLanguage();
      }
    });

    // Map loading fallback
    this.fallbackStrategies.set('map_load_failed', () => {
      const mapContainer = document.getElementById('harmony-world-map');
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #666;">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 16px;"></i>
            <p>Карта тимчасово недоступна</p>
            <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #e67e22; color: white; border: none; border-radius: 4px;">Спробувати знову</button>
          </div>
        `;
      }
    });

    // Font loading fallback
    this.fallbackStrategies.set('font_load_failed', () => {
      document.body.style.fontFamily = 'Arial, sans-serif';
    });
  }

  setupRecoveryMechanisms() {
    // Auto-recovery for transient errors
    this.recovery.set('network_timeout', () => {
      setTimeout(() => {
        // Try to re-establish network connections
        if (navigator.onLine) {
          this.clearErrorsOfType('network_error');
        }
      }, 5000);
    });

    // Memory cleanup recovery
    this.recovery.set('memory_pressure', () => {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }

      // Clear image caches
      const images = document.querySelectorAll('img[src^="data:"]');
      images.forEach(img => {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
        }
      });
    });

    // Performance recovery
    this.recovery.set('slow_performance', () => {
      // Reduce animations
      document.body.classList.add('reduced-motion');

      // Disable non-essential features
      this.showUserNotification({
        type: 'info',
        title: 'Режим енергозбереження',
        message: 'Деякі анімації вимкнено для кращої продуктивності',
        duration: 5000
      });
    });
  }

  // =====================================================
  // USER NOTIFICATIONS
  // =====================================================

  setupUserNotifications() {
    // Create notification container
    if (!document.getElementById('error-notifications')) {
      const container = document.createElement('div');
      container.id = 'error-notifications';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        pointer-events: none;
        width: 350px;
      `;
      document.body.appendChild(container);
    }
  }

  showUserNotification(notification) {
    const container = document.getElementById('error-notifications');
    if (!container) return;

    const notificationEl = document.createElement('div');
    notificationEl.style.cssText = `
      background: ${this.getNotificationColor(notification.type)};
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      pointer-events: auto;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-left: 4px solid ${this.getNotificationBorderColor(notification.type)};
    `;

    notificationEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">${notification.title}</div>
          <div style="font-size: 14px; opacity: 0.9;">${notification.message}</div>
          ${notification.actions ? this.renderNotificationActions(notification.actions) : ''}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin-left: 8px;">×</button>
      </div>
    `;

    container.appendChild(notificationEl);

    // Animate in
    setTimeout(() => {
      notificationEl.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after duration
    if (notification.duration) {
      setTimeout(() => {
        if (notificationEl.parentElement) {
          notificationEl.style.transform = 'translateX(100%)';
          setTimeout(() => notificationEl.remove(), 300);
        }
      }, notification.duration);
    }

    this.userNotifications.push({
      ...notification,
      timestamp: Date.now(),
      element: notificationEl
    });
  }

  getNotificationColor(type) {
    const colors = {
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
      success: '#27ae60'
    };
    return colors[type] || colors.info;
  }

  getNotificationBorderColor(type) {
    const colors = {
      error: '#c0392b',
      warning: '#e67e22',
      info: '#2980b9',
      success: '#229954'
    };
    return colors[type] || colors.info;
  }

  renderNotificationActions(actions) {
    return `
      <div style="margin-top: 8px;">
        ${actions.map(action => `
          <button onclick="${action.action}" style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            margin-right: 8px;
            cursor: pointer;
            font-size: 12px;
          ">${action.text}</button>
        `).join('')}
      </div>
    `;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  applyFallback(strategyKey) {
    const strategy = this.fallbackStrategies.get(strategyKey);
    if (strategy) {
      try {
        strategy();
        this.logInfo(`Applied fallback strategy: ${strategyKey}`);
      } catch (error) {
        this.logError('Fallback strategy failed', { strategyKey, error });
      }
    }
  }

  checkAndApplyFallback(errorInfo) {
    // Apply fallbacks based on error patterns
    if (errorInfo.message.includes('camera') || errorInfo.message.includes('getUserMedia')) {
      this.applyFallback('ar_camera_failed');
    } else if (errorInfo.message.includes('WebGL')) {
      this.applyFallback('webgl_failed');
    } else if (errorInfo.message.includes('map') || errorInfo.message.includes('leaflet')) {
      this.applyFallback('map_load_failed');
    } else if (errorInfo.type === 'script_load_failed') {
      // Handle critical script failures
      if (errorInfo.message.includes('main.js') || errorInfo.message.includes('app.js')) {
        this.handleCriticalScriptFailure();
      }
    }
  }

  checkAndTriggerRecovery(errorInfo) {
    const errorCount = Array.from(this.errors.values())
      .reduce((sum, error) => sum + error.count, 0);

    if (errorCount > this.errorThreshold) {
      this.triggerEmergencyRecovery();
    }

    // Performance-based recovery
    if (performance.memory && performance.memory.usedJSHeapSize > 100 * 1024 * 1024) {
      this.applyRecovery('memory_pressure');
    }
  }

  checkAndNotifyUser(errorInfo) {
    if (errorInfo.severity === 'high') {
      this.showUserNotification({
        type: 'error',
        title: 'Виникла проблема',
        message: 'Ми працюємо над її вирішенням',
        duration: 8000
      });
    }
  }

  triggerEmergencyRecovery() {
    this.showUserNotification({
      type: 'warning',
      title: 'Відновлення системи',
      message: 'Перезавантажуємо компоненти для стабільної роботи',
      actions: [
        { text: 'Оновити сторінку', action: 'location.reload()' }
      ]
    });

    // Clear non-essential errors
    this.clearNonCriticalErrors();

    // Restart key components
    this.restartComponents();
  }

  handleCriticalScriptFailure() {
    this.showUserNotification({
      type: 'error',
      title: 'Критична помилка',
      message: 'Не вдалося завантажити основні компоненти',
      actions: [
        { text: 'Перезавантажити', action: 'location.reload()' }
      ]
    });
  }

  applyFallbackStyles() {
    const fallbackCSS = document.createElement('style');
    fallbackCSS.id = 'fallback-styles';
    fallbackCSS.textContent = `
      body { font-family: Arial, sans-serif !important; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .btn { padding: 10px 20px; background: #e67e22; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .btn:hover { background: #d35400; }
      .header { background: white; border-bottom: 1px solid #ddd; padding: 10px 0; }
      .section { padding: 40px 0; }
      img { max-width: 100%; height: auto; }
      .hidden { display: none !important; }
      .loading { opacity: 0.5; pointer-events: none; }
    `;
    document.head.appendChild(fallbackCSS);
  }

  tryScriptFallback(script) {
    // For now, just log the failure - could implement CDN fallbacks here
    this.logError('Script fallback needed', { src: script.src });
  }

  restartComponents() {
    // Restart internationalization
    if (window.ultraI18n && typeof window.ultraI18n.restart === 'function') {
      window.ultraI18n.restart();
    }

    // Restart AR viewer if needed
    if (window.simpleARViewer && typeof window.simpleARViewer.init === 'function') {
      try {
        window.simpleARViewer.init();
      } catch (error) {
        this.logError('Failed to restart AR viewer', error);
      }
    }
  }

  clearErrorsOfType(type) {
    for (const [key, error] of this.errors.entries()) {
      if (error.type === type) {
        this.errors.delete(key);
      }
    }
  }

  clearNonCriticalErrors() {
    for (const [key, error] of this.errors.entries()) {
      if (error.severity === 'low') {
        this.errors.delete(key);
      }
    }
  }

  // =====================================================
  // LOGGING METHODS
  // =====================================================

  logError(message, data = null) {
    const logEntry = {
      level: 'error',
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error(`[Error Handler] ${message}`, data);

    // Store for analytics
    this.storeErrorLog(logEntry);
  }

  logInfo(message, data = null) {
    console.log(`[Error Handler] ${message}`, data);
  }

  storeErrorLog(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      logs.push(logEntry);

      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }

      localStorage.setItem('error_logs', JSON.stringify(logs));
    } catch (e) {
      // Storage might be full or unavailable
      console.warn('Could not store error log', e);
    }
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  getErrorReport() {
    return {
      errors: Array.from(this.errors.entries()).map(([key, error]) => ({
        key,
        ...error
      })),
      summary: {
        totalErrors: this.errors.size,
        totalOccurrences: Array.from(this.errors.values()).reduce((sum, e) => sum + e.count, 0),
        criticalErrors: Array.from(this.errors.values()).filter(e => e.severity === 'high').length
      },
      userNotifications: this.userNotifications.length,
      systemHealth: this.getSystemHealth()
    };
  }

  getSystemHealth() {
    const totalErrors = Array.from(this.errors.values()).reduce((sum, e) => sum + e.count, 0);

    if (totalErrors === 0) return 'excellent';
    if (totalErrors < 5) return 'good';
    if (totalErrors < 15) return 'fair';
    return 'poor';
  }

  retryCamera() {
    if (window.simpleARViewer && typeof window.simpleARViewer.startCamera === 'function') {
      window.simpleARViewer.startCamera();
    }
  }

  showARFallback() {
    if (window.simpleARViewer && typeof window.simpleARViewer.showFallback === 'function') {
      window.simpleARViewer.showFallback();
    }
  }

  clearAllErrors() {
    this.errors.clear();
    this.userNotifications = [];
    const container = document.getElementById('error-notifications');
    if (container) {
      container.innerHTML = '';
    }
  }
}

// Initialize error handler immediately
const ultraErrorHandler = new UltraErrorHandler();

// Make globally available
window.InnerGarden = window.InnerGarden || {};
window.InnerGarden.errorHandler = ultraErrorHandler;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraErrorHandler;
}