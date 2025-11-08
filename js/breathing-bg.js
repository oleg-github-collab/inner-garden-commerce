// Inner Garden - Breathing Background Animation

class BreathingBackground {
  constructor() {
    this.container = null;
    this.elements = [];
    this.isVisible = true;
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.container = document.querySelector('.breathing-background');
    if (!this.container) {
      this.createBackground();
    }
    
    this.bindEvents();
    this.startAnimation();
    this.setupPerformanceOptimization();
  }

  createBackground() {
    // Create breathing background container
    const container = document.createElement('div');
    container.className = 'breathing-background';
    container.id = 'breathing-background';
    
    // Create SVG with breathing elements
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'breathing-svg');
    svg.setAttribute('viewBox', '0 0 1920 1080');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Create gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    const gradient1 = this.createRadialGradient('breathGradient1', '50%', '50%', '50%', [
      { offset: '0%', color: '#e67e22', opacity: 0.1 },
      { offset: '100%', color: '#f39c12', opacity: 0.05 }
    ]);
    
    const gradient2 = this.createRadialGradient('breathGradient2', '30%', '70%', '40%', [
      { offset: '0%', color: '#2c3e50', opacity: 0.08 },
      { offset: '100%', color: '#34495e', opacity: 0.03 }
    ]);

    const gradient3 = this.createRadialGradient('breathGradient3', '70%', '30%', '35%', [
      { offset: '0%', color: '#27ae60', opacity: 0.06 },
      { offset: '100%', color: '#2ecc71', opacity: 0.02 }
    ]);

    defs.appendChild(gradient1);
    defs.appendChild(gradient2);
    defs.appendChild(gradient3);
    svg.appendChild(defs);

    // Create breathing elements
    const elements = [
      this.createElement('circle', {
        class: 'breath-element breath-1',
        cx: '960',
        cy: '540',
        r: '300',
        fill: 'url(#breathGradient1)'
      }),
      this.createElement('circle', {
        class: 'breath-element breath-2',
        cx: '576',
        cy: '756',
        r: '200',
        fill: 'url(#breathGradient2)'
      }),
      this.createElement('circle', {
        class: 'breath-element breath-3',
        cx: '1344',
        cy: '324',
        r: '150',
        fill: 'url(#breathGradient3)'
      }),
      this.createElement('path', {
        class: 'breath-element breath-4',
        d: 'M400,400 Q600,200 800,400 T1200,400',
        stroke: '#e67e22',
        'stroke-width': '2',
        fill: 'none',
        opacity: '0.3'
      }),
      this.createElement('path', {
        class: 'breath-element breath-5',
        d: 'M200,800 Q400,600 600,800 T1000,800',
        stroke: '#27ae60',
        'stroke-width': '1.5',
        fill: 'none',
        opacity: '0.2'
      })
    ];

    elements.forEach(element => {
      svg.appendChild(element);
      this.elements.push(element);
    });

