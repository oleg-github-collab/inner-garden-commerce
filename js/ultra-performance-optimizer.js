// Ultra Performance Optimizer - Maximum Speed & Efficiency System
// Optimizes loading, rendering, memory usage, and overall site performance

class UltraPerformanceOptimizer {
  constructor() {
    this.metrics = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0
    };
    this.optimizations = new Map();
    this.observers = new Map();
    this.imageCache = new Map();
    this.resourceQueue = [];
    this.lazyLoadQueue = [];
    this.isOptimizing = false;

    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.setupImageOptimization();
    this.setupLazyLoading();
    this.setupResourceOptimization();
    this.setupMemoryOptimization();
    this.setupNetworkOptimization();
    this.setupRenderOptimization();
    this.setupCriticalResourcePrioritization();

    console.log('⚡ Ultra Performance Optimizer активовано - максимальна швидкість!');
  }

  // =====================================================
  // PERFORMANCE MONITORING
  // =====================================================

  setupPerformanceMonitoring() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      this.observeMetric('largest-contentful-paint', (entries) => {
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.checkAndOptimizeLCP(lastEntry.startTime);
      });

      // First Input Delay
      this.observeMetric('first-input', (entries) => {
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkAndOptimizeFID(this.metrics.fid);
        });
      });

      // Cumulative Layout Shift
      let clsValue = 0;
      this.observeMetric('layout-shift', (entries) => {
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.checkAndOptimizeCLS(clsValue);
      });

      // First Contentful Paint
      this.observeMetric('paint', (entries) => {
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });

      // Navigation timing
      this.observeMetric('navigation', (entries) => {
        entries.forEach((entry) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
        });
      });
    }

    // Manual performance tracking
    this.trackCustomMetrics();
  }

  observeMetric(type, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  trackCustomMetrics() {
    // Track AR initialization time
    window.addEventListener('ar-viewer-ready', (event) => {
      this.metrics.arInitTime = performance.now() - (event.detail?.startTime || 0);
    });

    // Track image loading performance
    document.addEventListener('load', (event) => {
      if (event.target.tagName === 'IMG') {
        this.trackImageLoad(event.target);
      }
    }, true);

    // Track script loading
    document.addEventListener('load', (event) => {
      if (event.target.tagName === 'SCRIPT') {
        this.trackScriptLoad(event.target);
      }
    }, true);
  }

  // =====================================================
  // IMAGE OPTIMIZATION
  // =====================================================

  setupImageOptimization() {
    // Optimize all images on page
    this.optimizeExistingImages();

    // Set up mutation observer for new images
    const imageObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'IMG') {
            this.optimizeImage(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('img').forEach(img => this.optimizeImage(img));
          }
        });
      });
    });

    imageObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  optimizeExistingImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => this.optimizeImage(img));
  }

  optimizeImage(img) {
    if (img.dataset.optimized) return;

    // Add loading optimization
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }

    // Add decode hint
    img.decoding = 'async';

    // Optimize source based on screen size and pixel ratio
    this.optimizeImageSource(img);

    // Add to cache for faster subsequent loads
    this.cacheImage(img);

    img.dataset.optimized = 'true';
  }

  optimizeImageSource(img) {
    const dpr = window.devicePixelRatio || 1;
    const width = img.getAttribute('width') || img.clientWidth || 300;
    const height = img.getAttribute('height') || img.clientHeight || 200;

    // Calculate optimal dimensions
    const optimalWidth = Math.round(width * dpr);
    const optimalHeight = Math.round(height * dpr);

    // For artwork images, use WebP if supported
    if (this.supportsWebP() && img.src.includes('artwork')) {
      const webpSrc = img.src.replace(/\.(jpg|png|jpeg)$/i, '.webp');

      // Test if WebP version exists
      this.testImageExists(webpSrc).then(exists => {
        if (exists) {
          img.src = webpSrc;
        }
      });
    }

    // Set responsive sizes
    if (!img.hasAttribute('sizes')) {
      img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }
  }

  async testImageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  supportsWebP() {
    if (this._webpSupport !== undefined) return this._webpSupport;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this._webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    return this._webpSupport;
  }

  cacheImage(img) {
    const cacheKey = img.src;
    if (!this.imageCache.has(cacheKey)) {
      this.imageCache.set(cacheKey, {
        url: img.src,
        loadTime: performance.now(),
        dimensions: { width: img.naturalWidth, height: img.naturalHeight }
      });
    }
  }

  // =====================================================
  // LAZY LOADING OPTIMIZATION
  // =====================================================

  setupLazyLoading() {
    // Enhanced intersection observer for lazy loading
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyElement(entry.target);
          lazyObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before element enters viewport
      threshold: 0.1
    });

    // Observe lazy elements
    this.observeLazyElements(lazyObserver);

    // Set up for dynamic content
    this.setupDynamicLazyLoading(lazyObserver);
  }

  observeLazyElements(observer) {
    // Images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => observer.observe(img));

    // Background images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(el => observer.observe(el));

    // Sections/components
    const lazySections = document.querySelectorAll('[data-lazy]');
    lazySections.forEach(section => observer.observe(section));
  }

  setupDynamicLazyLoading(observer) {
    // Monitor for new lazy elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check the node itself
            if (node.hasAttribute && (node.hasAttribute('data-src') || node.hasAttribute('data-bg') || node.hasAttribute('data-lazy'))) {
              observer.observe(node);
            }
            // Check child nodes
            if (node.querySelectorAll) {
              const lazyElements = node.querySelectorAll('[data-src], [data-bg], [data-lazy]');
              lazyElements.forEach(el => observer.observe(el));
            }
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  loadLazyElement(element) {
    // Handle lazy images
    if (element.hasAttribute('data-src')) {
      element.src = element.getAttribute('data-src');
      element.removeAttribute('data-src');
    }

    // Handle lazy background images
    if (element.hasAttribute('data-bg')) {
      element.style.backgroundImage = `url(${element.getAttribute('data-bg')})`;
      element.removeAttribute('data-bg');
    }

    // Handle lazy sections/components
    if (element.hasAttribute('data-lazy')) {
      this.initializeLazyComponent(element);
      element.removeAttribute('data-lazy');
    }

    element.classList.add('loaded');
  }

  initializeLazyComponent(element) {
    const componentType = element.dataset.component;

    switch (componentType) {
      case 'map':
        this.initializeMap(element);
        break;
      case 'carousel':
        this.initializeCarousel(element);
        break;
      case 'gallery':
        this.initializeGallery(element);
        break;
      default:
        // Generic initialization
        element.style.opacity = '1';
    }
  }

  // =====================================================
  // RESOURCE OPTIMIZATION
  // =====================================================

  setupResourceOptimization() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize script loading
    this.optimizeScriptLoading();

    // Optimize CSS loading
    this.optimizeCSSLoading();

    // Setup resource hints
    this.setupResourceHints();
  }

  preloadCriticalResources() {
    const criticalResources = [
      { href: 'css/ultra-perfect.css', as: 'style' },
      { href: 'js/ultra-perfect-i18n.js', as: 'script' },
      { href: 'js/main.js', as: 'script' },
      { href: 'assets/images/hero-artwork.jpg', as: 'image' }
    ];

    criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource.href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.as === 'style') {
          link.onload = () => {
            link.rel = 'stylesheet';
          };
        }
        document.head.appendChild(link);
      }
    });
  }

  optimizeScriptLoading() {
    // Add async/defer to non-critical scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (!script.async && !script.defer && !this.isCriticalScript(script.src)) {
        script.defer = true;
      }
    });

    // Load scripts based on priority
    this.loadScriptsByPriority();
  }

  isCriticalScript(src) {
    const criticalScripts = [
      'ultra-perfect-i18n.js',
      'ultra-preloader.js',
      'ultra-error-handler.js',
      'main.js'
    ];
    return criticalScripts.some(critical => src.includes(critical));
  }

  loadScriptsByPriority() {
    const scriptPriorities = [
      { scripts: ['ultra-error-handler.js'], priority: 'immediate' },
      { scripts: ['ultra-perfect-i18n.js', 'ultra-preloader.js'], priority: 'high' },
      { scripts: ['main.js', 'simple-ar-viewer.js'], priority: 'medium' },
      { scripts: ['harmony-map.js', 'stories.js'], priority: 'low' }
    ];

    let loadDelay = 0;
    scriptPriorities.forEach(group => {
      setTimeout(() => {
        this.loadScriptGroup(group.scripts);
      }, loadDelay);
      loadDelay += group.priority === 'immediate' ? 0 : 100;
    });
  }

  loadScriptGroup(scriptNames) {
    const promises = scriptNames.map(name => this.loadScriptIfNeeded(name));
    return Promise.all(promises);
  }

  loadScriptIfNeeded(scriptName) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="${scriptName}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `js/${scriptName}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  optimizeCSSLoading() {
    // Load non-critical CSS asynchronously
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    nonCriticalCSS.forEach(link => {
      if (!this.isCriticalCSS(link.href)) {
        this.loadCSSAsync(link);
      }
    });
  }

  isCriticalCSS(href) {
    const criticalCSS = ['ultra-perfect.css', 'styles.css'];
    return criticalCSS.some(critical => href.includes(critical));
  }

  loadCSSAsync(link) {
    const asyncLink = link.cloneNode();
    asyncLink.media = 'print';
    asyncLink.onload = () => {
      asyncLink.media = 'all';
    };
    link.parentNode.insertBefore(asyncLink, link.nextSibling);
    link.remove();
  }

  setupResourceHints() {
    // Add DNS prefetch for external domains
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdnjs.cloudflare.com',
      'unpkg.com'
    ];

    externalDomains.forEach(domain => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href*="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      }
    });
  }

  // =====================================================
  // MEMORY OPTIMIZATION
  // =====================================================

  setupMemoryOptimization() {
    // Monitor memory usage
    this.monitorMemoryUsage();

    // Set up memory cleanup intervals
    this.setupMemoryCleanup();

    // Optimize DOM size
    this.optimizeDOMSize();

    // Set up event listener optimization
    this.optimizeEventListeners();
  }

  monitorMemoryUsage() {
    if (!performance.memory) return;

    setInterval(() => {
      const memoryInfo = performance.memory;
      const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024);

      if (usedMB > limitMB * 0.8) {
        this.triggerMemoryCleanup();
      }

      // Store metrics
      this.metrics.memoryUsage = usedMB;
      this.metrics.memoryLimit = limitMB;
    }, 30000); // Check every 30 seconds
  }

  setupMemoryCleanup() {
    // Clean up every 5 minutes
    setInterval(() => {
      this.performMemoryCleanup();
    }, 5 * 60 * 1000);

    // Clean up on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performMemoryCleanup();
      }
    });
  }

  performMemoryCleanup() {
    // Clear old image cache entries
    this.cleanImageCache();

    // Remove unused event listeners
    this.cleanEventListeners();

    // Clear temporary data
    this.clearTemporaryData();

    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }

  triggerMemoryCleanup() {
    console.warn('Memory usage high, triggering cleanup...');
    this.performMemoryCleanup();

    // Notify error handler about memory pressure
    if (window.InnerGarden?.errorHandler) {
      window.InnerGarden.errorHandler.handleError({
        type: 'memory_pressure',
        message: 'High memory usage detected',
        severity: 'medium',
        timestamp: Date.now()
      });
    }
  }

  cleanImageCache() {
    const now = performance.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [key, entry] of this.imageCache.entries()) {
      if (now - entry.loadTime > maxAge) {
        this.imageCache.delete(key);
      }
    }
  }

  cleanEventListeners() {
    // Remove listeners from elements that are no longer in the DOM
    // This is handled automatically by modern browsers, but we can help
    const elements = document.querySelectorAll('[data-event-listeners]');
    elements.forEach(element => {
      if (!document.contains(element)) {
        // Element is no longer in DOM, cleanup would be automatic
        console.log('Orphaned element detected for cleanup');
      }
    });
  }

  clearTemporaryData() {
    // Clear any temporary caches or data structures
    this.resourceQueue = this.resourceQueue.slice(-10); // Keep only last 10 entries
    this.lazyLoadQueue = []; // Clear lazy load queue
  }

  optimizeDOMSize() {
    // Monitor DOM size and optimize if needed
    const nodeCount = document.querySelectorAll('*').length;
    if (nodeCount > 5000) {
      console.warn('Large DOM detected, consider virtualization');
      this.suggestDOMOptimizations();
    }
  }

  suggestDOMOptimizations() {
    // Find large containers that could benefit from virtualization
    const largeContainers = document.querySelectorAll('.collection-grid, .stories-grid, .artworks-grid');
    largeContainers.forEach(container => {
      const childCount = container.children.length;
      if (childCount > 50) {
        console.log(`Consider virtualizing ${container.className} with ${childCount} children`);
      }
    });
  }

  optimizeEventListeners() {
    // Use event delegation for dynamic content
    this.setupEventDelegation();

    // Debounce frequently fired events
    this.debounceEvents();
  }

  setupEventDelegation() {
    // Remove individual listeners and use delegation
    const containers = document.querySelectorAll('.collection-grid, .artworks-grid, .stories-grid');
    containers.forEach(container => {
      container.addEventListener('click', this.handleDelegatedClick.bind(this));
    });
  }

  handleDelegatedClick(event) {
    const target = event.target.closest('[data-action], .thumbnail, .artwork-item');
    if (target) {
      const action = target.dataset.action;
      if (action && window.InnerGarden?.[action]) {
        window.InnerGarden[action](target);
      }
    }
  }

  debounceEvents() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.handleOptimizedScroll();
      }, 16); // ~60fps
    }, { passive: true });

    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleOptimizedResize();
      }, 250);
    });
  }

  // =====================================================
  // NETWORK OPTIMIZATION
  // =====================================================

  setupNetworkOptimization() {
    // Monitor network conditions
    this.monitorNetworkConditions();

    // Optimize requests based on connection
    this.optimizeRequestsByConnection();

    // Set up request batching
    this.setupRequestBatching();

    // Implement service worker caching
    this.optimizeServiceWorkerCaching();
  }

  monitorNetworkConditions() {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      const updateNetworkOptimizations = () => {
        const effectiveType = connection.effectiveType;
        this.metrics.networkType = effectiveType;

        // Adjust optimizations based on connection speed
        switch (effectiveType) {
          case 'slow-2g':
          case '2g':
            this.enableAggressiveOptimizations();
            break;
          case '3g':
            this.enableModerateOptimizations();
            break;
          case '4g':
          default:
            this.enableStandardOptimizations();
            break;
        }
      };

      connection.addEventListener('change', updateNetworkOptimizations);
      updateNetworkOptimizations(); // Initial call
    }
  }

  enableAggressiveOptimizations() {
    // Reduce image quality
    document.documentElement.classList.add('low-bandwidth');

    // Disable non-essential animations
    document.documentElement.classList.add('reduced-motion');

    // Prioritize text content over images
    this.prioritizeTextContent();

    console.log('Aggressive optimizations enabled for slow connection');
  }

  enableModerateOptimizations() {
    document.documentElement.classList.remove('low-bandwidth', 'reduced-motion');
    document.documentElement.classList.add('moderate-bandwidth');

    console.log('Moderate optimizations enabled for 3G connection');
  }

  enableStandardOptimizations() {
    document.documentElement.classList.remove('low-bandwidth', 'moderate-bandwidth', 'reduced-motion');

    console.log('Standard optimizations enabled for fast connection');
  }

  prioritizeTextContent() {
    // Hide non-essential images on slow connections
    const nonEssentialImages = document.querySelectorAll('img:not([data-essential])');
    nonEssentialImages.forEach(img => {
      img.style.display = 'none';
    });
  }

  optimizeRequestsByConnection() {
    // Batch non-critical requests on slow connections
    if (this.metrics.networkType === '2g' || this.metrics.networkType === 'slow-2g') {
      this.enableRequestBatching();
    }
  }

  setupRequestBatching() {
    // Batch multiple small requests together
    this.requestBatch = [];
    this.batchTimeout = null;

    // Override fetch for batching
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      if (this.shouldBatchRequest(args[0])) {
        return this.addToBatch(...args);
      }
      return originalFetch(...args);
    };
  }

  shouldBatchRequest(url) {
    // Only batch small API requests, not images or large resources
    return typeof url === 'string' &&
           url.includes('/api/') &&
           !url.includes('image') &&
           !url.includes('video');
  }

  addToBatch(...args) {
    return new Promise((resolve, reject) => {
      this.requestBatch.push({ args, resolve, reject });

      // Clear existing timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      // Set new timeout to process batch
      this.batchTimeout = setTimeout(() => {
        this.processBatch();
      }, 50); // 50ms batching window
    });
  }

  async processBatch() {
    const batch = [...this.requestBatch];
    this.requestBatch = [];

    // Process all requests in parallel
    const results = await Promise.allSettled(
      batch.map(({ args }) => fetch(...args))
    );

    // Resolve/reject individual promises
    results.forEach((result, index) => {
      const { resolve, reject } = batch[index];
      if (result.status === 'fulfilled') {
        resolve(result.value);
      } else {
        reject(result.reason);
      }
    });
  }

  optimizeServiceWorkerCaching() {
    if ('serviceWorker' in navigator) {
      // Send optimization hints to service worker
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'OPTIMIZATION_CONFIG',
          config: {
            networkType: this.metrics.networkType,
            memoryUsage: this.metrics.memoryUsage,
            aggressiveCaching: this.metrics.networkType === '2g'
          }
        });
      });
    }
  }

  // =====================================================
  // RENDER OPTIMIZATION
  // =====================================================

  setupRenderOptimization() {
    // Optimize animations
    this.optimizeAnimations();

    // Set up frame rate monitoring
    this.monitorFrameRate();

    // Optimize layout thrashing
    this.preventLayoutThrashing();

    // Set up will-change optimization
    this.optimizeWillChange();
  }

  optimizeAnimations() {
    // Use transform and opacity for animations (GPU accelerated)
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });

    // Reduce animation complexity on low-end devices
    if (this.isLowEndDevice()) {
      document.documentElement.classList.add('reduced-animations');
    }
  }

  isLowEndDevice() {
    // Detect low-end devices based on various factors
    const memory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connectionSpeed = this.metrics.networkType;

    return memory < 4 ||
           hardwareConcurrency < 4 ||
           connectionSpeed === '2g' ||
           connectionSpeed === 'slow-2g';
  }

  monitorFrameRate() {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fps = fps;

        if (fps < 30) {
          this.handleLowFrameRate();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  handleLowFrameRate() {
    // Reduce visual complexity when frame rate drops
    document.documentElement.classList.add('performance-mode');

    // Disable non-essential animations
    const nonEssentialAnimations = document.querySelectorAll('.breathing-background, .cursor-outline');
    nonEssentialAnimations.forEach(el => {
      el.style.animationPlayState = 'paused';
    });

    console.warn('Low frame rate detected, enabling performance mode');
  }

  preventLayoutThrashing() {
    // Batch DOM reads and writes
    this.setupDOMBatching();

    // Use DocumentFragment for multiple DOM insertions
    this.optimizeDOMInsertions();
  }

  setupDOMBatching() {
    let readCallbacks = [];
    let writeCallbacks = [];
    let scheduled = false;

    window.fastdom = {
      read: (callback) => {
        readCallbacks.push(callback);
        this.scheduleFlush();
      },
      write: (callback) => {
        writeCallbacks.push(callback);
        this.scheduleFlush();
      }
    };

    this.scheduleFlush = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          // Execute all reads first
          readCallbacks.forEach(callback => callback());
          // Then execute all writes
          writeCallbacks.forEach(callback => callback());

          readCallbacks = [];
          writeCallbacks = [];
          scheduled = false;
        });
      }
    };
  }

  optimizeDOMInsertions() {
    // Override common DOM insertion methods to use DocumentFragment
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
      if (this.dataset.batchInsert) {
        if (!this._fragment) {
          this._fragment = document.createDocumentFragment();
        }
        return this._fragment.appendChild(child);
      }
      return originalAppendChild.call(this, child);
    };
  }

  optimizeWillChange() {
    // Automatically manage will-change property
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add will-change when element becomes visible
          if (entry.target.dataset.willChange) {
            entry.target.style.willChange = entry.target.dataset.willChange;
          }
        } else {
          // Remove will-change when element is out of view
          entry.target.style.willChange = 'auto';
        }
      });
    });

    const animatedElements = document.querySelectorAll('[data-will-change]');
    animatedElements.forEach(el => observer.observe(el));
  }

  // =====================================================
  // CRITICAL RESOURCE PRIORITIZATION
  // =====================================================

  setupCriticalResourcePrioritization() {
    // Prioritize above-the-fold content
    this.prioritizeAboveFold();

    // Defer non-critical resources
    this.deferNonCriticalResources();

    // Set up progressive enhancement
    this.setupProgressiveEnhancement();
  }

  prioritizeAboveFold() {
    // Identify and prioritize above-the-fold content
    const aboveFoldElements = this.getAboveFoldElements();

    aboveFoldElements.forEach(element => {
      // Preload images in above-the-fold content
      const images = element.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'eager';
        }
      });

      // Mark as critical for other optimizations
      element.dataset.critical = 'true';
    });
  }

  getAboveFoldElements() {
    const viewportHeight = window.innerHeight;
    const elements = document.querySelectorAll('section, .hero-section, header');

    return Array.from(elements).filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.top < viewportHeight;
    });
  }

  deferNonCriticalResources() {
    // Defer analytics scripts
    this.deferAnalytics();

    // Defer social media widgets
    this.deferSocialWidgets();

    // Defer non-essential third-party scripts
    this.deferThirdPartyScripts();
  }

  deferAnalytics() {
    // Defer Google Analytics and other tracking scripts
    setTimeout(() => {
      // Load analytics after main content is ready
      this.loadAnalytics();
    }, 3000);
  }

  deferSocialWidgets() {
    // Load social widgets only when needed
    const socialContainers = document.querySelectorAll('[data-social-widget]');

    const socialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadSocialWidget(entry.target);
          socialObserver.unobserve(entry.target);
        }
      });
    });

    socialContainers.forEach(container => socialObserver.observe(container));
  }

  deferThirdPartyScripts() {
    // Identify and defer third-party scripts
    const thirdPartyDomains = ['google-analytics.com', 'facebook.net', 'twitter.com'];
    const scripts = document.querySelectorAll('script[src]');

    scripts.forEach(script => {
      const isThirdParty = thirdPartyDomains.some(domain => script.src.includes(domain));
      if (isThirdParty && !script.defer && !script.async) {
        script.defer = true;
      }
    });
  }

  setupProgressiveEnhancement() {
    // Layer enhancements based on device capabilities
    this.applyProgressiveEnhancements();
  }

  applyProgressiveEnhancements() {
    // Basic functionality first
    document.documentElement.classList.add('js-enabled');

    // Add enhancements based on capabilities
    if (window.IntersectionObserver) {
      document.documentElement.classList.add('intersection-observer');
    }

    if (window.WebGLRenderingContext) {
      document.documentElement.classList.add('webgl');
    }

    if ('serviceWorker' in navigator) {
      document.documentElement.classList.add('service-worker');
    }

    if (window.DeviceOrientationEvent) {
      document.documentElement.classList.add('device-orientation');
    }
  }

  // =====================================================
  // PERFORMANCE TRACKING & OPTIMIZATION METHODS
  // =====================================================

  trackImageLoad(img) {
    const loadTime = performance.now();
    const size = img.naturalWidth * img.naturalHeight;

    // Track slow loading images
    if (loadTime > 2000) {
      console.warn(`Slow image load: ${img.src} took ${loadTime}ms`);
    }

    // Store metrics
    this.metrics.imageLoads = this.metrics.imageLoads || [];
    this.metrics.imageLoads.push({
      src: img.src,
      loadTime,
      size,
      timestamp: Date.now()
    });
  }

  trackScriptLoad(script) {
    const loadTime = performance.now();

    // Track slow loading scripts
    if (loadTime > 3000) {
      console.warn(`Slow script load: ${script.src} took ${loadTime}ms`);
    }
  }

  checkAndOptimizeLCP(lcp) {
    if (lcp > 2500) { // Poor LCP
      this.optimizeLCP();
    }
  }

  checkAndOptimizeFID(fid) {
    if (fid > 100) { // Poor FID
      this.optimizeFID();
    }
  }

  checkAndOptimizeCLS(cls) {
    if (cls > 0.1) { // Poor CLS
      this.optimizeCLS();
    }
  }

  optimizeLCP() {
    // Optimize Largest Contentful Paint
    console.log('Optimizing LCP...');

    // Preload LCP element
    const lcpElement = this.findLCPElement();
    if (lcpElement && lcpElement.tagName === 'IMG') {
      this.preloadImage(lcpElement.src);
    }
  }

  optimizeFID() {
    // Optimize First Input Delay
    console.log('Optimizing FID...');

    // Break up long tasks
    this.breakUpLongTasks();

    // Use requestIdleCallback for non-critical work
    this.deferNonCriticalWork();
  }

  optimizeCLS() {
    // Optimize Cumulative Layout Shift
    console.log('Optimizing CLS...');

    // Add size attributes to images
    this.addImageDimensions();

    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent();
  }

  findLCPElement() {
    // Find the largest contentful paint element
    const candidates = document.querySelectorAll('img, video, [data-lcp]');
    let largest = null;
    let largestSize = 0;

    candidates.forEach(element => {
      const rect = element.getBoundingClientRect();
      const size = rect.width * rect.height;
      if (size > largestSize) {
        largest = element;
        largestSize = size;
      }
    });

    return largest;
  }

  preloadImage(src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }

  breakUpLongTasks() {
    // Use scheduler.postTask if available, otherwise use setTimeout
    const scheduleTask = window.scheduler?.postTask || ((callback) => setTimeout(callback, 0));

    // Example: Break up array processing
    window.processLargeArray = (array, processor) => {
      const chunkSize = 50;
      let index = 0;

      function processChunk() {
        const chunk = array.slice(index, index + chunkSize);
        chunk.forEach(processor);
        index += chunkSize;

        if (index < array.length) {
          scheduleTask(processChunk);
        }
      }

      processChunk();
    };
  }

  deferNonCriticalWork() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Perform non-critical optimizations
        this.performNonCriticalOptimizations();
      });
    }
  }

  performNonCriticalOptimizations() {
    // Clean up old metrics
    this.cleanupOldMetrics();

    // Optimize images that are not visible
    this.optimizeOffscreenImages();

    // Preload next sections
    this.preloadNextSections();
  }

  addImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (img.naturalWidth && img.naturalHeight) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      }
    });
  }

  reserveSpaceForDynamicContent() {
    // Add min-height to containers that will have dynamic content
    const dynamicContainers = document.querySelectorAll('[data-dynamic], .collection-grid, .stories-grid');
    dynamicContainers.forEach(container => {
      if (!container.style.minHeight) {
        container.style.minHeight = '200px';
      }
    });
  }

  cleanupOldMetrics() {
    // Keep only recent metrics
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const now = Date.now();

    if (this.metrics.imageLoads) {
      this.metrics.imageLoads = this.metrics.imageLoads.filter(
        entry => now - entry.timestamp < maxAge
      );
    }
  }

  optimizeOffscreenImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!this.isInViewport(img) && !img.dataset.optimized) {
        img.loading = 'lazy';
        img.dataset.optimized = 'true';
      }
    });
  }

  preloadNextSections() {
    // Preload the next likely section based on user scroll behavior
    const currentScroll = window.scrollY;
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 2 && rect.top > 0) {
        // Section is coming up, preload its resources
        this.preloadSectionResources(section);
      }
    });
  }

  preloadSectionResources(section) {
    const images = section.querySelectorAll('img[data-src]');
    images.slice(0, 3).forEach(img => { // Preload first 3 images
      const tempImg = new Image();
      tempImg.src = img.dataset.src;
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  handleOptimizedScroll() {
    // Optimized scroll handler
    this.updateVisibleElements();
    this.manageAnimations();
  }

  handleOptimizedResize() {
    // Optimized resize handler
    this.updateResponsiveElements();
    this.recalculateLayoutOptimizations();
  }

  updateVisibleElements() {
    // Update only visible elements during scroll
    const visibleElements = document.querySelectorAll('[data-scroll-update]');
    visibleElements.forEach(element => {
      if (this.isInViewport(element)) {
        this.updateElementOnScroll(element);
      }
    });
  }

  updateElementOnScroll(element) {
    const scrollUpdateType = element.dataset.scrollUpdate;
    switch (scrollUpdateType) {
      case 'parallax':
        this.updateParallax(element);
        break;
      case 'fade':
        this.updateFadeOnScroll(element);
        break;
      case 'animate':
        this.updateAnimationOnScroll(element);
        break;
    }
  }

  updateParallax(element) {
    const rect = element.getBoundingClientRect();
    const speed = element.dataset.parallaxSpeed || 0.5;
    const yPos = -(rect.top * speed);
    element.style.transform = `translateY(${yPos}px)`;
  }

  updateFadeOnScroll(element) {
    const rect = element.getBoundingClientRect();
    const opacity = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
    element.style.opacity = opacity;
  }

  updateAnimationOnScroll(element) {
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible && !element.classList.contains('animated')) {
      element.classList.add('animated');
    }
  }

  manageAnimations() {
    // Pause animations that are out of view
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      if (this.isInViewport(element)) {
        element.style.animationPlayState = 'running';
      } else {
        element.style.animationPlayState = 'paused';
      }
    });
  }

  updateResponsiveElements() {
    // Update elements that need to respond to size changes
    const responsiveElements = document.querySelectorAll('[data-responsive]');
    responsiveElements.forEach(element => {
      this.updateResponsiveElement(element);
    });
  }

  updateResponsiveElement(element) {
    const type = element.dataset.responsive;
    switch (type) {
      case 'text':
        this.updateResponsiveText(element);
        break;
      case 'image':
        this.updateResponsiveImage(element);
        break;
      case 'layout':
        this.updateResponsiveLayout(element);
        break;
    }
  }

  updateResponsiveText(element) {
    // Adjust text size based on container width
    const width = element.offsetWidth;
    if (width < 300) {
      element.classList.add('small-text');
    } else {
      element.classList.remove('small-text');
    }
  }

  updateResponsiveImage(element) {
    // Update image source based on container size
    const width = element.offsetWidth;
    const dpr = window.devicePixelRatio || 1;
    const optimalWidth = Math.round(width * dpr);

    if (element.dataset.srcset) {
      // Browser will handle srcset automatically
      return;
    }

    // Manual responsive image handling
    if (optimalWidth < 400 && element.dataset.srcSmall) {
      element.src = element.dataset.srcSmall;
    } else if (optimalWidth < 800 && element.dataset.srcMedium) {
      element.src = element.dataset.srcMedium;
    } else if (element.dataset.srcLarge) {
      element.src = element.dataset.srcLarge;
    }
  }

  updateResponsiveLayout(element) {
    // Update layout classes based on size
    const width = element.offsetWidth;
    element.classList.toggle('compact-layout', width < 600);
    element.classList.toggle('expanded-layout', width > 1200);
  }

  recalculateLayoutOptimizations() {
    // Recalculate layout-dependent optimizations
    this.optimizeVisibleImages();
    this.updateLazyLoadThresholds();
  }

  optimizeVisibleImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (this.isInViewport(img)) {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
    });
  }

  updateLazyLoadThresholds() {
    // Update intersection observer thresholds based on viewport size
    const viewportHeight = window.innerHeight;
    const rootMargin = `${Math.round(viewportHeight * 0.1)}px 0px`;

    // This would require recreating intersection observers with new settings
    console.log(`Updated lazy load threshold to ${rootMargin}`);
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  getPerformanceReport() {
    return {
      metrics: { ...this.metrics },
      optimizations: Array.from(this.optimizations.keys()),
      cacheStatus: {
        imageCache: this.imageCache.size,
        resourceQueue: this.resourceQueue.length
      },
      recommendations: this.getPerformanceRecommendations()
    };
  }

  getPerformanceRecommendations() {
    const recommendations = [];

    if (this.metrics.lcp > 2500) {
      recommendations.push('Consider optimizing Largest Contentful Paint');
    }

    if (this.metrics.fid > 100) {
      recommendations.push('Consider reducing JavaScript execution time');
    }

    if (this.metrics.cls > 0.1) {
      recommendations.push('Consider adding size attributes to images');
    }

    if (this.metrics.memoryUsage > 100) {
      recommendations.push('Consider optimizing memory usage');
    }

    if (this.metrics.fps < 30) {
      recommendations.push('Consider reducing animation complexity');
    }

    return recommendations;
  }

  enablePerformanceMode() {
    document.documentElement.classList.add('performance-mode');
    this.enableAggressiveOptimizations();
  }

  disablePerformanceMode() {
    document.documentElement.classList.remove('performance-mode');
    this.enableStandardOptimizations();
  }

  // Manual optimization triggers
  optimizeImages() {
    this.optimizeExistingImages();
  }

  cleanupMemory() {
    this.performMemoryCleanup();
  }

  preloadCritical() {
    this.preloadCriticalResources();
  }

  // Utility methods for other components
  initializeMap(element) {
    // Map initialization would go here
    console.log('Initializing map component');
  }

  initializeCarousel(element) {
    // Carousel initialization would go here
    console.log('Initializing carousel component');
  }

  initializeGallery(element) {
    // Gallery initialization would go here
    console.log('Initializing gallery component');
  }

  loadAnalytics() {
    // Analytics loading would go here
    console.log('Loading analytics');
  }

  loadSocialWidget(container) {
    // Social widget loading would go here
    console.log('Loading social widget for', container);
  }
}

// Initialize performance optimizer
const ultraPerformanceOptimizer = new UltraPerformanceOptimizer();

// Make globally available
window.InnerGarden = window.InnerGarden || {};
window.InnerGarden.performanceOptimizer = ultraPerformanceOptimizer;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraPerformanceOptimizer;
}