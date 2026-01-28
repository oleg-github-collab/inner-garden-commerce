(() => {
  const CLOUDINARY_BASE = 'https://res.cloudinary.com/djdc6wcpg/image/upload/f_auto,q_auto/';
  const state = {
    token: localStorage.getItem('inner-garden-admin-token') || '',
    artworks: [],
    filtered: [],
    selectedId: null
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
    artworkForm: $('#artworkForm'),
    formTitle: $('#formTitle'),
    formStatusBadge: $('#formStatusBadge'),
    artworkId: $('#artworkId'),
    cloudinaryInput: $('#cloudinaryInput'),
    previewImage: $('#previewImage'),
    cloudinaryDrop: $('#cloudinaryDrop'),
    statusSelect: $('#statusSelect'),
    resetBtn: $('#resetBtn'),
    toast: $('#toast')
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
      const thumbSrc = art.cloudinary_id ? `${CLOUDINARY_BASE}${art.cloudinary_id}.webp` : '';
      return `
        <div class="artwork-row" data-id="${art.id}">
          <img class="artwork-thumb" src="${thumbSrc}" alt="${title}">
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
  };

  const fillForm = (artwork) => {
    if (!elements.artworkForm) return;
    const form = elements.artworkForm;
    form.reset();
    elements.artworkId.value = artwork?.id || '';

    if (!artwork) {
      elements.formTitle.textContent = 'Нова картина';
      elements.formStatusBadge.textContent = statusLabels.available;
      elements.formStatusBadge.className = 'status-pill';
      elements.previewImage.src = '';
      elements.previewImage.alt = '';
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

    updatePreview(artwork.cloudinary_id || '');
  };

  const updatePreview = (cloudinaryId) => {
    if (!elements.previewImage) return;
    const hint = elements.cloudinaryDrop?.querySelector('.drop-hint');
    if (!cloudinaryId) {
      elements.previewImage.src = '';
      elements.previewImage.alt = '';
      if (hint) hint.style.display = 'block';
      return;
    }
    elements.previewImage.src = `${CLOUDINARY_BASE}${cloudinaryId}.webp`;
    elements.previewImage.alt = 'Preview';
    if (hint) hint.style.display = 'none';
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
    } catch (error) {
      showToast('Невірні дані або адмінка не налаштована');
    } finally {
      elements.loginBtn.disabled = false;
    }
  };

  const handleLogout = () => {
    state.token = '';
    localStorage.removeItem('inner-garden-admin-token');
    showLogin();
  };

  const handleListClick = (event) => {
    const row = event.target.closest('.artwork-row');
    if (!row) return;
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
    elements.cloudinaryInput?.addEventListener('input', (event) => updatePreview(event.target.value.trim()));
    elements.cloudinaryInput?.addEventListener('paste', (event) => {
      const text = event.clipboardData?.getData('text/plain') || '';
      const id = extractCloudinaryId(text);
      if (id) {
        event.preventDefault();
        elements.cloudinaryInput.value = id;
        updatePreview(id);
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
        updatePreview(id);
        showToast('Cloudinary ID оновлено');
      });
    }
    elements.statusSelect?.addEventListener('change', (event) => {
      const status = normalizeStatus(event.target.value);
      elements.formStatusBadge.textContent = statusLabels[status];
      elements.formStatusBadge.className = `status-pill ${status}`;
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
    if (!state.token) {
      showLogin();
      return;
    }
    hideLogin();
    fetchArtworks();
  };

  init();
})();