    container.appendChild(svg);
    document.body.insertBefore(container, document.body.firstChild);
    this.container = container;
  }

  createRadialGradient(id, cx, cy, r, stops) {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', id);
    gradient.setAttribute('cx', cx);
    gradient.setAttribute('cy', cy);
    gradient.setAttribute('r', r);

    stops.forEach(stop => {
      const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stopElement.setAttribute('offset', stop.offset);
      stopElement.setAttribute('style', `stop-color:${stop.color};stop-opacity:${stop.opacity}`);
      gradient.appendChild(stopElement);
    });

    return gradient;
  }

  createElement(type, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', type);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  startAnimation() {
    // Use CSS animations for better performance
    if (this.container) {
      this.container.classList.add('animated');
    }

    // Add additional JavaScript-driven animations for more complex effects
    this.animateParticles();
  }

  animateParticles() {
    let time = 0;
    
    const animate = () => {
      if (!this.isVisible) {
        this.animationId = requestAnimationFrame(animate);
        return;
      }

      time += 0.01;

      this.elements.forEach((element, index) => {
        if (element.tagName === 'circle') {
          const baseR = parseFloat(element.getAttribute('r'));
          const variation = Math.sin(time + index) * 0.1 + 1;
          const newR = baseR * variation;
          
          element.setAttribute('r', newR.toString());
          
          // Subtle position changes
          const baseCx = index === 0 ? 960 : index === 1 ? 576 : 1344;
          const baseCy = index === 0 ? 540 : index === 1 ? 756 : 324;
          
          const offsetX = Math.sin(time * 0.5 + index) * 10;
          const offsetY = Math.cos(time * 0.3 + index) * 8;
          
          element.setAttribute('cx', (baseCx + offsetX).toString());
          element.setAttribute('cy', (baseCy + offsetY).toString());
        } else if (element.tagName === 'path') {
          // Animate path opacity
          const baseOpacity = index === 3 ? 0.3 : 0.2;
          const newOpacity = baseOpacity * (0.5 + Math.sin(time + index) * 0.5);
          element.setAttribute('opacity', newOpacity.toString());
        }
      });

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  setupPerformanceOptimization() {
    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (!this.isVisible && this.container) {
        this.container.style.animationPlayState = 'paused';
      } else if (this.container) {
        this.container.style.animationPlayState = 'running';
      }
    });

    // Reduce animation complexity on lower-end devices
    this.detectDeviceCapability();
    
    // Pause animations during scroll for better performance
    this.setupScrollOptimization();
  }

  detectDeviceCapability() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check device memory (if available)
    const lowEndDevice = navigator.deviceMemory && navigator.deviceMemory <= 2;
    
    // Check connection type
    const slowConnection = navigator.connection && 
      (navigator.connection.effectiveType === 'slow-2g' || 
       navigator.connection.effectiveType === '2g');

    if (prefersReducedMotion || lowEndDevice || slowConnection || !gl) {
      this.reduceAnimationComplexity();
    }
  }

  reduceAnimationComplexity() {
    if (this.container) {
      this.container.style.opacity = '0.3';
      
      // Remove complex animations
      this.elements.forEach(element => {
        element.style.animation = 'none';
      });
      
      // Cancel JavaScript animations
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  setupScrollOptimization() {
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
      if (!isScrolling && this.container) {
        isScrolling = true;
        this.container.style.animationPlayState = 'paused';
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        if (this.container && this.isVisible) {
          this.container.style.animationPlayState = 'running';
        }
      }, 100);
    });
  }

  bindEvents() {
    // Intersection Observer to pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === this.container) {
          this.isVisible = entry.isIntersecting;
        }
      });
    });

    if (this.container) {
      observer.observe(this.container);
    }

    // Window focus/blur events
    window.addEventListener('focus', () => {
      this.isVisible = true;
    });

    window.addEventListener('blur', () => {
      this.isVisible = false;
    });
  }

  // Public methods
  show() {
    if (this.container) {
      this.container.style.opacity = '0.6';
      this.isVisible = true;
    }
  }

  hide() {
    if (this.container) {
      this.container.style.opacity = '0';
      this.isVisible = false;
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.container) {
      this.container.remove();
    }
  }

  // Dynamic breathing intensity based on user interaction
  setIntensity(intensity) {
    if (this.container) {
      const normalizedIntensity = Math.max(0.1, Math.min(1, intensity));
      this.container.style.opacity = (0.2 + normalizedIntensity * 0.4).toString();
      
      // Adjust animation speed
      this.elements.forEach((element, index) => {
        const duration = 10 / normalizedIntensity;
        element.style.animationDuration = `${duration}s`;
      });
    }
  }
}

// Breathing pattern controller
class BreathingController {
  constructor(background) {
    this.background = background;
    this.currentMood = 'calm';
    this.patterns = {
      calm: { intensity: 0.3, speed: 1 },
      focused: { intensity: 0.5, speed: 1.2 },
      energetic: { intensity: 0.8, speed: 1.5 },
      relaxed: { intensity: 0.2, speed: 0.8 }
    };
  }

  setMood(mood) {
    if (this.patterns[mood]) {
      this.currentMood = mood;
      const pattern = this.patterns[mood];
      this.background.setIntensity(pattern.intensity);
    }
  }

  adaptToSection(sectionId) {
    const moodMap = {
      'hero': 'calm',
      'artworks': 'focused',
      'meditation': 'relaxed',
      'business': 'focused',
      'quiz': 'energetic'
    };

    const mood = moodMap[sectionId] || 'calm';
    this.setMood(mood);
  }
}

// Initialize breathing background
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on desktop for performance
  if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const breathingBg = new BreathingBackground();
    const controller = new BreathingController(breathingBg);
    
    // Make available globally
    window.breathingBackground = breathingBg;
    window.breathingController = controller;
    
    // Adapt to current section on scroll
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          controller.adaptToSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BreathingBackground, BreathingController };
}