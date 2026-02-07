(() => {
  const CLOUDINARY_BASE = 'https://res.cloudinary.com/djdc6wcpg/image/upload/f_auto,q_auto/';
  const state = {
    token: localStorage.getItem('inner-garden-admin-token') || '',
    artworks: [],
    filtered: [],
    selectedId: null,
    selectedIds: new Set(),
    cloudinary: {
      assets: [],
      nextCursor: null,
      loading: false,
      configured: false,
      ratio: null,
      baseUrl: CLOUDINARY_BASE,
      selectedId: null
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    loginModal: $('#loginModal'),
    loginForm: $('#loginForm'),
    loginBtn: $('#loginBtn'),
    summaryCards: $('#summaryCards'),
    artworksList: $('#artworksList'),
    searchInput: $('#searchInput'),
    statusFilter: $('#statusFilter'),
    segmentFilter: $('#segmentFilter'),
    newArtworkBtn: $('#newArtworkBtn'),
    refreshBtn: $('#refreshBtn'),
    logoutBtn: $('#logoutBtn'),
    bulkPanel: $('#bulkPanel'),
    bulkCount: $('#bulkCount'),
    bulkSelectAll: $('#bulkSelectAll'),
    bulkClear: $('#bulkClear'),
    bulkStatus: $('#bulkStatus'),
    bulkMood: $('#bulkMood'),
    bulkPrice: $('#bulkPrice'),
    bulkCurrency: $('#bulkCurrency'),
    bulkSegmentsMode: $('#bulkSegmentsMode'),
    bulkSegments: $('#bulkSegments'),
    bulkPriceClear: $('#bulkPriceClear'),
    bulkApply: $('#bulkApply'),
    bulkDelete: $('#bulkDelete'),
    artworkForm: $('#artworkForm'),
    formTitle: $('#formTitle'),
    formStatusBadge: $('#formStatusBadge'),
    artworkId: $('#artworkId'),
    cloudinaryInput: $('#cloudinaryInput'),
    previewImage: $('#previewImage'),
    cloudinaryDrop: $('#cloudinaryDrop'),
    statusSelect: $('#statusSelect'),
    resetBtn: $('#resetBtn'),
    toast: $('#toast'),
    widthInput: $('#artworkForm [name="width_cm"]'),
    heightInput: $('#artworkForm [name="height_cm"]'),
    sizeInput: $('#artworkForm [name="size"]'),
    ratioHint: $('#ratioHint'),
    cloudinaryStatus: $('#cloudinaryStatus'),
    cloudinarySearch: $('#cloudinarySearch'),
    cloudinaryFolder: $('#cloudinaryFolder'),
    cloudinaryTag: $('#cloudinaryTag'),
    cloudinarySearchBtn: $('#cloudinarySearchBtn'),
    cloudinaryClearBtn: $('#cloudinaryClearBtn'),
    cloudinaryResults: $('#cloudinaryResults'),
    cloudinaryLoadMore: $('#cloudinaryLoadMore'),
    cloudinaryUpload: $('#cloudinaryUpload'),
    cloudinaryUploadFolder: $('#cloudinaryUploadFolder'),
    cloudinaryUploadPublicId: $('#cloudinaryUploadPublicId'),
    cloudinaryUploadBtn: $('#cloudinaryUploadBtn'),
    cloudinaryInspectBtn: $('#cloudinaryInspectBtn'),
    cloudinaryOpenBtn: $('#cloudinaryOpenBtn'),
    cloudinaryCopyBtn: $('#cloudinaryCopyBtn'),
    cloudinaryMeta: $('#cloudinaryMeta')
  };

  const statusLabels = {
    available: 'Доступна',
    reserved: 'Резерв',
    commission: 'Під замовлення',
    sold: 'Продано'
  };

  const showToast = (message) => {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2500);
  };

  const updateBulkUi = () => {
    const count = state.selectedIds.size;
    if (elements.bulkCount) {
      elements.bulkCount.textContent = `Обрано: ${count}`;
    }
    if (elements.bulkPanel) {
      elements.bulkPanel.classList.toggle('has-selection', count > 0);
    }
    if (elements.bulkApply) elements.bulkApply.disabled = count === 0;
    if (elements.bulkDelete) elements.bulkDelete.disabled = count === 0;
  };

  const clearBulkSelection = () => {
    state.selectedIds.clear();
    updateBulkUi();
    renderList();
  };

  const toggleSelection = (id, isSelected) => {
    if (!id) return;
    if (isSelected) {
      state.selectedIds.add(id);
    } else {
      state.selectedIds.delete(id);
    }
    updateBulkUi();
    renderList();
  };

  const authHeaders = () => {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  };

  const normalizeStatus = (value) => {
    const status = String(value || '').trim().toLowerCase();
    return ['available', 'reserved', 'commission', 'sold'].includes(status) ? status : 'available';
  };

  const formatPrice = (art) => {
    if (typeof art.price === 'number' && Number.isFinite(art.price)) {
      const currency = art.currency || 'EUR';
      return `${currency} ${art.price.toLocaleString('en-US')}`;
    }
    return 'За запитом';
  };

  const extractCloudinaryId = (value) => {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    if (!trimmed.includes('/') && !trimmed.includes('http')) {
      return trimmed;
    }
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split('/').filter(Boolean);
      const uploadIndex = parts.findIndex((part) => part === 'upload');
      if (uploadIndex >= 0) {
        const afterUpload = parts.slice(uploadIndex + 1);
        const versionIndex = afterUpload.findIndex((part) => /^v\\d+$/.test(part));
        const transformationPattern = /^(?:c_|w_|h_|q_|f_|g_|t_|ar_|b_|e_)/;
        let startIndex = 0;
        if (versionIndex >= 0) {
          startIndex = versionIndex + 1;
        } else {
          while (startIndex < afterUpload.length - 1) {
            const segment = afterUpload[startIndex];
            if (segment.includes(',') || transformationPattern.test(segment)) {
              startIndex += 1;
            } else {
              break;
            }
          }
        }
        const idParts = afterUpload.slice(startIndex);
        if (!idParts.length) return '';
        const lastIndex = idParts.length - 1;
        idParts[lastIndex] = idParts[lastIndex].replace(/\\.[a-z0-9]+$/i, '');
        return idParts.join('/');
      }
    } catch (error) {
      const match = trimmed.match(/upload\\/(?:v\\d+\\/)?(.+)\\.[a-z0-9]+$/i);
      if (match) return match[1];
    }
    return '';
  };

  const formatBytes = (bytes) => {
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const formatRatio = (width, height) => {
    if (!width || !height) return '';
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const divisor = gcd(width, height) || 1;
    return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
  };

  const setRatioHint = (asset) => {
    if (!elements.ratioHint) return;
    if (!asset || !asset.width || !asset.height) {
      elements.ratioHint.textContent = 'Співвідношення: —';
      return;
    }
    const ratio = formatRatio(asset.width, asset.height);
    elements.ratioHint.textContent = `Співвідношення: ${ratio} (${asset.width}×${asset.height}px)`;
  };

  const updateCloudinaryMeta = (asset) => {
    if (!elements.cloudinaryMeta) return;
    if (!asset || !asset.width || !asset.height) {
      elements.cloudinaryMeta.textContent = 'Метадані: —';
      return;
    }
    const ratio = formatRatio(asset.width, asset.height);
    const bytes = formatBytes(asset.bytes);
    const parts = [
      `${asset.width}×${asset.height}px`,
      ratio ? `ratio ${ratio}` : null,
      bytes || null,
      asset.format ? asset.format.toUpperCase() : null
    ].filter(Boolean);
    elements.cloudinaryMeta.textContent = `Метадані: ${parts.join(' · ')}`;
  };

  const updateSizeAuto = () => {
    if (!elements.widthInput || !elements.heightInput || !elements.sizeInput) return;
    const width = Number(elements.widthInput.value);
    const height = Number(elements.heightInput.value);
    if (!width || !height) return;
    const autoValue = `${width} × ${height} см`;
    if (!elements.sizeInput.value || elements.sizeInput.dataset.auto === 'true') {
      elements.sizeInput.value = autoValue;
      elements.sizeInput.dataset.auto = 'true';
    }
  };

  const applyRatioIfMissing = (changedField) => {
    if (!state.cloudinary.ratio || !elements.widthInput || !elements.heightInput) return;
    const widthVal = Number(elements.widthInput.value);
    const heightVal = Number(elements.heightInput.value);
    if (changedField === 'width' && widthVal && !heightVal) {
      elements.heightInput.value = Math.round(widthVal / state.cloudinary.ratio);
    }
    if (changedField === 'height' && heightVal && !widthVal) {
      elements.widthInput.value = Math.round(heightVal * state.cloudinary.ratio);
    }
  };

  const updateSummary = () => {
    if (!elements.summaryCards) return;
    const total = state.artworks.length;
    const counts = state.artworks.reduce((acc, art) => {
      const status = normalizeStatus(art.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    elements.summaryCards.innerHTML = `
      <div class="summary-card">
        <span>Всього робіт</span>
        <strong>${total}</strong>
      </div>
      <div class="summary-card">
        <span>Доступні</span>
        <strong>${counts.available || 0}</strong>
      </div>
      <div class="summary-card">
        <span>Продані</span>
        <strong>${counts.sold || 0}</strong>
      </div>
      <div class="summary-card">
        <span>Під замовлення</span>
        <strong>${counts.commission || 0}</strong>
      </div>
    `;
  };

  const renderList = () => {
    if (!elements.artworksList) return;
    if (!state.filtered.length) {
      elements.artworksList.innerHTML = '<p class="muted">Немає робіт для відображення.</p>';
      return;
    }

    elements.artworksList.innerHTML = state.filtered.map((art) => {
      const status = normalizeStatus(art.status);
      const title = art.title_uk || art.title_en || 'Без назви';
      const segments = (art.segments || []).join(', ');
      const base = state.cloudinary.baseUrl || CLOUDINARY_BASE;
      const thumbSrc = art.cloudinary_id ? `${base}${art.cloudinary_id}.webp` : '';
      const isSelected = state.selectedIds.has(art.id);
      return `
        <div class="artwork-row ${isSelected ? 'is-selected' : ''}" data-id="${art.id}">
          <label class="row-select">
            <input type="checkbox" class="row-select-input" data-id="${art.id}" ${isSelected ? 'checked' : ''}>
          </label>
          <img class="artwork-thumb" src="${thumbSrc}" alt="${title}" loading="lazy" decoding="async">
          <div class="artwork-info">
            <h4>${title}</h4>
            <div class="artwork-meta">
              <span>${formatPrice(art)}</span>
              <span>${segments || 'без сегментів'}</span>
              <span>${art.size || ''}</span>
            </div>
          </div>
          <div class="row-actions">
            <span class="status-pill ${status}">${statusLabels[status]}</span>
            <button class="icon-btn" data-action="edit" title="Редагувати"><i class="fas fa-pen"></i></button>
            <button class="icon-btn" data-action="toggle" title="Змінити статус"><i class="fas fa-tag"></i></button>
            <button class="icon-btn" data-action="delete" title="Видалити"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');
  };

  const applyFilters = () => {
    const query = (elements.searchInput?.value || '').trim().toLowerCase();
    const statusFilter = elements.statusFilter?.value || 'all';
    const segmentFilter = elements.segmentFilter?.value || 'all';

    state.filtered = state.artworks.filter((art) => {
      const title = `${art.title_uk || ''} ${art.title_en || ''} ${art.title_de || ''}`.toLowerCase();
      const description = `${art.description_uk || ''} ${art.description_en || ''} ${art.description_de || ''}`.toLowerCase();
      const matchesQuery = !query || title.includes(query) || description.includes(query);
      const status = normalizeStatus(art.status);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const segments = art.segments || [];
      const matchesSegment = segmentFilter === 'all' || segments.includes(segmentFilter);
      return matchesQuery && matchesStatus && matchesSegment;
    });

    renderList();
    updateBulkUi();
  };

  const fillForm = (artwork) => {
    if (!elements.artworkForm) return;
    const form = elements.artworkForm;
    form.reset();
    if (elements.sizeInput) {
      elements.sizeInput.dataset.auto = 'true';
    }
    elements.artworkId.value = artwork?.id || '';

    if (!artwork) {
      elements.formTitle.textContent = 'Нова картина';
      elements.formStatusBadge.textContent = statusLabels.available;
      elements.formStatusBadge.className = 'status-pill';
      elements.previewImage.src = '';
      elements.previewImage.alt = '';
      state.cloudinary.ratio = null;
      setRatioHint(null);
      updateCloudinaryMeta(null);
      state.selectedId = null;
      return;
    }

    state.selectedId = artwork.id;
    elements.formTitle.textContent = artwork.title_uk || 'Редагування';

    Object.entries(artwork).forEach(([key, value]) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (!field) return;
      if (field.type === 'checkbox') return;
      if (field.tagName === 'SELECT' || field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
        field.value = value ?? '';
      }
    });

    const segments = artwork.segments || [];
    $$('#segmentChips input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = segments.includes(checkbox.value);
    });

    const status = normalizeStatus(artwork.status);
    elements.formStatusBadge.textContent = statusLabels[status];
    elements.formStatusBadge.className = `status-pill ${status}`;

    if (elements.sizeInput) {
      elements.sizeInput.dataset.auto = artwork.size ? 'false' : 'true';
    }
    updateSizeAuto();

    updatePreview(artwork.cloudinary_id || '');
    updateCloudinaryMeta(null);
  };

  const updatePreview = (cloudinaryId) => {
    if (!elements.previewImage) return;
    const hint = elements.cloudinaryDrop?.querySelector('.drop-hint');
    if (!cloudinaryId) {
      elements.previewImage.src = '';
      elements.previewImage.alt = '';
      if (hint) hint.style.display = 'block';
      updateCloudinaryMeta(null);
      return;
    }
    const base = state.cloudinary.baseUrl || CLOUDINARY_BASE;
    elements.previewImage.src = `${base}${cloudinaryId}.webp`;
    elements.previewImage.alt = 'Preview';
    if (hint) hint.style.display = 'none';
  };

  const updateCloudinaryStatus = (configured) => {
    if (!elements.cloudinaryStatus) return;
    elements.cloudinaryStatus.textContent = configured ? 'API активне' : 'API вимкнено';
    elements.cloudinaryStatus.className = `status-pill ${configured ? '' : 'offline'}`.trim();
    [elements.cloudinarySearchBtn, elements.cloudinaryUploadBtn, elements.cloudinaryLoadMore, elements.cloudinaryInspectBtn].forEach((btn) => {
      if (btn) btn.disabled = !configured;
    });
  };

  const renderCloudinaryResults = () => {
    if (!elements.cloudinaryResults) return;
    if (!state.cloudinary.assets.length) {
      elements.cloudinaryResults.innerHTML = '<p class="muted">Немає результатів.</p>';
      if (elements.cloudinaryLoadMore) {
        elements.cloudinaryLoadMore.style.display = 'none';
      }
      return;
    }

    elements.cloudinaryResults.innerHTML = state.cloudinary.assets.map((asset) => {
      const ratio = formatRatio(asset.width, asset.height);
      const size = `${asset.width}×${asset.height}px`;
      const bytes = formatBytes(asset.bytes);
      const metaParts = [size, bytes, ratio ? `ratio ${ratio}` : null].filter(Boolean).join(' · ');
      const isSelected = asset.public_id === state.cloudinary.selectedId;
      const thumbUrl = asset.secure_url
        ? asset.secure_url.replace('/upload/', '/upload/c_fill,w_140,h_140,q_auto,f_auto/')
        : '';
      return `
        <div class="cloudinary-card ${isSelected ? 'is-selected' : ''}" data-id="${asset.public_id}">
          <img src="${thumbUrl}" alt="${asset.public_id}" loading="lazy">
          <div>
            <strong>${asset.public_id}</strong>
            <div class="cloudinary-meta">${metaParts}</div>
            <div class="cloudinary-card-actions">
              <button class="btn ghost" data-action="use">Використати</button>
              <button class="btn ghost" data-action="copy">Копія ID</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (elements.cloudinaryLoadMore) {
      elements.cloudinaryLoadMore.style.display = state.cloudinary.nextCursor ? 'inline-flex' : 'none';
    }
  };

  const fetchCloudinaryStatus = async () => {
    if (!state.token) return;
    try {
      const response = await fetch('/api/admin/cloudinary/status', {
        headers: {
          ...authHeaders()
        }
      });
      const data = await response.json();
      state.cloudinary.configured = Boolean(data.configured);
      updateCloudinaryStatus(state.cloudinary.configured);
      if (!state.cloudinary.configured) {
        if (elements.cloudinaryResults) {
          elements.cloudinaryResults.innerHTML = '<p class="muted">Cloudinary не налаштовано. Додайте ключі у .env.</p>';
        }
      }
    } catch (error) {
      updateCloudinaryStatus(false);
    }
  };

  const fetchCloudinaryAssets = async ({ append = false } = {}) => {
    if (!state.cloudinary.configured) {
      showToast('Cloudinary не налаштовано');
      return;
    }
    if (append && !state.cloudinary.nextCursor) {
      return;
    }
    if (state.cloudinary.loading) return;
    state.cloudinary.loading = true;
    try {
      const params = new URLSearchParams();
      const query = (elements.cloudinarySearch?.value || '').trim();
      const folder = (elements.cloudinaryFolder?.value || '').trim();
      const tag = (elements.cloudinaryTag?.value || '').trim();
      if (query) params.set('query', query);
      if (folder) params.set('folder', folder);
      if (tag) params.set('tag', tag);
      if (append && state.cloudinary.nextCursor) {
        params.set('cursor', state.cloudinary.nextCursor);
      }

      const response = await fetch(`/api/admin/cloudinary/search?${params.toString()}`, {
        headers: {
          ...authHeaders()
        }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Cloudinary error');
      }

      const nextAssets = data.assets || [];
      state.cloudinary.assets = append ? [...state.cloudinary.assets, ...nextAssets] : nextAssets;
      state.cloudinary.nextCursor = data.next_cursor || null;
      renderCloudinaryResults();
    } catch (error) {
      console.error(error);
      showToast('Не вдалося завантажити Cloudinary');
    } finally {
      state.cloudinary.loading = false;
    }
  };

  const clearCloudinarySearch = () => {
    if (elements.cloudinarySearch) elements.cloudinarySearch.value = '';
    if (elements.cloudinaryFolder) elements.cloudinaryFolder.value = '';
    if (elements.cloudinaryTag) elements.cloudinaryTag.value = '';
    state.cloudinary.assets = [];
    state.cloudinary.nextCursor = null;
    state.cloudinary.selectedId = null;
    renderCloudinaryResults();
  };

  const applyCloudinaryAsset = (asset) => {
    if (!asset) return;
    state.cloudinary.selectedId = asset.public_id;
    state.cloudinary.ratio = asset.width && asset.height ? asset.width / asset.height : null;
    const urlMatch = asset.secure_url?.match(/res\.cloudinary\.com\/([^/]+)\//);
    if (urlMatch?.[1]) {
      state.cloudinary.baseUrl = `https://res.cloudinary.com/${urlMatch[1]}/image/upload/f_auto,q_auto/`;
    }
    elements.cloudinaryInput.value = asset.public_id;
    updatePreview(asset.public_id);
    setRatioHint(asset);
    updateCloudinaryMeta(asset);

    applyRatioIfMissing('width');
    applyRatioIfMissing('height');
    updateSizeAuto();
    renderCloudinaryResults();
    showToast('Cloudinary ID оновлено');
  };

  const fileToDataUrl = (file, maxSize = 2400, quality = 0.9) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => {
      img.src = reader.result;
    };
    reader.onerror = reject;
    img.onerror = reject;
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      const maxDim = Math.max(naturalWidth, naturalHeight);
      const scale = maxDim > maxSize ? maxSize / maxDim : 1;
      const targetWidth = Math.round(naturalWidth * scale);
      const targetHeight = Math.round(naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    reader.readAsDataURL(file);
  });

  const uploadCloudinaryAsset = async () => {
    if (!state.cloudinary.configured) {
      showToast('Cloudinary не налаштовано');
      return;
    }
    const file = elements.cloudinaryUpload?.files?.[0];
    if (!file) {
      showToast('Оберіть файл для завантаження');
      return;
    }
    try {
      elements.cloudinaryUploadBtn.disabled = true;
      elements.cloudinaryUploadBtn.textContent = 'Завантаження...';
      const fileData = await fileToDataUrl(file);
      const payload = {
        file: fileData,
        folder: (elements.cloudinaryUploadFolder?.value || '').trim() || undefined,
        public_id: (elements.cloudinaryUploadPublicId?.value || '').trim() || undefined
      };
      const response = await fetch('/api/admin/cloudinary/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }
      const asset = data.asset;
      state.cloudinary.assets = [asset, ...state.cloudinary.assets];
      renderCloudinaryResults();
      applyCloudinaryAsset(asset);
    } catch (error) {
      console.error(error);
      showToast('Не вдалося завантажити файл');
    } finally {
      elements.cloudinaryUploadBtn.disabled = false;
      elements.cloudinaryUploadBtn.innerHTML = '<i class="fas fa-cloud-arrow-up"></i> Завантажити';
    }
  };

  const inspectCloudinaryAsset = async () => {
    const id = (elements.cloudinaryInput?.value || '').trim();
    if (!id) {
      showToast('Вкажіть Cloudinary ID');
      return;
    }
    try {
      elements.cloudinaryInspectBtn.disabled = true;
      const response = await fetch(`/api/admin/cloudinary/asset?public_id=${encodeURIComponent(id)}`, {
        headers: {
          ...authHeaders()
        }
      });
      if (response.status === 401) {
        showLogin();
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Cloudinary lookup failed');
      }
      const asset = data.asset;
      const urlMatch = asset.secure_url?.match(/res\.cloudinary\.com\/([^/]+)\//);
      if (urlMatch?.[1]) {
        state.cloudinary.baseUrl = `https://res.cloudinary.com/${urlMatch[1]}/image/upload/f_auto,q_auto/`;
      }
      updatePreview(asset.public_id);
      setRatioHint(asset);
      updateCloudinaryMeta(asset);
      state.cloudinary.ratio = asset.width && asset.height ? asset.width / asset.height : null;
      applyRatioIfMissing('width');
      applyRatioIfMissing('height');
      updateSizeAuto();
      showToast('Дані Cloudinary оновлено');
    } catch (error) {
      console.error(error);
      showToast('Не вдалося перевірити Cloudinary');
    } finally {
      if (elements.cloudinaryInspectBtn) {
        elements.cloudinaryInspectBtn.disabled = false;
      }
    }
  };

  const openCloudinaryAsset = () => {
    const id = (elements.cloudinaryInput?.value || '').trim();
    if (!id) {
      showToast('Вкажіть Cloudinary ID');
      return;
    }
    const base = state.cloudinary.baseUrl || CLOUDINARY_BASE;
    window.open(`${base}${id}`, '_blank');
  };

  const collectFormData = () => {
    const formData = new FormData(elements.artworkForm);
    const segments = formData.getAll('segments');
    const payload = {};
    formData.forEach((value, key) => {
      if (key === 'segments') return;
      payload[key] = value;
    });
    payload.segments = segments;
    payload.price = payload.price ? Number(payload.price) : null;
    payload.width_cm = payload.width_cm ? Number(payload.width_cm) : null;
    payload.height_cm = payload.height_cm ? Number(payload.height_cm) : null;
    return payload;
  };

  const collectBulkPayload = () => {
    const updates = {};
    const options = {};

    if (elements.bulkStatus?.value) {
      updates.status = elements.bulkStatus.value;
    }
    if (elements.bulkMood?.value) {
      updates.mood = elements.bulkMood.value;
    }
    if (elements.bulkCurrency?.value) {
      updates.currency = elements.bulkCurrency.value;
    }

    const priceClear = elements.bulkPriceClear?.checked;
    const priceValue = elements.bulkPrice?.value;
    if (priceClear) {
      updates.price = null;
    } else if (priceValue !== '' && typeof priceValue !== 'undefined') {
      updates.price = Number(priceValue);
    }

    const segmentInputs = elements.bulkSegments
      ? Array.from(elements.bulkSegments.querySelectorAll('input[type="checkbox"]'))
      : [];
    const selectedSegments = segmentInputs.filter((input) => input.checked).map((input) => input.value);
    if (selectedSegments.length) {
      updates.segments = selectedSegments;
      options.segmentsMode = elements.bulkSegmentsMode?.value || 'replace';
    }

    return { updates, options };
  };

  const resetBulkInputs = () => {
    if (elements.bulkStatus) elements.bulkStatus.value = '';
    if (elements.bulkMood) elements.bulkMood.value = '';
    if (elements.bulkCurrency) elements.bulkCurrency.value = '';
    if (elements.bulkPrice) {
      elements.bulkPrice.value = '';
      elements.bulkPrice.disabled = false;
    }
    if (elements.bulkPriceClear) elements.bulkPriceClear.checked = false;
    if (elements.bulkSegmentsMode) elements.bulkSegmentsMode.value = 'replace';
    if (elements.bulkSegments) {
      elements.bulkSegments.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
    }
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/admin/artworks', {
        headers: {
          ...authHeaders()
        }
      });
      if (response.status === 401) {
        showLogin();
        return;
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load artworks');
      }
      state.artworks = data.artworks || [];
      const liveIds = new Set(state.artworks.map((item) => item.id));
      state.selectedIds.forEach((id) => {
        if (!liveIds.has(id)) state.selectedIds.delete(id);
      });
      applyFilters();
      updateSummary();
    } catch (error) {
      showToast('Не вдалося завантажити роботи');
      console.error(error);
    }
  };

  const saveArtwork = async (payload) => {
    const targetId = payload.id || state.selectedId;
    const isEditing = Boolean(targetId);
    const url = isEditing ? `/api/admin/artworks/${targetId}` : '/api/admin/artworks';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Save failed');
    }

    showToast(isEditing ? 'Оновлено' : 'Додано');
    await fetchArtworks();
    fillForm(data.artwork || null);
  };

  const bulkUpdateArtworks = async () => {
    const ids = Array.from(state.selectedIds);
    if (!ids.length) {
      showToast('Немає вибраних робіт');
      return;
    }
    const { updates, options } = collectBulkPayload();
    if (!Object.keys(updates).length) {
      showToast('Оберіть, що потрібно змінити');
      return;
    }

    const response = await fetch('/api/admin/artworks/bulk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ ids, updates, options })
    });
    if (response.status === 401) {
      showLogin();
      return;
    }
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Bulk update failed');
    }
    showToast('Bulk-оновлення виконано');
    resetBulkInputs();
    clearBulkSelection();
    await fetchArtworks();
  };

  const bulkDeleteArtworks = async () => {
    const ids = Array.from(state.selectedIds);
    if (!ids.length) {
      showToast('Немає вибраних робіт');
      return;
    }
    if (!confirm(`Видалити ${ids.length} робіт?`)) {
      return;
    }

    const response = await fetch('/api/admin/artworks/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ ids })
    });
    if (response.status === 401) {
      showLogin();
      return;
    }
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Bulk delete failed');
    }
    showToast('Видалено');
    clearBulkSelection();
    await fetchArtworks();
  };

  const deleteArtwork = async (id) => {
    const response = await fetch(`/api/admin/artworks/${id}`, {
      method: 'DELETE',
      headers: {
        ...authHeaders()
      }
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Delete failed');
    }
    showToast('Видалено');
    await fetchArtworks();
    fillForm(null);
  };

  const toggleStatus = async (artwork) => {
    const status = normalizeStatus(artwork.status);
    const next = status === 'sold' ? 'available' : 'sold';
    await saveArtwork({ ...artwork, status: next });
  };

  const showLogin = () => {
    if (elements.loginModal) {
      elements.loginModal.style.display = 'flex';
    }
  };

  const hideLogin = () => {
    if (elements.loginModal) {
      elements.loginModal.style.display = 'none';
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(elements.loginForm);
    const payload = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    elements.loginBtn.disabled = true;
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }
      state.token = data.token;
      localStorage.setItem('inner-garden-admin-token', data.token);
      hideLogin();
      showToast('Вітаємо!');
      await fetchArtworks();
      await fetchCloudinaryStatus();
    } catch (error) {
      showToast('Невірні дані або адмінка не налаштована');
    } finally {
      elements.loginBtn.disabled = false;
    }
  };

  const handleLogout = () => {
    state.token = '';
    localStorage.removeItem('inner-garden-admin-token');
    clearBulkSelection();
    resetBulkInputs();
    state.cloudinary = {
      assets: [],
      nextCursor: null,
      loading: false,
      configured: false,
      ratio: null,
      baseUrl: CLOUDINARY_BASE,
      selectedId: null
    };
    clearCloudinarySearch();
    updateCloudinaryStatus(false);
    showLogin();
  };

  const handleListClick = (event) => {
    const row = event.target.closest('.artwork-row');
    if (!row) return;
    if (event.target.closest('.row-select')) return;
    const id = row.dataset.id;
    const artwork = state.artworks.find((item) => item.id === id);
    if (!artwork) return;

    const action = event.target.closest('button')?.dataset.action;
    if (action === 'delete') {
      if (confirm('Видалити цю картину?')) {
        deleteArtwork(id).catch((error) => {
          console.error(error);
          showToast('Помилка видалення');
        });
      }
      return;
    }

    if (action === 'toggle') {
      toggleStatus(artwork).catch((error) => {
        console.error(error);
        showToast('Не вдалося змінити статус');
      });
      return;
    }

    fillForm(artwork);
  };

  const bindEvents = () => {
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.searchInput?.addEventListener('input', applyFilters);
    elements.statusFilter?.addEventListener('change', applyFilters);
    elements.segmentFilter?.addEventListener('change', applyFilters);
    elements.newArtworkBtn?.addEventListener('click', () => fillForm(null));
    elements.refreshBtn?.addEventListener('click', fetchArtworks);
    elements.logoutBtn?.addEventListener('click', handleLogout);
    elements.artworksList?.addEventListener('click', handleListClick);
    elements.artworksList?.addEventListener('change', (event) => {
      const checkbox = event.target.closest('.row-select-input');
      if (!checkbox) return;
      toggleSelection(checkbox.dataset.id, checkbox.checked);
    });
    elements.bulkSelectAll?.addEventListener('click', () => {
      state.filtered.forEach((art) => state.selectedIds.add(art.id));
      updateBulkUi();
      renderList();
    });
    elements.bulkClear?.addEventListener('click', clearBulkSelection);
    elements.bulkApply?.addEventListener('click', () => {
      bulkUpdateArtworks().catch((error) => {
        console.error(error);
        showToast('Bulk-оновлення не вдалося');
      });
    });
    elements.bulkDelete?.addEventListener('click', () => {
      bulkDeleteArtworks().catch((error) => {
        console.error(error);
        showToast('Bulk-видалення не вдалося');
      });
    });
    elements.bulkPriceClear?.addEventListener('change', () => {
      if (!elements.bulkPrice) return;
      if (elements.bulkPriceClear.checked) {
        elements.bulkPrice.value = '';
        elements.bulkPrice.disabled = true;
      } else {
        elements.bulkPrice.disabled = false;
      }
    });
    elements.cloudinaryInput?.addEventListener('input', (event) => {
      const raw = event.target.value.trim();
      const cloudMatch = raw.match(/res\.cloudinary\.com\/([^/]+)\//);
      if (cloudMatch?.[1]) {
        state.cloudinary.baseUrl = `https://res.cloudinary.com/${cloudMatch[1]}/image/upload/f_auto,q_auto/`;
      }
      const extracted = extractCloudinaryId(raw);
      if (extracted && extracted !== raw) {
        event.target.value = extracted;
      }
      updatePreview(event.target.value.trim());
      state.cloudinary.ratio = null;
      setRatioHint(null);
      updateCloudinaryMeta(null);
    });
    elements.cloudinaryInput?.addEventListener('paste', (event) => {
      const text = event.clipboardData?.getData('text/plain') || '';
      const id = extractCloudinaryId(text);
      if (id) {
        event.preventDefault();
        elements.cloudinaryInput.value = id;
        const cloudMatch = text.match(/res\.cloudinary\.com\/([^/]+)\//);
        if (cloudMatch?.[1]) {
          state.cloudinary.baseUrl = `https://res.cloudinary.com/${cloudMatch[1]}/image/upload/f_auto,q_auto/`;
        }
        updatePreview(id);
        state.cloudinary.ratio = null;
        setRatioHint(null);
        updateCloudinaryMeta(null);
        showToast('Cloudinary ID оновлено');
      }
    });
    if (elements.cloudinaryDrop) {
      const dropZone = elements.cloudinaryDrop;
      dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        const text = event.dataTransfer?.getData('text/uri-list')
          || event.dataTransfer?.getData('text/plain')
          || '';
        if (!text && event.dataTransfer?.files?.length) {
          showToast('Перетягніть Cloudinary URL або вставте ID');
          return;
        }
        const id = extractCloudinaryId(text);
        if (!id) {
          showToast('Не вдалося розпізнати Cloudinary ID');
          return;
        }
        elements.cloudinaryInput.value = id;
        const cloudMatch = text.match(/res\.cloudinary\.com\/([^/]+)\//);
        if (cloudMatch?.[1]) {
          state.cloudinary.baseUrl = `https://res.cloudinary.com/${cloudMatch[1]}/image/upload/f_auto,q_auto/`;
        }
        updatePreview(id);
        state.cloudinary.ratio = null;
        setRatioHint(null);
        updateCloudinaryMeta(null);
        showToast('Cloudinary ID оновлено');
      });
    }
    elements.statusSelect?.addEventListener('change', (event) => {
      const status = normalizeStatus(event.target.value);
      elements.formStatusBadge.textContent = statusLabels[status];
      elements.formStatusBadge.className = `status-pill ${status}`;
    });
    elements.widthInput?.addEventListener('input', () => {
      applyRatioIfMissing('width');
      updateSizeAuto();
    });
    elements.heightInput?.addEventListener('input', () => {
      applyRatioIfMissing('height');
      updateSizeAuto();
    });
    elements.sizeInput?.addEventListener('input', () => {
      elements.sizeInput.dataset.auto = 'false';
    });
    elements.cloudinarySearchBtn?.addEventListener('click', () => fetchCloudinaryAssets());
    elements.cloudinaryClearBtn?.addEventListener('click', clearCloudinarySearch);
    elements.cloudinarySearch?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        fetchCloudinaryAssets();
      }
    });
    elements.cloudinaryLoadMore?.addEventListener('click', () => fetchCloudinaryAssets({ append: true }));
    elements.cloudinaryResults?.addEventListener('click', (event) => {
      const card = event.target.closest('.cloudinary-card');
      if (!card) return;
      const id = card.dataset.id;
      const asset = state.cloudinary.assets.find((item) => item.public_id === id);
      if (!asset) return;
      const action = event.target.closest('button')?.dataset.action;
      if (action === 'copy') {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(id);
          showToast('ID скопійовано');
        }
        return;
      }
      applyCloudinaryAsset(asset);
    });
    elements.cloudinaryUploadBtn?.addEventListener('click', uploadCloudinaryAsset);
    elements.cloudinaryInspectBtn?.addEventListener('click', inspectCloudinaryAsset);
    elements.cloudinaryOpenBtn?.addEventListener('click', openCloudinaryAsset);
    elements.cloudinaryCopyBtn?.addEventListener('click', () => {
      const id = (elements.cloudinaryInput?.value || '').trim();
      if (!id) {
        showToast('Немає Cloudinary ID');
        return;
      }
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(id);
        showToast('ID скопійовано');
      }
    });
    elements.resetBtn?.addEventListener('click', () => fillForm(null));
    elements.artworkForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = collectFormData();
      saveArtwork(payload).catch((error) => {
        console.error(error);
        showToast('Не вдалося зберегти');
      });
    });
  };

  const init = () => {
    bindEvents();
    updateBulkUi();
    if (!state.token) {
      showLogin();
      return;
    }
    hideLogin();
    fetchArtworks();
    fetchCloudinaryStatus();
  };

  init();
})();
