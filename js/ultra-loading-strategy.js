// Ultra Loading Strategy - Lightning Fast Page Loading with Intelligent Prioritization
// Advanced loading orchestration for maximum perceived and actual performance

class UltraLoadingStrategy {
  constructor() {
    this.loadPhases = {
      critical: [],
      important: [],
      normal: [],
      deferred: []
    };
    this.loadedPhases = new Set();
    this.isInitialized = false;
    this.performanceTimings = {};
    this.userEngagement = {
      hasScrolled: false,
      hasInteracted: false,
      timeOnPage: 0,
      idleTime: 0
    };

    this.init();
  }

  async init() {
    this.measureInitialPerformance();
    this.setupPhases();
    this.setupUserEngagementTracking();
    this.startLoadingOrchestration();

    console.log('🎯 Ultra Loading Strategy activated - maximum performance enabled');
  }

  // =====================================================
  // LOADING PHASES DEFINITION
  // =====================================================

  setupPhases() {
    // PHASE 1: CRITICAL (0-100ms) - Immediate visual response
    this.loadPhases.critical = [
      {
        name: 'preloader',
        action: () => this.initializePreloader(),
        priority: 'immediate'
      },
      {
        name: 'critical-css',
        action: () => this.inlineCriticalCSS(),
        priority: 'immediate'
      },
      {
        name: 'language-system',
        action: () => this.initializeLanguageSystem(),
        priority: 'immediate'
      },
      {
        name: 'state-management',
        action: () => this.initializeStateManagement(),
        priority: 'immediate'
      }
    ];

    // PHASE 2: IMPORTANT (100-500ms) - Core functionality
    this.loadPhases.important = [
      {
        name: 'hero-content',
        action: () => this.loadHeroContent(),
        priority: 'high'
      },
      {
        name: 'navigation',
        action: () => this.initializeNavigation(),
        priority: 'high'
      },
      {
        name: 'critical-images',
        action: () => this.loadCriticalImages(),
        priority: 'high'
      },
      {
        name: 'performance-monitoring',
        action: () => this.initializePerformanceMonitoring(),
        priority: 'high'
      }
    ];

    // PHASE 3: NORMAL (500ms-2s) - Enhanced functionality
    this.loadPhases.normal = [
      {
        name: 'interactive-elements',
        action: () => this.loadInteractiveElements(),
        priority: 'normal'
      },
      {
        name: 'animation-systems',
        action: () => this.initializeAnimations(),
        priority: 'normal'
      },
      {
        name: 'form-validation',
        action: () => this.initializeFormValidation(),
        priority: 'normal'
      },
      {
        name: 'analytics',
        action: () => this.initializeAnalytics(),
        priority: 'normal'
      }
    ];

    // PHASE 4: DEFERRED (2s+) - Nice-to-have features
    this.loadPhases.deferred = [
      {
        name: 'ar-viewer',
        action: () => this.loadARViewer(),
        priority: 'low'
      },
      {
        name: 'social-widgets',
        action: () => this.loadSocialWidgets(),
        priority: 'low'
      },
      {
        name: 'advanced-animations',
        action: () => this.loadAdvancedAnimations(),
        priority: 'low'
      },
      {
        name: 'chat-widget',
        action: () => this.loadChatWidget(),
        priority: 'low'
      }
    ];
  }

  // =====================================================
  // LOADING ORCHESTRATION
  // =====================================================

  async startLoadingOrchestration() {
    const startTime = performance.now();

    try {
      // Phase 1: Critical (immediate)
      await this.executePhase('critical', 0);

      // Phase 2: Important (after critical)
      setTimeout(() => this.executePhase('important', 100), 100);

      // Phase 3: Normal (after user interaction or timeout)
      this.scheduleNormalPhase();

      // Phase 4: Deferred (when idle or after delay)
      this.scheduleDeferredPhase();

      const totalTime = performance.now() - startTime;
      console.log(`⚡ Loading orchestration complete in ${totalTime.toFixed(1)}ms`);

    } catch (error) {
      console.error('❌ Loading orchestration failed:', error);
      this.fallbackLoading();
    }
  }

  async executePhase(phaseName, delay = 0) {
    if (this.loadedPhases.has(phaseName)) return;

    const phase = this.loadPhases[phaseName];
    if (!phase || phase.length === 0) return;

    console.log(`🔄 Executing ${phaseName} phase (${phase.length} tasks)`);
    const phaseStartTime = performance.now();

    try {
      // Execute all tasks in phase
      const promises = phase.map(async (task) => {
        try {
          const taskStartTime = performance.now();
          await task.action();
          const taskTime = performance.now() - taskStartTime;
          console.log(`✅ ${task.name} completed in ${taskTime.toFixed(1)}ms`);
        } catch (error) {
          console.error(`❌ Task ${task.name} failed:`, error);
        }
      });

      await Promise.allSettled(promises);

      const phaseTime = performance.now() - phaseStartTime;
      this.loadedPhases.add(phaseName);
      this.performanceTimings[phaseName] = phaseTime;

      console.log(`✨ ${phaseName} phase completed in ${phaseTime.toFixed(1)}ms`);

    } catch (error) {
      console.error(`❌ Phase ${phaseName} execution failed:`, error);
    }
  }

