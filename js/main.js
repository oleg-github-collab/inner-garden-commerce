/* Inner Garden – Core UI interactions */
(function () {
  'use strict';

  const READY_STATES = ['interactive', 'complete'];

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const smoothScrollTo = (target) => {
    if (!target) return;
    const supportsSmooth = !prefersReducedMotion();

    if (target === document.body || target === document.documentElement) {
      window.scrollTo({ top: 0, behavior: supportsSmooth ? 'smooth' : 'auto' });
      return;
    }

    target.scrollIntoView({ behavior: supportsSmooth ? 'smooth' : 'auto', block: 'start' });
  };

  const initAnchorNavigation = () => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const hash = anchor.getAttribute('href');
        if (!hash || hash === '#') {
          return;
        }

        const destination = document.querySelector(hash);
        if (!destination) {
          return;
        }

        event.preventDefault();
        smoothScrollTo(destination);

        const mobileMenu = document.getElementById('mobile-menu');
        const toggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenu?.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          document.body.classList.remove('no-scroll');
          toggle?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  const initHeaderState = () => {
    const header = document.getElementById('header');
    if (!header) return;

    const backToTop = document.getElementById('back-to-top');
    const toggleState = () => {
      const currentScroll = window.scrollY || window.pageYOffset;
      header.classList.toggle('scrolled', currentScroll > 12);
      if (backToTop) {
        backToTop.classList.toggle('visible', currentScroll > 600);
      }
    };

    toggleState();
    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(toggleState);
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', (event) => {
        event.preventDefault();
        smoothScrollTo(document.body);
      });
    }
  };

  const initMobileMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const toggle = document.getElementById('mobile-menu-toggle');

    if (!mobileMenu || !toggle) {
      return;
    }

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('no-scroll');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      mobileMenu.classList.add('open');
      document.body.classList.add('no-scroll');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.addEventListener('click', (event) => {
      if (event.target === mobileMenu) {
        closeMenu();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  };

  const loadImage = (image) => {
    if (!(image instanceof HTMLImageElement)) {
      return;
    }

    const { src, srcset, sizes } = image.dataset;
    if (src) {
      image.src = src;
      delete image.dataset.src;
    }
    if (srcset) {
      image.srcset = srcset;
      delete image.dataset.srcset;
    }
    if (sizes) {
      image.sizes = sizes;
      delete image.dataset.sizes;
    }
    image.classList.remove('lazy-image');
  };

  const initLazyLoading = () => {
    const images = document.querySelectorAll('img.lazy-image');
    if (!images.length) {
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          loadImage(entry.target);
          observerInstance.unobserve(entry.target);
        });
      }, {
        rootMargin: '150px 0px',
        threshold: 0.01
      });

      images.forEach((image) => observer.observe(image));
      return;
    }

    // Fallback for older browsers
    images.forEach(loadImage);
  };

  const initMeditationModal = () => {
    const trigger = document.getElementById('meditation-play-btn');
    const modal = document.getElementById('meditation-modal');
    if (!trigger || !modal) return;

    const closeButton = modal.querySelector('#meditation-modal-close');
    const video = modal.querySelector('#meditation-video');
    const audio = modal.querySelector('#meditation-audio');

    const openModal = () => {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => void 0);
      }
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => void 0);
      }
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (video) {
        video.pause();
      }
      if (audio) {
        audio.pause();
      }
    };

    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');

    trigger.addEventListener('click', openModal);
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });

    closeButton?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  };

  const initStoryModal = () => {
    const trigger = document.getElementById('share-story-btn');
    const modal = document.getElementById('story-modal');
    if (!trigger || !modal) return;

    const closeButton = document.getElementById('story-modal-close');
    const form = document.getElementById('story-form');

    const openModal = () => {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', openModal);
    closeButton?.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      form.reset();
      closeModal();
      window.setTimeout(() => {
        const successMessage = typeof window.t === 'function'
          ? window.t('story-form-success')
          : 'Thank you for your story!';
        window.alert(successMessage);
      }, 200);
    });
  };

  const highlightNavOnScroll = () => {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    if (!sections.length || !navLinks.length) {
      return;
    }

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const target = link.getAttribute('href');
        if (target === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0.01
    });

    sections.forEach((section) => observer.observe(section));
  };

  const init = () => {
    initAnchorNavigation();
    initHeaderState();
    initMobileMenu();
    initLazyLoading();
    initMeditationModal();
    initStoryModal();
    highlightNavOnScroll();
  };

  if (READY_STATES.includes(document.readyState)) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();
