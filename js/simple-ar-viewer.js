// Inner Garden - Advanced AR Viewer with AI-Powered Features

// Performance Monitor Class
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      renderTime: 0,
      memoryUsage: 0
    };
    this.startTime = performance.now();
    this.frameCount = 0;
    this.lastFrameTime = 0;
  }

  startFrame() {
    this.lastFrameTime = performance.now();
  }

  endFrame() {
    const now = performance.now();
    this.frameCount++;
    this.metrics.frameTime = now - this.lastFrameTime;
    this.metrics.renderTime = now;

    // Calculate FPS every second
    if (now - this.startTime >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / (now - this.startTime));
      this.frameCount = 0;
      this.startTime = now;
    }

    // Memory usage (if available)
    if (performance.memory) {
      this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// AR Analytics Class
class ARAnalytics {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      interactions: [],
      artworkViews: new Map(),
      gestures: [],
      placements: 0,
      sessionDuration: 0
    };
  }

  trackInteraction(type, data = {}) {
    this.sessionData.interactions.push({
      type,
      timestamp: Date.now(),
      data
    });
  }

  trackArtworkView(artworkId, duration = 0) {
    const current = this.sessionData.artworkViews.get(artworkId) || { views: 0, totalDuration: 0 };
    current.views++;
    current.totalDuration += duration;
    this.sessionData.artworkViews.set(artworkId, current);
  }

  trackGesture(gesture) {
    this.sessionData.gestures.push({
      type: gesture,
      timestamp: Date.now()
    });
  }

  trackPlacement() {
    this.sessionData.placements++;
  }

  getSessionReport() {
    this.sessionData.sessionDuration = Date.now() - this.sessionData.startTime;
    return { ...this.sessionData };
  }
}

// Room Style Analyzer Class
class RoomStyleAnalyzer {
  constructor() {
    this.colorPalette = [];
    this.lightingConditions = null;
    this.roomStyle = null;
    this.dominantColors = [];
  }

  async analyzeFromImage(imageData) {
    try {
      // Simulate color analysis
      const colors = this.extractDominantColors(imageData);
      this.dominantColors = colors;
      this.roomStyle = this.inferRoomStyle(colors);
      return {
        dominantColors: colors,
        roomStyle: this.roomStyle,
        lightingConditions: this.lightingConditions
      };
    } catch (error) {
      console.error('Room analysis failed:', error);
      return null;
    }
  }

  extractDominantColors(imageData) {
    // Simplified color extraction
    const colors = [
      { color: '#f8f9fa', percentage: 45, name: 'Light Gray' },
      { color: '#6c757d', percentage: 30, name: 'Medium Gray' },
      { color: '#e67e22', percentage: 15, name: 'Warm Orange' },
      { color: '#2c3e50', percentage: 10, name: 'Dark Blue' }
    ];
    return colors;
  }

  inferRoomStyle(colors) {
    // Simplified style inference
    const lightColors = colors.filter(c => this.isLightColor(c.color));
    const warmColors = colors.filter(c => this.isWarmColor(c.color));

    if (lightColors.length > 2) return 'minimalist';
    if (warmColors.length > 1) return 'cozy';
    return 'modern';
  }

  isLightColor(hex) {
    const rgb = this.hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
  }

