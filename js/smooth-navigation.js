/* Inner Garden - Smooth Navigation & UX Enhancements */
(function() {
  'use strict';

  // ========================================
  // SMOOTH SCROLL TO ANCHORS
  // ========================================
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip empty anchors
        if (href === '#' || href === '#!') {
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();

          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
          }

          // Smooth scroll to target
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }

          // Focus target for accessibility
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
            targetElement.removeAttribute('tabindex');
          }, 500);
        }
      });
    });
  }

  // ========================================
  // SCROLL SPY - Highlight active nav item
  // ========================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('a[href^="#"]');

    if (!sections.length || !navLinks.length) {
      return;
    }

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 150;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveLink();
  }

  // ========================================
  // HEADER SCROLL BEHAVIOR
  // ========================================
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollTop = 0;
    let ticking = false;

    function updateHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Add scrolled class when scrolled down
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide header on scroll down, show on scroll up (optional)
      // Uncomment if you want this behavior:
      /*
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      */

      lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateHeader();
  }

  // ========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ========================================
  function initScrollAnimations() {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });

    // Observe cards
    document.querySelectorAll('.artwork-card, .collection-item, .story-card, .quiz-card').forEach(card => {
      observer.observe(card);
    });
  }

  // ========================================
  // BACK TO TOP BUTTON
  // ========================================
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    let ticking = false;

    function updateBackToTopVisibility() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBackToTopVisibility();
          ticking = false;
        });
        ticking = true;
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    updateBackToTopVisibility();
  }

  // ========================================
  // PREFETCH LINKS ON HOVER
  // ========================================
  function initLinkPrefetch() {
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const href = this.getAttribute('href');

        // Only prefetch internal HTML pages
        if (href && href.endsWith('.html') && !href.startsWith('http')) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;

          // Check if not already prefetched
          if (!document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
            document.head.appendChild(prefetchLink);
          }
        }
      }, { once: true });
    });
  }

  // ========================================
  // PERFORMANCE: Defer offscreen images
  // ========================================
  function initImageOptimization() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }
  }

  // ========================================
  // ACCESSIBILITY: Focus trap in modals
  // ========================================
  function initModalFocusTrap() {
    const modals = document.querySelectorAll('.modal, .meditation-modal, .ar-modal');

    modals.forEach(modal => {
      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          const closeBtn = this.querySelector('.modal-close, .meditation-close-new');
          if (closeBtn) {
            closeBtn.click();
          }
        }

        // Trap focus within modal
        if (e.key === 'Tab') {
          const focusableElements = this.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          const firstFocusable = focusableElements[0];
          const lastFocusable = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    });
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  function init() {
    try {
      initSmoothScroll();
      initScrollSpy();
      initHeaderScroll();
      initScrollAnimations();
      initBackToTop();
      initLinkPrefetch();
      initImageOptimization();
      initModalFocusTrap();

      console.log('[smooth-navigation] ✓ All enhancements initialized');
    } catch (error) {
      console.error('[smooth-navigation] Initialization error:', error);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }

  // Export for potential external use
  window.smoothNavigation = {
    refresh: () => {
      initScrollSpy();
      initScrollAnimations();
    }
  };
})();
