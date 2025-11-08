// Ultra State Manager - Advanced State Management for Smooth UI Operations
// Manages application state, loading states, error handling, and UI consistency

class UltraStateManager {
  constructor() {
    this.state = new Map();
    this.listeners = new Map();
    this.loadingStates = new Map();
    this.errorStates = new Map();
    this.cache = new Map();
    this.middleware = [];
    this.history = [];
    this.maxHistorySize = 100;

    this.initializeDefaultState();
    this.setupErrorBoundaries();
    this.setupPerformanceMonitoring();

    console.log('🎯 Ultra State Manager activated - smooth state handling enabled');
  }

  // =====================================================
  // INITIALIZATION & SETUP
  // =====================================================

  initializeDefaultState() {
    // Core application state
    this.setState('app', {
      isInitialized: false,
      currentSection: 'hero',
      language: 'uk',
      theme: 'light',
      isOnline: navigator.onLine,
      viewport: this.getViewportInfo(),
      performance: {
        loadTime: 0,
        renderTime: 0,
        interactionDelay: 0
      }
    });

    // UI state
    this.setState('ui', {
      isMobileMenuOpen: false,
      isModalOpen: false,
      currentModal: null,
      isLoading: false,
      notifications: [],
      scrollPosition: 0,
      activeFilters: new Set(),
      searchQuery: ''
    });

    // User interaction state
    this.setState('user', {
      hasInteracted: false,
      preferences: this.loadUserPreferences(),
      visitCount: this.getVisitCount(),
      lastVisit: this.getLastVisit(),
      currentSession: {
        startTime: Date.now(),
        pageViews: 1,
        interactions: 0
      }
    });

    // Content state
    this.setState('content', {
      artworks: new Map(),
      stories: new Map(),
      quiz: {
        currentQuestion: 0,
        answers: [],
        result: null
      },
      meditation: {
        isPlaying: false,
        currentTime: 0,
        duration: 0
      }
    });

    // Network state
    this.setState('network', {
      isOnline: navigator.onLine,
      connectionType: this.getConnectionType(),
      latency: 0,
      bandwidth: 0
    });
  }

