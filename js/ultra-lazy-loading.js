// Ultra Lazy Loading System - Performance Optimized Image Loading
// Intelligent loading with progressive enhancement, WebP support, and critical resource prioritization

class UltraLazyLoader {
  constructor() {
    this.imageQueue = new Map();
    this.loadingImages = new Set();
    this.observer = null;
    this.supportedFormats = {
      webp: false,
      avif: false
    };
    this.networkInfo = this.getNetworkInfo();
    this.preloadQueue = [];
    this.criticalImages = [];

    this.init();
  }

  async init() {
    // Detect supported image formats
    await this.detectSupportedFormats();

    // Setup Intersection Observer with optimized settings
    this.setupIntersectionObserver();

    // Find and categorize images
    this.categorizeImages();

    // Load critical images immediately
    this.loadCriticalImages();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    // Setup network adaptive loading
    this.setupNetworkAdaptiveLoading();

    console.log('🚀 Ultra Lazy Loader activated - intelligent image loading enabled');
  }

  // =====================================================
  // FORMAT DETECTION & OPTIMIZATION
  // =====================================================

  async detectSupportedFormats() {
    // Test WebP support
    this.supportedFormats.webp = await this.testImageFormat('data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');

    // Test AVIF support
    this.supportedFormats.avif = await this.testImageFormat('data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=');

    console.log('📸 Format support detected:', this.supportedFormats);
  }