  scheduleNormalPhase() {
    // Load normal phase when user shows engagement
    const loadNormal = () => {
      if (!this.loadedPhases.has('normal')) {
        this.executePhase('normal', 500);
      }
    };

    // Triggers for normal phase
    const triggers = [
      () => this.userEngagement.hasScrolled,
      () => this.userEngagement.hasInteracted,
      () => this.userEngagement.timeOnPage > 2000 // 2 seconds
    ];

    // Check triggers every 100ms
    const checkTriggers = () => {
      if (triggers.some(trigger => trigger())) {
        loadNormal();
        return;
      }
      setTimeout(checkTriggers, 100);
    };

    // Fallback: load after 3 seconds regardless
    setTimeout(loadNormal, 3000);
    checkTriggers();
  }

  scheduleDeferredPhase() {
    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.executePhase('deferred', 2000);
      }, { timeout: 5000 });
    } else {
      // Fallback: load after 5 seconds
      setTimeout(() => {
        this.executePhase('deferred', 2000);
      }, 5000);
    }
  }

  // =====================================================
  // PHASE IMPLEMENTATIONS
  // =====================================================

  async initializePreloader() {
    // Show preloader instantly
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'flex';
      preloader.style.opacity = '1';
    }

    // Initialize language selection
    if (window.ultraI18n) {
      window.ultraI18n.updateLanguageInterface();
    }
  }

  async inlineCriticalCSS() {
    // Critical CSS is already inlined in HTML head
    // This ensures it's processed immediately
    const criticalStyles = document.querySelector('style[data-critical]');
    if (criticalStyles) {
      console.log('🎨 Critical CSS processed');
    }
  }

  async initializeLanguageSystem() {
    // Ultra I18n should already be loaded
    if (window.ultraI18n && window.ultraI18n.isReady) {
      window.ultraI18n.updateAllContent();
    }
  }

  async initializeStateManagement() {
    // State manager should already be initialized
    if (window.stateManager) {
      window.stateManager.setState('app.isInitialized', true);
    }
  }

  async loadHeroContent() {
    // Preload hero image with high priority
    if (window.ultraResourceLoader) {
      await window.ultraResourceLoader.loadImage('assets/images/hero-artwork.jpg', {
        priority: 'high',
        critical: true
      });
    }

    // Initialize hero animations
    this.initializeHeroAnimations();
  }

  async initializeNavigation() {
    // Setup navigation event listeners
    this.setupNavigationListeners();

    // Load navigation icons
    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.preloadResource(
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        'style',
        'high'
      );
    }
  }

  async loadCriticalImages() {
    const criticalImages = [
      'assets/images/logo.png',
      'assets/images/favicon.ico'
    ];

    if (window.ultraResourceLoader) {
      await window.ultraResourceLoader.loadBatch(
        criticalImages.map(url => ({ url, type: 'image' })),
        { priority: 'high', concurrency: 3 }
      );
    }
  }

  async initializePerformanceMonitoring() {
    // Ultra Performance Optimizer should be running
    if (window.ultraPerformanceOptimizer) {
      console.log('📊 Performance monitoring active');
    }
  }

  async loadInteractiveElements() {
    // Initialize form elements
    this.setupFormInteractions();

    // Setup scroll effects
    this.setupScrollEffects();

    // Initialize tooltips and popovers
    this.initializeTooltips();
  }

  async initializeAnimations() {
    // Load GSAP if needed
    if (typeof gsap === 'undefined') {
      await window.ultraResourceLoader.loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
      );
    }

    // Initialize scroll-triggered animations
    this.setupScrollAnimations();
  }

  async initializeFormValidation() {
    // Ultra form validator should handle this
    if (window.ultraFormValidator) {
      window.ultraFormValidator.initializeAll();
    }
  }

  async initializeAnalytics() {
    // Load analytics scripts (non-blocking)
    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.loadScript('js/analytics.js', {
        priority: 'low',
        async: true
      });
    }
  }

  async loadARViewer() {
    // Load AR.js only when needed
    if (window.ultraResourceLoader) {
      await window.ultraResourceLoader.loadScript('js/simple-ar-viewer.js', {
        priority: 'low'
      });
    }
  }

  async loadSocialWidgets() {
    // Load social media widgets
    const socialScripts = [
      'https://platform.twitter.com/widgets.js',
      'https://connect.facebook.net/en_US/sdk.js'
    ];

    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.loadBatch(
        socialScripts.map(url => ({ url, type: 'script' })),
        { priority: 'low', concurrency: 2 }
      );
    }
  }

  async loadAdvancedAnimations() {
    // Load advanced animation libraries
    if (window.ultraResourceLoader) {
      await window.ultraResourceLoader.loadScript('js/advanced-animations.js', {
        priority: 'low'
      });
    }
  }

  async loadChatWidget() {
    // Load chat widget script
    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.loadScript('js/chat-widget.js', {
        priority: 'low'
      });
    }
  }

  // =====================================================
  // USER ENGAGEMENT TRACKING
  // =====================================================

  setupUserEngagementTracking() {
    const startTime = Date.now();

    // Track scrolling
    window.addEventListener('scroll', () => {
      if (!this.userEngagement.hasScrolled) {
        this.userEngagement.hasScrolled = true;
        console.log('👆 User scrolled - triggering normal phase');
      }
    }, { once: true });

    // Track interactions
    const interactionEvents = ['click', 'touchstart', 'keydown', 'mousemove'];
    interactionEvents.forEach(event => {
      window.addEventListener(event, () => {
        if (!this.userEngagement.hasInteracted) {
          this.userEngagement.hasInteracted = true;
          console.log('👆 User interacted - triggering normal phase');
        }
      }, { once: true });
    });

    // Track time on page
    setInterval(() => {
      this.userEngagement.timeOnPage = Date.now() - startTime;
    }, 1000);

    // Track idle time
    this.setupIdleTracking();
  }

  setupIdleTracking() {
    let idleTimer;
    const idleTime = 30000; // 30 seconds

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      this.userEngagement.idleTime = 0;

      idleTimer = setTimeout(() => {
        this.userEngagement.idleTime = idleTime;
        console.log('😴 User idle - deferring heavy resources');
      }, idleTime);
    };

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetIdleTimer, true);
    });

    resetIdleTimer();
  }

  // =====================================================
  // HELPER IMPLEMENTATIONS
  // =====================================================

  initializeHeroAnimations() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.classList.add('animate-fade-in');
    }
  }

  setupNavigationListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', this.toggleMobileMenu);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', this.handleSmoothScroll);
    });
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
    }
  }

  handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setupFormInteractions() {
    // Enhanced form focusing
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.closest('.form-group')?.classList.add('focused');
      });

      input.addEventListener('blur', (e) => {
        e.target.closest('.form-group')?.classList.remove('focused');
      });
    });
  }

  setupScrollEffects() {
    // Parallax effects for hero
    window.addEventListener('scroll', this.handleParallaxScroll);

    // Update scroll progress
    window.addEventListener('scroll', this.updateScrollProgress);
  }

  handleParallaxScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }

  updateScrollProgress() {
    const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    if (window.stateManager) {
      window.stateManager.setState('ui.scrollProgress', scrollProgress);
    }
  }

  initializeTooltips() {
    // Simple tooltip system
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', this.showTooltip);
      element.addEventListener('mouseleave', this.hideTooltip);
    });
  }

  showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tooltip);

    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  setupScrollAnimations() {
    if (typeof gsap !== 'undefined') {
      // GSAP scroll animations
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.animate-on-scroll').forEach(element => {
        gsap.fromTo(element,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }

  // =====================================================
  // PERFORMANCE UTILITIES
  // =====================================================

  measureInitialPerformance() {
    this.performanceTimings.navigationStart = performance.timing.navigationStart;
    this.performanceTimings.domContentLoaded = performance.timing.domContentLoadedEventEnd;
    this.performanceTimings.loadComplete = performance.timing.loadEventEnd;

    // Mark strategy start
    performance.mark('ultra-loading-start');
  }

  fallbackLoading() {
    console.warn('🚨 Fallback loading activated');

    // Load all essential resources immediately
    const essentialResources = [
      'js/main.js',
      'css/ultra-perfect.css'
    ];

    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.loadBatch(essentialResources, {
        priority: 'high',
        concurrency: 4
      });
    }
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  getLoadingStats() {
    return {
      loadedPhases: Array.from(this.loadedPhases),
      performanceTimings: this.performanceTimings,
      userEngagement: this.userEngagement,
      isFullyLoaded: this.loadedPhases.size === Object.keys(this.loadPhases).length
    };
  }

  forceLoadPhase(phaseName) {
    if (!this.loadedPhases.has(phaseName)) {
      this.executePhase(phaseName, 0);
    }
  }

  preloadNextPageResources(urls) {
    if (window.ultraResourceLoader) {
      window.ultraResourceLoader.prefetch(urls);
    }
  }
}

// Initialize loading strategy
window.ultraLoadingStrategy = new UltraLoadingStrategy();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraLoadingStrategy;
}