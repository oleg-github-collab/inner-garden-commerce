// Inner Garden - Custom Cursor System

class CustomCursor {
  constructor() {
    this.cursor = {
      dot: null,
      outline: null,
      text: null
    };
    
    this.mousePosition = { x: 0, y: 0 };
    this.cursorPosition = { x: 0, y: 0 };
    this.isHovering = false;
    this.isClicking = false;
    this.currentText = '';
    
    this.init();
  }

  init() {
    // Check if device supports hover (desktop)
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      console.log('Touch device detected - skipping custom cursor');
      return;
    }

    // Don't initialize cursor if preloader is active
    const preloader = document.getElementById('preloader');
    if (preloader && getComputedStyle(preloader).display !== 'none') {
      console.log('Preloader active - delaying cursor initialization');
      // Wait for preloader to hide
      this.waitForPreloaderHide();
      return;
    }

    this.createCursor();
    this.bindEvents();
    this.animateCursor();
  }

  waitForPreloaderHide() {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      this.createCursor();
      this.bindEvents();
      this.animateCursor();
      return;
    }

    // Watch for preloader to hide
    const observer = new MutationObserver(() => {
      if (getComputedStyle(preloader).display === 'none' ||
          getComputedStyle(preloader).opacity === '0') {
        console.log('Preloader hidden - initializing cursor');
        observer.disconnect();
        this.createCursor();
        this.bindEvents();
        this.animateCursor();
      }
    });

    observer.observe(preloader, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Also listen for custom events
    window.addEventListener('preloaderComplete', () => {
      console.log('Preloader complete event - initializing cursor');
      observer.disconnect();
      setTimeout(() => {
        this.createCursor();
        this.bindEvents();
        this.animateCursor();
      }, 500);
    });
  }

  createCursor() {
    const container = document.querySelector('.cursor-container');
    if (!container) {
      console.error('Cursor container not found!');
      return;
    }

    this.cursor.dot = container.querySelector('.cursor-dot');
    this.cursor.outline = container.querySelector('.cursor-outline');
    this.cursor.text = container.querySelector('.cursor-text');

    if (!this.cursor.dot || !this.cursor.outline || !this.cursor.text) {
      console.error('Cursor elements not found!');
      return;
    }

    // Hide default cursor ONLY after preloader is hidden
    document.body.classList.add('cursor-enabled');
    console.log('Custom cursor initialized successfully');
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    // Mouse down/up
    document.addEventListener('mousedown', () => {
      this.isClicking = true;
      document.body.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
      this.isClicking = false;
      document.body.classList.remove('cursor-click');
    });

    // Hover elements
    this.bindHoverElements();
  }

  bindHoverElements() {
    const hoverElements = document.querySelectorAll(`
      a, button, .interactive, input, textarea, 
      .artwork-card, .quiz-option, .filter-btn, 
      .story-card, .roi-stat, .meditation-play-btn,
      .lang-btn, .mobile-menu-toggle, .scroll-indicator
    `);

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.onElementHover(element);
      });

      element.addEventListener('mouseleave', () => {
        this.onElementLeave();
      });
    });

    // Special text cursor behaviors
    this.bindTextCursors();
  }

  bindTextCursors() {
    // Artwork cards with quotes
    document.querySelectorAll('.artwork-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.showText('View AR');
      });
    });

    // Quiz options
    document.querySelectorAll('.quiz-option').forEach(option => {
      option.addEventListener('mouseenter', () => {
        this.showText('Select');
      });
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.showText('Navigate');
      });
    });

    // Buttons with specific actions
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        const text = btn.textContent.trim();
        this.showText(text.length > 15 ? 'Click' : text);
      });
    });

    // Meditation start button
    document.querySelector('#meditation-play-btn')?.addEventListener('mouseenter', () => {
      this.showText('Start Journey');
    });

    // Scroll indicator
    document.querySelector('.scroll-indicator')?.addEventListener('mouseenter', () => {
      this.showText('Scroll Down');
    });
  }

  onElementHover(element) {
    this.isHovering = true;
    document.body.classList.add('cursor-hover');

    // Different hover styles for different elements
    if (element.classList.contains('artwork-card')) {
      this.cursor.outline.style.width = '80px';
      this.cursor.outline.style.height = '80px';
      this.cursor.outline.style.borderColor = '#e67e22';
    } else if (element.classList.contains('btn-primary')) {
      this.cursor.outline.style.width = '60px';
      this.cursor.outline.style.height = '60px';
      this.cursor.outline.style.borderColor = '#f39c12';
    } else {
      this.cursor.outline.style.width = '50px';
      this.cursor.outline.style.height = '50px';
      this.cursor.outline.style.borderColor = '#e67e22';
    }
  }

  onElementLeave() {
    this.isHovering = false;
    document.body.classList.remove('cursor-hover');
    this.hideText();
    
    // Reset outline size
    this.cursor.outline.style.width = '40px';
    this.cursor.outline.style.height = '40px';
    this.cursor.outline.style.borderColor = '#e67e22';
  }

  showText(text) {
    if (this.cursor.text && text) {
      this.currentText = text;
      this.cursor.text.textContent = text;
      document.body.classList.add('cursor-text-visible');
    }
  }

  hideText() {
    this.currentText = '';
    document.body.classList.remove('cursor-text-visible');
  }

  animateCursor() {
    // Smooth cursor movement with easing
    const ease = 0.15;
    
    this.cursorPosition.x += (this.mousePosition.x - this.cursorPosition.x) * ease;
    this.cursorPosition.y += (this.mousePosition.y - this.cursorPosition.y) * ease;

    // Update cursor position
    if (this.cursor.dot) {
      this.cursor.dot.style.left = this.mousePosition.x + 'px';
      this.cursor.dot.style.top = this.mousePosition.y + 'px';
    }

    if (this.cursor.outline) {
      this.cursor.outline.style.left = this.cursorPosition.x + 'px';
      this.cursor.outline.style.top = this.cursorPosition.y + 'px';
    }

    if (this.cursor.text) {
      this.cursor.text.style.left = this.cursorPosition.x + 'px';
      this.cursor.text.style.top = this.cursorPosition.y + 'px';
    }

    requestAnimationFrame(() => this.animateCursor());
  }

  // Public methods for dynamic elements
  addHoverElement(element, text = '') {
    element.addEventListener('mouseenter', () => {
      this.onElementHover(element);
      if (text) this.showText(text);
    });

    element.addEventListener('mouseleave', () => {
      this.onElementLeave();
    });
  }

  updateHoverElements() {
    // Re-bind hover elements for dynamically added content
    this.bindHoverElements();
  }
}

