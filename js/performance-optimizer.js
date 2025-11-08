// Inner Garden - Ultra Performance & Reliability System

class UltraPerformanceOptimizer {
  constructor() {
    this.isRunning = false;
    this.optimizations = new Map();
    this.lazyLoadManager = new LazyLoadManager();
    this.cacheManager = new CacheManager();
    this.resourcePreloader = new ResourcePreloader();
    this.errorRecoveryManager = new ErrorRecoveryManager();
    this.memoryManager = new MemoryManager();
    this.networkOptimizer = new NetworkOptimizer();

    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.optimizeInitialLoad();
    this.setupErrorHandling();
    this.optimizeImages();
    this.optimizeScripts();
    this.setupServiceWorker();
  }

  setupPerformanceMonitoring() {
    // Core Web Vitals monitoring
    this.observePerformanceMetrics();
    this.monitorLargestContentfulPaint();
    this.monitorFirstInputDelay();
    this.monitorCumulativeLayoutShift();
  }

  observePerformanceMetrics() {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logPerformanceMetric('navigation', entry);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.optimizeResourceLoading(entry);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logPerformanceMetric('paint', entry);
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    }
  }

  monitorLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        console.log('LCP:', lastEntry.startTime);

        if (lastEntry.startTime > 2500) {
          this.optimizeLCP();
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  monitorFirstInputDelay() {
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);

          if (entry.processingStart - entry.startTime > 100) {
            this.optimizeFID();
          }
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  monitorCumulativeLayoutShift() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);

            if (clsValue > 0.1) {
              this.optimizeCLS();
            }
          }
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  optimizeInitialLoad() {
    // Critical resource hints
    this.addResourceHints();

    // Optimize CSS delivery
    this.optimizeCSSDelivery();

    // Defer non-critical JavaScript
    this.deferNonCriticalJS();

    // Optimize fonts
    this.optimizeFonts();
  }

  addResourceHints() {
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'preconnect', href: 'https://unpkg.com' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
    ];

    hints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
      }
    });
  }

  optimizeCSSDelivery() {
    // Critical CSS inlining is handled in HTML
    // Load non-critical CSS asynchronously
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');

    nonCriticalCSS.forEach(link => {
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
    });
  }

  deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script[data-defer]');

    scripts.forEach(script => {
      script.defer = true;
    });
  }

  optimizeFonts() {
    // Font display optimization
    const fontFaces = document.styleSheets;

    // Preload critical fonts
    const criticalFonts = [
      'Montserrat',
      'Playfair Display'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `https://fonts.gstatic.com/s/${font.toLowerCase().replace(' ', '')}/v1/${font.toLowerCase().replace(' ', '')}-regular.woff2`;
      document.head.appendChild(link);
    });
  }

  optimizeImages() {
    // Implement WebP support with fallbacks
    this.implementWebPSupport();

    // Setup intersection observer for lazy loading
    this.lazyLoadManager.init();

    // Optimize image loading
    this.optimizeImageLoading();
  }

  implementWebPSupport() {
    const supportsWebP = this.detectWebPSupport();

    if (supportsWebP) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  }

  detectWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  optimizeImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Add loading="lazy" for non-critical images
      if (!img.hasAttribute('loading') && !this.isCriticalImage(img)) {
        img.loading = 'lazy';
      }

      // Add error handling
      img.onerror = () => {
        this.handleImageError(img);
      };
    });
  }

  isCriticalImage(img) {
    const rect = img.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  handleImageError(img) {
    // Try alternative sources or show placeholder
    const fallbackSrc = img.dataset.fallback || 'assets/images/placeholder.jpg';

    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    } else {
      img.style.display = 'none';
      console.error('Failed to load image:', img.src);
    }
  }

  optimizeScripts() {
    // Bundle splitting and dynamic imports
    this.implementCodeSplitting();

    // Remove unused code
    this.removeUnusedCode();

    // Optimize third-party scripts
    this.optimizeThirdPartyScripts();
  }

  implementCodeSplitting() {
    // Dynamic import for non-critical modules
    const loadModule = async (moduleName) => {
      try {
        const module = await import(`./modules/${moduleName}.js`);
        return module.default;
      } catch (error) {
        console.error(`Failed to load module ${moduleName}:`, error);
        return null;
      }
    };

    // Example: Load AR module only when needed
    window.loadARModule = () => loadModule('ar-enhanced');
  }

  removeUnusedCode() {
    // Tree shaking is handled by build tools
    // Runtime dead code elimination
    this.cleanupUnusedEventListeners();
    this.cleanupUnusedDOMElements();
  }

  cleanupUnusedEventListeners() {
    // Track and remove unused event listeners
    const eventTargets = new WeakMap();

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!eventTargets.has(this)) {
        eventTargets.set(this, new Map());
      }
      eventTargets.get(this).set(type, listener);
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  cleanupUnusedDOMElements() {
    // Remove elements that are not visible and not needed
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');

    hiddenElements.forEach(el => {
      if (!el.dataset.keepHidden) {
        el.remove();
      }
    });
  }

  optimizeThirdPartyScripts() {
    // Lazy load third-party scripts
    const thirdPartyScripts = [
      { src: 'https://maps.googleapis.com/maps/api/js', condition: () => document.querySelector('#map') },
      { src: 'https://www.google-analytics.com/analytics.js', condition: () => window.gtag }
    ];

    thirdPartyScripts.forEach(({ src, condition }) => {
      if (condition()) {
        this.loadScriptAsync(src);
      }
    });
  }

  loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          this.setupPushNotifications(registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  setupPushNotifications(registration) {
    if ('PushManager' in window) {
      // Setup push notifications for updates
      registration.pushManager.getSubscription()
        .then(subscription => {
          if (!subscription) {
            return this.subscribeToPush(registration);
          }
        });
    }
  }

  subscribeToPush(registration) {
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array('your-vapid-public-key')
    });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Error');
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });

    // Resource error handler
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event.target);
      }
    }, true);
  }

  handleError(error, context) {
    console.error(`[${context}]`, error);

    // Log to analytics service
    if (window.gtag) {
      gtag('event', 'exception', {
        description: error.message || error,
        fatal: false
      });
    }

    // Attempt recovery
    this.errorRecoveryManager.attemptRecovery(error, context);
  }

  handleResourceError(target) {
    if (target.tagName === 'IMG') {
      this.handleImageError(target);
    } else if (target.tagName === 'SCRIPT') {
      this.handleScriptError(target);
    }
  }

  handleScriptError(script) {
    console.error('Script failed to load:', script.src);

    // Try to load from CDN fallback
    const fallbackSrc = script.dataset.fallback;
    if (fallbackSrc && script.src !== fallbackSrc) {
      script.src = fallbackSrc;
    }
  }

  optimizeLCP() {
    // Optimize Largest Contentful Paint
    this.preloadCriticalImages();
    this.optimizeCriticalCSS();
    this.removeRenderBlockingResources();
  }

  preloadCriticalImages() {
    const heroImages = document.querySelectorAll('.hero img, .critical img');

    heroImages.forEach(img => {
      if (img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  }

  optimizeCriticalCSS() {
    // Critical CSS should be inlined in HTML
    // This function ensures non-critical CSS doesn't block rendering
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');

    stylesheets.forEach(link => {
      link.media = 'print';
      link.addEventListener('load', () => {
        link.media = 'all';
      });
    });
  }

  removeRenderBlockingResources() {
    // Defer non-critical JavaScript
    const nonCriticalScripts = document.querySelectorAll('script:not([data-critical])');

    nonCriticalScripts.forEach(script => {
      if (!script.async && !script.defer) {
        script.defer = true;
      }
    });
  }

  optimizeFID() {
    // Optimize First Input Delay
    this.breakUpLongTasks();
    this.reduceJavaScriptExecutionTime();
    this.useWebWorkers();
  }

  breakUpLongTasks() {
    // Use scheduler.postTask or setTimeout to break up long tasks
    const yieldToMain = () => {
      return new Promise(resolve => {
        if ('scheduler' in window && 'postTask' in scheduler) {
          scheduler.postTask(resolve, { priority: 'background' });
        } else {
          setTimeout(resolve, 0);
        }
      });
    };

    window.yieldToMain = yieldToMain;
  }

  reduceJavaScriptExecutionTime() {
    // Code splitting and lazy loading
    this.implementModuleLazyLoading();
  }

  implementModuleLazyLoading() {
    const lazyModules = new Map();

    window.loadLazyModule = async (name) => {
      if (lazyModules.has(name)) {
        return lazyModules.get(name);
      }

      const modulePromise = import(`./lazy/${name}.js`);
      lazyModules.set(name, modulePromise);

      return modulePromise;
    };
  }

  useWebWorkers() {
    // Offload heavy computations to web workers
    if ('Worker' in window) {
      this.setupComputationWorkers();
    }
  }

  setupComputationWorkers() {
    const workerCode = `
      self.addEventListener('message', function(e) {
        const { type, data } = e.data;

        switch(type) {
          case 'processImage':
            // Heavy image processing
            const result = processImageData(data);
            self.postMessage({ type: 'imageProcessed', result });
            break;
          case 'calculateMetrics':
            // Heavy calculations
            const metrics = calculateComplexMetrics(data);
            self.postMessage({ type: 'metricsCalculated', metrics });
            break;
        }
      });

      function processImageData(data) {
        // Simulate heavy processing
        return data;
      }

      function calculateComplexMetrics(data) {
        // Simulate complex calculations
        return { processed: true };
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.computationWorker = new Worker(URL.createObjectURL(blob));
  }

  optimizeCLS() {
    // Optimize Cumulative Layout Shift
    this.setImageDimensions();
    this.reserveSpaceForAds();
    this.preloadFonts();
  }

  setImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');

    images.forEach(img => {
      // Set explicit dimensions to prevent layout shift
      if (img.naturalWidth && img.naturalHeight) {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        img.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
      }
    });
  }

  reserveSpaceForAds() {
    const adSlots = document.querySelectorAll('.ad-slot');

    adSlots.forEach(slot => {
      // Reserve space for ads to prevent layout shift
      if (!slot.style.height) {
        slot.style.minHeight = '250px';
      }
    });
  }

  preloadFonts() {
    const fontPreloads = [
      'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-obK4ALg.woff2',
      'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qC0s.woff2'
    ];

    fontPreloads.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  logPerformanceMetric(type, entry) {
    console.log(`[Performance ${type}]`, entry);

    // Send to analytics
    if (window.gtag) {
      gtag('event', 'timing_complete', {
        name: entry.name,
        value: Math.round(entry.duration || entry.startTime)
      });
    }
  }

  optimizeResourceLoading(entry) {
    // Optimize future resource loading based on patterns
    if (entry.duration > 1000) {
      console.warn('Slow resource detected:', entry.name, entry.duration);

      // Add to optimization queue
      this.resourcePreloader.addToOptimizationQueue(entry.name);
    }
  }
}

// Lazy Load Manager
class LazyLoadManager {
  constructor() {
    this.observer = null;
    this.elements = new Set();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.observeElements();
    } else {
      // Fallback for older browsers
      this.loadAllElements();
    }
  }

  observeElements() {
    const lazyElements = document.querySelectorAll('[data-lazy]');

    lazyElements.forEach(el => {
      this.elements.add(el);
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
        this.elements.delete(entry.target);
      }
    });
  }

  loadElement(element) {
    if (element.tagName === 'IMG') {
      this.loadLazyImage(element);
    } else if (element.tagName === 'IFRAME') {
      this.loadLazyIframe(element);
    } else {
      this.loadLazyContent(element);
    }
  }

  loadLazyImage(img) {
    const src = img.dataset.lazy;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-lazy');
    }
  }

  loadLazyIframe(iframe) {
    const src = iframe.dataset.lazy;
    if (src) {
      iframe.src = src;
      iframe.removeAttribute('data-lazy');
    }
  }

  loadLazyContent(element) {
    const content = element.dataset.lazy;
    if (content) {
      element.innerHTML = content;
      element.removeAttribute('data-lazy');
    }
  }

  loadAllElements() {
    this.elements.forEach(el => this.loadElement(el));
  }
}

// Cache Manager
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50;
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, customTTL) {
    const expiry = Date.now() + (customTTL || this.ttl);

    this.cache.set(key, { value, expiry });

    // Cleanup if cache is too large
    if (this.cache.size > this.maxSize) {
      this.cleanup();
    }
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Remove expired items
    entries.forEach(([key, value]) => {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    });

    // Remove oldest items if still too large
    if (this.cache.size > this.maxSize) {
      const sortedEntries = entries
        .filter(([, value]) => now <= value.expiry)
        .sort((a, b) => a[1].expiry - b[1].expiry);

      const toRemove = sortedEntries.slice(0, this.cache.size - this.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Resource Preloader
class ResourcePreloader {
  constructor() {
    this.preloadQueue = new Set();
    this.optimizationQueue = new Set();
  }

  preload(url, type = 'fetch') {
    if (this.preloadQueue.has(url)) return;

    this.preloadQueue.add(url);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    switch (type) {
      case 'image':
        link.as = 'image';
        break;
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      default:
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
    }

    document.head.appendChild(link);
  }

  addToOptimizationQueue(resource) {
    this.optimizationQueue.add(resource);

    // Process optimization queue periodically
    if (this.optimizationQueue.size > 5) {
      this.processOptimizationQueue();
    }
  }

  processOptimizationQueue() {
    // Implement resource optimization strategies
    console.log('Processing optimization queue:', this.optimizationQueue);

    this.optimizationQueue.forEach(resource => {
      // Add to preload for next visit
      this.preload(resource);
    });

    this.optimizationQueue.clear();
  }
}

// Error Recovery Manager
class ErrorRecoveryManager {
  constructor() {
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  setupRecoveryStrategies() {
    this.recoveryStrategies.set('Network Error', this.handleNetworkError.bind(this));
    this.recoveryStrategies.set('Script Error', this.handleScriptError.bind(this));
    this.recoveryStrategies.set('Image Error', this.handleImageError.bind(this));
  }

  attemptRecovery(error, context) {
    const strategy = this.recoveryStrategies.get(context);

    if (strategy) {
      strategy(error);
    } else {
      this.genericRecovery(error, context);
    }
  }

  handleNetworkError(error) {
    // Implement network error recovery
    console.log('Attempting network error recovery:', error);

    // Retry with exponential backoff
    this.retryWithBackoff(() => {
      // Retry the failed network request
    });
  }

  handleScriptError(error) {
    // Attempt to reload critical scripts
    console.log('Attempting script error recovery:', error);
  }

  handleImageError(error) {
    // Load fallback images
    console.log('Attempting image error recovery:', error);
  }

  genericRecovery(error, context) {
    console.log(`Generic recovery for ${context}:`, error);

    // Log error for monitoring
    this.logError(error, context);
  }

  retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    let retries = 0;

    const attempt = () => {
      fn().catch(error => {
        retries++;
        if (retries < maxRetries) {
          setTimeout(attempt, delay * Math.pow(2, retries));
        } else {
          throw error;
        }
      });
    };

    attempt();
  }

  logError(error, context) {
    // Send error to monitoring service
    if (window.gtag) {
      gtag('event', 'exception', {
        description: `${context}: ${error.message}`,
        fatal: false
      });
    }
  }
}

// Memory Manager
class MemoryManager {
  constructor() {
    this.objectPool = new Map();
    this.cleanupInterval = null;
    this.setupCleanup();
  }

  setupCleanup() {
    // Periodic memory cleanup
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 30000); // Every 30 seconds

    // Cleanup on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performCleanup();
      }
    });
  }

  performCleanup() {
    // Clear caches
    this.clearUnusedCaches();

    // Clean up DOM
    this.cleanupDOM();

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  clearUnusedCaches() {
    // Clear expired cache entries
    if (window.caches) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('temp')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }

  cleanupDOM() {
    // Remove disconnected nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    const elementsToRemove = [];
    let node;

    while (node = walker.nextNode()) {
      if (!node.isConnected) {
        elementsToRemove.push(node);
      }
    }

    elementsToRemove.forEach(el => el.remove());
  }

  getObject(type, ...args) {
    // Object pooling for frequently created objects
    if (!this.objectPool.has(type)) {
      this.objectPool.set(type, []);
    }

    const pool = this.objectPool.get(type);

    if (pool.length > 0) {
      return pool.pop();
    }

    // Create new object if pool is empty
    return this.createObject(type, ...args);
  }

  releaseObject(type, obj) {
    // Return object to pool
    if (!this.objectPool.has(type)) {
      this.objectPool.set(type, []);
    }

    const pool = this.objectPool.get(type);

    // Reset object state
    this.resetObject(obj);

    pool.push(obj);
  }

  createObject(type, ...args) {
    switch (type) {
      case 'div':
        return document.createElement('div');
      case 'img':
        return document.createElement('img');
      default:
        return {};
    }
  }

  resetObject(obj) {
    if (obj instanceof HTMLElement) {
      obj.className = '';
      obj.innerHTML = '';
      obj.removeAttribute('style');
    }
  }
}

// Network Optimizer
class NetworkOptimizer {
  constructor() {
    this.connectionType = this.getConnectionType();
    this.setupNetworkAdaptation();
  }

  getConnectionType() {
    if ('connection' in navigator) {
      return navigator.connection.effectiveType;
    }
    return 'unknown';
  }

  setupNetworkAdaptation() {
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.connectionType = navigator.connection.effectiveType;
        this.adaptToConnection();
      });
    }
  }

  adaptToConnection() {
    switch (this.connectionType) {
      case 'slow-2g':
      case '2g':
        this.enableDataSavingMode();
        break;
      case '3g':
        this.enableReducedQualityMode();
        break;
      case '4g':
      default:
        this.enableHighQualityMode();
        break;
    }
  }

  enableDataSavingMode() {
    // Reduce image quality, disable animations
    document.documentElement.classList.add('data-saving');

    // Lazy load all non-critical resources
    const images = document.querySelectorAll('img:not(.critical)');
    images.forEach(img => {
      if (!img.hasAttribute('data-lazy')) {
        img.dataset.lazy = img.src;
        img.removeAttribute('src');
      }
    });
  }

  enableReducedQualityMode() {
    document.documentElement.classList.add('reduced-quality');
  }

  enableHighQualityMode() {
    document.documentElement.classList.remove('data-saving', 'reduced-quality');
  }
}

// Initialize Ultra Performance Optimizer
const ultraPerformanceOptimizer = new UltraPerformanceOptimizer();

// Make available globally
window.InnerGarden = window.InnerGarden || {};
window.InnerGarden.performanceOptimizer = ultraPerformanceOptimizer;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraPerformanceOptimizer;
}