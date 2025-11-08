/* Inner Garden - Performance Utilities */
/* Debouncing, throttling, and performance optimization helpers */

(function() {
  'use strict';

  // =====================================================
  // DEBOUNCE & THROTTLE UTILITIES
  // =====================================================

  /**
   * Debounce function - delays execution until after wait time has elapsed
   * Perfect for: input validation, window resize, search autocomplete
   */
  const debounce = (func, wait = 300, immediate = false) => {
    let timeout;

    return function executedFunction(...args) {
      const context = this;

      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  };

  /**
   * Throttle function - ensures function is only called once per wait period
   * Perfect for: scroll events, mouse move, window resize
   */
  const throttle = (func, wait = 100) => {
    let inThrottle;
    let lastFunc;
    let lastTime;

    return function(...args) {
      const context = this;

      if (!inThrottle) {
        func.apply(context, args);
        lastTime = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastTime >= wait) {
            func.apply(context, args);
            lastTime = Date.now();
          }
        }, Math.max(wait - (Date.now() - lastTime), 0));
      }
    };
  };

  /**
   * RequestAnimationFrame throttle - optimal for visual updates
   * Perfect for: animations, scroll effects, parallax
   */
  const rafThrottle = (func) => {
    let rafId = null;

    return function(...args) {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    };
  };

  // =====================================================
  // PASSIVE EVENT LISTENERS
  // =====================================================

  /**
   * Check if passive event listeners are supported
   */
  const supportsPassive = (() => {
    let support = false;
    try {
      const options = {
        get passive() {
          support = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      support = false;
    }
    return support;
  })();

  /**
   * Get optimal event listener options
   */
  const getPassiveOptions = (passive = true) => {
    return supportsPassive ? { passive, capture: false } : false;
  };

  // =====================================================
  // PERFORMANCE MONITORING
  // =====================================================

  /**
   * Measure function execution time
   */
  const measurePerformance = (func, label = 'Operation') => {
    return function(...args) {
      const startTime = performance.now();
      const result = func.apply(this, args);
      const endTime = performance.now();
      console.log(`⏱️ ${label} took ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    };
  };

  /**
   * FPS Monitor
   */
  class FPSMonitor {
    constructor() {
      this.fps = 60;
      this.frames = [];
      this.lastFrameTime = performance.now();
      this.monitoring = false;
    }

    start() {
      if (this.monitoring) return;
      this.monitoring = true;
      this.measure();
    }

    stop() {
      this.monitoring = false;
    }

    measure() {
      if (!this.monitoring) return;

      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      const currentFPS = 1000 / delta;
      this.frames.push(currentFPS);

      // Keep only last 60 frames
      if (this.frames.length > 60) {
        this.frames.shift();
      }

      // Calculate average FPS
      this.fps = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;

      requestAnimationFrame(() => this.measure());
    }

    getFPS() {
      return Math.round(this.fps);
    }

    isPerformanceGood() {
      return this.fps >= 50; // Consider 50+ FPS as good
    }
  }

  // =====================================================
  // NETWORK QUALITY DETECTION
  // =====================================================

  /**
   * Get network connection info
   */
  const getNetworkInfo = () => {
    const connection = navigator.connection ||
                      navigator.mozConnection ||
                      navigator.webkitConnection;

    if (!connection) {
      return { effectiveType: '4g', downlink: 10, rtt: 100, saveData: false };
    }

    return {
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 100,
      saveData: connection.saveData || false
    };
  };

  /**
   * Check if connection is slow
   */
  const isSlowConnection = () => {
    const network = getNetworkInfo();
    return network.effectiveType === 'slow-2g' ||
           network.effectiveType === '2g' ||
           network.saveData === true ||
           network.rtt > 400;
  };

  // =====================================================
  // INTERSECTION OBSERVER HELPERS
  // =====================================================

  /**
   * Create optimized Intersection Observer
   */
  const createIntersectionObserver = (callback, options = {}) => {
    const defaultOptions = {
      rootMargin: '50px',
      threshold: 0.1
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return new IntersectionObserver(callback, mergedOptions);
  };

  /**
   * Lazy load element when visible
   */
  const lazyLoadWhenVisible = (element, loadCallback) => {
    const observer = createIntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCallback(entry.target);
          obs.unobserve(entry.target);
        }
      });
    });

    observer.observe(element);
    return observer;
  };

  // =====================================================
  // CRITICAL PERFORMANCE OPTIMIZATIONS
  // =====================================================

  /**
   * Optimize scroll handlers globally
   */
  const optimizeScrollHandlers = () => {
    // Replace all scroll listeners with throttled versions
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'scroll' && typeof listener === 'function') {
        const throttledListener = rafThrottle(listener);
        return originalAddEventListener.call(
          this,
          type,
          throttledListener,
          getPassiveOptions()
        );
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  };

  /**
   * Optimize resize handlers globally
   */
  const optimizeResizeHandlers = () => {
    const handlers = new Set();
    let resizeTimeout;

    window.addEventListener('resize', debounce(() => {
      handlers.forEach(handler => {
        try {
          handler();
        } catch (error) {
          console.error('Resize handler error:', error);
        }
      });
    }, 150), getPassiveOptions());

    // Expose API for adding resize handlers
    window.addResizeHandler = (handler) => {
      if (typeof handler === 'function') {
        handlers.add(handler);
      }
    };

    window.removeResizeHandler = (handler) => {
      handlers.delete(handler);
    };
  };

  /**
   * Reduce motion for users who prefer it
   */
  const respectReducedMotion = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      console.log('♿ Reduced motion enabled for accessibility');
    }

    return prefersReducedMotion;
  };

  /**
   * Enable GPU acceleration for elements
   */
  const enableGPUAcceleration = (selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.willChange = 'transform';
      el.style.transform = 'translateZ(0)';
      el.style.backfaceVisibility = 'hidden';
    });
  };

  // =====================================================
  // INITIALIZE PERFORMANCE OPTIMIZATIONS
  // =====================================================

  const initPerformanceOptimizations = () => {
    // Optimize scroll handlers
    optimizeScrollHandlers();

    // Optimize resize handlers
    optimizeResizeHandlers();

    // Respect user preferences
    respectReducedMotion();

    // Enable GPU acceleration for animations
    requestAnimationFrame(() => {
      enableGPUAcceleration('.cursor-dot, .cursor-outline, .modal, .card, .artwork-card');
    });

    // Start FPS monitoring in dev mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const fpsMonitor = new FPSMonitor();
      fpsMonitor.start();

      setInterval(() => {
        const fps = fpsMonitor.getFPS();
        if (fps < 50) {
          console.warn(`⚠️ Low FPS detected: ${fps} fps`);
        }
      }, 5000);
    }

    console.log('⚡ Performance optimizations enabled');
  };

  // =====================================================
  // EXPORT TO GLOBAL SCOPE
  // =====================================================

  window.PerformanceUtils = {
    debounce,
    throttle,
    rafThrottle,
    measurePerformance,
    getPassiveOptions,
    FPSMonitor,
    getNetworkInfo,
    isSlowConnection,
    createIntersectionObserver,
    lazyLoadWhenVisible,
    enableGPUAcceleration,
    respectReducedMotion
  };

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
  } else {
    initPerformanceOptimizations();
  }

})();