  setupErrorBoundaries() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError('global', event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('promise', event.reason, {
        type: 'unhandledrejection'
      });
    });

    // Network status monitoring
    window.addEventListener('online', () => {
      this.setState('network.isOnline', true);
      this.clearError('network');
    });

    window.addEventListener('offline', () => {
      this.setState('network.isOnline', false);
      this.setError('network', 'Connection lost', 'warning');
    });
  }

  setupPerformanceMonitoring() {
    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.updatePerformanceMetrics(entry);
        });
      });

      observer.observe({ entryTypes: ['navigation', 'measure', 'paint'] });
    }

    // Monitor viewport changes
    window.addEventListener('resize', this.debounce(() => {
      this.setState('app.viewport', this.getViewportInfo());
    }, 250));

    // Monitor scroll position
    window.addEventListener('scroll', this.throttle(() => {
      this.setState('ui.scrollPosition', window.scrollY);
    }, 16)); // ~60fps
  }

  // =====================================================
  // STATE MANAGEMENT CORE
  // =====================================================

  setState(path, value, options = {}) {
    const { silent = false, validate = true, persist = false } = options;

    try {
      // Validate state change if validation is enabled
      if (validate && !this.validateStateChange(path, value)) {
        console.warn(`⚠️ Invalid state change rejected: ${path}`, value);
        return false;
      }

      // Apply middleware
      const processedValue = this.applyMiddleware('SET_STATE', { path, value, options });
      const finalValue = processedValue !== undefined ? processedValue : value;

      // Update state
      const oldValue = this.getState(path);
      this.setNestedState(path, finalValue);

      // Add to history
      this.addToHistory('SET_STATE', path, oldValue, finalValue);

      // Persist if requested
      if (persist) {
        this.persistState(path, finalValue);
      }

      // Notify listeners
      if (!silent) {
        this.notifyListeners(path, finalValue, oldValue);
      }

      return true;
    } catch (error) {
      console.error('❌ State update failed:', error);
      this.handleError('state', error, { path, value });
      return false;
    }
  }

  getState(path) {
    try {
      if (!path) return Object.fromEntries(this.state);

      const keys = path.split('.');
      let current = this.state;

      for (const key of keys) {
        if (current instanceof Map) {
          current = current.get(key);
        } else if (typeof current === 'object' && current !== null) {
          current = current[key];
        } else {
          return undefined;
        }

        if (current === undefined) break;
      }

      return current;
    } catch (error) {
      console.error('❌ State retrieval failed:', error);
      return undefined;
    }
  }

  setNestedState(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.state;

    // Navigate to parent object
    for (const key of keys) {
      if (!current.has(key)) {
        current.set(key, new Map());
      }
      current = current.get(key);
    }

    // Set the value
    if (current instanceof Map) {
      current.set(lastKey, value);
    } else {
      current[lastKey] = value;
    }
  }

  // =====================================================
  // LOADING STATE MANAGEMENT
  // =====================================================

  setLoading(key, isLoading = true, message = '') {
    this.loadingStates.set(key, {
      isLoading,
      message,
      startTime: isLoading ? Date.now() : null,
      duration: !isLoading && this.loadingStates.has(key)
        ? Date.now() - this.loadingStates.get(key).startTime
        : 0
    });

    // Update global loading state
    const hasAnyLoading = Array.from(this.loadingStates.values())
      .some(state => state.isLoading);

    this.setState('ui.isLoading', hasAnyLoading, { silent: true });

    // Notify loading state listeners
    this.notifyListeners(`loading.${key}`, this.loadingStates.get(key));

    // Auto-clear loading state after timeout (prevent stuck loading)
    if (isLoading) {
      setTimeout(() => {
        if (this.loadingStates.get(key)?.isLoading) {
          console.warn(`⚠️ Loading state auto-cleared: ${key}`);
          this.setLoading(key, false);
        }
      }, 30000); // 30 second timeout
    }
  }

  isLoading(key) {
    return this.loadingStates.get(key)?.isLoading || false;
  }

  getLoadingState(key) {
    return this.loadingStates.get(key) || { isLoading: false, message: '', duration: 0 };
  }

  // =====================================================
  // ERROR STATE MANAGEMENT
  // =====================================================

  setError(key, error, severity = 'error', context = {}) {
    const errorState = {
      message: typeof error === 'string' ? error : error.message,
      severity,
      timestamp: Date.now(),
      context,
      stack: error.stack || new Error().stack,
      resolved: false
    };

    this.errorStates.set(key, errorState);

    // Notify error listeners
    this.notifyListeners(`error.${key}`, errorState);

    // Auto-clear non-critical errors
    if (severity === 'warning' || severity === 'info') {
      setTimeout(() => {
        this.clearError(key);
      }, 10000); // Clear warnings after 10 seconds
    }

    console.error(`🚨 Error state set (${severity}): ${key}`, errorState);
  }

  clearError(key) {
    if (this.errorStates.has(key)) {
      const errorState = this.errorStates.get(key);
      errorState.resolved = true;
      this.notifyListeners(`error.${key}`, errorState);
      this.errorStates.delete(key);
    }
  }

  hasError(key) {
    return this.errorStates.has(key) && !this.errorStates.get(key).resolved;
  }

  getError(key) {
    return this.errorStates.get(key);
  }

  // =====================================================
  // EVENT LISTENERS & SUBSCRIPTIONS
  // =====================================================

  subscribe(path, callback, options = {}) {
    const { immediate = false, once = false } = options;

    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }

    const wrappedCallback = once ?
      (value, oldValue, statePath) => {
        callback(value, oldValue, statePath);
        this.unsubscribe(path, wrappedCallback);
      } :
      callback;

    this.listeners.get(path).add(wrappedCallback);

    // Call immediately with current value if requested
    if (immediate) {
      const currentValue = this.getState(path);
      callback(currentValue, undefined, path);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(path, wrappedCallback);
  }

  unsubscribe(path, callback) {
    if (this.listeners.has(path)) {
      this.listeners.get(path).delete(callback);

      // Clean up empty listener sets
      if (this.listeners.get(path).size === 0) {
        this.listeners.delete(path);
      }
    }
  }

  notifyListeners(path, value, oldValue) {
    // Notify exact path listeners
    if (this.listeners.has(path)) {
      this.listeners.get(path).forEach(callback => {
        try {
          callback(value, oldValue, path);
        } catch (error) {
          console.error('❌ Listener callback failed:', error);
        }
      });
    }

    // Notify wildcard listeners (e.g., 'ui.*' for 'ui.isLoading')
    this.listeners.forEach((callbacks, listenerPath) => {
      if (listenerPath.includes('*') && this.matchesWildcard(path, listenerPath)) {
        callbacks.forEach(callback => {
          try {
            callback(value, oldValue, path);
          } catch (error) {
            console.error('❌ Wildcard listener callback failed:', error);
          }
        });
      }
    });
  }

  matchesWildcard(path, pattern) {
    const pathParts = path.split('.');
    const patternParts = pattern.split('.');

    for (let i = 0; i < Math.max(pathParts.length, patternParts.length); i++) {
      const pathPart = pathParts[i];
      const patternPart = patternParts[i];

      if (patternPart === '*') continue;
      if (pathPart !== patternPart) return false;
    }

    return true;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    };
  }

  getConnectionType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || '4g';
  }

  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('innerGarden_preferences');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }

  getVisitCount() {
    try {
      const count = localStorage.getItem('innerGarden_visitCount');
      const newCount = count ? parseInt(count) + 1 : 1;
      localStorage.setItem('innerGarden_visitCount', newCount.toString());
      return newCount;
    } catch {
      return 1;
    }
  }

  getLastVisit() {
    try {
      return localStorage.getItem('innerGarden_lastVisit') || null;
    } catch {
      return null;
    }
  }

  persistState(path, value) {
    try {
      localStorage.setItem(`innerGarden_state_${path}`, JSON.stringify(value));
    } catch (error) {
      console.warn('⚠️ Failed to persist state:', error);
    }
  }

  validateStateChange(path, value) {
    // Add validation rules as needed
    const validationRules = {
      'app.language': (val) => ['uk', 'en', 'de'].includes(val),
      'app.theme': (val) => ['light', 'dark'].includes(val),
      'ui.scrollPosition': (val) => typeof val === 'number' && val >= 0
    };

    const rule = validationRules[path];
    return rule ? rule(value) : true;
  }

  applyMiddleware(action, data) {
    return this.middleware.reduce((result, middleware) => {
      return middleware(action, result || data);
    }, undefined);
  }

  addToHistory(action, path, oldValue, newValue) {
    this.history.push({
      action,
      path,
      oldValue,
      newValue,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  handleError(category, error, context = {}) {
    this.setError(category, error, 'error', context);

    // Report to external error tracking if available
    if (window.errorTracker) {
      window.errorTracker.report(error, { category, ...context });
    }
  }

  updatePerformanceMetrics(entry) {
    const currentPerf = this.getState('app.performance') || {};

    switch (entry.entryType) {
      case 'navigation':
        this.setState('app.performance.loadTime', entry.loadEventEnd - entry.fetchStart);
        break;
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.setState('app.performance.renderTime', entry.startTime);
        }
        break;
      case 'measure':
        if (entry.name.includes('interaction')) {
          this.setState('app.performance.interactionDelay', entry.duration);
        }
        break;
    }
  }

  // Utility functions for event handling
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Get state history
  getHistory() {
    return [...this.history];
  }

  // Clear all states
  reset() {
    this.state.clear();
    this.loadingStates.clear();
    this.errorStates.clear();
    this.cache.clear();
    this.history = [];
    this.initializeDefaultState();
  }

  // Get comprehensive state snapshot
  getSnapshot() {
    return {
      state: Object.fromEntries(this.state),
      loading: Object.fromEntries(this.loadingStates),
      errors: Object.fromEntries(this.errorStates),
      timestamp: Date.now()
    };
  }
}

// Initialize global state manager
window.stateManager = new UltraStateManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraStateManager;
}