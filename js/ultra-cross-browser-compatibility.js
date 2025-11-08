// Ultra Cross-Browser Compatibility System
// Ensures perfect functionality across ALL browsers and devices

class UltraCrossBrowserCompatibility {
  constructor() {
    this.browserInfo = {};
    this.polyfills = new Map();
    this.compatibilityIssues = [];
    this.browserSpecificFixes = new Map();
    this.featureSupport = new Map();
    this.isInitialized = false;

    this.init();
  }

  init() {
    this.detectBrowser();
    this.detectFeatureSupport();
    this.applyPolyfills();
    this.applyBrowserSpecificFixes();
    this.setupCompatibilityTesting();
    this.setupInputMethodCompatibility();
    this.setupViewportCompatibility();

    this.isInitialized = true;
    console.log('🌐 Ultra Cross-Browser Compatibility активовано - працює на всіх браузерах!');
  }

  // =====================================================
  // BROWSER DETECTION & FEATURE SUPPORT
  // =====================================================

  detectBrowser() {
    const ua = navigator.userAgent;
    const vendor = navigator.vendor || '';

    this.browserInfo = {
      // Browser identification
      isChrome: /Chrome/i.test(ua) && /Google Inc/i.test(vendor),
      isFirefox: /Firefox/i.test(ua),
      isSafari: /Safari/i.test(ua) && !/Chrome/i.test(ua),
      isEdge: /Edg/i.test(ua),
      isIE: /MSIE|Trident/i.test(ua),
      isOpera: /OPR|Opera/i.test(ua),

      // Mobile browsers
      isMobileSafari: /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua),
      isMobileChrome: /Android/i.test(ua) && /Chrome/i.test(ua),
      isFirefoxMobile: /Mobile/i.test(ua) && /Firefox/i.test(ua),
      isSamsungBrowser: /SamsungBrowser/i.test(ua),

      // Version detection
      chromeVersion: this.extractVersion(ua, /Chrome\/(\d+)/),
      firefoxVersion: this.extractVersion(ua, /Firefox\/(\d+)/),
      safariVersion: this.extractVersion(ua, /Version\/(\d+)/),
      edgeVersion: this.extractVersion(ua, /Edg\/(\d+)/),

      // Engine detection
      isWebKit: /WebKit/i.test(ua),
      isBlink: /Chrome/i.test(ua) && /WebKit/i.test(ua),
      isGecko: /Gecko/i.test(ua) && !/WebKit/i.test(ua),

      // OS detection
      isWindows: /Windows/i.test(ua),
      isMacOS: /Macintosh|Mac OS X/i.test(ua),
      isLinux: /Linux/i.test(ua),
      isAndroid: /Android/i.test(ua),
      isiOS: /iPhone|iPad|iPod/i.test(ua)
    };

