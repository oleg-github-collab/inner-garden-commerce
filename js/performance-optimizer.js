// Inner Garden - Performance Optimizer (Safe & Effective)

(() => {
  'use strict';

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || {};
  const isSlow = ['slow-2g', '2g'].includes(connection.effectiveType);

  // Resource hints for faster subsequent loads
  const addResourceHints = () => {
    const hints = [
      { rel: 'preconnect', href: 'https://res.cloudinary.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
      { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
    ];

    const frag = document.createDocumentFragment();
    hints.forEach(({ rel, href, crossOrigin }) => {
      if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin !== undefined) link.crossOrigin = crossOrigin;
      frag.appendChild(link);
    });
    document.head.appendChild(frag);
  };

  // Optimize images: native lazy loading + error handling
  const optimizeImages = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading && !img.closest('.hero')) {
        img.loading = 'lazy';
      }
      img.decoding = 'async';

      img.addEventListener('error', function handler() {
        img.removeEventListener('error', handler);
        img.style.opacity = '0.5';
        img.alt = img.alt || 'Image unavailable';
      }, { once: true });
    });
  };

  // Scroll-triggered reveal animations
  const setupScrollReveal = () => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    document.querySelectorAll('.section, .card, .art-card, .image-card').forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  };

  // Debounce utility
  const debounce = (fn, ms = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  // Optimize scroll handlers
  const optimizeScroll = () => {
    let ticking = false;
    const header = document.querySelector('header.site-header, .catalog-header');

    if (!header) return;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
    }, { passive: true });
  };

  // Adapt quality based on network
  const adaptToNetwork = () => {
    if (isSlow) {
      document.documentElement.classList.add('save-data');
    }

    if (connection.saveData) {
      document.documentElement.classList.add('save-data');
    }
  };

  // Service worker registration
  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  };

  // Viewport-aware section loading
  const setupContentVisibility = () => {
    const sections = document.querySelectorAll('.section, .tab-section:not(.active)');
    sections.forEach(section => {
      if (!section.style.contentVisibility) {
        section.style.contentVisibility = 'auto';
        section.style.containIntrinsicSize = 'auto 500px';
      }
    });
  };

  // Initialize
  const init = () => {
    addResourceHints();
    optimizeImages();
    optimizeScroll();
    adaptToNetwork();
    setupContentVisibility();

    // Defer non-critical setup
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setupScrollReveal();
        registerServiceWorker();
      });
    } else {
      setTimeout(() => {
        setupScrollReveal();
        registerServiceWorker();
      }, 200);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-optimize after dynamic content loads
  window.InnerGarden = window.InnerGarden || {};
  window.InnerGarden.optimizeImages = optimizeImages;
  window.InnerGarden.setupScrollReveal = setupScrollReveal;
})();