  testImageFormat(data) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width === 2 && img.height === 2);
      img.onerror = () => resolve(false);
      img.src = data;
    });
  }

  // =====================================================
  // INTERSECTION OBSERVER SETUP
  // =====================================================

  setupIntersectionObserver() {
    // Optimized observer settings based on device and network
    const rootMargin = this.getOptimalRootMargin();
    const threshold = this.getOptimalThreshold();

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin,
        threshold
      }
    );

    // Observe all lazy images
    this.observeImages();
  }

  getOptimalRootMargin() {
    // Adjust based on connection speed and device capability
    if (this.networkInfo.effectiveType === '4g' && navigator.hardwareConcurrency > 4) {
      return '300px'; // Aggressive preloading for fast connections
    } else if (this.networkInfo.effectiveType === '3g') {
      return '150px'; // Moderate preloading
    } else {
      return '50px'; // Conservative for slow connections
    }
  }

  getOptimalThreshold() {
    // Use multiple thresholds for smooth loading progression
    return [0, 0.1, 0.3, 0.5, 0.7, 1.0];
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
    lazyImages.forEach(img => {
      this.observer.observe(img);
    });
  }

  // =====================================================
  // IMAGE CATEGORIZATION & PRIORITIZATION
  // =====================================================

  categorizeImages() {
    // Find critical images (above the fold, hero images)
    this.criticalImages = Array.from(document.querySelectorAll('.critical-image, .hero-image img, [fetchpriority="high"]'));

    // Find regular lazy images
    const lazyImages = document.querySelectorAll('.lazy-image:not(.critical-image)');

    // Create priority queue
    lazyImages.forEach((img, index) => {
      const priority = this.calculateImagePriority(img, index);
      this.imageQueue.set(img, { priority, loaded: false });
    });

    console.log(`📋 Categorized ${this.criticalImages.length} critical and ${lazyImages.length} lazy images`);
  }

  calculateImagePriority(img, index) {
    let priority = 100; // Base priority

    // Higher priority for images closer to viewport
    const rect = img.getBoundingClientRect();
    const distanceFromViewport = Math.max(0, rect.top - window.innerHeight);
    priority -= Math.min(50, distanceFromViewport / 20);

    // Higher priority for smaller images (load faster)
    const imgSize = (img.dataset.width || 800) * (img.dataset.height || 600);
    priority += Math.max(0, 30 - (imgSize / 100000));

    // Lower priority for images further down in DOM
    priority -= index * 2;

    return Math.max(1, priority);
  }

  // =====================================================
  // CRITICAL IMAGE LOADING
  // =====================================================

  async loadCriticalImages() {
    const loadPromises = this.criticalImages.map(img => this.loadImage(img, true));

    try {
      await Promise.allSettled(loadPromises);
      console.log('⚡ Critical images loaded');
    } catch (error) {
      console.warn('❌ Some critical images failed to load:', error);
    }
  }

  // =====================================================
  // INTERSECTION HANDLING
  // =====================================================

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Load with priority based on intersection ratio
        const priority = entry.intersectionRatio > 0.5 ? 'high' : 'normal';
        this.loadImage(img, false, priority);

        // Stop observing this image
        this.observer.unobserve(img);
      }
    });
  }

  // =====================================================
  // INTELLIGENT IMAGE LOADING
  // =====================================================

  async loadImage(img, isCritical = false, priority = 'normal') {
    if (this.loadingImages.has(img) || img.classList.contains('loaded')) {
      return;
    }

    this.loadingImages.add(img);

    try {
      // Get optimized image source
      const optimizedSrc = this.getOptimizedImageSource(img);

      // Preload the image
      const imageElement = await this.preloadImage(optimizedSrc, img);

      // Apply smooth transition
      this.applyImageWithTransition(img, imageElement, optimizedSrc);

      // Mark as loaded
      img.classList.add('loaded');
      this.loadingImages.delete(img);

      // Update queue status
      if (this.imageQueue.has(img)) {
        this.imageQueue.get(img).loaded = true;
      }

      // Track performance
      this.trackImageLoadPerformance(img, isCritical);

    } catch (error) {
      console.warn('❌ Failed to load image:', img.dataset.src, error);
      this.handleImageLoadError(img);
    }
  }

  getOptimizedImageSource(img) {
    const baseSrc = img.dataset.src;
    if (!baseSrc) return img.src;

    // Try to get WebP/AVIF version if supported
    if (this.supportedFormats.avif && baseSrc.includes('.jpg')) {
      const avifSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      return avifSrc;
    } else if (this.supportedFormats.webp && baseSrc.includes('.jpg')) {
      const webpSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }

    return baseSrc;
  }

  preloadImage(src, originalImg) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Set up srcset and sizes if available
      if (originalImg.dataset.srcset) {
        img.srcset = originalImg.dataset.srcset;
      }
      if (originalImg.dataset.sizes) {
        img.sizes = originalImg.dataset.sizes;
      }

      img.onload = () => resolve(img);
      img.onerror = reject;

      // Set decoding attribute for performance
      img.decoding = 'async';

      img.src = src;
    });
  }

  applyImageWithTransition(targetImg, loadedImg, src) {
    // Create smooth fade-in effect
    targetImg.style.opacity = '0';
    targetImg.style.transition = 'opacity 0.3s ease-in-out';

    // Update source
    targetImg.src = src;
    if (loadedImg.srcset) targetImg.srcset = loadedImg.srcset;
    if (loadedImg.sizes) targetImg.sizes = loadedImg.sizes;

    // Fade in
    requestAnimationFrame(() => {
      targetImg.style.opacity = '1';
    });

    // Clean up transition after completion
    setTimeout(() => {
      targetImg.style.transition = '';
    }, 300);
  }

  handleImageLoadError(img) {
    // Try fallback source
    const fallbackSrc = img.dataset.fallback || img.dataset.src;
    if (fallbackSrc && fallbackSrc !== img.src) {
      img.src = fallbackSrc;
    } else {
      // Show placeholder or hide image
      img.style.display = 'none';
    }

    this.loadingImages.delete(img);
  }

  // =====================================================
  // NETWORK ADAPTIVE LOADING
  // =====================================================

  getNetworkInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      saveData: connection?.saveData || false
    };
  }

  setupNetworkAdaptiveLoading() {
    // Listen for network changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.networkInfo = this.getNetworkInfo();
        this.adjustLoadingStrategy();
      });
    }

    // Adjust strategy based on current network
    this.adjustLoadingStrategy();
  }

  adjustLoadingStrategy() {
    const { effectiveType, saveData } = this.networkInfo;

    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      // Disable auto-loading for slow connections
      this.observer.disconnect();
      console.log('🐌 Slow connection detected - manual loading only');
    } else if (effectiveType === '3g') {
      // Conservative loading for 3G
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { rootMargin: '50px', threshold: 0.1 }
      );
      this.observeImages();
    }
  }

  // =====================================================
  // PERFORMANCE MONITORING
  // =====================================================

  setupPerformanceMonitoring() {
    this.performanceMetrics = {
      totalImages: 0,
      loadedImages: 0,
      failedImages: 0,
      averageLoadTime: 0,
      totalLoadTime: 0
    };
  }

  trackImageLoadPerformance(img, isCritical) {
    this.performanceMetrics.totalImages++;
    this.performanceMetrics.loadedImages++;

    // Calculate load time (simplified)
    const loadTime = performance.now() - this.startTime;
    this.performanceMetrics.totalLoadTime += loadTime;
    this.performanceMetrics.averageLoadTime = this.performanceMetrics.totalLoadTime / this.performanceMetrics.loadedImages;

    if (isCritical) {
      console.log(`⚡ Critical image loaded in ${loadTime.toFixed(2)}ms`);
    }
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  // Force load all remaining images
  loadAllImages() {
    const remainingImages = document.querySelectorAll('.lazy-image:not(.loaded)');
    remainingImages.forEach(img => this.loadImage(img));
  }

  // Get loading statistics
  getStats() {
    return {
      ...this.performanceMetrics,
      supportedFormats: this.supportedFormats,
      networkInfo: this.networkInfo
    };
  }

  // Refresh observer for dynamically added images
  refresh() {
    this.observer.disconnect();
    this.observeImages();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ultraLazyLoader = new UltraLazyLoader();
  });
} else {
  window.ultraLazyLoader = new UltraLazyLoader();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraLazyLoader;
}