// Special cursor effects for different sections
class CursorEffects {
  constructor(cursor) {
    this.cursor = cursor;
    this.init();
  }

  init() {
    this.bindSectionEffects();
  }

  bindSectionEffects() {
    // Artwork section - special glow effect
    const artworkSection = document.querySelector('#artworks');
    if (artworkSection) {
      artworkSection.addEventListener('mouseenter', () => {
        if (this.cursor.cursor.dot) {
          this.cursor.cursor.dot.style.boxShadow = '0 0 20px #e67e22, 0 0 10px #f39c12';
        }
      });

      artworkSection.addEventListener('mouseleave', () => {
        if (this.cursor.cursor.dot) {
          this.cursor.cursor.dot.style.boxShadow = '0 0 10px #e67e22, 0 0 5px #e67e22';
        }
      });
    }

    // Meditation section - calm effect
    const meditationSection = document.querySelector('#meditation');
    if (meditationSection) {
      meditationSection.addEventListener('mouseenter', () => {
        if (this.cursor.cursor.outline) {
          this.cursor.cursor.outline.style.transition = 'all 0.8s ease';
          this.cursor.cursor.outline.style.opacity = '0.3';
        }
      });

      meditationSection.addEventListener('mouseleave', () => {
        if (this.cursor.cursor.outline) {
          this.cursor.cursor.outline.style.transition = 'all 0.3s ease';
          this.cursor.cursor.outline.style.opacity = '1';
        }
      });
    }

    // Business section - professional effect
    const businessSection = document.querySelector('#business');
    if (businessSection) {
      businessSection.addEventListener('mouseenter', () => {
        if (this.cursor.cursor.outline) {
          this.cursor.cursor.outline.style.borderColor = '#2c3e50';
        }
        if (this.cursor.cursor.dot) {
          this.cursor.cursor.dot.style.backgroundColor = '#2c3e50';
        }
      });

      businessSection.addEventListener('mouseleave', () => {
        if (this.cursor.cursor.outline) {
          this.cursor.cursor.outline.style.borderColor = '#e67e22';
        }
        if (this.cursor.cursor.dot) {
          this.cursor.cursor.dot.style.backgroundColor = '#e67e22';
        }
      });
    }
  }
}

// Initialize cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const cursor = new CustomCursor();
  const cursorEffects = new CursorEffects(cursor);
  
  // Make cursor available globally for dynamic content
  window.customCursor = cursor;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CustomCursor, CursorEffects };
}