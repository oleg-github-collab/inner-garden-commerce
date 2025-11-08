/* Inner Garden - Ultra Fast Initialization */
(function() {
  'use strict';

  // Performance optimization
  const perf = window.performance;
  const startTime = perf.now();

  // Critical CSS loaded inline, defer non-critical
  const deferStyles = () => {
    const styles = [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];

    styles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = function() { this.media = 'all'; };
      document.head.appendChild(link);
    });
  };

  // Lazy load images
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            if (img.dataset.src) {
              img.src = img.dataset.src;
            }

            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        if (img.dataset.src) img.src = img.dataset.src;
      });
    }
  };

  // Optimize scroll performance
  let ticking = false;
  const optimizedScroll = (callback) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Header scroll behavior
  const initHeaderScroll = () => {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    const updateHeader = () => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', () => {
      optimizedScroll(updateHeader);
    }, { passive: true });
  };

  // Back to top button
  const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleBtn = () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', () => {
      optimizedScroll(toggleBtn);
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // Mobile menu
  const initMobileMenu = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };

    const openMenu = () => {
      menu.classList.add('open');
      document.body.classList.add('no-scroll');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking links
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  };

  // Smooth scroll for anchor links
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          document.body.classList.remove('no-scroll');
        }
      });
    });
  };

  // Reveal on scroll animations
  const initScrollReveal = () => {
    const elements = document.querySelectorAll(`
      .hero-title,
      .hero-subtitle,
      .hero-description,
      .hero-buttons,
      .hero-image,
      .collection-item,
      .artwork-card,
      .story-card,
      .timeline-item
    `);

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
      });

      // Add revealed class styling
      const style = document.createElement('style');
      style.textContent = `
        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Toast notification system
  window.showToast = (message, duration = 3000) => {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // Form validation helper
  window.validateForm = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });

    return isValid;
  };

  // Initialize everything after DOM is ready
  const init = () => {
    // Defer non-critical styles
    deferStyles();

    // Initialize features
    lazyLoadImages();
    initHeaderScroll();
    initBackToTop();
    initMobileMenu();
    initSmoothScroll();

    // Wait a bit for animations
    setTimeout(() => {
      initScrollReveal();
    }, 300);

    // Log performance
    const loadTime = perf.now() - startTime;
    console.log(`🚀 Site initialized in ${loadTime.toFixed(2)}ms`);
  };

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export utilities
  window.InnerGarden = {
    showToast: window.showToast,
    validateForm: window.validateForm
  };

})();