  isWarmColor(hex) {
    const rgb = this.hexToRgb(hex);
    return rgb.r > rgb.b;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Artwork Recommendation Engine Class
class ArtworkRecommendationEngine {
  constructor() {
    this.roomProfile = null;
    this.userPreferences = new Map();
    this.recommendationHistory = [];
  }

  setRoomProfile(profile) {
    this.roomProfile = profile;
  }

  trackUserPreference(artworkId, interaction) {
    const current = this.userPreferences.get(artworkId) || { score: 0, interactions: 0 };
    current.interactions++;

    switch (interaction) {
      case 'view': current.score += 1; break;
      case 'place': current.score += 3; break;
      case 'share': current.score += 5; break;
      case 'download': current.score += 4; break;
    }

    this.userPreferences.set(artworkId, current);
  }

  getRecommendations(artworks, count = 3) {
    const scored = artworks.map(artwork => ({
      ...artwork,
      score: this.calculateArtworkScore(artwork)
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  calculateArtworkScore(artwork) {
    let score = 0;

    // User preference score
    const userPref = this.userPreferences.get(artwork.id);
    if (userPref) {
      score += userPref.score;
    }

    // Room style compatibility
    if (this.roomProfile && artwork.tags) {
      const compatibility = this.calculateRoomCompatibility(artwork.tags);
      score += compatibility * 2;
    }

    // Add some randomness for discovery
    score += Math.random() * 0.5;

    return score;
  }

  calculateRoomCompatibility(artworkTags) {
    if (!this.roomProfile) return 0;

    const styleMap = {
      minimalist: ['calm', 'simple', 'clean', 'geometric'],
      modern: ['contemporary', 'bold', 'abstract', 'dynamic'],
      cozy: ['warm', 'organic', 'natural', 'soft']
    };

    const roomStyleTags = styleMap[this.roomProfile.roomStyle] || [];
    const matches = artworkTags.filter(tag => roomStyleTags.includes(tag));

    return matches.length / Math.max(roomStyleTags.length, artworkTags.length);
  }
}

// Color Harmony Analyzer Class
class ColorHarmonyAnalyzer {
  constructor() {
    this.harmonies = ['complementary', 'analogous', 'triadic', 'monochromatic'];
  }

  analyzeHarmony(artworkColors, roomColors) {
    try {
      const artworkHsl = artworkColors.map(c => this.hexToHsl(c.color));
      const roomHsl = roomColors.map(c => this.hexToHsl(c.color));

      const harmonyScore = this.calculateHarmonyScore(artworkHsl, roomHsl);
      const harmonyType = this.determineHarmonyType(artworkHsl, roomHsl);

      return {
        score: harmonyScore,
        type: harmonyType,
        recommendation: this.getHarmonyRecommendation(harmonyScore)
      };
    } catch (error) {
      console.error('Color harmony analysis failed:', error);
      return { score: 0.5, type: 'unknown', recommendation: 'neutral' };
    }
  }

  hexToHsl(hex) {
    const rgb = this.hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  calculateHarmonyScore(artworkHsl, roomHsl) {
    let totalScore = 0;
    let comparisons = 0;

    artworkHsl.forEach(artColor => {
      roomHsl.forEach(roomColor => {
        const hueDiff = Math.abs(artColor.h - roomColor.h);
        const satDiff = Math.abs(artColor.s - roomColor.s);
        const lightDiff = Math.abs(artColor.l - roomColor.l);

        // Calculate harmony based on color theory
        let score = 0;
        if (hueDiff < 30 || hueDiff > 330) score += 0.8; // Similar hues
        else if (Math.abs(hueDiff - 180) < 30) score += 0.9; // Complementary
        else if (Math.abs(hueDiff - 120) < 30 || Math.abs(hueDiff - 240) < 30) score += 0.7; // Triadic

        // Saturation and lightness harmony
        if (satDiff < 20) score += 0.3;
        if (lightDiff < 20) score += 0.3;

        totalScore += score;
        comparisons++;
      });
    });

    return comparisons > 0 ? Math.min(totalScore / comparisons, 1) : 0;
  }

  determineHarmonyType(artworkHsl, roomHsl) {
    // Simplified harmony type detection
    return 'complementary';
  }

  getHarmonyRecommendation(score) {
    if (score > 0.8) return 'excellent';
    if (score > 0.6) return 'good';
    if (score > 0.4) return 'acceptable';
    return 'consider-alternatives';
  }
}

class SimpleARViewer {
  constructor() {
    this.isARSupported = false;
    this.isARActive = false;
    this.currentArtwork = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.ctx = null;
    this.artworksData = this.buildArtworksData();
    this.currentArtworkId = this.artworksData[0]?.id || null;
    this.i18nUnsubscribe = null;
    this.lightboxInitialized = false;
    this.boundLightboxKeydown = this.handleLightboxKeydown.bind(this);

    // Enhanced AR features
    this.placedArtworks = [];
    this.gestureDetector = null;
    this.faceDetector = null;
    this.environmentMesh = null;
    this.lightingEstimator = null;
    this.surfaceDetector = null;
    this.roomScanner = null;
    this.artworkSizeCalibrator = null;
    this.socialSharingManager = null;
    this.performanceMonitor = new PerformanceMonitor();
    this.analytics = new ARAnalytics();

    // AI-powered features
    this.roomStyleAnalyzer = new RoomStyleAnalyzer();
    this.artworkRecommendationEngine = new ArtworkRecommendationEngine();
    this.colorHarmonyAnalyzer = new ColorHarmonyAnalyzer();

    this.init();
  }

  async init() {
    try {
      await this.checkARSupport();
      this.setupARInterface();
      this.bindEvents();
      this.logDebug('Simple AR Viewer initialized');
    } catch (error) {
      this.logDebug('AR Viewer initialization failed, showing fallback');
      this.isARSupported = false;
    }
  }

  buildArtworksData() {
    return [
      {
        id: 'inner-peace',
        image: 'assets/images/artworks/inner-peace.jpg',
        translations: {
          uk: {
            title: 'Внутрішній Спокій',
            description: 'Заспокійлива абстракція, що створює атмосферу умиротворення',
            details: ['80×120 см', 'Акрил на полотні', '2024']
          },
          en: {
            title: 'Inner Peace',
            description: 'A calming abstraction that fills the room with serenity',
            details: ['80×120 cm', 'Acrylic on canvas', '2024']
          },
          de: {
            title: 'Innere Ruhe',
            description: 'Beruhigende Abstraktion, die den Raum mit Gelassenheit erfüllt',
            details: ['80×120 cm', 'Acryl auf Leinwand', '2024']
          }
        }
      },
      {
        id: 'sun-energy',
        image: 'assets/images/artworks/sun-energy.jpg',
        translations: {
          uk: {
            title: 'Сонячна Енергія',
            description: 'Динамічна композиція, що дарує бадьорість та позитивні емоції',
            details: ['90×90 см', 'Акрил на полотні', '2024']
          },
          en: {
            title: 'Sun Energy',
            description: 'A dynamic composition that brings vitality and positive energy',
            details: ['90×90 cm', 'Acrylic on canvas', '2024']
          },
          de: {
            title: 'Sonnenenergie',
            description: 'Dynamische Komposition, die Vitalität und positive Energie vermittelt',
            details: ['90×90 cm', 'Acryl auf Leinwand', '2024']
          }
        }
      },
      {
        id: 'harmony-flow',
        image: 'assets/images/artworks/harmony-flow.jpg',
        translations: {
          uk: {
            title: 'Потік Гармонії',
            description: 'Плавні лінії та кольори створюють відчуття балансу та руху',
            details: ['70×100 см', 'Змішана техніка', '2023']
          },
          en: {
            title: 'Harmony Flow',
            description: 'Flowing lines and colors create a sense of balance and movement',
            details: ['70×100 cm', 'Mixed media', '2023']
          },
          de: {
            title: 'Harmoniefluss',
            description: 'Fließende Linien und Farben schaffen ein Gefühl von Balance und Bewegung',
            details: ['70×100 cm', 'Mischtechnik', '2023']
          }
        }
      },
      {
        id: 'balance-stone',
        image: 'assets/images/artworks/balance-stone.jpg',
        translations: {
          uk: {
            title: 'Камінь Балансу',
            description: 'Стабільність та сила природи у сучасному мистецькому втіленні',
            details: ['80×120 см', 'Полотно, текстури', '2023']
          },
          en: {
            title: 'Balance Stone',
            description: 'The stability and strength of nature in a contemporary artistic expression',
            details: ['80×120 cm', 'Canvas with textured layers', '2023']
          },
          de: {
            title: 'Balance-Stein',
            description: 'Stabilität und Kraft der Natur in einer modernen künstlerischen Interpretation',
            details: ['80×120 cm', 'Leinwand mit Textur', '2023']
          }
        }
      }
    ];
  }

  async checkARSupport() {
    try {
      // Detect device type
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isTablet = /iPad/i.test(navigator.userAgent);
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      
      // AR only on mobile phones, not tablets or desktop
      this.isARSupported = isMobile && !isTablet && hasCamera && window.innerWidth < 768;
      
      this.logDebug(`AR Support: ${this.isARSupported} (Mobile: ${isMobile}, Width: ${window.innerWidth})`);
      return this.isARSupported;
    } catch (error) {
      this.isARSupported = false;
      return false;
    }
  }

  setupARInterface() {
    this.createARStyles();
    this.createARContainer();
  }

  createARStyles() {
    if (document.getElementById('simple-ar-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'simple-ar-styles';
    styles.textContent = `
      .simple-ar-container {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 2rem auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        overflow: hidden;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
      }

      .ar-video-container {
        position: relative;
        width: 100%;
        height: 400px;
        background: #000;
        border-radius: 16px;
        overflow: hidden;
      }

      .ar-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ar-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .ar-controls {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 15px;
        z-index: 10;
      }

      .ar-btn {
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .ar-btn:hover {
        background: white;
        transform: translateY(-2px);
      }

      .ar-fallback {
        padding: 40px;
        text-align: center;
      }

      .ar-fallback h3 {
        margin-bottom: 20px;
        font-size: 1.5rem;
      }

      .ar-fallback img {
        max-width: 100%;
        border-radius: 8px;
        margin: 20px 0;
      }

      .ar-instructions {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin: 20px;
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        z-index: 5;
      }

      /* Desktop Gallery Styles */
      .desktop-gallery {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 25px 60px rgba(44, 62, 80, 0.15), 0 10px 30px rgba(0,0,0,0.08);
        border: 1px solid rgba(230, 126, 34, 0.1);
      }
      
      .gallery-showcase {
        display: grid;
        grid-template-columns: 1fr 280px;
        grid-template-rows: 1fr auto;
        min-height: 600px;
        gap: 30px;
        padding: 40px;
      }
      
      .showcase-main {
        position: relative;
        background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 20px;
        overflow: hidden;
        grid-row: 1 / -1;
        border: 2px solid rgba(230, 126, 34, 0.1);
        box-shadow: inset 0 4px 20px rgba(0,0,0,0.05);
      }
      
      .showcase-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .showcase-main:hover .showcase-img {
        transform: scale(1.05);
      }
      
      .showcase-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(44, 62, 80, 0.95));
        padding: 35px;
        color: white;
        transform: translateY(100%);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
      }
      
      .showcase-main:hover .showcase-overlay {
        transform: translateY(0);
      }
      
      .artwork-info h3 {
        margin: 0 0 12px;
        font-size: 1.8rem;
        font-weight: 700;
        color: #ffffff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      .artwork-info p {
        margin: 0 0 20px;
        opacity: 0.95;
        line-height: 1.6;
        font-size: 1.05rem;
        color: #ecf0f1;
      }
      
      .artwork-details {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }
      
      .detail {
        background: rgba(230, 126, 34, 0.9);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      .gallery-thumbnails {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 15px 0;
        max-height: 520px;
        overflow-y: auto;
      }
      
      .thumbnail {
        width: 100%;
        height: 100px;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 3px solid rgba(230, 126, 34, 0.2);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }
      
      .thumbnail:hover,
      .thumbnail.active {
        opacity: 1;
        border-color: #e67e22;
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 8px 25px rgba(230, 126, 34, 0.3);
      }
      
      .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .gallery-controls {
        grid-column: 1 / -1;
        display: flex;
        gap: 20px;
        justify-content: center;
        padding-top: 30px;
        border-top: 2px solid rgba(230, 126, 34, 0.1);
        margin-top: 10px;
      }
      
      .gallery-btn {
        padding: 15px 30px;
        background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%);
        color: white;
        border: none;
        border-radius: 30px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 15px;
        box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);
        min-width: 180px;
      }
      
      .gallery-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(230, 126, 34, 0.4);
        background: linear-gradient(135deg, #d35400 0%, #e67e22 100%);
      }
      
      /* Lightbox styles */
      .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .lightbox.active {
        opacity: 1;
        pointer-events: all;
      }
      
      .lightbox-content {
        max-width: 90vw;
        max-height: 90vh;
        position: relative;
      }
      
      .lightbox-img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
      }
      
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 10px;
      }

      @media (max-width: 768px) {
        .simple-ar-container {
          margin: 1rem;
          border-radius: 12px;
        }
        
        .ar-instructions {
          font-size: 14px;
          padding: 15px;
        }
        
        .gallery-showcase {
          grid-template-columns: 1fr;
          grid-template-rows: 300px auto auto;
          height: auto;
        }
        
        .gallery-thumbnails {
          flex-direction: row;
          overflow-x: auto;
          padding: 10px;
        }
        
        .thumbnail {
          min-width: 80px;
          height: 60px;
        }
        
        .gallery-controls {
          flex-direction: column;
          gap: 10px;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  createARContainer() {
    // Find or create AR section in artworks
    let arSection = document.querySelector('#artworks .ar-section');
    if (!arSection) {
      const artworksSection = document.getElementById('artworks');
      if (artworksSection) {
        arSection = document.createElement('div');
        arSection.className = 'ar-section';
        
        if (this.isARSupported) {
          arSection.innerHTML = `
            <div class="section-header" style="text-align: center; margin-bottom: 2rem;">
              <h2 data-key="ar-title">Побачте у своєму просторі</h2>
              <p data-key="ar-instruction">Наведіть камеру на стіну і розмістіть картину</p>
            </div>
          `;
        } else {
          arSection.innerHTML = `
            <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
              <h2 data-key="artworks-title" style="color: #2c3e50; font-size: 2.5rem; margin-bottom: 1rem;">Доторкніться до Мистецтва</h2>
              <div class="section-line" style="width: 80px; height: 4px; background: linear-gradient(135deg, #e67e22, #f39c12); margin: 0 auto 1.5rem;"></div>
              <p data-key="artworks-subtitle" style="color: #5a6c7d; font-size: 1.1rem; line-height: 1.6;">Наведіть курсор на картину, щоб відчути її енергію</p>
            </div>
          `;
        }
        artworksSection.appendChild(arSection);
      }
    }

    if (arSection) {
      const arContainer = document.createElement('div');
      arContainer.className = 'simple-ar-container';
      arContainer.id = 'simple-ar-container';
      
      if (this.isARSupported) {
        arContainer.innerHTML = `
          <div class="ar-instructions">
            <h4 data-key="ar-instructions-title"></h4>
            <p data-key="ar-instructions-1"></p>
            <p data-key="ar-instructions-2"></p>
            <p data-key="ar-instructions-3"></p>
          </div>
          <div class="ar-fallback">
            <h3 data-key="ar-ready"></h3>
            <p data-key="ar-select-artwork"></p>
            <button class="ar-btn" data-action="start-ar">
              📱 <span data-key="ar-start"></span>
            </button>
          </div>
        `;
      } else {
        // Desktop Interactive Gallery
        arContainer.innerHTML = this.renderDesktopGallery();
      }
      
      arSection.appendChild(arContainer);
      this.applyTranslations();

      if (this.isARSupported) {
        const startButton = arContainer.querySelector('[data-action="start-ar"]');
        if (startButton) {
          startButton.addEventListener('click', () => this.startCamera());
        }
      } else {
        this.cacheGalleryElements(arContainer);
        this.setupDesktopGallery();
        this.applyGalleryLanguage();
      }
    }
  }

  renderDesktopGallery() {
    const thumbnails = this.artworksData
      .map((artwork, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-artwork-id="${artwork.id}">
          <img src="${artwork.image}" alt="">
        </div>
      `)
      .join('');

    const firstImage = this.artworksData[0]?.image || '';

    return `
      <div class="desktop-gallery">
        <div class="gallery-showcase">
          <div class="showcase-main">
            <img id="showcase-image" src="${firstImage}" alt="" class="showcase-img">
            <div class="showcase-overlay">
              <div class="artwork-info">
                <h3 id="showcase-title"></h3>
                <p id="showcase-description"></p>
                <div class="artwork-details" id="showcase-details"></div>
              </div>
            </div>
          </div>

          <div class="gallery-thumbnails">
            ${thumbnails}
          </div>

          <div class="gallery-controls">
            <button class="gallery-btn" data-action="open-lightbox">
              <i class="fas fa-search-plus" style="margin-right: 8px;"></i>
              <span data-key="gallery-view-details"></span>
            </button>
            <button class="gallery-btn" data-action="download-image">
              <i class="fas fa-download" style="margin-right: 8px;"></i>
              <span data-key="gallery-download"></span>
            </button>
            <button class="gallery-btn" data-action="share-artwork">
              <i class="fas fa-share-alt" style="margin-right: 8px;"></i>
              <span data-key="gallery-share"></span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  cacheGalleryElements(container) {
    this.galleryElements = {
      container,
      showcaseImage: container.querySelector('#showcase-image'),
      showcaseTitle: container.querySelector('#showcase-title'),
      showcaseDescription: container.querySelector('#showcase-description'),
      showcaseDetails: container.querySelector('#showcase-details'),
      thumbnails: Array.from(container.querySelectorAll('.thumbnail'))
    };
  }

  async startCamera() {
    if (!this.isARSupported) {
      this.showFallback();
      return;
    }

    try {
      const container = document.getElementById('simple-ar-container');
      if (!container) return;

      container.innerHTML = `
        <div class="ar-video-container">
          <video class="ar-video" id="ar-video" autoplay playsinline></video>
          <canvas class="ar-canvas" id="ar-canvas"></canvas>
          <div class="ar-instructions">
            <p data-key="ar-camera-active">📷 Камера активна! Наведіть на стіну</p>
          </div>
          <div class="ar-controls">
            <button class="ar-btn" data-action="place-artwork">
              🖼️ <span data-key="ar-place-artwork">Розмістити картину</span>
            </button>
            <button class="ar-btn" data-action="stop-ar">
              ❌ <span data-key="ar-stop">Зупинити</span>
            </button>
          </div>
        </div>
      `;

      const placeBtn = container.querySelector('[data-action="place-artwork"]');
      if (placeBtn) {
        placeBtn.addEventListener('click', () => this.placeArtwork());
      }

      const stopBtn = container.querySelector('[data-action="stop-ar"]');
      if (stopBtn) {
        stopBtn.addEventListener('click', () => this.stopAR());
      }

      this.applyTranslations();

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.videoElement = document.getElementById('ar-video');
      this.canvasElement = document.getElementById('ar-canvas');
      this.ctx = this.canvasElement.getContext('2d');

      this.videoElement.srcObject = stream;
      this.isARActive = true;

      // Setup canvas overlay
      this.setupCanvas();
      
      this.logDebug('AR camera started successfully');

    } catch (error) {
      this.logDebug('Camera access failed:', error);
      this.showCameraError();
    }
  }

  setupCanvas() {
    if (!this.canvasElement || !this.videoElement) return;

    // Resize canvas to match video
    const resizeCanvas = () => {
      const video = this.videoElement;
      const canvas = this.canvasElement;
      
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;
    };

    this.videoElement.addEventListener('loadedmetadata', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    
    // Initial resize
    setTimeout(resizeCanvas, 100);
  }

  placeArtwork() {
    if (!this.ctx || !this.canvasElement) return;

    const canvas = this.canvasElement;
    const ctx = this.ctx;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Покращені розміри з пропорціями реальних картин
    const artworkWidth = Math.min(canvas.width * 0.5, 400);
    const artworkHeight = artworkWidth * 1.25; // Реалістичні пропорції
    const x = (canvas.width - artworkWidth) / 2;
    const y = (canvas.height - artworkHeight) / 2;

    // Тінь для глибини
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;

    // Дерев'яна рамка (реалістична)
    const frameWidth = 8;
    const gradient = ctx.createLinearGradient(x - frameWidth, y - frameWidth, x + frameWidth, y + frameWidth);
    gradient.addColorStop(0, '#8B7355');
    gradient.addColorStop(0.5, '#A0826D');
    gradient.addColorStop(1, '#6F5C4E');

    ctx.fillStyle = gradient;
    ctx.fillRect(x - frameWidth, y - frameWidth, artworkWidth + frameWidth * 2, artworkHeight + frameWidth * 2);

    // Скидання тіні
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Білий фон полотна
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(x, y, artworkWidth, artworkHeight);

    // Реалістичний градієнт абстракції
    const artGradient = ctx.createLinearGradient(x, y, x + artworkWidth, y + artworkHeight);
    artGradient.addColorStop(0, '#667eea');
    artGradient.addColorStop(0.3, '#764ba2');
    artGradient.addColorStop(0.7, '#e67e22');
    artGradient.addColorStop(1, '#f39c12');

    ctx.fillStyle = artGradient;
    ctx.fillRect(x + 15, y + 15, artworkWidth - 30, artworkHeight - 30);

    // Додаткові абстрактні елементи
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + artworkWidth * 0.3, y + artworkHeight * 0.4, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(x + artworkWidth * 0.7, y + artworkHeight * 0.6, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Відображення розмірів
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(x + artworkWidth - 80, y + artworkHeight - 35, 75, 30);
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('120 × 80 см', x + artworkWidth - 42, y + artworkHeight - 15);

    // Show placement success message
    const message = window.ultraI18n?.translate('ar-artwork-placed') || 'Картину розміщено! 🎨';
    this.showARMessage(message);

    this.logDebug('Artwork placed in AR view with enhanced rendering');
  }

  showARMessage(message) {
    const existingMessage = document.querySelector('.ar-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('div');
    messageEl.className = 'ar-message';
    messageEl.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-weight: bold;
      z-index: 20;
      pointer-events: none;
    `;
    messageEl.textContent = message;
    
    const container = document.getElementById('simple-ar-container');
    if (container) {
      container.appendChild(messageEl);
      setTimeout(() => messageEl.remove(), 3000);
    }
  }

  stopAR() {
    this.isARActive = false;
    
    // Stop camera stream
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    // Reset container
    const container = document.getElementById('simple-ar-container');
    if (container) {
      container.innerHTML = `
        <div class="ar-fallback">
          <h3 data-key="ar-session-ended"></h3>
          <p data-key="ar-thanks"></p>
          <button class="ar-btn" data-action="restart-ar">
            🔄 <span data-key="ar-restart"></span>
          </button>
        </div>
      `;
      const restartBtn = container.querySelector('[data-action="restart-ar"]');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => this.startCamera());
      }
      this.applyTranslations();
    }
    
    this.logDebug('AR session stopped');
  }

  showCameraError() {
    const container = document.getElementById('simple-ar-container');
    if (container) {
      container.innerHTML = `
        <div class="ar-fallback">
          <h3 data-key="ar-camera-error"></h3>
          <p data-key="ar-camera-access-denied"></p>
          <p data-key="ar-check-permissions"></p>
          <button class="ar-btn" data-action="retry-ar">
            🔄 <span data-key="ar-try-again"></span>
          </button>
        </div>
      `;
      const retryBtn = container.querySelector('[data-action="retry-ar"]');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => this.startCamera());
      }
      this.applyTranslations();
    }
  }

  showFallback(artwork = null) {
    const container = document.getElementById('simple-ar-container');
    if (container) {
      let localizedArtwork = null;
      if (artwork?.id) {
        localizedArtwork = this.getLocalizedArtwork(artwork.id);
      } else if (artwork?.title) {
        localizedArtwork = artwork;
      } else if (this.currentArtworkId) {
        localizedArtwork = this.getLocalizedArtwork(this.currentArtworkId);
      }

      let content = `
        <div class="ar-fallback">
          <h3 data-key="ar-unavailable"></h3>
          <p data-key="ar-mobile-only"></p>
      `;

      if (localizedArtwork?.image) {
        const description = localizedArtwork.description ? `<p style="margin-top: 8px;">${localizedArtwork.description}</p>` : '';
        content += `
          <figure style="margin: 20px 0;">
            <img src="${localizedArtwork.image}" alt="${localizedArtwork.title || ''}" style="max-width: 300px; border-radius: 8px;">
            <figcaption style="margin-top: 12px; font-weight: 600;">${localizedArtwork.title || ''}</figcaption>
            ${description}
          </figure>
        `;
      }

      content += `</div>`;
      container.innerHTML = content;
      this.applyTranslations();
    }
  }

  // Desktop Gallery Functions
  setupDesktopGallery() {
    if (!this.galleryElements) return;

    const { thumbnails, container } = this.galleryElements;

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        this.setCurrentArtwork(thumb.dataset.artworkId);
      });
    });

    const openBtn = container.querySelector('[data-action="open-lightbox"]');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.openLightbox());
    }

    const downloadBtn = container.querySelector('[data-action="download-image"]');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    const shareBtn = container.querySelector('[data-action="share-artwork"]');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareArtwork());
    }

    const initialArtworkId = this.currentArtworkId || this.artworksData[0]?.id;
    if (initialArtworkId) {
      this.setCurrentArtwork(initialArtworkId, { updateActive: true });
    }

    this.createLightbox();
  }

  createLightbox() {
    if (this.lightboxInitialized) return;

    let lightbox = document.getElementById('artwork-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.id = 'artwork-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" data-action="close-lightbox">✕</button>
          <img class="lightbox-img" id="lightbox-image" src="" alt="Artwork">
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target?.matches('[data-action="close-lightbox"]')) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', this.boundLightboxKeydown);
    this.lightboxInitialized = true;
  }

  handleLightboxKeydown(event) {
    if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }

  openLightbox() {
    const lightbox = document.getElementById('artwork-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');

    if (lightbox && lightboxImg && this.currentArtwork) {
      lightboxImg.src = this.currentArtwork.image;
      lightboxImg.alt = this.currentArtwork.title || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    const lightbox = document.getElementById('artwork-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  getCurrentLanguage() {
    return window.ultraI18n?.getCurrentLanguage?.() || 'uk';
  }

  getFallbackLanguage() {
    return 'uk';
  }

  getLocalizedArtwork(artworkId, lang = this.getCurrentLanguage()) {
    const artwork = this.artworksData.find(item => item.id === artworkId);
    if (!artwork) return null;

    const translations = artwork.translations[lang]
      || artwork.translations[this.getFallbackLanguage()]
      || Object.values(artwork.translations)[0];

    if (!translations) return null;

    return {
      id: artwork.id,
      image: artwork.image,
      title: translations.title,
      description: translations.description,
      details: translations.details
    };
  }

  setCurrentArtwork(artworkId, { updateActive = true } = {}) {
    if (!artworkId) return;
    const localized = this.getLocalizedArtwork(artworkId);
    if (!localized) return;

    this.currentArtworkId = artworkId;
    this.currentArtwork = localized;

    if (!this.galleryElements) return;
    const { showcaseImage, showcaseTitle, showcaseDescription, showcaseDetails, thumbnails } = this.galleryElements;

    if (showcaseImage) {
      showcaseImage.src = localized.image;
      showcaseImage.alt = localized.title || '';
    }

    if (showcaseTitle) {
      showcaseTitle.textContent = localized.title || '';
    }

    if (showcaseDescription) {
      showcaseDescription.textContent = localized.description || '';
    }

    if (showcaseDetails) {
      showcaseDetails.innerHTML = '';
      (localized.details || []).forEach(detail => {
        const span = document.createElement('span');
        span.className = 'detail';
        span.textContent = detail;
        showcaseDetails.appendChild(span);
      });
    }

    if (updateActive && Array.isArray(thumbnails)) {
      thumbnails.forEach(thumb => {
        thumb.classList.toggle('active', thumb.dataset.artworkId === artworkId);
      });
    }
  }

  applyGalleryLanguage() {
    if (!this.galleryElements) return;

    const lang = this.getCurrentLanguage();
    const { thumbnails } = this.galleryElements;

    if (Array.isArray(thumbnails)) {
      thumbnails.forEach(thumb => {
        const localized = this.getLocalizedArtwork(thumb.dataset.artworkId, lang);
        if (!localized) return;
        const image = thumb.querySelector('img');
        thumb.setAttribute('title', localized.title || '');
        if (image) {
          image.alt = localized.title || '';
        }
      });
    }

    if (this.currentArtworkId) {
      this.setCurrentArtwork(this.currentArtworkId, { updateActive: false });
    }
  }

  applyTranslations() {
    if (window.ultraI18n?.updateAllElements) {
      window.ultraI18n.updateAllElements();
    }
  }

  onLanguageChanged() {
    this.applyTranslations();
    if (this.isARSupported) {
      // Update AR interface instructions if AR is available and idle
      if (!this.isARActive) {
        const container = document.getElementById('simple-ar-container');
        if (container && container.querySelector('.ar-instructions')) {
          this.applyTranslations();
        }
      }
    } else {
      this.applyGalleryLanguage();
    }
  }

  downloadImage() {
    const showcaseImg = document.getElementById('showcase-image');
    if (showcaseImg && this.currentArtwork) {
      const link = document.createElement('a');
      link.href = showcaseImg.src;
      const slugBase = this.currentArtwork.id || this.currentArtwork.title || 'artwork';
      const slug = slugBase.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'artwork';
      link.download = `inner-garden-${slug}.jpg`;
      link.click();
      
      const message = window.ultraI18n?.translate('gallery-image-saved') || '🎨 Зображення збережено!';
      this.showGalleryMessage(message);
    }
  }

  shareArtwork() {
    if (this.currentArtwork && navigator.share) {
      navigator.share({
        title: `Inner Garden - ${this.currentArtwork.title}`,
        text: this.currentArtwork.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        const message = window.ultraI18n?.translate('gallery-link-copied') || '🔗 Посилання скопійовано!';
        this.showGalleryMessage(message);
      }).catch(() => {
        const message = window.ultraI18n?.translate('gallery-share-page') || '📤 Поділіться цією сторінкою!';
        this.showGalleryMessage(message);
      });
    }
  }

  showGalleryMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-weight: bold;
      z-index: 10001;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
      messageEl.style.opacity = '1';
      messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateX(100%)';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  // Public API
  viewArtworkInAR(artwork) {
    if (artwork?.id && this.getLocalizedArtwork(artwork.id)) {
      this.currentArtworkId = artwork.id;
      this.currentArtwork = this.getLocalizedArtwork(artwork.id);

      if (!this.isARSupported && this.galleryElements) {
        this.setCurrentArtwork(artwork.id);
      }
    } else if (artwork) {
      this.currentArtwork = artwork;
    }

    if (this.isARSupported) {
      this.startCamera();
    } else {
      const fallbackArtwork = artwork?.id ? this.currentArtwork : artwork;
      this.showFallback(fallbackArtwork || this.currentArtwork);
    }
  }

  bindEvents() {
    // Listen for artwork selection events
    document.addEventListener('artwork-selected-for-ar', (event) => {
      this.viewArtworkInAR(event.detail.artwork);
    });
    
    // Make globally accessible
    window.simpleARViewer = this;

    if (window.ultraI18n?.subscribe) {
      this.i18nUnsubscribe = window.ultraI18n.subscribe((event) => {
        if (event === 'languageChanged') {
          this.onLanguageChanged();
        }
      });
    }
  }

  logDebug(message, data = null) {
    if (window.InnerGarden?.errorHandler) {
      window.InnerGarden.errorHandler.logInfo(`[SimpleAR] ${message}`, data);
    } else {
      console.log(`[SimpleAR] ${message}`, data);
    }
  }

  destroy() {
    this.stopAR();
    
    // Remove global reference
    delete window.simpleARViewer;

    if (typeof this.i18nUnsubscribe === 'function') {
      this.i18nUnsubscribe();
      this.i18nUnsubscribe = null;
    }

    document.removeEventListener('keydown', this.boundLightboxKeydown);
  }
}

// Initialize Simple AR Viewer
let simpleARViewer;

document.addEventListener('DOMContentLoaded', () => {
  simpleARViewer = new SimpleARViewer();
  
  // Make available globally
  window.InnerGarden = window.InnerGarden || {};
  window.InnerGarden.arViewer = simpleARViewer;
  
  console.log('📱 Simple AR Viewer initialized');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (simpleARViewer) {
    simpleARViewer.destroy();
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleARViewer;
}
