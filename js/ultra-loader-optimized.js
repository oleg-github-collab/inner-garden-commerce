/**
 * ═══════════════════════════════════════════════════════════════
 * ULTRA LOADER - Оптимізоване Завантаження Ресурсів
 * ═══════════════════════════════════════════════════════════════
 *
 * Стратегія:
 * 1. Critical CSS inline
 * 2. Async/Defer для JS
 * 3. Lazy loading для зображень
 * 4. Preload для критичних ресурсів
 * 5. Resource hints (dns-prefetch, preconnect)
 * 6. Code splitting
 */

class UltraLoaderOptimized {
  constructor() {
    this.config = {
      criticalLoadTimeout: 3000,
      lazyLoadThreshold: '200px',
      enableServiceWorker: true,
      enableHTTP2Push: true
    };

    this.state = {
      domReady: false,
      assetsLoaded: false,
      interactiveReady: false
    };

    this.metrics = {
      startTime: performance.now(),
      domContentLoaded: 0,
      fullyLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0
    };

    this.init();
  }

  init() {
    this.measurePerformance();
    this.setupCriticalLoad();
    this.setupLazyLoading();
    this.optimizeResourceLoading();
    this.monitorLoadingState();
  }

  /**
   * Вимірювання Core Web Vitals
   */
  measurePerformance() {
    // First Paint
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime;
      }
      if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now() - this.metrics.startTime;
      this.state.domReady = true;
      this.logMetric('DOM Ready', this.metrics.domContentLoaded);
    });

    // Fully Loaded
    window.addEventListener('load', () => {
      this.metrics.fullyLoaded = performance.now() - this.metrics.startTime;
      this.state.assetsLoaded = true;
      this.logMetric('Fully Loaded', this.metrics.fullyLoaded);
      this.reportPerformance();
    });
  }

  /**
   * Критичне завантаження
   */
  setupCriticalLoad() {
    // Preload критичних шрифтів
    this.preloadCriticalResources([
      {
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Raleway:wght@300;400;600&display=swap',
        as: 'style'
      }
    ]);

    // Preconnect до зовнішніх доменів
    this.preconnectDomains([
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
      'https://unpkg.com'
    ]);
  }

  /**
   * Preload критичних ресурсів
   */
  preloadCriticalResources(resources) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }

  /**
   * Preconnect до доменів
   */
  preconnectDomains(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Налаштування Lazy Loading
   */
  setupLazyLoading() {
    // Використання native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      this.setupNativeLazyLoad();
    } else {
      this.setupIntersectionObserverLazyLoad();
    }
  }

  /**
   * Native lazy loading
   */
  setupNativeLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.hasAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
      if (img.hasAttribute('data-srcset')) {
        img.srcset = img.getAttribute('data-srcset');
        img.removeAttribute('data-srcset');
      }
    });
  }

  /**
   * Intersection Observer для старіших браузерів
   */
  setupIntersectionObserverLazyLoad() {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: this.config.lazyLoadThreshold
      }
    );

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Завантаження зображення
   */
  loadImage(img) {
    if (img.hasAttribute('data-src')) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }
    if (img.hasAttribute('data-srcset')) {
      img.srcset = img.getAttribute('data-srcset');
      img.removeAttribute('data-srcset');
    }
    img.classList.add('loaded');
  }

  /**
   * Оптимізація завантаження ресурсів
   */
  optimizeResourceLoading() {
    // Відкладене завантаження некритичного CSS
    this.deferNonCriticalCSS();

    // Відкладене завантаження JS
    this.deferNonCriticalJS();

    // Prefetch для наступних сторінок
    this.prefetchNextPages();
  }

  /**
   * Відкладене завантаження CSS
   */
  deferNonCriticalCSS() {
    const deferredStyles = [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    ];

    deferredStyles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function() {
        this.media = 'all';
      };
      document.head.appendChild(link);
    });
  }

  /**
   * Відкладене завантаження JS
   */
  deferNonCriticalJS() {
    // Завантаження некритичних скриптів після load
    window.addEventListener('load', () => {
      const deferredScripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
      ];

      deferredScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    });
  }

  /**
   * Prefetch наступних сторінок
   */
  prefetchNextPages() {
    // Можна додати логіку prefetch для SPA навігації
    const links = document.querySelectorAll('a[data-prefetch]');
    links.forEach(link => {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = link.href;
      document.head.appendChild(prefetch);
    });
  }

  /**
   * Моніторинг стану завантаження
   */
  monitorLoadingState() {
    // Відстеження прогресу завантаження
    const updateProgress = () => {
      const resources = performance.getEntriesByType('resource');
      const total = resources.length;
      const loaded = resources.filter(r => r.responseEnd > 0).length;
      const progress = Math.round((loaded / total) * 100);

      this.updateProgressBar(progress);

      if (progress === 100) {
        this.onLoadingComplete();
      }
    };

    // Перевірка кожні 100ms
    const progressInterval = setInterval(() => {
      updateProgress();
      if (this.state.assetsLoaded) {
        clearInterval(progressInterval);
      }
    }, 100);
  }

  /**
   * Оновлення прогрес бару
   */
  updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Emit event
    document.dispatchEvent(new CustomEvent('loading-progress', {
      detail: { progress }
    }));
  }

  /**
   * Завершення завантаження
   */
  onLoadingComplete() {
    this.state.interactiveReady = true;

    // Приховати preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }

    // Emit event
    document.dispatchEvent(new CustomEvent('site-ready'));

    console.log('✅ Site fully loaded and interactive');
  }

  /**
   * Звіт про performance
   */
  reportPerformance() {
    const report = {
      metrics: this.metrics,
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').length
    };

    // Відправка до analytics (Google Analytics, etc.)
    if (window.gtag) {
      window.gtag('event', 'performance', {
        dom_ready: Math.round(this.metrics.domContentLoaded),
        fully_loaded: Math.round(this.metrics.fullyLoaded),
        fcp: Math.round(this.metrics.firstContentfulPaint),
        lcp: Math.round(this.metrics.largestContentfulPaint)
      });
    }

    console.log('📊 Performance Report:', report);
  }

  /**
   * Логування метрик
   */
  logMetric(name, value) {
    console.log(`⚡ ${name}: ${Math.round(value)}ms`);
  }

  /**
   * Отримання метрик
   */
  getMetrics() {
    return this.metrics;
  }
}

// Ініціалізація
const ultraLoader = new UltraLoaderOptimized();

// Export
if (typeof window !== 'undefined') {
  window.UltraLoader = ultraLoader;
}
