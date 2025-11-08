/* Inner Garden - Enhanced AR Viewer (Optimized & Accurate) */
(function() {
  'use strict';

  class EnhancedARViewer {
    constructor() {
      this.modal = null;
      this.video = null;
      this.canvas = null;
      this.ctx = null;
      this.artworkImg = null;
      this.stream = null;

      // AR State
      this.artwork = {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        width: 300,
        height: 400,
        isDragging: false,
        startX: 0,
        startY: 0
      };

      // Touch/Mouse state
      this.touchStart = { x: 0, y: 0, distance: 0, rotation: 0 };
      this.lastTap = 0;

      // Performance
      this.rafId = null;
      this.lastRender = 0;
      this.targetFPS = 60;

      this.init();
    }

    init() {
      this.createModal();
      this.setupEventListeners();
    }

    createModal() {
      this.modal = document.createElement('div');
      this.modal.className = 'ar-viewer-enhanced';
      this.modal.innerHTML = `
        <div class="ar-viewer-content">
          <button class="ar-close-btn" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>

          <div class="ar-header">
            <h3 class="ar-title">AR Примірка</h3>
            <p class="ar-subtitle">Подивіться, як картина виглядатиме у вашому просторі</p>
          </div>

          <div class="ar-stage-wrapper">
            <video class="ar-video" autoplay playsinline muted></video>
            <canvas class="ar-canvas"></canvas>
            <div class="ar-fallback-container hidden">
              <img class="ar-fallback-image" src="" alt="Room">
              <canvas class="ar-fallback-canvas"></canvas>
            </div>
          </div>

          <div class="ar-controls">
            <div class="ar-control-group">
              <label class="ar-control-label">
                <i class="fas fa-search-plus"></i>
                Розмір
              </label>
              <input type="range" class="ar-slider ar-scale-slider" min="0.3" max="2.5" step="0.01" value="1">
            </div>

            <div class="ar-control-group">
              <label class="ar-control-label">
                <i class="fas fa-sync-alt"></i>
                Поворот
              </label>
              <input type="range" class="ar-slider ar-rotation-slider" min="0" max="360" step="1" value="0">
            </div>

            <div class="ar-actions">
              <button class="ar-btn ar-reset-btn">
                <i class="fas fa-undo"></i>
                Скинути
              </button>
              <button class="ar-btn ar-capture-btn">
                <i class="fas fa-camera"></i>
                Зберегти фото
              </button>
              <button class="ar-btn ar-switch-camera-btn hidden">
                <i class="fas fa-sync"></i>
                Змінити камеру
              </button>
            </div>
          </div>

          <div class="ar-instructions">
            <div class="ar-instruction-item">
              <i class="fas fa-hand-pointer"></i>
              <span>Перетягуйте картину пальцем</span>
            </div>
            <div class="ar-instruction-item">
              <i class="fas fa-expand-arrows-alt"></i>
              <span>Pinch для зміни розміру</span>
            </div>
            <div class="ar-instruction-item">
              <i class="fas fa-redo"></i>
              <span>Поворот двома пальцями</span>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.modal);

      // Get references
      this.video = this.modal.querySelector('.ar-video');
      this.canvas = this.modal.querySelector('.ar-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.fallbackContainer = this.modal.querySelector('.ar-fallback-container');
      this.fallbackImage = this.modal.querySelector('.ar-fallback-image');
      this.fallbackCanvas = this.modal.querySelector('.ar-fallback-canvas');
      this.fallbackCtx = this.fallbackCanvas.getContext('2d');

      // Add styles
      this.addStyles();
    }

    setupEventListeners() {
      // Close button
      this.modal.querySelector('.ar-close-btn').addEventListener('click', () => this.close());

      // Controls
      this.modal.querySelector('.ar-scale-slider').addEventListener('input', (e) => {
        this.artwork.scale = parseFloat(e.target.value);
      });

      this.modal.querySelector('.ar-rotation-slider').addEventListener('input', (e) => {
        this.artwork.rotation = parseFloat(e.target.value);
      });

      this.modal.querySelector('.ar-reset-btn').addEventListener('click', () => this.reset());
      this.modal.querySelector('.ar-capture-btn').addEventListener('click', () => this.capture());

      // Touch/Mouse events on canvas
      this.setupInteractionEvents();
    }

    setupInteractionEvents() {
      const activeCanvas = this.canvas;

      // Touch events
      activeCanvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
      activeCanvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      activeCanvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

      // Mouse events
      activeCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      activeCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      activeCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));

      // Wheel for scaling
      activeCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        this.artwork.scale = Math.max(0.3, Math.min(2.5, this.artwork.scale + delta));
        this.modal.querySelector('.ar-scale-slider').value = this.artwork.scale;
      }, { passive: false });
    }

    handleTouchStart(e) {
      e.preventDefault();

      if (e.touches.length === 1) {
        // Single touch - drag
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.artwork.isDragging = true;
        this.artwork.startX = touch.clientX - rect.left - this.artwork.x;
        this.artwork.startY = touch.clientY - rect.top - this.artwork.y;

        // Double tap detection
        const currentTime = new Date().getTime();
        const tapLength = currentTime - this.lastTap;
        if (tapLength < 300 && tapLength > 0) {
          this.reset();
        }
        this.lastTap = currentTime;

      } else if (e.touches.length === 2) {
        // Two touches - pinch and rotate
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        this.touchStart.distance = this.getDistance(touch1, touch2);
        this.touchStart.rotation = this.getAngle(touch1, touch2);
        this.touchStart.scale = this.artwork.scale;
        this.touchStart.rotationValue = this.artwork.rotation;
      }
    }

    handleTouchMove(e) {
      e.preventDefault();

      if (e.touches.length === 1 && this.artwork.isDragging) {
        // Drag
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.artwork.x = touch.clientX - rect.left - this.artwork.startX;
        this.artwork.y = touch.clientY - rect.top - this.artwork.startY;

      } else if (e.touches.length === 2) {
        // Pinch and rotate
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Scale
        const currentDistance = this.getDistance(touch1, touch2);
        const scaleChange = currentDistance / this.touchStart.distance;
        this.artwork.scale = Math.max(0.3, Math.min(2.5, this.touchStart.scale * scaleChange));
        this.modal.querySelector('.ar-scale-slider').value = this.artwork.scale;

        // Rotation
        const currentRotation = this.getAngle(touch1, touch2);
        const rotationChange = currentRotation - this.touchStart.rotation;
        this.artwork.rotation = (this.touchStart.rotationValue + rotationChange) % 360;
        if (this.artwork.rotation < 0) this.artwork.rotation += 360;
        this.modal.querySelector('.ar-rotation-slider').value = this.artwork.rotation;
      }
    }

    handleTouchEnd(e) {
      this.artwork.isDragging = false;
    }

    handleMouseDown(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.artwork.isDragging = true;
      this.artwork.startX = e.clientX - rect.left - this.artwork.x;
      this.artwork.startY = e.clientY - rect.top - this.artwork.y;
    }

    handleMouseMove(e) {
      if (!this.artwork.isDragging) return;

      const rect = this.canvas.getBoundingClientRect();
      this.artwork.x = e.clientX - rect.left - this.artwork.startX;
      this.artwork.y = e.clientY - rect.top - this.artwork.startY;
    }

    handleMouseUp(e) {
      this.artwork.isDragging = false;
    }

    getDistance(touch1, touch2) {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    getAngle(touch1, touch2) {
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    async open(artworkData) {
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Load artwork
      this.artworkImg = new Image();
      this.artworkImg.crossOrigin = 'anonymous';
      this.artworkImg.src = artworkData.image;

      await new Promise((resolve) => {
        this.artworkImg.onload = resolve;
      });

      // Try camera first
      const cameraSuccess = await this.startCamera();

      if (!cameraSuccess) {
        // Fallback to static image
        this.useFallback();
      }

      // Start render loop
      this.startRenderLoop();
    }

    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        this.video.srcObject = this.stream;
        await this.video.play();

        // Set canvas size
        this.video.addEventListener('loadedmetadata', () => {
          this.canvas.width = this.video.videoWidth;
          this.canvas.height = this.video.videoHeight;

          // Center artwork
          this.artwork.x = this.canvas.width / 2;
          this.artwork.y = this.canvas.height / 2;
        });

        return true;
      } catch (error) {
        console.error('Camera error:', error);
        return false;
      }
    }

    useFallback() {
      // Use fallback room image
      this.fallbackImage.src = 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/25_my6afc.webp';
      this.fallbackContainer.classList.remove('hidden');
      this.video.style.display = 'none';

      this.fallbackImage.onload = () => {
        this.fallbackCanvas.width = this.fallbackImage.naturalWidth;
        this.fallbackCanvas.height = this.fallbackImage.naturalHeight;

        // Center artwork
        this.artwork.x = this.fallbackCanvas.width / 2;
        this.artwork.y = this.fallbackCanvas.height / 2;
      };
    }

    startRenderLoop() {
      const render = (timestamp) => {
        // Throttle to target FPS
        if (timestamp - this.lastRender < 1000 / this.targetFPS) {
          this.rafId = requestAnimationFrame(render);
          return;
        }
        this.lastRender = timestamp;

        // Draw frame
        if (this.stream) {
          this.renderCameraView();
        } else {
          this.renderFallbackView();
        }

        this.rafId = requestAnimationFrame(render);
      };

      this.rafId = requestAnimationFrame(render);
    }

    renderCameraView() {
      // Draw video frame
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

      // Draw artwork
      this.drawArtwork(this.ctx);
    }

    renderFallbackView() {
      // Draw background
      this.fallbackCtx.drawImage(this.fallbackImage, 0, 0, this.fallbackCanvas.width, this.fallbackCanvas.height);

      // Draw artwork
      this.drawArtwork(this.fallbackCtx);
    }

    drawArtwork(ctx) {
      ctx.save();

      // Transform
      ctx.translate(this.artwork.x, this.artwork.y);
      ctx.rotate(this.artwork.rotation * Math.PI / 180);
      ctx.scale(this.artwork.scale, this.artwork.scale);

      // Draw image centered
      const w = this.artwork.width;
      const h = this.artwork.height;
      ctx.drawImage(this.artworkImg, -w / 2, -h / 2, w, h);

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3 / this.artwork.scale;
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      ctx.restore();
    }

    reset() {
      const activeCanvas = this.stream ? this.canvas : this.fallbackCanvas;

      this.artwork.x = activeCanvas.width / 2;
      this.artwork.y = activeCanvas.height / 2;
      this.artwork.scale = 1;
      this.artwork.rotation = 0;

      this.modal.querySelector('.ar-scale-slider').value = 1;
      this.modal.querySelector('.ar-rotation-slider').value = 0;
    }

    capture() {
      const activeCanvas = this.stream ? this.canvas : this.fallbackCanvas;

      // Create download link
      activeCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inner-garden-ar-${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);

        if (typeof window.showToast === 'function') {
          window.showToast('✅ Фото збережено!', 2000);
        }
      }, 'image/jpeg', 0.95);
    }

    close() {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';

      // Stop camera
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      // Stop render loop
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      // Reset
      this.artwork.scale = 1;
      this.artwork.rotation = 0;
    }

    addStyles() {
      if (document.getElementById('ar-viewer-enhanced-styles')) return;

      const style = document.createElement('style');
      style.id = 'ar-viewer-enhanced-styles';
      style.textContent = `
        .ar-viewer-enhanced {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.95);
          display: none;
          align-items: center;
          justify-content: center;
        }

        .ar-viewer-enhanced.open {
          display: flex;
        }

        .ar-viewer-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .ar-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        .ar-close-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .ar-header {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
          z-index: 10;
          background: rgba(0, 0, 0, 0.6);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .ar-title {
          font-size: 1.25rem;
          margin: 0 0 0.25rem;
        }

        .ar-subtitle {
          font-size: 0.85rem;
          margin: 0;
          opacity: 0.9;
        }

        .ar-stage-wrapper {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .ar-video, .ar-canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .ar-canvas {
          z-index: 2;
          cursor: move;
          touch-action: none;
        }

        .ar-fallback-container {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .ar-fallback-container.hidden {
          display: none;
        }

        .ar-fallback-image, .ar-fallback-canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .ar-fallback-canvas {
          z-index: 2;
          cursor: move;
          touch-action: none;
        }

        .ar-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.6));
          padding: 1.5rem;
          z-index: 10;
        }

        .ar-control-group {
          margin-bottom: 1rem;
        }

        .ar-control-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .ar-slider {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
          -webkit-appearance: none;
        }

        .ar-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .ar-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .ar-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .ar-btn {
          flex: 1;
          padding: 0.875rem 1rem;
          border: none;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .ar-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .ar-btn.hidden {
          display: none;
        }

        .ar-instructions {
          position: absolute;
          bottom: 180px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          z-index: 9;
        }

        .ar-instruction-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.75rem;
          background: rgba(0, 0, 0, 0.6);
          padding: 0.75rem;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .ar-instruction-item i {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .ar-header {
            top: 0.5rem;
            padding: 0.5rem 1rem;
          }

          .ar-title {
            font-size: 1rem;
          }

          .ar-subtitle {
            font-size: 0.75rem;
          }

          .ar-controls {
            padding: 1rem;
          }

          .ar-actions {
            flex-direction: column;
          }

          .ar-instructions {
            bottom: 220px;
            flex-direction: column;
            gap: 0.5rem;
          }

          .ar-instruction-item {
            flex-direction: row;
            padding: 0.5rem 0.75rem;
            font-size: 0.7rem;
          }

          .ar-instruction-item i {
            font-size: 1.25rem;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Create global instance
  window.ARViewerEnhanced = new EnhancedARViewer();

  // Override old AR viewer open method
  window.ARViewer = {
    open: (artworkData) => {
      window.ARViewerEnhanced.open(artworkData);
    }
  };
})();
