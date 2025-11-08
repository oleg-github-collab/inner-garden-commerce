/* Inner Garden – Reliable mobile-first AR try-on */
(function () {
  'use strict';

  const SUPPORTS_CAMERA = Boolean(
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );

  const CAMERA_CONSTRAINTS = {
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  };

  const CAMERA_TIMEOUT = 9000;
  const MOBILE_REGEX = /Android|iPhone|iPad|iPod|Pixel|Windows Phone/i;

  const SAMPLE_BACKDROPS = [
    '',
    'assets/images/collection/placeholder-room.jpg',
    'assets/images/collection/placeholder-main.jpg',
    'assets/images/collection/placeholder-detail.jpg'
  ];

  const SELECTORS = {
    modal: 'ar-modal',
    stage: 'ar-stage',
    video: 'ar-video',
    overlay: 'ar-overlay',
    artwork: 'ar-artwork',
    fallback: 'ar-fallback',
    fallbackBackdrop: 'ar-fallback-backdrop',
    scaleInput: 'ar-scale',
    rotationInput: 'ar-rotation',
    resetButton: 'ar-reset',
    backdropButton: 'ar-backdrop',
    uploadButton: 'ar-upload',
    captureButton: 'ar-capture',
    doneButton: 'ar-done',
    closeButton: 'ar-modal-close',
    hint: 'ar-hint',
    status: 'ar-status'
  };

  const SCALE_MIN = 0.6;
  const SCALE_MAX = 2.2;

  const translateKey = (key, fallback) => {
    if (typeof window.t === 'function') {
      const value = window.t(key);
      if (value && value !== key) {
        return value;
      }
    }
    return fallback;
  };

  const showToast = (message, duration = 2600) => {
    if (typeof window.showToast === 'function') {
      window.showToast(message, duration);
    } else {
      console.log(`[AR Viewer] ${message}`);
    }
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  class ARViewer {
    constructor() {
      this.modal = document.getElementById(SELECTORS.modal);
      this.stage = document.getElementById(SELECTORS.stage);
      this.video = document.getElementById(SELECTORS.video);
      this.overlay = document.getElementById(SELECTORS.overlay);
      this.artworkImg = document.getElementById(SELECTORS.artwork);
      this.fallback = document.getElementById(SELECTORS.fallback);
      this.fallbackBackdrop = document.getElementById(SELECTORS.fallbackBackdrop);
      this.scaleInput = document.getElementById(SELECTORS.scaleInput);
      this.rotationInput = document.getElementById(SELECTORS.rotationInput);
      this.resetBtn = document.getElementById(SELECTORS.resetButton);
      this.backdropBtn = document.getElementById(SELECTORS.backdropButton);
      this.uploadBtn = document.getElementById(SELECTORS.uploadButton);
      this.captureBtn = document.getElementById(SELECTORS.captureButton);
      this.doneBtn = document.getElementById(SELECTORS.doneButton);
      this.closeBtn = document.getElementById(SELECTORS.closeButton);
      this.hint = document.getElementById(SELECTORS.hint);
      this.status = document.getElementById(SELECTORS.status);

      this.statusContent = this.status?.querySelector('.ar-status-content') || null;
      this.statusIcon = this.statusContent?.querySelector('i') || null;
      this.statusText = this.statusContent?.querySelector('.ar-status-text') || null;
      this.statusSpinner = null;

      this.stream = null;
      this.cameraTimeoutId = null;
      this.pendingCameraRequest = false;
      this.customBackdropUrl = null;
      this.backdropIndex = 0;
      this.sampleBackdrops = [...SAMPLE_BACKDROPS];

      this.activeArtwork = null;
      this.aspectRatio = 1;
      this.baseWidth = 280;

      this.position = { x: 0, y: 0 };
      this.startPosition = { x: 0, y: 0 };
      this.scale = 1;
      this.rotation = 0;

      this.pointerId = null;
      this.dragging = false;
      this.startDrag = { x: 0, y: 0 };

      this.keydownHandler = null;
      this.visibilityHandler = this.handleVisibilityChange.bind(this);
      this.resizeHandler = this.handleResize.bind(this);

      this.hasCamera = SUPPORTS_CAMERA;
      this.prefersCamera = SUPPORTS_CAMERA;
      this.isMobile = MOBILE_REGEX.test(navigator.userAgent || '');
      this.currentStatusKey = null;
      this.isOpen = false;

      this.init();
    }

    init() {
      if (!this.modal || !this.stage || !this.overlay || !this.artworkImg) {
        console.warn('[AR Viewer] Required elements not found. AR preview disabled.');
        return;
      }

      this.uploadInput = this.createUploadInput();
      this.prepareStatus();
      this.bindControls();
      this.hideModal();
      this.updateHint(this.hasCamera ? 'ar-hint' : 'ar-no-camera-hint');

      window.arViewer = this;
      window.ARViewer = this;

      window.addEventListener('language:change', () => {
        this.updateHint(this.stream ? 'ar-hint' : 'ar-no-camera-hint');
        this.refreshStatusMessage();
      });
    }

    prepareStatus() {
      if (!this.statusContent) {
        return;
      }
      this.statusSpinner = document.createElement('div');
      this.statusSpinner.className = 'ar-status-spinner';
      this.statusSpinner.hidden = true;
      this.statusContent.insertBefore(this.statusSpinner, this.statusText);
    }

    createUploadInput() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = this.isMobile ? 'environment' : '';
      input.hidden = true;
      input.addEventListener('change', (event) => this.handleUploadChange(event));
      this.modal?.appendChild(input);
      return input;
    }

    bindControls() {
      this.closeBtn?.addEventListener('click', () => this.close());
      this.doneBtn?.addEventListener('click', () => this.close());
      this.resetBtn?.addEventListener('click', () => this.resetTransform());
      this.backdropBtn?.addEventListener('click', () => this.toggleBackdrop());
      this.captureBtn?.addEventListener('click', () => this.captureFrame());
      this.uploadBtn?.addEventListener('click', () => this.requestUpload());

      this.scaleInput?.addEventListener('input', (event) => {
        const value = Number(event.target.value || 100) / 100;
        this.scale = clamp(value, SCALE_MIN, SCALE_MAX);
        this.applyTransform();
      });

      this.rotationInput?.addEventListener('input', (event) => {
        this.rotation = Number(event.target.value || 0);
        this.applyTransform();
      });

      this.overlay.addEventListener('pointerdown', (event) => this.onPointerDown(event));
      window.addEventListener('pointermove', (event) => this.onPointerMove(event));
      window.addEventListener('pointerup', (event) => this.onPointerUp(event));

      this.stage.addEventListener('wheel', (event) => this.onWheel(event), { passive: false });
    }

    showArtwork(artwork) {
      if (!artwork) {
        return;
      }

      this.activeArtwork = artwork;

      const src = artwork.image || artwork.preview || artwork.src || '';
      const alt = artwork.alt ||
        artwork.title ||
        translateKey('ar-preview-alt', 'Попередній перегляд картини');

      if (src) {
        this.artworkImg.src = src;
      }
      this.artworkImg.alt = alt;

      if (this.artworkImg.complete) {
        this.onArtworkLoaded();
      } else {
        this.artworkImg.onload = () => this.onArtworkLoaded();
      }

      this.resetTransform();
      this.showModal();
      this.attachLifecycleEvents();

      if (this.hasCamera && this.prefersCamera) {
        this.startCamera();
      } else {
        this.showFallback('no-camera');
      }
    }

    open(payload) {
      if (!payload) {
        return;
      }

      if (typeof payload === 'object') {
        this.showArtwork(payload);
        return;
      }

      if (typeof payload === 'string') {
        const domMatch = document.querySelector(`[data-artwork-id="${payload}"] img`);
        if (domMatch) {
          const imageSrc = domMatch.dataset.src || domMatch.currentSrc || domMatch.src || '';
          this.showArtwork({
            image: imageSrc,
            title: domMatch.alt || translateKey('ar-preview-alt', 'Попередній перегляд картини'),
            id: payload
          });
          return;
        }
      }

      if (typeof window.getArtworkById === 'function') {
        const fromCatalog = window.getArtworkById(payload);
        if (fromCatalog) {
          this.showArtwork(fromCatalog);
          return;
        }
      }

      this.showArtwork({
        image: payload,
        title: translateKey('ar-preview-alt', 'Попередній перегляд картини')
      });
    }

    onArtworkLoaded() {
      if (this.artworkImg.naturalWidth && this.artworkImg.naturalHeight) {
        this.aspectRatio = this.artworkImg.naturalWidth / this.artworkImg.naturalHeight;
      } else {
        this.aspectRatio = 1.25;
      }

      const stageWidth = this.stage.clientWidth || 600;
      const stageHeight = this.stage.clientHeight || 400;

      const widthByStage = stageWidth * 0.45;
      const widthByHeight = stageHeight * 0.65 * this.aspectRatio;

      this.baseWidth = Math.min(380, widthByStage, widthByHeight);
      this.applyTransform();
    }

    startCamera() {
      if (!SUPPORTS_CAMERA) {
        this.hasCamera = false;
        this.prefersCamera = false;
        this.showFallback('no-camera');
        return;
      }

      if (!window.isSecureContext) {
        this.hasCamera = false;
        this.prefersCamera = false;
        this.showFallback('insecure');
        showToast(translateKey('ar-status-error', 'Для доступу до камери потрібне захищене з’єднання (https).'));
        return;
      }

      if (this.pendingCameraRequest) {
        return;
      }

      this.pendingCameraRequest = true;
      this.setStatus('ar-status-loading', { icon: 'fa-spinner', spinner: true });

      this.cameraTimeoutId = window.setTimeout(() => {
        this.handleCameraTimeout();
      }, CAMERA_TIMEOUT);

      navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS)
        .then((stream) => this.handleCameraSuccess(stream))
        .catch((error) => this.handleCameraError(error))
        .finally(() => {
          this.pendingCameraRequest = false;
        });
    }

    handleCameraSuccess(stream) {
      window.clearTimeout(this.cameraTimeoutId);
      this.cameraTimeoutId = null;

      this.stream = stream;
      this.prefersCamera = true;
      this.hasCamera = true;
      this.customBackdropUrl && this.revokeCustomBackdrop();

      this.video.srcObject = stream;
      this.video.play().catch(() => {});

      this.video.classList.remove('ar-hidden');
      this.stage.classList.remove('ar-stage--fallback');
      this.fallback.hidden = true;
      this.hideStatus();
      this.updateHint('ar-hint');
    }

    handleCameraError(error) {
      console.error('[AR Viewer] Camera access error:', error);
      window.clearTimeout(this.cameraTimeoutId);
      this.cameraTimeoutId = null;

      this.hasCamera = false;
      this.prefersCamera = false;
      this.stopCamera({ keepStatus: true });

      const statusKey = error?.name === 'NotAllowedError'
        ? 'ar-status-error'
        : 'ar-status-upload';

      this.showFallback('denied');
      this.setStatus(statusKey, { icon: 'fa-image', spinner: false });
      showToast(translateKey('ar-camera-error', 'Потрібен доступ до камери для AR-примірки.'));
    }

    handleCameraTimeout() {
      if (!this.pendingCameraRequest) {
        return;
      }

      this.pendingCameraRequest = false;
      this.stopCamera({ keepStatus: true });
      this.hasCamera = false;
      this.prefersCamera = false;
      this.showFallback('timeout');
      this.setStatus('ar-status-upload', { icon: 'fa-image' });
      showToast(translateKey('ar-status-camera-off', 'Камеру не вдалося запустити. Використайте фото кімнати або спробуйте ще раз.'), 3200);
    }

    stopCamera({ keepStatus = false } = {}) {
      window.clearTimeout(this.cameraTimeoutId);
      this.cameraTimeoutId = null;

      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }
      if (this.video) {
        this.video.srcObject = null;
      }

      if (!keepStatus) {
        this.hideStatus();
      }
    }

    showFallback(reason = 'no-camera') {
      this.stopCamera({ keepStatus: true });
      this.stage.classList.add('ar-stage--fallback');
      this.video.classList.add('ar-hidden');
      this.fallback.hidden = false;

      const source = this.getCurrentBackdrop();
      if (this.fallbackBackdrop) {
        if (source) {
          this.fallbackBackdrop.src = source;
        } else {
          this.fallbackBackdrop.removeAttribute('src');
        }
      }

      const statusKey = reason === 'uploaded'
        ? 'ar-status-uploaded'
        : reason === 'timeout'
          ? 'ar-status-upload'
          : reason === 'denied'
            ? 'ar-status-upload'
            : 'ar-status-ready';

      this.setStatus(statusKey, { icon: 'fa-image', spinner: false });
      this.updateHint('ar-no-camera-hint');
    }

    toggleBackdrop() {
      const sources = this.getBackdropSources();
      if (!sources.length) {
        return;
      }

      this.backdropIndex = (this.backdropIndex + 1) % sources.length;
      const src = sources[this.backdropIndex];

      if (this.fallbackBackdrop) {
        if (src) {
          this.fallbackBackdrop.src = src;
        } else {
          this.fallbackBackdrop.removeAttribute('src');
        }
      }

      if (!this.stream) {
        this.showFallback('uploaded');
      }
    }

    getBackdropSources() {
      const list = [...this.sampleBackdrops];
      if (this.customBackdropUrl) {
        list.unshift(this.customBackdropUrl);
      }
      return list.filter((item, index, arr) => arr.indexOf(item) === index);
    }

    getCurrentBackdrop() {
      const sources = this.getBackdropSources();
      return sources[this.backdropIndex] || sources[0] || null;
    }

    requestUpload() {
      if (this.uploadInput) {
        this.uploadInput.click();
      }
    }

    handleUploadChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        showToast(translateKey('ar-upload-error', 'Будь ласка, оберіть зображення кімнати.'));
        return;
      }

      const existing = this.customBackdropUrl;
      if (existing && existing.startsWith('blob:')) {
        URL.revokeObjectURL(existing);
      }

      const objectUrl = URL.createObjectURL(file);
      this.customBackdropUrl = objectUrl;
      this.backdropIndex = 0;

      if (this.fallbackBackdrop) {
        this.fallbackBackdrop.src = objectUrl;
      }

      this.prefersCamera = false;
      this.hasCamera = SUPPORTS_CAMERA;

      this.showFallback('uploaded');
      showToast(translateKey('ar-upload-success', 'Фон оновлено. Тепер картина адаптована під вашу кімнату.'), 3200);
    }

    revokeCustomBackdrop() {
      if (this.customBackdropUrl && this.customBackdropUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.customBackdropUrl);
      }
      this.customBackdropUrl = null;
    }

    showModal() {
      this.isOpen = true;
      document.body.classList.add('modal-open');
      this.modal.classList.add('open');

      this.keydownHandler = (event) => {
        if (event.key === 'Escape') {
          this.close();
        }
      };
      document.addEventListener('keydown', this.keydownHandler, { once: false });
    }

    hideModal() {
      this.isOpen = false;
      this.modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }

    close() {
      this.detachLifecycleEvents();
      this.stopCamera();
      this.hideModal();
      this.stage.classList.remove('ar-stage--fallback');
      this.fallback.hidden = true;
      this.video.classList.remove('ar-hidden');

      this.revokeCustomBackdrop();

      if (this.keydownHandler) {
        document.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null;
      }
    }

    resetTransform() {
      this.position = { x: 0, y: 0 };
      this.scale = 1;
      this.rotation = 0;
      if (this.scaleInput) {
        this.scaleInput.value = 100;
      }
      if (this.rotationInput) {
        this.rotationInput.value = 0;
      }
      this.applyTransform();
    }

    applyTransform() {
      const width = (this.baseWidth || 280) * this.scale;
      const height = width / (this.aspectRatio || 1);

      this.artworkImg.style.width = `${width}px`;
      this.artworkImg.style.height = `${height}px`;

      this.overlay.style.transform = `translate3d(-50%, -50%, 0) translate3d(${this.position.x}px, ${this.position.y}px, 0) rotate(${this.rotation}deg)`;
    }

    updateHint(key) {
      const hintText = this.hint?.querySelector('p');
      if (!hintText) {
        return;
      }
      hintText.textContent = translateKey(
        key,
        key === 'ar-no-camera-hint'
          ? 'Завантажте приклад кімнати або додайте власне фото.'
          : 'Допоможіть камері знайти стіну.'
      );
    }

    onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }
      if (this.pointerId !== null) {
        return;
      }

      this.pointerId = event.pointerId;
      this.dragging = true;

      this.startDrag = { x: event.clientX, y: event.clientY };
      this.startPosition = { ...this.position };

      this.overlay.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    onPointerMove(event) {
      if (!this.dragging || event.pointerId !== this.pointerId) {
        return;
      }

      const deltaX = event.clientX - this.startDrag.x;
      const deltaY = event.clientY - this.startDrag.y;

      this.position.x = this.startPosition.x + deltaX;
      this.position.y = this.startPosition.y + deltaY;
      this.applyTransform();
    }

    onPointerUp(event) {
      if (event.pointerId !== this.pointerId) {
        return;
      }

      this.overlay.releasePointerCapture(event.pointerId);
      this.pointerId = null;
      this.dragging = false;
    }

    onWheel(event) {
      event.preventDefault();

      const direction = Math.sign(event.deltaY);
      const step = direction > 0 ? -0.05 : 0.05;
      const nextScale = clamp(this.scale + step, SCALE_MIN, SCALE_MAX);

      this.scale = Number(nextScale.toFixed(2));
      if (this.scaleInput) {
        this.scaleInput.value = Math.round(this.scale * 100);
      }
      this.applyTransform();
    }

    captureFrame() {
      const stageRect = this.stage.getBoundingClientRect();
      const width = Math.round(stageRect.width || 600);
      const height = Math.round(stageRect.height || 400);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        showToast(translateKey('ar-capture-error', 'Не вдалося зберегти знімок.'));
        return;
      }

      if (this.stream && this.video && this.video.readyState >= 2) {
        ctx.drawImage(this.video, 0, 0, width, height);
      } else if (this.fallbackBackdrop && this.fallbackBackdrop.complete) {
        ctx.drawImage(this.fallbackBackdrop, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#f6f7fb';
        ctx.fillRect(0, 0, width, height);
      }

      const artWidth = (this.baseWidth || 280) * this.scale;
      const artHeight = artWidth / (this.aspectRatio || 1);
      const centerX = width / 2 + this.position.x;
      const centerY = height / 2 + this.position.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((Math.PI / 180) * this.rotation);
      ctx.drawImage(this.artworkImg, -artWidth / 2, -artHeight / 2, artWidth, artHeight);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast(translateKey('ar-capture-error', 'Не вдалося зберегти знімок.'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const artworkSlug = (this.activeArtwork?.slug || this.activeArtwork?.id || 'inner-garden-ar').toString();
        link.download = `${artworkSlug}-preview.png`;
        link.click();
        URL.revokeObjectURL(url);

        showToast(translateKey('ar-snapshot-saved', 'Фото з AR успішно збережено.'));
      }, 'image/png');
    }

    setStatus(key, { icon = 'fa-mobile-alt', spinner = false } = {}) {
      if (!this.status) {
        return;
      }

      this.currentStatusKey = key;
      this.status.hidden = false;

      if (this.statusIcon) {
        this.statusIcon.className = `fas ${icon}`;
      }

      if (this.statusSpinner) {
        this.statusSpinner.hidden = !spinner;
      }

      if (this.statusText) {
        this.statusText.textContent = translateKey(key, '');
      }
    }

    hideStatus() {
      if (this.status) {
        this.status.hidden = true;
      }
      this.currentStatusKey = null;
      if (this.statusSpinner) {
        this.statusSpinner.hidden = true;
      }
    }

    refreshStatusMessage() {
      if (!this.currentStatusKey || !this.statusText) {
        return;
      }
      this.statusText.textContent = translateKey(this.currentStatusKey, this.statusText.textContent);
    }

    attachLifecycleEvents() {
      document.addEventListener('visibilitychange', this.visibilityHandler);
      window.addEventListener('orientationchange', this.resizeHandler);
      window.addEventListener('resize', this.resizeHandler);
    }

    detachLifecycleEvents() {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      window.removeEventListener('orientationchange', this.resizeHandler);
      window.removeEventListener('resize', this.resizeHandler);
    }

    handleVisibilityChange() {
      if (!this.isOpen) {
        return;
      }

      if (document.hidden) {
        this.stopCamera({ keepStatus: true });
      } else if (this.prefersCamera && !this.stream) {
        this.startCamera();
      }
    }

    handleResize() {
      if (!this.isOpen) {
        return;
      }
      this.onArtworkLoaded();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ARViewer());
  } else {
    new ARViewer();
  }
})();

