// Ultra Resource Loader - Intelligent Resource Loading with Maximum Performance
// Advanced resource prioritization, caching, and progressive loading

class UltraResourceLoader {
  constructor() {
    this.loadQueue = new Map();
    this.loadedResources = new Set();
    this.failedResources = new Set();
    this.loadingPromises = new Map();
    this.criticalResources = new Set();
    this.deferredResources = new Set();
    this.networkMonitor = null;
    this.performanceMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLoadTime: 0,
      totalLoadTime: 0
    };

    this.init();
  }

  init() {
    this.setupNetworkMonitoring();
    this.setupIntersectionObserver();
    this.setupPerformanceMonitoring();
    this.preloadCriticalResources();

    console.log('🚀 Ultra Resource Loader initialized - intelligent loading active');
  }

  // =====================================================
  // CRITICAL RESOURCE PRELOADING
  // =====================================================

  preloadCriticalResources() {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];

    const criticalImages = [
      'assets/images/hero-artwork.jpg',
      'assets/images/logo.png',
      'assets/images/favicon.ico'
    ];

    const criticalScripts = [
      'js/ultra-performance-optimizer.js',
      'js/ultra-instant-i18n.js',
      'js/ultra-state-manager.js'
    ];

    // Preload fonts with high priority
    criticalFonts.forEach(font => {
      this.preloadResource(font, 'style', 'high');
    });

    // Preload critical images
    criticalImages.forEach(image => {
      this.preloadResource(image, 'image', 'high');
    });

    // Load critical scripts
    criticalScripts.forEach(script => {
      this.loadScript(script, { priority: 'high', critical: true });
    });
  }

  // =====================================================
  // INTELLIGENT RESOURCE LOADING
  // =====================================================

  async loadResource(url, options = {}) {
    const {
      type = 'auto',
      priority = 'normal',
      critical = false,
      retries = 3,
      timeout = 10000,
      cache = true
    } = options;

    // Check if already loaded
    if (this.loadedResources.has(url)) {
      return Promise.resolve(url);
    }

    // Check if currently loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Check network conditions
    const networkSpeed = this.getNetworkSpeed();
    const adjustedTimeout = this.adjustTimeoutForNetwork(timeout, networkSpeed);

    // Create loading promise
    const loadPromise = this.createLoadingPromise(url, type, adjustedTimeout, retries);

    // Track loading
    this.loadingPromises.set(url, loadPromise);
    this.trackLoadStart(url, priority, critical);

    try {
      const result = await loadPromise;
      this.handleLoadSuccess(url, result);
      return result;
    } catch (error) {
      this.handleLoadError(url, error);
      throw error;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  createLoadingPromise(url, type, timeout, retries) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const attemptLoad = () => {
        attempts++;
        const startTime = performance.now();

        // Create appropriate loader based on type
        const loader = this.createLoader(url, type);

        // Set timeout
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout loading ${url} after ${timeout}ms`));
        }, timeout);

        loader.onload = loader.onreadystatechange = () => {
          if (loader.readyState && loader.readyState !== 'complete' && loader.readyState !== 'loaded') {
            return;
          }

          clearTimeout(timeoutId);
          const loadTime = performance.now() - startTime;
          this.updatePerformanceMetrics(loadTime, true);
          resolve(loader);
        };

        loader.onerror = () => {
          clearTimeout(timeoutId);
          const loadTime = performance.now() - startTime;
          this.updatePerformanceMetrics(loadTime, false);

          if (attempts < retries) {
            console.warn(`Retrying ${url} (attempt ${attempts + 1}/${retries})`);
            setTimeout(attemptLoad, Math.pow(2, attempts) * 1000); // Exponential backoff
          } else {
            reject(new Error(`Failed to load ${url} after ${retries} attempts`));
          }
        };

        // Start loading
        this.startLoader(loader, url, type);
      };

      attemptLoad();
    });
  }

  createLoader(url, type) {
    switch (type) {
      case 'script':
        return document.createElement('script');
      case 'style':
        return document.createElement('link');
      case 'image':
        return new Image();
      case 'font':
        return document.createElement('link');
      default:
        // Auto-detect based on URL
        if (url.endsWith('.js')) return document.createElement('script');
        if (url.endsWith('.css')) return document.createElement('link');
        if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) return new Image();
        return document.createElement('link');
    }
  }

  startLoader(loader, url, type) {
    switch (type) {
      case 'script':
        loader.src = url;
        loader.async = true;
        loader.defer = true;
        document.head.appendChild(loader);
        break;

      case 'style':
      case 'font':
        loader.rel = 'stylesheet';
        loader.href = url;
        if (type === 'font') {
          loader.rel = 'preload';
          loader.as = 'style';
          loader.onload = () => {
            loader.rel = 'stylesheet';
          };
        }
        document.head.appendChild(loader);
        break;

      case 'image':
        loader.src = url;
        break;

      default:
        loader.href = url;
        document.head.appendChild(loader);
    }
  }

  // =====================================================
  // SPECIALIZED LOADERS
  // =====================================================

  async loadScript(url, options = {}) {
    return this.loadResource(url, { ...options, type: 'script' });
  }

  async loadStyle(url, options = {}) {
    return this.loadResource(url, { ...options, type: 'style' });
  }

  async loadImage(url, options = {}) {
    return this.loadResource(url, { ...options, type: 'image' });
  }

  async loadFont(url, options = {}) {
    return this.loadResource(url, { ...options, type: 'font' });
  }

  // =====================================================
  // PRELOADING SYSTEM
  // =====================================================

  preloadResource(url, type = 'auto', priority = 'normal') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    // Set appropriate 'as' attribute
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
      default:
        if (url.endsWith('.js')) link.as = 'script';
        else if (url.endsWith('.css')) link.as = 'style';
        else if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) link.as = 'image';
    }

    // Set priority
    if (priority === 'high') {
      link.fetchPriority = 'high';
    } else if (priority === 'low') {
      link.fetchPriority = 'low';
    }

    document.head.appendChild(link);
    console.log(`🔄 Preloading ${type}: ${url} (priority: ${priority})`);
  }

  // =====================================================
  // NETWORK MONITORING
  // =====================================================

  setupNetworkMonitoring() {
    // Monitor connection changes
    if ('connection' in navigator) {
      this.networkMonitor = navigator.connection;

      navigator.connection.addEventListener('change', () => {
        this.handleNetworkChange();
      });
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored');
      this.retryFailedResources();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Connection lost');
    });
  }

  getNetworkSpeed() {
    if (!this.networkMonitor) return '4g';
    return this.networkMonitor.effectiveType || '4g';
  }

  adjustTimeoutForNetwork(baseTimeout, networkSpeed) {
    const multipliers = {
      'slow-2g': 4,
      '2g': 3,
      '3g': 2,
      '4g': 1
    };

    return baseTimeout * (multipliers[networkSpeed] || 1);
  }

  handleNetworkChange() {
    const speed = this.getNetworkSpeed();
    const saveData = this.networkMonitor?.saveData || false;

    console.log(`📡 Network changed: ${speed} (saveData: ${saveData})`);

    // Adjust loading strategy based on connection
    if (saveData || speed === 'slow-2g' || speed === '2g') {
      this.enableDataSaver();
    } else {
      this.disableDataSaver();
    }
  }

  enableDataSaver() {
    console.log('💾 Data saver mode enabled');
    // Pause non-critical loading
    this.deferredResources.forEach(url => {
      if (this.loadingPromises.has(url)) {
        // Cancel if not critical
        console.log(`⏸️ Pausing ${url} due to slow connection`);
      }
    });
  }

  disableDataSaver() {
    console.log('🚀 High-speed loading enabled');
    // Resume deferred loading
    this.loadDeferredResources();
  }

  // =====================================================
  // PERFORMANCE MONITORING
  // =====================================================

  setupPerformanceMonitoring() {
    // Monitor resource loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.analyzeResourcePerformance(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  analyzeResourcePerformance(entry) {
    const { name, duration, transferSize, encodedBodySize } = entry;

    // Log slow resources
    if (duration > 2000) {
      console.warn(`🐌 Slow resource: ${name} took ${duration.toFixed(0)}ms`);
    }

    // Log large resources
    if (transferSize > 500000) { // 500KB
      console.warn(`📦 Large resource: ${name} (${(transferSize / 1024).toFixed(0)}KB)`);
    }

    // Track compression efficiency
    if (encodedBodySize && transferSize) {
      const compressionRatio = (1 - transferSize / encodedBodySize) * 100;
      if (compressionRatio < 30) {
        console.warn(`🗜️ Poor compression: ${name} (${compressionRatio.toFixed(1)}%)`);
      }
    }
  }

  trackLoadStart(url, priority, critical) {
    this.performanceMetrics.totalRequests++;

    if (critical) {
      console.log(`⚡ Loading critical resource: ${url}`);
    }
  }

  handleLoadSuccess(url, result) {
    this.loadedResources.add(url);
    this.performanceMetrics.successfulRequests++;
    console.log(`✅ Loaded: ${url}`);
  }

  handleLoadError(url, error) {
    this.failedResources.add(url);
    this.performanceMetrics.failedRequests++;
    console.error(`❌ Failed to load: ${url}`, error);
  }

  updatePerformanceMetrics(loadTime, success) {
    if (success) {
      this.performanceMetrics.totalLoadTime += loadTime;
      this.performanceMetrics.averageLoadTime =
        this.performanceMetrics.totalLoadTime / this.performanceMetrics.successfulRequests;
    }
  }

  // =====================================================
  // BATCH LOADING
  // =====================================================

  async loadBatch(resources, options = {}) {
    const { concurrency = 6, priority = 'normal' } = options;

    console.log(`📦 Batch loading ${resources.length} resources (concurrency: ${concurrency})`);

    // Split into chunks to respect concurrency limit
    const chunks = this.chunkArray(resources, concurrency);
    const results = [];

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(resource => {
        const url = typeof resource === 'string' ? resource : resource.url;
        const resourceOptions = typeof resource === 'object' ? { ...resource, priority } : { priority };
        return this.loadResource(url, resourceOptions);
      });

      try {
        const chunkResults = await Promise.allSettled(chunkPromises);
        results.push(...chunkResults);
      } catch (error) {
        console.error('Batch loading chunk failed:', error);
      }
    }

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Batch complete: ${successful} successful, ${failed} failed`);
    return results;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // =====================================================
  // DEFERRED LOADING
  // =====================================================

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const deferredUrl = element.getAttribute('data-deferred-src');

          if (deferredUrl) {
            this.loadResource(deferredUrl, { priority: 'normal' });
            this.intersectionObserver.unobserve(element);
          }
        }
      });
    }, {
      rootMargin: '200px'
    });

    // Observe elements with deferred loading
    document.querySelectorAll('[data-deferred-src]').forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  loadDeferredResources() {
    document.querySelectorAll('[data-deferred-src]').forEach(element => {
      const url = element.getAttribute('data-deferred-src');
      if (url && !this.loadedResources.has(url)) {
        this.loadResource(url, { priority: 'low' });
      }
    });
  }

  // =====================================================
  // RETRY MECHANISM
  // =====================================================

  retryFailedResources() {
    console.log(`🔄 Retrying ${this.failedResources.size} failed resources`);

    this.failedResources.forEach(url => {
      this.failedResources.delete(url);
      this.loadResource(url, { priority: 'low', retries: 1 });
    });
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  getStats() {
    return {
      ...this.performanceMetrics,
      loadedCount: this.loadedResources.size,
      failedCount: this.failedResources.size,
      loadingCount: this.loadingPromises.size,
      networkSpeed: this.getNetworkSpeed(),
      successRate: this.performanceMetrics.totalRequests > 0
        ? (this.performanceMetrics.successfulRequests / this.performanceMetrics.totalRequests * 100).toFixed(1) + '%'
        : '0%'
    };
  }

  clearCache() {
    this.loadedResources.clear();
    this.failedResources.clear();
    console.log('🗑️ Resource cache cleared');
  }

  prefetch(urls) {
    if (!Array.isArray(urls)) urls = [urls];

    urls.forEach(url => {
      this.preloadResource(url, 'auto', 'low');
    });
  }
}

// Initialize global resource loader
window.ultraResourceLoader = new UltraResourceLoader();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraResourceLoader;
}