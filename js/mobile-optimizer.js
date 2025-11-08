/* Inner Garden - Mobile Optimizer */
(function() {
  'use strict';

  class MobileOptimizer {
    constructor() {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      this.init();
    }

    init() {
      if (!this.isMobile && !this.isTouch) return;

      // 1. Optimize touch interactions
      this.optimizeTouchInteractions();

      // 2. Improve scroll performance
      this.optimizeScrolling();

      // 3. Optimize images for mobile
      this.optimizeMobileImages();

      // 4. Improve tap targets
      this.improveTapTargets();

      // 5. Optimize forms for mobile
      this.optimizeForms();

      // 6. Add mobile-specific styles
      this.addMobileStyles();

      // 7. Prevent zoom on input focus (optional)
      this.preventZoomOnInput();

      // 8. Optimize viewport
      this.optimizeViewport();
    }

    optimizeTouchInteractions() {
      // Remove 300ms tap delay
      document.addEventListener('touchstart', function() {}, { passive: true });

      // Improve button feedback
      const buttons = document.querySelectorAll('button, .btn, a');
      buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
          this.classList.add('touch-active');
        }, { passive: true });

        btn.addEventListener('touchend', function() {
          setTimeout(() => {
            this.classList.remove('touch-active');
          }, 150);
        }, { passive: true });
      });

      // Prevent text selection on double tap
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';

      // But allow in input fields
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.style.webkitUserSelect = 'text';
      });
    }

    optimizeScrolling() {
      // Enable momentum scrolling
      document.body.style.webkitOverflowScrolling = 'touch';

      // Optimize scroll listeners
      let scrollTimeout;
      let isScrolling = false;

      window.addEventListener('scroll', () => {
        if (!isScrolling) {
          document.body.classList.add('is-scrolling');
          isScrolling = true;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          document.body.classList.remove('is-scrolling');
          isScrolling = false;
        }, 150);
      }, { passive: true });

      // Smooth scroll polyfill for iOS
      if (!('scrollBehavior' in document.documentElement.style)) {
        this.polyfillSmoothScroll();
      }
    }

    polyfillSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;

          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const targetPosition = target.offsetTop;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    optimizeMobileImages() {
      // Reduce image quality on mobile to save bandwidth
      const images = document.querySelectorAll('img[src*="cloudinary"]');

      images.forEach(img => {
        let src = img.src || img.dataset.src;

        // Add mobile optimizations to Cloudinary URLs
        if (src && src.includes('res.cloudinary.com')) {
          // Add quality and format optimizations
          if (!src.includes('q_')) {
            src = src.replace('/upload/', '/upload/q_auto:low,f_auto/');
          }

          // Resize for mobile screens
          if (window.innerWidth < 768) {
            if (!src.includes('w_')) {
              src = src.replace('/upload/', '/upload/w_800,c_limit/');
            }
          }

          if (img.dataset.src) {
            img.dataset.src = src;
          } else {
            img.src = src;
          }
        }
      });
    }

    improveTapTargets() {
      // Ensure all clickable elements are at least 44x44px
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          button, .btn, a[href], input[type="button"],
          input[type="submit"], .clickable {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 20px;
          }

          .mood-filter-btn, .filter-chip {
            min-height: 48px;
            min-width: 48px;
            padding: 12px 16px;
          }

          .collection-card, .artwork-card {
            margin-bottom: 1.5rem;
          }

          .nav-item {
            padding: 12px 16px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    optimizeForms() {
      const inputs = document.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Set appropriate input types for mobile keyboards
        if (input.name === 'email') {
          input.type = 'email';
          input.autocomplete = 'email';
        }

        if (input.name === 'phone' || input.name === 'tel') {
          input.type = 'tel';
          input.autocomplete = 'tel';
        }

        if (input.name === 'name') {
          input.autocomplete = 'name';
        }

        // Prevent zoom on focus (iOS)
        input.style.fontSize = '16px';
      });
    }

    addMobileStyles() {
      const style = document.createElement('style');
      style.id = 'mobile-optimizer-styles';
      style.textContent = `
        @media (max-width: 768px) {
          /* Optimize touch feedback */
          .touch-active {
            opacity: 0.7;
            transform: scale(0.98);
            transition: all 0.1s ease;
          }

          /* Improve scrolling performance */
          .is-scrolling * {
            pointer-events: none !important;
          }

          /* Optimize modal for mobile */
          .modal-content, .meditation-modal-content-new {
            max-height: 90vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          /* Optimize collection grid */
          .collection-grid, .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          /* Optimize filters */
          .collection-mood-filters {
            padding: 1.25rem;
            margin-bottom: 2rem;
          }

          .mood-buttons-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .mood-filter-btn {
            padding: 1rem;
          }

          .mood-emoji {
            font-size: 2rem;
          }

          .mood-label {
            font-size: 0.9rem;
          }

          /* Optimize hero section */
          .hero-section {
            padding-top: calc(var(--header-height) + 2rem);
            padding-bottom: 3rem;
            min-height: auto;
          }

          .hero-content {
            flex-direction: column;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2rem !important;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-description {
            font-size: 0.95rem;
          }

          /* Optimize buttons */
          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }

          .hero-buttons .btn {
            width: 100%;
            justify-content: center;
          }

          /* Optimize cards */
          .collection-card, .artwork-card {
            border-radius: 12px;
          }

          .collection-image, .artwork-image {
            height: 250px;
          }

          /* Optimize AR viewer for mobile */
          .ar-viewer-modal {
            padding: 0;
          }

          .ar-viewer-content {
            width: 100%;
            max-width: 100%;
            height: 100vh;
            border-radius: 0;
          }

          /* Optimize meditation */
          .meditation-modal-content-new {
            padding: 1.5rem;
            border-radius: 20px 20px 0 0;
          }

          .meditation-tracks-new {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          /* Optimize atmosphere quiz */
          .quiz-container {
            padding: 1rem;
          }

          .quiz-options {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .quiz-option {
            padding: 1.25rem;
          }

          /* Optimize footer */
          .footer-content {
            flex-direction: column;
            gap: 2rem;
          }

          .footer-column {
            width: 100%;
          }

          /* Optimize header */
          .header-nav {
            position: fixed;
            top: var(--header-height);
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
          }

          .header-nav.active {
            transform: translateY(0);
          }

          /* Prevent horizontal scroll */
          body {
            overflow-x: hidden;
          }

          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          /* Optimize section spacing */
          .section {
            padding: 3rem 0;
          }

          .section-header {
            margin-bottom: 2rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.75rem !important;
          }

          .collection-image, .artwork-image {
            height: 220px;
          }

          .mood-buttons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* iOS specific fixes */
        @supports (-webkit-touch-callout: none) {
          .modal-content, .meditation-modal-content-new {
            padding-bottom: env(safe-area-inset-bottom);
          }

          .hero-section {
            padding-top: calc(var(--header-height) + env(safe-area-inset-top));
          }
        }
      `;
      document.head.appendChild(style);
    }

    preventZoomOnInput() {
      // Only prevent if needed
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        if (!content.includes('maximum-scale')) {
          viewport.setAttribute('content', content + ', maximum-scale=1.0');
        }
      }
    }

    optimizeViewport() {
      let viewport = document.querySelector('meta[name="viewport"]');

      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }

      // Set optimal viewport settings
      viewport.setAttribute('content',
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
      );
    }
  }

  // Initialize mobile optimizer
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MobileOptimizer());
  } else {
    new MobileOptimizer();
  }
})();