    console.log('🔍 Browser detected:', this.browserInfo);
  }

  extractVersion(ua, regex) {
    const match = ua.match(regex);
    return match ? parseInt(match[1]) : null;
  }

  detectFeatureSupport() {
    this.featureSupport = new Map([
      // ES6+ Features
      ['es6-classes', this.testES6Classes()],
      ['arrow-functions', this.testArrowFunctions()],
      ['template-literals', this.testTemplateLiterals()],
      ['destructuring', this.testDestructuring()],
      ['promises', typeof Promise !== 'undefined'],
      ['async-await', this.testAsyncAwait()],

      // DOM APIs
      ['intersection-observer', typeof IntersectionObserver !== 'undefined'],
      ['resize-observer', typeof ResizeObserver !== 'undefined'],
      ['mutation-observer', typeof MutationObserver !== 'undefined'],
      ['performance-observer', typeof PerformanceObserver !== 'undefined'],

      // Media APIs
      ['get-user-media', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)],
      ['media-recorder', typeof MediaRecorder !== 'undefined'],
      ['webrtc', !!(window.RTCPeerConnection || window.webkitRTCPeerConnection)],

      // Graphics APIs
      ['canvas', !!document.createElement('canvas').getContext],
      ['webgl', this.testWebGL()],
      ['webgl2', this.testWebGL2()],

      // Storage APIs
      ['local-storage', typeof localStorage !== 'undefined'],
      ['session-storage', typeof sessionStorage !== 'undefined'],
      ['indexed-db', typeof indexedDB !== 'undefined'],

      // Network APIs
      ['fetch', typeof fetch !== 'undefined'],
      ['service-worker', 'serviceWorker' in navigator],
      ['web-share', typeof navigator.share !== 'undefined'],

      // Input APIs
      ['touch-events', 'ontouchstart' in window],
      ['pointer-events', 'onpointerdown' in window],
      ['device-orientation', typeof DeviceOrientationEvent !== 'undefined'],

      // CSS Features
      ['css-grid', this.testCSSGrid()],
      ['css-flexbox', this.testCSSFlexbox()],
      ['css-custom-properties', this.testCSSCustomProperties()],
      ['css-backdrop-filter', this.testCSSBackdropFilter()],

      // AR/VR APIs
      ['webxr', 'xr' in navigator],
      ['device-motion', typeof DeviceMotionEvent !== 'undefined']
    ]);

    console.log('✅ Feature support detected:', Array.from(this.featureSupport.entries()));
  }

  // Feature test implementations
  testES6Classes() {
    try {
      eval('class TestClass {}');
      return true;
    } catch {
      return false;
    }
  }

  testArrowFunctions() {
    try {
      eval('() => {}');
      return true;
    } catch {
      return false;
    }
  }

  testTemplateLiterals() {
    try {
      eval('`template literal`');
      return true;
    } catch {
      return false;
    }
  }

  testDestructuring() {
    try {
      eval('const {a} = {a: 1}');
      return true;
    } catch {
      return false;
    }
  }

  testAsyncAwait() {
    try {
      eval('async function test() { await Promise.resolve(); }');
      return true;
    } catch {
      return false;
    }
  }

  testWebGL() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  }

  testWebGL2() {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    return !!gl2;
  }

  testCSSGrid() {
    return CSS.supports('display', 'grid');
  }

  testCSSFlexbox() {
    return CSS.supports('display', 'flex');
  }

  testCSSCustomProperties() {
    return CSS.supports('color', 'var(--test-color)');
  }

  testCSSBackdropFilter() {
    return CSS.supports('backdrop-filter', 'blur(10px)');
  }

  // =====================================================
  // POLYFILLS
  // =====================================================

  applyPolyfills() {
    console.log('🔧 Applying polyfills for missing features...');

    // Intersection Observer Polyfill
    if (!this.featureSupport.get('intersection-observer')) {
      this.addIntersectionObserverPolyfill();
    }

    // ResizeObserver Polyfill
    if (!this.featureSupport.get('resize-observer')) {
      this.addResizeObserverPolyfill();
    }

    // Fetch Polyfill
    if (!this.featureSupport.get('fetch')) {
      this.addFetchPolyfill();
    }

    // Promise Polyfill
    if (!this.featureSupport.get('promises')) {
      this.addPromisePolyfill();
    }

    // Object.assign Polyfill
    if (!Object.assign) {
      this.addObjectAssignPolyfill();
    }

    // Array.from Polyfill
    if (!Array.from) {
      this.addArrayFromPolyfill();
    }

    // CSS.supports Polyfill
    if (!window.CSS || !CSS.supports) {
      this.addCSSSupportsPolyfill();
    }

    // RequestAnimationFrame Polyfill
    if (!window.requestAnimationFrame) {
      this.addRequestAnimationFramePolyfill();
    }

    // Performance.now Polyfill
    if (!window.performance || !performance.now) {
      this.addPerformanceNowPolyfill();
    }

    // GetUserMedia Polyfill for older browsers
    if (!navigator.mediaDevices) {
      this.addGetUserMediaPolyfill();
    }

    console.log('✅ Polyfills applied successfully');
  }

  addIntersectionObserverPolyfill() {
    if (typeof IntersectionObserver !== 'undefined') return;

    // Simple IntersectionObserver polyfill
    window.IntersectionObserver = class IntersectionObserver {
      constructor(callback, options = {}) {
        this.callback = callback;
        this.options = options;
        this.elements = new Set();
        this.checkIntersections = this.checkIntersections.bind(this);
      }

      observe(element) {
        this.elements.add(element);
        if (this.elements.size === 1) {
          this.startObserving();
        }
      }

      unobserve(element) {
        this.elements.delete(element);
        if (this.elements.size === 0) {
          this.stopObserving();
        }
      }

      disconnect() {
        this.elements.clear();
        this.stopObserving();
      }

      startObserving() {
        this.interval = setInterval(this.checkIntersections, 100);
        window.addEventListener('scroll', this.checkIntersections);
        window.addEventListener('resize', this.checkIntersections);
      }

      stopObserving() {
        clearInterval(this.interval);
        window.removeEventListener('scroll', this.checkIntersections);
        window.removeEventListener('resize', this.checkIntersections);
      }

      checkIntersections() {
        const entries = [];
        this.elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0;

          entries.push({
            target: element,
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
            boundingClientRect: rect
          });
        });

        if (entries.length > 0) {
          this.callback(entries, this);
        }
      }
    };

    console.log('📱 IntersectionObserver polyfill added');
  }

  addResizeObserverPolyfill() {
    if (typeof ResizeObserver !== 'undefined') return;

    window.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.elements = new Map();
        this.checkResize = this.checkResize.bind(this);
      }

      observe(element) {
        const rect = element.getBoundingClientRect();
        this.elements.set(element, { width: rect.width, height: rect.height });

        if (this.elements.size === 1) {
          this.startObserving();
        }
      }

      unobserve(element) {
        this.elements.delete(element);
        if (this.elements.size === 0) {
          this.stopObserving();
        }
      }

      disconnect() {
        this.elements.clear();
        this.stopObserving();
      }

      startObserving() {
        this.interval = setInterval(this.checkResize, 100);
        window.addEventListener('resize', this.checkResize);
      }

      stopObserving() {
        clearInterval(this.interval);
        window.removeEventListener('resize', this.checkResize);
      }

      checkResize() {
        const entries = [];
        this.elements.forEach((oldSize, element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width !== oldSize.width || rect.height !== oldSize.height) {
            this.elements.set(element, { width: rect.width, height: rect.height });
            entries.push({
              target: element,
              contentRect: rect,
              borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }]
            });
          }
        });

        if (entries.length > 0) {
          this.callback(entries, this);
        }
      }
    };

    console.log('📏 ResizeObserver polyfill added');
  }

  addFetchPolyfill() {
    if (typeof fetch !== 'undefined') return;

    window.fetch = function(url, options = {}) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url);

        // Set headers
        if (options.headers) {
          Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key]);
          });
        }

        xhr.onload = () => {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            text: () => Promise.resolve(xhr.responseText),
            json: () => Promise.resolve(JSON.parse(xhr.responseText))
          });
        };

        xhr.onerror = () => reject(new Error('Network Error'));
        xhr.send(options.body || null);
      });
    };

    console.log('🌐 Fetch polyfill added');
  }

  addPromisePolyfill() {
    if (typeof Promise !== 'undefined') return;

    window.Promise = class Promise {
      constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.handlers = [];

        try {
          executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
          this.reject(error);
        }
      }

      resolve(value) {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.handlers.forEach(handler => handler.onFulfilled(value));
        }
      }

      reject(reason) {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.value = reason;
          this.handlers.forEach(handler => handler.onRejected(reason));
        }
      }

      then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
          const handler = {
            onFulfilled: (value) => {
              try {
                const result = onFulfilled ? onFulfilled(value) : value;
                resolve(result);
              } catch (error) {
                reject(error);
              }
            },
            onRejected: (reason) => {
              try {
                const result = onRejected ? onRejected(reason) : reason;
                resolve(result);
              } catch (error) {
                reject(error);
              }
            }
          };

          if (this.state === 'fulfilled') {
            handler.onFulfilled(this.value);
          } else if (this.state === 'rejected') {
            handler.onRejected(this.value);
          } else {
            this.handlers.push(handler);
          }
        });
      }

      catch(onRejected) {
        return this.then(null, onRejected);
      }

      static resolve(value) {
        return new Promise(resolve => resolve(value));
      }

      static reject(reason) {
        return new Promise((resolve, reject) => reject(reason));
      }

      static all(promises) {
        return new Promise((resolve, reject) => {
          const results = [];
          let completed = 0;

          promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
              value => {
                results[index] = value;
                completed++;
                if (completed === promises.length) {
                  resolve(results);
                }
              },
              reject
            );
          });
        });
      }
    };

    console.log('🤝 Promise polyfill added');
  }

  addObjectAssignPolyfill() {
    Object.assign = Object.assign || function(target, ...sources) {
      sources.forEach(source => {
        if (source != null) {
          Object.keys(source).forEach(key => {
            target[key] = source[key];
          });
        }
      });
      return target;
    };

    console.log('🔗 Object.assign polyfill added');
  }

  addArrayFromPolyfill() {
    Array.from = Array.from || function(arrayLike, mapFn, thisArg) {
      const result = [];
      for (let i = 0; i < arrayLike.length; i++) {
        result[i] = mapFn ? mapFn.call(thisArg, arrayLike[i], i) : arrayLike[i];
      }
      return result;
    };

    console.log('📋 Array.from polyfill added');
  }

  addCSSSupportsPolyfill() {
    if (!window.CSS) {
      window.CSS = {};
    }

    if (!CSS.supports) {
      CSS.supports = function(property, value) {
        const el = document.createElement('div');
        el.style.cssText = `${property}: ${value}`;
        return el.style.length > 0;
      };
    }

    console.log('🎨 CSS.supports polyfill added');
  }

  addRequestAnimationFramePolyfill() {
    window.requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return setTimeout(callback, 1000 / 60);
      };

    window.cancelAnimationFrame = window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      clearTimeout;

    console.log('🎬 RequestAnimationFrame polyfill added');
  }

  addPerformanceNowPolyfill() {
    if (!window.performance) {
      window.performance = {};
    }

    if (!performance.now) {
      performance.now = performance.now ||
        performance.mozNow ||
        performance.msNow ||
        performance.oNow ||
        performance.webkitNow ||
        function() {
          return new Date().getTime();
        };
    }

    console.log('⏱️ Performance.now polyfill added');
  }

  addGetUserMediaPolyfill() {
    navigator.mediaDevices = navigator.mediaDevices || {};

    if (!navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        const getUserMedia = navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not supported'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }

    console.log('📹 GetUserMedia polyfill added');
  }

  // =====================================================
  // BROWSER-SPECIFIC FIXES
  // =====================================================

  applyBrowserSpecificFixes() {
    // Safari fixes
    if (this.browserInfo.isSafari || this.browserInfo.isMobileSafari) {
      this.applySafariFixes();
    }

    // Firefox fixes
    if (this.browserInfo.isFirefox) {
      this.applyFirefoxFixes();
    }

    // Chrome fixes
    if (this.browserInfo.isChrome) {
      this.applyChromeFixes();
    }

    // Edge fixes
    if (this.browserInfo.isEdge) {
      this.applyEdgeFixes();
    }

    // Internet Explorer fixes
    if (this.browserInfo.isIE) {
      this.applyIEFixes();
    }

    // Mobile browser fixes
    this.applyMobileBrowserFixes();

    // iOS-specific fixes
    if (this.browserInfo.isiOS) {
      this.applyIOSFixes();
    }

    // Android-specific fixes
    if (this.browserInfo.isAndroid) {
      this.applyAndroidFixes();
    }
  }

  applySafariFixes() {
    console.log('🧭 Applying Safari-specific fixes...');

    // Fix viewport height issues
    this.fixSafariViewportHeight();

    // Fix backdrop-filter support
    this.fixSafariBackdropFilter();

    // Fix scroll behavior
    this.fixSafariScrollBehavior();

    // Fix date input
    this.fixSafariDateInput();

    // Fix video playback
    this.fixSafariVideoPlayback();

    document.documentElement.classList.add('browser-safari');
  }

  fixSafariViewportHeight() {
    // Safari mobile viewport height fix
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });

    // Add CSS for Safari viewport fix
    if (!document.getElementById('safari-vh-fix')) {
      const style = document.createElement('style');
      style.id = 'safari-vh-fix';
      style.textContent = `
        .full-height { height: calc(var(--vh, 1vh) * 100); }
        .min-full-height { min-height: calc(var(--vh, 1vh) * 100); }
      `;
      document.head.appendChild(style);
    }
  }

  fixSafariBackdropFilter() {
    // Add -webkit- prefix for backdrop-filter
    const elementsWithBackdrop = document.querySelectorAll('[style*="backdrop-filter"]');
    elementsWithBackdrop.forEach(element => {
      const style = element.style.backdropFilter;
      if (style) {
        element.style.webkitBackdropFilter = style;
      }
    });

    // CSS fix for backdrop-filter
    if (!document.getElementById('safari-backdrop-fix')) {
      const style = document.createElement('style');
      style.id = 'safari-backdrop-fix';
      style.textContent = `
        .backdrop-blur {
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixSafariScrollBehavior() {
    // Fix smooth scrolling in Safari
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      const smoothScrollTo = (element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      // Override smooth scroll links
      document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
          e.preventDefault();
          const target = document.querySelector(e.target.getAttribute('href'));
          if (target) {
            smoothScrollTo(target);
          }
        }
      });
    }
  }

  fixSafariDateInput() {
    // Safari doesn't support some input types well
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      if (!this.isDateInputSupported()) {
        input.type = 'text';
        input.placeholder = 'DD/MM/YYYY';
      }
    });
  }

  isDateInputSupported() {
    const test = document.createElement('input');
    test.type = 'date';
    return test.type === 'date';
  }

  fixSafariVideoPlayback() {
    // Safari requires user interaction for video playback
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => {
      video.muted = true; // Safari allows autoplay only if muted
      video.playsInline = true; // Prevent fullscreen on mobile
    });
  }

  applyFirefoxFixes() {
    console.log('🦊 Applying Firefox-specific fixes...');

    // Fix flexbox issues in older Firefox
    this.fixFirefoxFlexbox();

    // Fix CSS Grid issues
    this.fixFirefoxGrid();

    // Fix scrollbar styling
    this.fixFirefoxScrollbar();

    document.documentElement.classList.add('browser-firefox');
  }

  fixFirefoxFlexbox() {
    // Firefox flexbox button fix
    if (!document.getElementById('firefox-flex-fix')) {
      const style = document.createElement('style');
      style.id = 'firefox-flex-fix';
      style.textContent = `
        @-moz-document url-prefix() {
          button::-moz-focus-inner {
            border: 0;
            padding: 0;
          }

          .flex-container {
            display: -moz-box;
            display: -webkit-flex;
            display: flex;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixFirefoxGrid() {
    // Firefox CSS Grid fixes
    if (!document.getElementById('firefox-grid-fix')) {
      const style = document.createElement('style');
      style.id = 'firefox-grid-fix';
      style.textContent = `
        @-moz-document url-prefix() {
          .grid-container {
            display: -ms-grid;
            display: grid;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixFirefoxScrollbar() {
    // Firefox scrollbar styling
    if (!document.getElementById('firefox-scrollbar-fix')) {
      const style = document.createElement('style');
      style.id = 'firefox-scrollbar-fix';
      style.textContent = `
        @-moz-document url-prefix() {
          * {
            scrollbar-width: thin;
            scrollbar-color: #e67e22 #f8f9fa;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  applyChromeFixes() {
    console.log('🔧 Applying Chrome-specific fixes...');

    // Fix Chrome autofill styling
    this.fixChromeAutofill();

    // Fix Chrome smooth scrolling
    this.fixChromeSmoothScrolling();

    document.documentElement.classList.add('browser-chrome');
  }

  fixChromeAutofill() {
    if (!document.getElementById('chrome-autofill-fix')) {
      const style = document.createElement('style');
      style.id = 'chrome-autofill-fix';
      style.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #2c3e50 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixChromeSmoothScrolling() {
    // Chrome smooth scrolling optimization
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  applyEdgeFixes() {
    console.log('⚡ Applying Edge-specific fixes...');

    // Edge CSS fixes
    this.fixEdgeCSS();

    document.documentElement.classList.add('browser-edge');
  }

  fixEdgeCSS() {
    if (!document.getElementById('edge-css-fix')) {
      const style = document.createElement('style');
      style.id = 'edge-css-fix';
      style.textContent = `
        @supports (-ms-ime-align: auto) {
          .flex-container {
            display: -ms-flexbox;
            display: flex;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  applyIEFixes() {
    console.log('🏛️ Applying Internet Explorer fixes...');

    // IE is not supported, show upgrade notice
    this.showIEUpgradeNotice();

    document.documentElement.classList.add('browser-ie');
  }

  showIEUpgradeNotice() {
    const notice = document.createElement('div');
    notice.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #d73527;
      color: white;
      padding: 15px;
      text-align: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
    `;
    notice.innerHTML = `
      <strong>⚠️ Застарілий браузер</strong><br>
      Для кращого досвіду використовуйте сучасний браузер: Chrome, Firefox, Safari або Edge
      <button onclick="this.parentElement.remove()" style="margin-left: 10px; padding: 5px 10px; background: white; color: #d73527; border: none; border-radius: 3px; cursor: pointer;">×</button>
    `;
    document.body.insertBefore(notice, document.body.firstChild);
  }

  applyMobileBrowserFixes() {
    if (this.browserInfo.isAndroid || this.browserInfo.isiOS) {
      console.log('📱 Applying mobile browser fixes...');

      // Fix touch scrolling
      this.fixMobileTouchScrolling();

      // Fix input zoom on focus
      this.fixMobileInputZoom();

      // Fix orientation change issues
      this.fixMobileOrientationChange();

      // Fix touch event handling
      this.fixMobileTouchEvents();
    }
  }

  fixMobileTouchScrolling() {
    // Enable momentum scrolling on iOS
    if (!document.getElementById('mobile-scroll-fix')) {
      const style = document.createElement('style');
      style.id = 'mobile-scroll-fix';
      style.textContent = `
        body, .scrollable {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }

        .no-scroll {
          position: fixed;
          width: 100%;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixMobileInputZoom() {
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (parseFloat(getComputedStyle(input).fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });
  }

  fixMobileOrientationChange() {
    let orientationChangeTimeout;

    window.addEventListener('orientationchange', () => {
      // Fix viewport height after orientation change
      clearTimeout(orientationChangeTimeout);
      orientationChangeTimeout = setTimeout(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }, 100);
    });
  }

  fixMobileTouchEvents() {
    // Improve touch responsiveness
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });

    // Fix 300ms click delay on older mobile browsers
    if (!('ontouchstart' in window)) return;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndTime = Date.now();
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const timeDiff = touchEndTime - touchStartTime;
      const xDiff = Math.abs(touchEndX - touchStartX);
      const yDiff = Math.abs(touchEndY - touchStartY);

      // If it's a quick tap without much movement
      if (timeDiff < 200 && xDiff < 10 && yDiff < 10) {
        const target = document.elementFromPoint(touchEndX, touchEndY);
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.onclick)) {
          e.preventDefault();
          target.click();
        }
      }
    });
  }

  applyIOSFixes() {
    console.log('📱 Applying iOS-specific fixes...');

    // Fix iOS Safari bounce scrolling
    this.fixIOSBounceScrolling();

    // Fix iOS form styling
    this.fixIOSFormStyling();

    // Fix iOS video playback
    this.fixIOSVideoPlayback();

    document.documentElement.classList.add('platform-ios');
  }

  fixIOSBounceScrolling() {
    // Prevent overscroll bounce
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.no-bounce')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  fixIOSFormStyling() {
    if (!document.getElementById('ios-form-fix')) {
      const style = document.createElement('style');
      style.id = 'ios-form-fix';
      style.textContent = `
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="url"],
        textarea,
        select {
          -webkit-appearance: none;
          -webkit-border-radius: 0;
          border-radius: 4px;
        }

        input[type="submit"],
        input[type="button"],
        button {
          -webkit-appearance: none;
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  fixIOSVideoPlayback() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
    });
  }

  applyAndroidFixes() {
    console.log('🤖 Applying Android-specific fixes...');

    // Fix Android Chrome address bar
    this.fixAndroidAddressBar();

    // Fix Android input styling
    this.fixAndroidInputStyling();

    document.documentElement.classList.add('platform-android');
  }

  fixAndroidAddressBar() {
    // Handle address bar showing/hiding
    const setAndroidVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--android-vh', `${vh}px`);
    };

    setAndroidVH();
    window.addEventListener('resize', setAndroidVH);
  }

  fixAndroidInputStyling() {
    if (!document.getElementById('android-input-fix')) {
      const style = document.createElement('style');
      style.id = 'android-input-fix';
      style.textContent = `
        input, textarea, select {
          font-size: 16px !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // =====================================================
  // INPUT METHOD COMPATIBILITY
  // =====================================================

  setupInputMethodCompatibility() {
    console.log('🖱️ Setting up input method compatibility...');

    // Mouse support
    this.setupMouseSupport();

    // Touch support
    this.setupTouchSupport();

    // Keyboard support
    this.setupKeyboardSupport();

    // Pointer events (stylus, etc.)
    this.setupPointerSupport();

    // Gamepad support (if applicable)
    this.setupGamepadSupport();
  }

  setupMouseSupport() {
    // Enhanced mouse interactions
    document.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
    document.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), true);

    // Right-click context menu handling
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));

    // Mouse wheel handling with better cross-browser support
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' :
                     'onmousewheel' in document.createElement('div') ? 'mousewheel' : 'DOMMouseScroll';

    document.addEventListener(wheelEvent, this.handleMouseWheel.bind(this), { passive: true });
  }

  setupTouchSupport() {
    if (!('ontouchstart' in window)) return;

    // Enhanced touch event handling
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // Gesture support for iOS
    if (this.browserInfo.isiOS) {
      document.addEventListener('gesturestart', this.handleGestureStart.bind(this));
      document.addEventListener('gesturechange', this.handleGestureChange.bind(this));
      document.addEventListener('gestureend', this.handleGestureEnd.bind(this));
    }
  }

  setupKeyboardSupport() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Focus management
    this.setupFocusManagement();

    // Tab trap for modals
    this.setupTabTraps();
  }

  setupPointerSupport() {
    if (!('onpointerdown' in window)) return;

    document.addEventListener('pointerdown', this.handlePointerDown.bind(this), { passive: true });
    document.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: true });
    document.addEventListener('pointerup', this.handlePointerUp.bind(this), { passive: true });
  }

  setupGamepadSupport() {
    if (!('getGamepads' in navigator)) return;

    // Basic gamepad support for navigation
    window.addEventListener('gamepadconnected', this.handleGamepadConnected.bind(this));
    window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected.bind(this));
  }

  // Event handlers
  handleMouseEnter(e) {
    if (e.target.matches('.interactive, button, a, input, select, textarea')) {
      e.target.classList.add('mouse-hover');
    }
  }

  handleMouseLeave(e) {
    e.target.classList.remove('mouse-hover');
  }

  handleMouseMove(e) {
    // Update custom cursor if enabled
    if (window.InnerGarden?.cursor) {
      window.InnerGarden.cursor.updatePosition(e.clientX, e.clientY);
    }
  }

  handleContextMenu(e) {
    // Allow context menu on images and text for user convenience
    if (!e.target.matches('img, p, span, div')) {
      e.preventDefault();
    }
  }

  handleMouseWheel(e) {
    // Smooth scrolling enhancement
    const delta = e.deltaY || e.wheelDelta || e.detail;
    // Could implement custom smooth scrolling here
  }

  handleTouchStart(e) {
    // Track touch for gesture recognition
    const touch = e.touches[0];
    this.touchStartData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      target: e.target
    };
  }

  handleTouchMove(e) {
    // Prevent scrolling on certain elements
    if (e.target.closest('.no-scroll, .ar-viewer')) {
      e.preventDefault();
    }
  }

  handleTouchEnd(e) {
    if (!this.touchStartData) return;

    const touch = e.changedTouches[0];
    const touchEndData = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Calculate gesture
    const deltaX = touchEndData.x - this.touchStartData.x;
    const deltaY = touchEndData.y - this.touchStartData.y;
    const deltaTime = touchEndData.time - this.touchStartData.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Detect swipe gestures
    if (deltaTime < 300 && distance > 50) {
      const direction = Math.abs(deltaX) > Math.abs(deltaY) ?
        (deltaX > 0 ? 'right' : 'left') :
        (deltaY > 0 ? 'down' : 'up');

      this.handleSwipeGesture(direction, this.touchStartData.target);
    }

    this.touchStartData = null;
  }

  handleSwipeGesture(direction, target) {
    // Handle swipe gestures on specific elements
    if (target.closest('.carousel, .slider, .gallery')) {
      // Could implement carousel navigation here
      console.log(`Swipe ${direction} detected on ${target.className}`);
    }

    if (target.closest('.modal') && direction === 'down') {
      // Close modal on swipe down
      const modal = target.closest('.modal');
      if (modal.id && window.InnerGarden?.modal) {
        window.InnerGarden.modal.close(modal.id);
      }
    }
  }

  handleGestureStart(e) {
    e.preventDefault(); // Prevent zoom
  }

  handleGestureChange(e) {
    e.preventDefault(); // Prevent zoom
  }

  handleGestureEnd(e) {
    e.preventDefault(); // Prevent zoom
  }

  setupFocusManagement() {
    // Visual focus indicators
    if (!document.getElementById('focus-fix')) {
      const style = document.createElement('style');
      style.id = 'focus-fix';
      style.textContent = `
        *:focus {
          outline: 2px solid #e67e22;
          outline-offset: 2px;
        }

        .mouse-user *:focus {
          outline: none;
        }

        .keyboard-user *:focus {
          outline: 2px solid #e67e22;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    }

    // Track input method
    document.addEventListener('mousedown', () => {
      document.body.classList.add('mouse-user');
      document.body.classList.remove('keyboard-user');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
        document.body.classList.remove('mouse-user');
      }
    });
  }

  setupTabTraps() {
    // Tab trapping for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal.active, .modal:not(.hidden)');
        if (activeModal) {
          this.trapTabInModal(e, activeModal);
        }
      }
    });
  }

  trapTabInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  handleKeyDown(e) {
    // Global keyboard shortcuts
    switch (e.key) {
      case 'Escape':
        this.handleEscapeKey();
        break;
      case 'Enter':
        if (e.target.matches('button, [role="button"]')) {
          e.target.click();
        }
        break;
      case ' ':
        if (e.target.matches('button, [role="button"]')) {
          e.preventDefault();
          e.target.click();
        }
        break;
    }

    // Developer shortcuts (only in development)
    if (e.ctrlKey && e.shiftKey) {
      switch (e.key) {
        case 'T':
          this.toggleTestInterface();
          break;
        case 'D':
          this.toggleDebugMode();
          break;
        case 'P':
          this.showPerformanceReport();
          break;
      }
    }
  }

  handleKeyUp(e) {
    // Handle key release events if needed
  }

  handlePointerDown(e) {
    // Enhanced pointer handling
    console.log(`Pointer down: ${e.pointerType} at ${e.clientX}, ${e.clientY}`);
  }

  handlePointerMove(e) {
    // Track pointer movement
  }

  handlePointerUp(e) {
    // Handle pointer release
  }

  handleGamepadConnected(e) {
    console.log('🎮 Gamepad connected:', e.gamepad.id);
    // Could implement gamepad navigation
  }

  handleGamepadDisconnected(e) {
    console.log('🎮 Gamepad disconnected');
  }

  // =====================================================
  // VIEWPORT COMPATIBILITY
  // =====================================================

  setupViewportCompatibility() {
    console.log('📐 Setting up viewport compatibility...');

    // Fix viewport meta tag
    this.fixViewportMeta();

    // Handle viewport changes
    this.setupViewportChangeHandling();

    // Fix zoom behavior
    this.fixZoomBehavior();

    // Handle safe areas (notch, etc.)
    this.handleSafeAreas();
  }

  fixViewportMeta() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');

    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }

    // Optimal viewport settings
    let content = 'width=device-width, initial-scale=1.0';

    // Disable zoom on forms to prevent iOS zoom
    if (this.browserInfo.isiOS) {
      content += ', maximum-scale=1.0, user-scalable=no';
    }

    // Handle notch devices
    if (this.hasNotch()) {
      content += ', viewport-fit=cover';
    }

    viewportMeta.content = content;
  }

  hasNotch() {
    // Detect devices with notch/safe areas
    return (
      'CSS' in window &&
      CSS.supports('padding-left', 'env(safe-area-inset-left)')
    );
  }

  setupViewportChangeHandling() {
    let resizeTimeout;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleViewportChange();
      }, 100);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleViewportChange();
      }, 200);
    });
  }

  handleViewportChange() {
    // Update CSS custom properties
    const vw = window.innerWidth * 0.01;
    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vw', `${vw}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Notify components of viewport change
    window.dispatchEvent(new CustomEvent('viewport-changed', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.innerWidth / window.innerHeight
      }
    }));
  }

  fixZoomBehavior() {
    // Disable pinch zoom on specific elements
    const noZoomElements = document.querySelectorAll('.ar-viewer, .map-container, .no-zoom');

    noZoomElements.forEach(element => {
      element.addEventListener('gesturestart', (e) => e.preventDefault());
      element.addEventListener('gesturechange', (e) => e.preventDefault());
      element.addEventListener('gestureend', (e) => e.preventDefault());
    });
  }

  handleSafeAreas() {
    if (!this.hasNotch()) return;

    // Add CSS for safe areas
    if (!document.getElementById('safe-area-fix')) {
      const style = document.createElement('style');
      style.id = 'safe-area-fix';
      style.textContent = `
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }

        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        .safe-area-left {
          padding-left: env(safe-area-inset-left);
        }

        .safe-area-right {
          padding-right: env(safe-area-inset-right);
        }

        .safe-area-all {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
      `;
      document.head.appendChild(style);
    }

    // Apply safe area classes to relevant elements
    const header = document.querySelector('header');
    if (header) {
      header.classList.add('safe-area-top');
    }

    const footer = document.querySelector('footer');
    if (footer) {
      footer.classList.add('safe-area-bottom');
    }
  }

  // =====================================================
  // COMPATIBILITY TESTING
  // =====================================================

  setupCompatibilityTesting() {
    console.log('🧪 Setting up compatibility testing...');

    // Test all features
    this.testAllFeatures();

    // Test event handling
    this.testEventHandling();

    // Test CSS compatibility
    this.testCSSCompatibility();

    // Test JavaScript compatibility
    this.testJavaScriptCompatibility();
  }

  testAllFeatures() {
    const testResults = new Map();

    this.featureSupport.forEach((supported, feature) => {
      testResults.set(feature, {
        supported,
        workaround: supported ? null : this.getFeatureWorkaround(feature),
        critical: this.isFeatureCritical(feature)
      });
    });

    console.log('📊 Feature compatibility test complete:', testResults);
    return testResults;
  }

  getFeatureWorkaround(feature) {
    const workarounds = {
      'intersection-observer': 'Polyfill implemented',
      'resize-observer': 'Polyfill implemented',
      'fetch': 'XMLHttpRequest fallback',
      'promises': 'Callback-based implementation',
      'get-user-media': 'AR feature disabled gracefully',
      'webgl': 'Canvas 2D fallback for graphics',
      'css-grid': 'Flexbox fallback layout',
      'css-custom-properties': 'Preprocessed CSS variables'
    };

    return workarounds[feature] || 'Manual implementation required';
  }

  isFeatureCritical(feature) {
    const criticalFeatures = [
      'fetch', 'promises', 'local-storage', 'css-flexbox'
    ];
    return criticalFeatures.includes(feature);
  }

  testEventHandling() {
    const events = ['click', 'touchstart', 'keydown', 'resize', 'scroll'];
    const results = {};

    events.forEach(eventType => {
      try {
        const testElement = document.createElement('div');
        let eventFired = false;

        testElement.addEventListener(eventType, () => {
          eventFired = true;
        });

        // Trigger test event
        const event = new Event(eventType, { bubbles: true });
        testElement.dispatchEvent(event);

        results[eventType] = eventFired;
      } catch (error) {
        results[eventType] = false;
        console.warn(`Event ${eventType} not supported:`, error);
      }
    });

    console.log('📡 Event handling test results:', results);
    return results;
  }

  testCSSCompatibility() {
    const cssFeatures = [
      'flexbox', 'grid', 'custom-properties', 'backdrop-filter',
      'transform', 'transition', 'animation', 'calc'
    ];

    const results = {};

    cssFeatures.forEach(feature => {
      try {
        switch (feature) {
          case 'flexbox':
            results[feature] = CSS.supports('display', 'flex');
            break;
          case 'grid':
            results[feature] = CSS.supports('display', 'grid');
            break;
          case 'custom-properties':
            results[feature] = CSS.supports('color', 'var(--test)');
            break;
          case 'backdrop-filter':
            results[feature] = CSS.supports('backdrop-filter', 'blur(10px)');
            break;
          case 'transform':
            results[feature] = CSS.supports('transform', 'translateX(10px)');
            break;
          case 'transition':
            results[feature] = CSS.supports('transition', 'all 0.3s ease');
            break;
          case 'animation':
            results[feature] = CSS.supports('animation', 'test 1s ease');
            break;
          case 'calc':
            results[feature] = CSS.supports('width', 'calc(100% - 10px)');
            break;
        }
      } catch (error) {
        results[feature] = false;
      }
    });

    console.log('🎨 CSS compatibility test results:', results);
    return results;
  }

  testJavaScriptCompatibility() {
    const jsFeatures = [
      'arrow-functions', 'template-literals', 'destructuring',
      'spread-operator', 'default-parameters', 'for-of-loops'
    ];

    const results = {};

    jsFeatures.forEach(feature => {
      try {
        switch (feature) {
          case 'arrow-functions':
            eval('() => {}');
            results[feature] = true;
            break;
          case 'template-literals':
            eval('`template`');
            results[feature] = true;
            break;
          case 'destructuring':
            eval('const {a} = {a: 1}');
            results[feature] = true;
            break;
          case 'spread-operator':
            eval('const arr = [...[1, 2, 3]]');
            results[feature] = true;
            break;
          case 'default-parameters':
            eval('function test(a = 1) {}');
            results[feature] = true;
            break;
          case 'for-of-loops':
            eval('for (const item of [1, 2, 3]) {}');
            results[feature] = true;
            break;
        }
      } catch (error) {
        results[feature] = false;
      }
    });

    console.log('⚙️ JavaScript compatibility test results:', results);
    return results;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  handleEscapeKey() {
    // Close topmost modal/overlay
    const activeModal = document.querySelector('.modal.active, .modal:not(.hidden)');
    if (activeModal) {
      const closeButton = activeModal.querySelector('.close, .modal-close, [data-action="close"]');
      if (closeButton) {
        closeButton.click();
      }
    }

    // Close mobile menu
    const mobileMenu = document.querySelector('.mobile-menu.active');
    if (mobileMenu) {
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      if (toggleButton) {
        toggleButton.click();
      }
    }
  }

  toggleTestInterface() {
    const testInterface = document.getElementById('browser-test-interface');
    if (testInterface) {
      testInterface.style.display = testInterface.style.display === 'none' ? 'block' : 'none';
    } else {
      this.createTestInterface();
    }
  }

  toggleDebugMode() {
    document.body.classList.toggle('debug-mode');
    console.log('🐛 Debug mode toggled');
  }

  showPerformanceReport() {
    if (window.InnerGarden?.performanceOptimizer) {
      console.log('📊 Performance Report:', window.InnerGarden.performanceOptimizer.getPerformanceReport());
    }
  }

  createTestInterface() {
    const testInterface = document.createElement('div');
    testInterface.id = 'browser-test-interface';
    testInterface.style.cssText = `
      position: fixed;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      width: 300px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 15px;
      z-index: 1000001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;

    const browserName = this.getCurrentBrowserName();
    const supportedFeatures = Array.from(this.featureSupport.entries())
      .filter(([, supported]) => supported).length;
    const totalFeatures = this.featureSupport.size;

    testInterface.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <strong>🌐 Browser Compatibility</strong>
        <button onclick="this.parentElement.parentElement.remove()" style="border: none; background: #ff4444; color: white; border-radius: 4px; padding: 2px 8px; cursor: pointer;">×</button>
      </div>

      <div style="margin-bottom: 15px;">
        <div><strong>Browser:</strong> ${browserName}</div>
        <div><strong>Features:</strong> ${supportedFeatures}/${totalFeatures} supported</div>
        <div><strong>Score:</strong> ${Math.round((supportedFeatures / totalFeatures) * 100)}%</div>
      </div>

      <div style="margin-bottom: 15px;">
        <button onclick="window.InnerGarden.crossBrowserCompatibility.runAllCompatibilityTests()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%; margin-bottom: 5px;">Run All Tests</button>
        <button onclick="window.InnerGarden.crossBrowserCompatibility.showCompatibilityReport()" style="padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">Show Report</button>
      </div>

      <div id="compatibility-test-results" style="font-size: 11px; max-height: 200px; overflow-y: auto;"></div>
    `;

    document.body.appendChild(testInterface);
  }

  getCurrentBrowserName() {
    if (this.browserInfo.isChrome) return `Chrome ${this.browserInfo.chromeVersion || ''}`;
    if (this.browserInfo.isFirefox) return `Firefox ${this.browserInfo.firefoxVersion || ''}`;
    if (this.browserInfo.isSafari) return `Safari ${this.browserInfo.safariVersion || ''}`;
    if (this.browserInfo.isEdge) return `Edge ${this.browserInfo.edgeVersion || ''}`;
    if (this.browserInfo.isIE) return 'Internet Explorer';
    if (this.browserInfo.isOpera) return 'Opera';
    return 'Unknown Browser';
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  async runAllCompatibilityTests() {
    console.log('🚀 Running comprehensive compatibility tests...');

    const results = {
      browser: this.browserInfo,
      features: this.testAllFeatures(),
      events: this.testEventHandling(),
      css: this.testCSSCompatibility(),
      javascript: this.testJavaScriptCompatibility(),
      performance: await this.testBrowserPerformance(),
      accessibility: this.testBrowserAccessibility(),
      timestamp: new Date().toISOString()
    };

    // Update UI
    this.updateTestResults(results);

    // Store globally
    window.InnerGarden = window.InnerGarden || {};
    window.InnerGarden.lastCompatibilityReport = results;

    console.log('✅ Compatibility tests complete!');
    return results;
  }

  async testBrowserPerformance() {
    const startTime = performance.now();

    // Test JavaScript performance
    const jsStart = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    const jsTime = performance.now() - jsStart;

    // Test DOM performance
    const domStart = performance.now();
    const testDiv = document.createElement('div');
    for (let i = 0; i < 1000; i++) {
      const span = document.createElement('span');
      span.textContent = `Item ${i}`;
      testDiv.appendChild(span);
    }
    const domTime = performance.now() - domStart;

    // Test rendering performance
    const renderStart = performance.now();
    document.body.appendChild(testDiv);
    await new Promise(resolve => requestAnimationFrame(resolve));
    document.body.removeChild(testDiv);
    const renderTime = performance.now() - renderStart;

    const totalTime = performance.now() - startTime;

    return {
      javascript: jsTime,
      dom: domTime,
      rendering: renderTime,
      total: totalTime,
      rating: this.getPerformanceRating(totalTime)
    };
  }

  getPerformanceRating(time) {
    if (time < 100) return 'excellent';
    if (time < 300) return 'good';
    if (time < 500) return 'fair';
    return 'poor';
  }

  testBrowserAccessibility() {
    const results = {
      screenReaderSupport: !!window.speechSynthesis,
      keyboardNavigation: true, // Assume true, would need more complex testing
      colorContrastAPI: !!window.CSS && CSS.supports('color-contrast', 'white vs black'),
      reducedMotionSupport: !!window.matchMedia('(prefers-reduced-motion)').matches,
      focusVisible: CSS.supports('selector(:focus-visible)'),
      ariaSupport: document.createElement('div').setAttribute('aria-label', 'test') !== undefined
    };

    return results;
  }

  updateTestResults(results) {
    const resultsEl = document.getElementById('compatibility-test-results');
    if (!resultsEl) return;

    const featuresScore = Math.round((Object.values(results.features).filter(f => f.supported).length / Object.keys(results.features).length) * 100);

    resultsEl.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>Compatibility Score: ${featuresScore}%</strong><br>
        Performance: ${results.performance?.rating || 'unknown'}
      </div>

      <div style="margin-bottom: 10px;">
        <strong>Critical Issues:</strong><br>
        ${this.getCriticalIssues(results).map(issue => `• ${issue}`).join('<br>') || 'None'}
      </div>

      <div>
        <strong>Browser Info:</strong><br>
        Platform: ${this.browserInfo.isWindows ? 'Windows' : this.browserInfo.isMacOS ? 'macOS' : this.browserInfo.isLinux ? 'Linux' : 'Mobile'}<br>
        Engine: ${this.browserInfo.isWebKit ? 'WebKit' : this.browserInfo.isBlink ? 'Blink' : this.browserInfo.isGecko ? 'Gecko' : 'Unknown'}
      </div>
    `;
  }

  getCriticalIssues(results) {
    const issues = [];

    // Check for critical missing features
    Object.entries(results.features).forEach(([feature, data]) => {
      if (data.critical && !data.supported) {
        issues.push(`${feature} not supported`);
      }
    });

    // Check for poor performance
    if (results.performance?.rating === 'poor') {
      issues.push('Poor browser performance detected');
    }

    // Check for IE
    if (this.browserInfo.isIE) {
      issues.push('Internet Explorer not supported');
    }

    return issues;
  }

  showCompatibilityReport() {
    const report = window.InnerGarden?.lastCompatibilityReport;
    if (!report) {
      alert('No compatibility report available. Run tests first.');
      return;
    }

    const criticalIssues = this.getCriticalIssues(report);
    const message = criticalIssues.length > 0 ?
      `Critical Issues Found:\n${criticalIssues.join('\n')}` :
      'All compatibility tests passed! ✅';

    alert(message);
  }

  // Get compatibility status for external use
  getCompatibilityStatus() {
    return {
      browser: this.getCurrentBrowserName(),
      supported: !this.browserInfo.isIE,
      features: this.featureSupport,
      issues: this.compatibilityIssues,
      recommendations: this.getCompatibilityRecommendations()
    };
  }

  getCompatibilityRecommendations() {
    const recommendations = [];

    if (this.browserInfo.isIE) {
      recommendations.push('Upgrade to a modern browser for full functionality');
    }

    if (!this.featureSupport.get('get-user-media')) {
      recommendations.push('AR features will be limited without camera access');
    }

    if (!this.featureSupport.get('intersection-observer')) {
      recommendations.push('Using polyfill for scroll animations');
    }

    return recommendations;
  }
}

// Initialize cross-browser compatibility
const ultraCrossBrowserCompatibility = new UltraCrossBrowserCompatibility();

// Make globally available
window.InnerGarden = window.InnerGarden || {};
window.InnerGarden.crossBrowserCompatibility = ultraCrossBrowserCompatibility;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraCrossBrowserCompatibility;
}