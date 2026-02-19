/**
 * Inner Garden — Admin Panel Application
 * Premium SaaS-quality admin for art gallery management
 * Features: visual grid, inline edit, keyboard shortcuts, dark mode,
 *           real-time search, batch ops, drag-drop upload, toast notifications
 */
(() => {
  'use strict';

  // ============================
  // Constants
  // ============================
  const CLOUD_NAME = 'djdc6wcpg';
  const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
  const THUMB_TRANSFORM = 'c_fill,w_480,h_360,q_auto,f_auto';
  const PREVIEW_TRANSFORM = 'c_limit,w_800,q_auto,f_auto';
  const ZOOM_TRANSFORM = 'c_limit,w_1600,q_auto,f_auto';
  const TOKEN_KEY = 'inner-garden-admin-token';
  const THEME_KEY = 'inner-garden-admin-theme';
  const DEBOUNCE_MS = 200;
  const TOAST_DURATION = 3000;

  const STATUS_LABELS = {
    available: 'Available',
    reserved: 'Reserved',
    commission: 'Commission',
    sold: 'Sold'
  };

  const STATUS_ICONS = {
    available: 'fa-check-circle',
    reserved: 'fa-clock',
    commission: 'fa-pen-ruler',
    sold: 'fa-shopping-bag'
  };

  const STATUS_CYCLE = ['available', 'reserved', 'sold', 'commission'];

  // ============================
  // State
  // ============================
  const state = {
    token: localStorage.getItem(TOKEN_KEY) || '',
    artworks: [],
    filtered: [],
    selectedIds: new Set(),
    editingId: null,
    currentView: 'artworks',
    editorOpen: false,
    darkMode: localStorage.getItem(THEME_KEY) === 'dark',
    cloudinary: {
      configured: false,
      assets: [],
      nextCursor: null,
      loading: false,
      selectedId: null,
      ratio: null,
      baseUrl: CLOUDINARY_BASE
    }
  };

  // ============================
  // DOM Helpers
  // ============================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  // ============================
  // Utility Functions
  // ============================
  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function normalizeStatus(val) {
    const s = String(val || '').trim().toLowerCase();
    return STATUS_LABELS[s] ? s : 'available';
  }

  function formatPrice(art) {
    if (typeof art.price === 'number' && Number.isFinite(art.price)) {
      return `${art.currency || 'EUR'} ${art.price.toLocaleString('en-US')}`;
    }
    return 'On request';
  }

  function formatBytes(bytes) {
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  function formatRatio(w, h) {
    if (!w || !h) return '';
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const d = gcd(w, h) || 1;
    return `${Math.round(w / d)}:${Math.round(h / d)}`;
  }

  function thumbUrl(cloudinaryId) {
    if (!cloudinaryId) return '';
    return `${CLOUDINARY_BASE}${THUMB_TRANSFORM}/${cloudinaryId}`;
  }

  function previewUrl(cloudinaryId) {
    if (!cloudinaryId) return '';
    return `${CLOUDINARY_BASE}${PREVIEW_TRANSFORM}/${cloudinaryId}`;
  }

  function zoomUrl(cloudinaryId) {
    if (!cloudinaryId) return '';
    return `${CLOUDINARY_BASE}${ZOOM_TRANSFORM}/${cloudinaryId}`;
  }

  function authHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) headers.Authorization = `Bearer ${state.token}`;
    return headers;
  }

  function authHeadersNoBody() {
    const headers = {};
    if (state.token) headers.Authorization = `Bearer ${state.token}`;
    return headers;
  }

  function extractCloudinaryId(value) {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    if (!trimmed.includes('/') && !trimmed.includes('http')) return trimmed;
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split('/').filter(Boolean);
      const uploadIdx = parts.findIndex(p => p === 'upload');
      if (uploadIdx >= 0) {
        const after = parts.slice(uploadIdx + 1);
        const versionIdx = after.findIndex(p => /^v\d+$/.test(p));
        const transformPattern = /^(?:c_|w_|h_|q_|f_|g_|t_|ar_|b_|e_)/;
        let start = 0;
        if (versionIdx >= 0) {
          start = versionIdx + 1;
        } else {
          while (start < after.length - 1) {
            if (after[start].includes(',') || transformPattern.test(after[start])) {
              start++;
            } else break;
          }
        }
        const idParts = after.slice(start);
        if (!idParts.length) return '';
        idParts[idParts.length - 1] = idParts[idParts.length - 1].replace(/\.[a-z0-9]+$/i, '');
        return idParts.join('/');
      }
    } catch {
      const m = trimmed.match(/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
      if (m) return m[1];
    }
    return '';
  }

  // ============================
  // Toast Notifications
  // ============================
  function toast(message, type = 'default') {
    const container = $('#toastContainer');
    if (!container) return;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      default: 'fa-info-circle'
    };

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i class="fas ${icons[type] || icons.default}"></i><span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.classList.add('toast-out');
      el.addEventListener('animationend', () => el.remove());
    }, TOAST_DURATION);
  }

  // ============================
  // Dark Mode
  // ============================
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    const toggle = $('#darkModeSwitch');
    if (toggle) toggle.classList.toggle('on', state.darkMode);
    const icon = $('#darkModeToggle i');
    if (icon) {
      icon.className = state.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    localStorage.setItem(THEME_KEY, state.darkMode ? 'dark' : 'light');
    applyTheme();
    toast(state.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  }

  // ============================
  // Auth / Login
  // ============================
  function showLogin() {
    const screen = $('#loginScreen');
    const shell = $('#appShell');
    if (screen) screen.style.display = 'flex';
    if (shell) shell.style.display = 'none';
  }

  function hideLogin() {
    const screen = $('#loginScreen');
    const shell = $('#appShell');
    if (screen) screen.style.display = 'none';
    if (shell) shell.style.display = 'flex';
  }

  async function handleLogin(e) {
    e.preventDefault();
    const btn = $('#loginBtn');
    const email = $('#loginEmail').value;
    const password = $('#loginPassword').value;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Login failed');

      state.token = data.token;
      localStorage.setItem(TOKEN_KEY, data.token);
      hideLogin();
      toast('Welcome back!', 'success');
      await Promise.all([fetchArtworks(), fetchCloudinaryStatus()]);
    } catch (err) {
      toast('Invalid credentials or server error', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
    }
  }

  function handleLogout() {
    state.token = '';
    state.artworks = [];
    state.filtered = [];
    state.selectedIds.clear();
    state.editingId = null;
    localStorage.removeItem(TOKEN_KEY);
    closeEditor();
    resetCloudinaryState();
    showLogin();
    toast('Signed out');
  }

  // ============================
  // Navigation / Views
  // ============================
  function switchView(view) {
    state.currentView = view;

    // Update sidebar nav active state
    $$('.sidebar-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Update bottom nav active state
    $$('.bottom-nav-item[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    // Show/hide view panels
    const panels = {
      artworks: '#viewArtworks',
      cloudinary: '#viewCloudinary',
      bulk: '#viewBulk'
    };

    Object.entries(panels).forEach(([key, sel]) => {
      const el = $(sel);
      if (el) el.style.display = key === view ? '' : 'none';
    });

    // Close mobile sidebar if open
    const sidebar = $('#sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Fetch cloudinary status when switching to media
    if (view === 'cloudinary' && !state.cloudinary.configured) {
      fetchCloudinaryStatus();
    }
  }

  // ============================
  // Stats
  // ============================
  function updateStats() {
    const counts = { total: 0, available: 0, sold: 0, reserved: 0, commission: 0 };
    state.artworks.forEach(art => {
      counts.total++;
      const s = normalizeStatus(art.status);
      counts[s] = (counts[s] || 0) + 1;
    });

    const map = {
      statTotal: counts.total,
      statAvailable: counts.available,
      statSold: counts.sold,
      statReserved: counts.reserved,
      statCommission: counts.commission
    };

    Object.entries(map).forEach(([id, val]) => {
      const el = $(`#${id}`);
      if (el) el.textContent = val;
    });
  }

  // ============================
  // Filtering
  // ============================
  function applyFilters() {
    const query = ($('#globalSearch')?.value || '').trim().toLowerCase();
    const statusF = $('#statusFilter')?.value || 'all';
    const segmentF = $('#segmentFilter')?.value || 'all';
    const moodF = $('#moodFilter')?.value || 'all';

    state.filtered = state.artworks.filter(art => {
      const text = [art.title_uk, art.title_en, art.title_de, art.description_uk, art.description_en, art.description_de]
        .filter(Boolean).join(' ').toLowerCase();
      const matchQuery = !query || text.includes(query);
      const matchStatus = statusF === 'all' || normalizeStatus(art.status) === statusF;
      const matchSegment = segmentF === 'all' || (art.segments || []).includes(segmentF);
      const matchMood = moodF === 'all' || art.mood === moodF;
      return matchQuery && matchStatus && matchSegment && matchMood;
    });

    renderGrid();
    updateSelectionUI();
  }

  const debouncedFilter = debounce(applyFilters, DEBOUNCE_MS);

  // ============================
  // Artwork Grid Rendering
  // ============================
  function renderGrid() {
    const grid = $('#artworkGrid');
    const empty = $('#emptyState');
    if (!grid) return;

    if (!state.filtered.length) {
      grid.innerHTML = '';
      if (empty) empty.style.display = '';
      return;
    }

    if (empty) empty.style.display = 'none';

    grid.innerHTML = state.filtered.map(art => {
      const status = normalizeStatus(art.status);
      const title = art.title_uk || art.title_en || 'Untitled';
      const selected = state.selectedIds.has(art.id);
      const imgSrc = thumbUrl(art.cloudinary_id);
      const segments = (art.segments || []).join(', ') || '--';
      const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(status) + 1) % STATUS_CYCLE.length];

      return `
        <div class="art-card ${selected ? 'is-selected' : ''}" data-id="${art.id}">
          <div class="art-card-select" data-action="select">
            <input type="checkbox" ${selected ? 'checked' : ''} data-action="select">
          </div>
          <div class="art-card-img-wrap">
            ${imgSrc ? `<img class="art-card-img" src="${imgSrc}" alt="${title}" loading="lazy" decoding="async">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted);"><i class="fas fa-image" style="font-size:2rem;opacity:0.3;"></i></div>'}
            <span class="art-card-status art-card-status--${status}">${STATUS_LABELS[status]}</span>
            ${imgSrc ? `<button class="art-card-zoom" data-action="zoom" title="Zoom"><i class="fas fa-expand"></i></button>` : ''}
          </div>
          <div class="art-card-body" data-action="edit">
            <div class="art-card-title">${title}</div>
            <div class="art-card-meta">
              <span class="art-card-price">${formatPrice(art)}</span>
              <span class="art-card-meta-dot"></span>
              <span>${art.size || ''}</span>
            </div>
          </div>
          <div class="art-card-footer">
            <button class="art-card-quick-btn art-card-quick-btn--status" data-action="cycle-status" title="Change to ${STATUS_LABELS[nextStatus]}">
              <i class="fas ${STATUS_ICONS[nextStatus]}"></i> ${STATUS_LABELS[nextStatus]}
            </button>
            <button class="art-card-quick-btn" data-action="edit" title="Edit">
              <i class="fas fa-pen"></i> Edit
            </button>
            <button class="art-card-quick-btn art-card-quick-btn--delete" data-action="delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // ============================
  // Selection Management
  // ============================
  function toggleSelect(id, selected) {
    if (selected) {
      state.selectedIds.add(id);
    } else {
      state.selectedIds.delete(id);
    }
    updateSelectionUI();
  }

  function selectAllVisible() {
    state.filtered.forEach(art => state.selectedIds.add(art.id));
    renderGrid();
    updateSelectionUI();
    toast(`Selected ${state.selectedIds.size} artworks`);
  }

  function clearSelection() {
    state.selectedIds.clear();
    renderGrid();
    updateSelectionUI();
  }

  function updateSelectionUI() {
    const count = state.selectedIds.size;

    // Selection count badge
    const countEl = $('#selectionCount');
    if (countEl) {
      countEl.style.display = count > 0 ? '' : 'none';
      countEl.textContent = `${count} selected`;
    }

    // Bulk nav badge
    const navBadge = $('#bulkNavBadge');
    if (navBadge) {
      navBadge.style.display = count > 0 ? '' : 'none';
      navBadge.textContent = count;
    }

    // Bulk view badge
    const bulkBadge = $('#bulkSelectionBadge');
    if (bulkBadge) bulkBadge.textContent = `${count} artwork${count !== 1 ? 's' : ''} selected`;

    // Enable/disable bulk buttons
    const applyBtn = $('#bulkApplyBtn');
    const deleteBtn = $('#bulkDeleteBtn');
    if (applyBtn) applyBtn.disabled = count === 0;
    if (deleteBtn) deleteBtn.disabled = count === 0;
  }

  // ============================
  // Grid Event Handling
  // ============================
  function handleGridClick(e) {
    const card = e.target.closest('.art-card');
    if (!card) return;

    const id = card.dataset.id;
    const art = state.artworks.find(a => a.id === id);
    if (!art) return;

    const action = e.target.closest('[data-action]')?.dataset.action;

    switch (action) {
      case 'select': {
        const checkbox = card.querySelector('.art-card-select input');
        // If click was on the div wrapper, not the checkbox itself
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        toggleSelect(id, checkbox.checked);
        // Update card class without full re-render for speed
        card.classList.toggle('is-selected', checkbox.checked);
        return;
      }
      case 'zoom': {
        e.stopPropagation();
        showZoom(art.cloudinary_id);
        return;
      }
      case 'cycle-status': {
        e.stopPropagation();
        const current = normalizeStatus(art.status);
        const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
        quickStatusChange(art, next);
        return;
      }
      case 'delete': {
        e.stopPropagation();
        if (confirm(`Delete "${art.title_uk || art.title_en || 'this artwork'}"?`)) {
          deleteArtwork(id);
        }
        return;
      }
      case 'edit':
      default: {
        openEditor(art);
        return;
      }
    }
  }

  // ============================
  // Quick Status Change
  // ============================
  async function quickStatusChange(art, newStatus) {
    try {
      const res = await fetch(`/api/admin/artworks/${art.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ...art, status: newStatus })
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      // Update local state for instant feedback
      const idx = state.artworks.findIndex(a => a.id === art.id);
      if (idx >= 0) state.artworks[idx].status = newStatus;

      applyFilters();
      updateStats();
      toast(`Status changed to ${STATUS_LABELS[newStatus]}`, 'success');
    } catch (err) {
      toast('Failed to change status', 'error');
    }
  }

  // ============================
  // Image Zoom
  // ============================
  function showZoom(cloudinaryId) {
    if (!cloudinaryId) return;
    const overlay = $('#zoomOverlay');
    const img = $('#zoomImage');
    if (!overlay || !img) return;
    img.src = zoomUrl(cloudinaryId);
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeZoom() {
    const overlay = $('#zoomOverlay');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ============================
  // Editor Panel
  // ============================
  function openEditor(artwork) {
    const panel = $('#editorPanel');
    const overlay = $('#editorOverlay');
    if (!panel) return;

    state.editorOpen = true;
    state.editingId = artwork?.id || null;
    panel.classList.add('open');
    if (overlay) overlay.classList.add('visible');

    fillEditorForm(artwork);
  }

  function closeEditor() {
    const panel = $('#editorPanel');
    const overlay = $('#editorOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    state.editorOpen = false;
    state.editingId = null;
  }

  function fillEditorForm(artwork) {
    const form = $('#artworkForm');
    if (!form) return;

    // Reset form
    form.reset();

    const title = $('#editorTitle');
    const idInput = $('#artworkId');
    const previewImg = $('#editorPreviewImg');
    const placeholder = $('#editorDropPlaceholder');
    const dropZone = $('#editorDropZone');
    const sizeInput = $('#editorSize');
    const cloudMeta = $('#editorCloudMeta');
    const ratioHint = $('#editorRatioHint');

    if (!artwork) {
      // New artwork
      if (title) title.textContent = 'New Artwork';
      if (idInput) idInput.value = '';
      if (previewImg) { previewImg.style.display = 'none'; previewImg.src = ''; }
      if (placeholder) placeholder.style.display = '';
      if (dropZone) dropZone.classList.remove('has-image');
      if (cloudMeta) cloudMeta.textContent = 'Image metadata: --';
      if (ratioHint) ratioHint.textContent = 'Aspect ratio: --';
      if (sizeInput) sizeInput.dataset.auto = 'true';

      setEditorStatus('available');
      setEditorMood('calm');
      state.cloudinary.ratio = null;

      // Show/hide buttons
      const delBtn = $('#editorDeleteBtn');
      const dupBtn = $('#editorDuplicateBtn');
      if (delBtn) delBtn.style.display = 'none';
      if (dupBtn) dupBtn.style.display = 'none';

      return;
    }

    // Editing existing artwork
    if (title) title.textContent = artwork.title_uk || artwork.title_en || 'Edit Artwork';
    if (idInput) idInput.value = artwork.id;

    // Fill all fields
    const fields = ['title_uk', 'title_en', 'title_de', 'description_uk', 'description_en', 'description_de',
                     'technique_uk', 'technique_en', 'technique_de', 'price', 'currency', 'width_cm',
                     'height_cm', 'size', 'cloudinary_id'];
    fields.forEach(name => {
      const el = form.querySelector(`[name="${name}"]`);
      if (el && artwork[name] !== undefined && artwork[name] !== null) {
        el.value = artwork[name];
      }
    });

    // Status
    setEditorStatus(normalizeStatus(artwork.status));

    // Mood
    setEditorMood(artwork.mood || 'calm');

    // Segments
    $$('#artworkForm [name="segments"]').forEach(cb => {
      cb.checked = (artwork.segments || []).includes(cb.value);
    });

    // Image preview
    if (artwork.cloudinary_id) {
      if (previewImg) {
        previewImg.src = previewUrl(artwork.cloudinary_id);
        previewImg.style.display = '';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (dropZone) dropZone.classList.add('has-image');
    } else {
      if (previewImg) { previewImg.style.display = 'none'; previewImg.src = ''; }
      if (placeholder) placeholder.style.display = '';
      if (dropZone) dropZone.classList.remove('has-image');
    }

    if (cloudMeta) cloudMeta.textContent = 'Image metadata: --';
    if (ratioHint) {
      const w = artwork.width_cm;
      const h = artwork.height_cm;
      if (w && h) {
        ratioHint.textContent = `Aspect ratio: ${formatRatio(w, h)} (${w} x ${h} cm)`;
      } else {
        ratioHint.textContent = 'Aspect ratio: --';
      }
    }

    if (sizeInput) sizeInput.dataset.auto = artwork.size ? 'false' : 'true';

    // Show/hide buttons
    const delBtn = $('#editorDeleteBtn');
    const dupBtn = $('#editorDuplicateBtn');
    if (delBtn) delBtn.style.display = '';
    if (dupBtn) dupBtn.style.display = '';
  }

  function setEditorStatus(status) {
    const hiddenInput = $('#editorStatus');
    if (hiddenInput) hiddenInput.value = status;

    $$('#statusToggleGroup .status-toggle').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
  }

  function setEditorMood(mood) {
    const hiddenInput = $('#editorMood');
    if (hiddenInput) hiddenInput.value = mood;

    $$('#moodSelect .mood-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.mood === mood);
    });
  }

  function updateEditorPreview(cloudinaryId) {
    const img = $('#editorPreviewImg');
    const placeholder = $('#editorDropPlaceholder');
    const dropZone = $('#editorDropZone');

    if (!cloudinaryId) {
      if (img) { img.style.display = 'none'; img.src = ''; }
      if (placeholder) placeholder.style.display = '';
      if (dropZone) dropZone.classList.remove('has-image');
      return;
    }

    if (img) {
      img.src = previewUrl(cloudinaryId);
      img.style.display = '';
    }
    if (placeholder) placeholder.style.display = 'none';
    if (dropZone) dropZone.classList.add('has-image');
  }

  function collectFormData() {
    const form = $('#artworkForm');
    if (!form) return {};

    const fd = new FormData(form);
    const payload = {};
    fd.forEach((val, key) => {
      if (key === 'segments') return;
      payload[key] = val;
    });

    payload.segments = fd.getAll('segments');
    payload.price = payload.price ? Number(payload.price) : null;
    payload.width_cm = payload.width_cm ? Number(payload.width_cm) : null;
    payload.height_cm = payload.height_cm ? Number(payload.height_cm) : null;

    return payload;
  }

  function autoFillSize() {
    const wInput = $('#editorWidth');
    const hInput = $('#editorHeight');
    const sInput = $('#editorSize');
    const ratioHint = $('#editorRatioHint');
    if (!wInput || !hInput || !sInput) return;

    const w = Number(wInput.value);
    const h = Number(hInput.value);

    if (w && h) {
      if (!sInput.value || sInput.dataset.auto === 'true') {
        sInput.value = `${w} \u00D7 ${h} cm`;
        sInput.dataset.auto = 'true';
      }
      if (ratioHint) {
        ratioHint.textContent = `Aspect ratio: ${formatRatio(w, h)} (${w} x ${h} cm)`;
      }
    }
  }

  function applyRatioFromCloud(changedField) {
    if (!state.cloudinary.ratio) return;
    const wInput = $('#editorWidth');
    const hInput = $('#editorHeight');
    if (!wInput || !hInput) return;

    const w = Number(wInput.value);
    const h = Number(hInput.value);

    if (changedField === 'width' && w && !h) {
      hInput.value = Math.round(w / state.cloudinary.ratio);
    }
    if (changedField === 'height' && h && !w) {
      wInput.value = Math.round(h * state.cloudinary.ratio);
    }
  }

  // ============================
  // API: Artworks CRUD
  // ============================
  async function fetchArtworks() {
    try {
      const res = await fetch('/api/admin/artworks', { headers: authHeadersNoBody() });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');

      state.artworks = data.artworks || [];

      // Clean up selections of deleted items
      const liveIds = new Set(state.artworks.map(a => a.id));
      state.selectedIds.forEach(id => {
        if (!liveIds.has(id)) state.selectedIds.delete(id);
      });

      applyFilters();
      updateStats();
      updateSelectionUI();
    } catch (err) {
      toast('Failed to load artworks', 'error');
      console.error(err);
    }
  }

  async function saveArtwork(payload) {
    const id = payload.id || state.editingId;
    const isEditing = Boolean(id);
    const url = isEditing ? `/api/admin/artworks/${id}` : '/api/admin/artworks';
    const method = isEditing ? 'PUT' : 'POST';

    const saveBtn = $('#saveBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner"></span> Saving...';
    }

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');

      toast(isEditing ? 'Artwork updated' : 'Artwork created', 'success');
      await fetchArtworks();

      // If editing, keep editor open with updated data
      if (data.artwork) {
        state.editingId = data.artwork.id;
        fillEditorForm(data.artwork);
      }
    } catch (err) {
      toast('Failed to save artwork', 'error');
      console.error(err);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i><span>Save Artwork</span><kbd>Ctrl+S</kbd>';
      }
    }
  }

  async function deleteArtwork(id) {
    try {
      const res = await fetch(`/api/admin/artworks/${id}`, {
        method: 'DELETE',
        headers: authHeadersNoBody()
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Delete failed');

      toast('Artwork deleted', 'success');
      state.selectedIds.delete(id);
      if (state.editingId === id) closeEditor();
      await fetchArtworks();
    } catch (err) {
      toast('Failed to delete artwork', 'error');
    }
  }

  // ============================
  // Bulk Operations
  // ============================
  async function bulkUpdate() {
    const ids = [...state.selectedIds];
    if (!ids.length) { toast('No artworks selected', 'warning'); return; }

    const updates = {};
    const options = {};

    const bulkStatus = $('#bulkStatus')?.value;
    const bulkMood = $('#bulkMood')?.value;
    const bulkCurrency = $('#bulkCurrency')?.value;
    const bulkPrice = $('#bulkPrice')?.value;
    const bulkPriceClear = $('#bulkPriceClear')?.checked;

    if (bulkStatus) updates.status = bulkStatus;
    if (bulkMood) updates.mood = bulkMood;
    if (bulkCurrency) updates.currency = bulkCurrency;

    if (bulkPriceClear) {
      updates.price = null;
    } else if (bulkPrice !== '' && bulkPrice !== undefined) {
      updates.price = Number(bulkPrice);
    }

    const segmentInputs = $$('#bulkSegmentChips input[type="checkbox"]');
    const selectedSegments = segmentInputs.filter(cb => cb.checked).map(cb => cb.value);
    if (selectedSegments.length) {
      updates.segments = selectedSegments;
      options.segmentsMode = $('#bulkSegmentsMode')?.value || 'replace';
    }

    if (!Object.keys(updates).length) {
      toast('Select at least one field to update', 'warning');
      return;
    }

    const applyBtn = $('#bulkApplyBtn');
    if (applyBtn) { applyBtn.disabled = true; applyBtn.innerHTML = '<span class="spinner"></span> Applying...'; }

    try {
      const res = await fetch('/api/admin/artworks/bulk', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ ids, updates, options })
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Bulk update failed');

      toast(`Updated ${ids.length} artworks`, 'success');
      resetBulkForm();
      clearSelection();
      await fetchArtworks();
    } catch (err) {
      toast('Bulk update failed', 'error');
    } finally {
      if (applyBtn) {
        applyBtn.disabled = state.selectedIds.size === 0;
        applyBtn.innerHTML = '<i class="fas fa-check"></i> Apply to Selected';
      }
    }
  }

  async function bulkDelete() {
    const ids = [...state.selectedIds];
    if (!ids.length) { toast('No artworks selected', 'warning'); return; }

    if (!confirm(`Delete ${ids.length} artwork${ids.length > 1 ? 's' : ''}? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/admin/artworks/bulk-delete', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ids })
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Bulk delete failed');

      toast(`Deleted ${ids.length} artworks`, 'success');
      clearSelection();
      if (state.editingId && ids.includes(state.editingId)) closeEditor();
      await fetchArtworks();
    } catch (err) {
      toast('Bulk delete failed', 'error');
    }
  }

  function resetBulkForm() {
    ['bulkStatus', 'bulkMood', 'bulkCurrency', 'bulkSegmentsMode'].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.value = el.options ? el.options[0].value : '';
    });
    const price = $('#bulkPrice');
    if (price) { price.value = ''; price.disabled = false; }
    const priceClear = $('#bulkPriceClear');
    if (priceClear) priceClear.checked = false;
    $$('#bulkSegmentChips input[type="checkbox"]').forEach(cb => { cb.checked = false; });
  }

  // ============================
  // Cloudinary
  // ============================
  function resetCloudinaryState() {
    state.cloudinary = {
      configured: false,
      assets: [],
      nextCursor: null,
      loading: false,
      selectedId: null,
      ratio: null,
      baseUrl: CLOUDINARY_BASE
    };
    updateCloudinaryStatusUI(false);
    const grid = $('#cloudGrid');
    if (grid) grid.innerHTML = '';
  }

  function updateCloudinaryStatusUI(configured) {
    const chip = $('#cloudinaryStatusChip');
    if (!chip) return;
    chip.className = `status-chip ${configured ? 'online' : 'offline'}`;
    chip.innerHTML = configured
      ? '<i class="fas fa-circle"></i><span>Connected</span>'
      : '<i class="fas fa-circle"></i><span>Disconnected</span>';
  }

  async function fetchCloudinaryStatus() {
    if (!state.token) return;
    try {
      const res = await fetch('/api/admin/cloudinary/status', { headers: authHeadersNoBody() });
      const data = await res.json();
      state.cloudinary.configured = Boolean(data.configured);
      updateCloudinaryStatusUI(state.cloudinary.configured);
    } catch {
      updateCloudinaryStatusUI(false);
    }
  }

  async function searchCloudinary(append = false) {
    if (!state.cloudinary.configured) { toast('Cloudinary not configured', 'warning'); return; }
    if (append && !state.cloudinary.nextCursor) return;
    if (state.cloudinary.loading) return;

    state.cloudinary.loading = true;
    const searchBtn = $('#cloudSearchBtn');
    if (searchBtn && !append) searchBtn.innerHTML = '<span class="spinner"></span>';

    try {
      const params = new URLSearchParams();
      const q = ($('#cloudSearch')?.value || '').trim();
      const folder = ($('#cloudFolder')?.value || '').trim();
      const tag = ($('#cloudTag')?.value || '').trim();
      if (q) params.set('query', q);
      if (folder) params.set('folder', folder);
      if (tag) params.set('tag', tag);
      if (append && state.cloudinary.nextCursor) params.set('cursor', state.cloudinary.nextCursor);

      const res = await fetch(`/api/admin/cloudinary/search?${params}`, { headers: authHeadersNoBody() });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Search failed');

      const assets = data.assets || [];
      state.cloudinary.assets = append ? [...state.cloudinary.assets, ...assets] : assets;
      state.cloudinary.nextCursor = data.next_cursor || null;
      renderCloudGrid();
    } catch (err) {
      toast('Cloudinary search failed', 'error');
    } finally {
      state.cloudinary.loading = false;
      if (searchBtn) searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
    }
  }

  function clearCloudSearch() {
    const fields = ['cloudSearch', 'cloudFolder', 'cloudTag'];
    fields.forEach(id => { const el = $(`#${id}`); if (el) el.value = ''; });
    state.cloudinary.assets = [];
    state.cloudinary.nextCursor = null;
    state.cloudinary.selectedId = null;
    renderCloudGrid();
  }

  function renderCloudGrid() {
    const grid = $('#cloudGrid');
    const loadMore = $('#cloudLoadMore');
    if (!grid) return;

    if (!state.cloudinary.assets.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);">No results. Try searching above.</div>';
      if (loadMore) loadMore.style.display = 'none';
      return;
    }

    grid.innerHTML = state.cloudinary.assets.map(asset => {
      const thumbSrc = asset.secure_url
        ? asset.secure_url.replace('/upload/', '/upload/c_fill,w_240,h_240,q_auto,f_auto/')
        : '';
      const ratio = formatRatio(asset.width, asset.height);
      const size = `${asset.width || '?'}x${asset.height || '?'}`;
      const bytes = formatBytes(asset.bytes);
      const meta = [size, bytes, ratio].filter(Boolean).join(' / ');
      const isSelected = asset.public_id === state.cloudinary.selectedId;
      const tags = (asset.tags || []).slice(0, 5);
      const tagsHtml = tags.length
        ? `<div class="cloud-card-tags">${tags.map(t => `<span class="cloud-tag">${t}</span>`).join('')}</div>`
        : '';
      const caption = asset.context?.caption || asset.context?.alt || '';
      const captionHtml = caption
        ? `<div class="cloud-card-caption" title="${caption}">${caption}</div>`
        : '';

      return `
        <div class="cloud-card ${isSelected ? 'is-selected' : ''}" data-id="${asset.public_id}">
          <img class="cloud-card-img" src="${thumbSrc}" alt="${asset.public_id}" loading="lazy">
          <div class="cloud-card-body">
            <div class="cloud-card-id" title="${asset.public_id}">${asset.public_id}</div>
            <div class="cloud-card-meta">${meta}</div>
            ${captionHtml}
            ${tagsHtml}
          </div>
          <div class="cloud-card-actions">
            <button class="btn btn-primary btn-sm" data-action="use">Use</button>
            <button class="btn btn-accent btn-sm" data-action="autofill" title="Auto-fill form from metadata">Auto-fill</button>
            <button class="btn btn-ghost btn-sm" data-action="copy">Copy ID</button>
          </div>
        </div>
      `;
    }).join('');

    if (loadMore) {
      loadMore.style.display = state.cloudinary.nextCursor ? '' : 'none';
    }
  }

  function useCloudinaryAsset(asset) {
    if (!asset) return;
    state.cloudinary.selectedId = asset.public_id;
    state.cloudinary.ratio = (asset.width && asset.height) ? asset.width / asset.height : null;

    const cidInput = $('#editorCloudinaryId');
    if (cidInput) cidInput.value = asset.public_id;

    updateEditorPreview(asset.public_id);

    const cloudMeta = $('#editorCloudMeta');
    if (cloudMeta && asset.width && asset.height) {
      const ratio = formatRatio(asset.width, asset.height);
      const bytes = formatBytes(asset.bytes);
      const parts = [
        `${asset.width}x${asset.height}px`,
        ratio ? `ratio ${ratio}` : null,
        bytes,
        asset.format ? asset.format.toUpperCase() : null
      ].filter(Boolean);
      cloudMeta.textContent = `Image: ${parts.join(' / ')}`;
    }

    // Auto-fill dimensions from ratio
    applyRatioFromCloud('width');
    applyRatioFromCloud('height');
    autoFillSize();

    renderCloudGrid();
    toast('Cloudinary ID applied', 'success');

    // If editor is open, it's already there. If not, open it.
    if (state.editorOpen) return;
  }

  function autoFillFromCloudinary(asset) {
    if (!asset) return;

    // Apply cloudinary_id and preview
    useCloudinaryAsset(asset);

    const context = asset.context || {};
    const tags = asset.tags || [];

    // Map context.alt -> title fields (only if empty)
    const altText = context.alt || '';
    if (altText) {
      const titleEn = $('[name="title_en"]');
      if (titleEn && !titleEn.value) titleEn.value = altText;
    }

    // Map context.caption -> description fields (only if empty)
    const caption = context.caption || context.description || '';
    if (caption) {
      const descEn = $('[name="description_en"]');
      if (descEn && !descEn.value) descEn.value = caption;
    }

    // Map tags to mood (if matching)
    const moodTags = ['calm', 'energy', 'luxury', 'focus', 'warmth', 'balance', 'depth'];
    const matchedMood = tags.find(t => moodTags.includes(t.toLowerCase()));
    if (matchedMood) {
      setEditorMood(matchedMood.toLowerCase());
    }

    // Map tags to segments (if matching)
    const segmentTags = ['home', 'business', 'wellness', 'office', 'hotel', 'spa'];
    const matchedSegments = tags.filter(t => segmentTags.includes(t.toLowerCase()));
    if (matchedSegments.length) {
      $$('#artworkForm [name="segments"]').forEach(cb => {
        if (matchedSegments.includes(cb.value)) cb.checked = true;
      });
    }

    toast('Auto-filled from Cloudinary metadata', 'success');
  }

  async function uploadToCloudinary() {
    if (!state.cloudinary.configured) { toast('Cloudinary not configured', 'warning'); return; }

    const fileInput = $('#cloudFileInput');
    const file = fileInput?.files?.[0];
    if (!file) { toast('Select a file first', 'warning'); return; }

    const uploadBtn = $('#uploadBtn');
    const progress = $('#uploadProgress');
    const progressBar = progress?.querySelector('.upload-progress-bar');

    if (uploadBtn) { uploadBtn.disabled = true; uploadBtn.innerHTML = '<span class="spinner"></span> Uploading...'; }
    if (progress) progress.style.display = '';
    if (progressBar) progressBar.style.width = '30%';

    try {
      // Convert to data URL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();
        reader.onload = () => { img.src = reader.result; };
        reader.onerror = reject;
        img.onerror = reject;
        img.onload = () => {
          const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
          const scale = maxDim > 2400 ? 2400 / maxDim : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.naturalWidth * scale);
          canvas.height = Math.round(img.naturalHeight * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        reader.readAsDataURL(file);
      });

      if (progressBar) progressBar.style.width = '60%';

      const payload = {
        file: dataUrl,
        folder: ($('#uploadFolder')?.value || '').trim() || undefined,
        public_id: ($('#uploadPublicId')?.value || '').trim() || undefined
      };

      const res = await fetch('/api/admin/cloudinary/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      if (progressBar) progressBar.style.width = '90%';

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

      if (progressBar) progressBar.style.width = '100%';

      const asset = data.asset;
      state.cloudinary.assets = [asset, ...state.cloudinary.assets];
      renderCloudGrid();

      toast('File uploaded successfully', 'success');

      // Auto-use the uploaded asset
      useCloudinaryAsset(asset);

      // Reset file input
      if (fileInput) fileInput.value = '';
      if (uploadBtn) uploadBtn.style.display = 'none';
    } catch (err) {
      toast('Upload failed', 'error');
      console.error(err);
    } finally {
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
      }
      setTimeout(() => {
        if (progress) progress.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
      }, 500);
    }
  }

  async function inspectCloudinaryAsset() {
    const id = ($('#editorCloudinaryId')?.value || '').trim();
    if (!id) { toast('Enter a Cloudinary ID first', 'warning'); return; }

    const btn = $('#editorInspectBtn');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(`/api/admin/cloudinary/asset?public_id=${encodeURIComponent(id)}`, {
        headers: authHeadersNoBody()
      });
      if (res.status === 401) { showLogin(); return; }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Lookup failed');

      const asset = data.asset;
      state.cloudinary.ratio = (asset.width && asset.height) ? asset.width / asset.height : null;

      updateEditorPreview(asset.public_id);

      const cloudMeta = $('#editorCloudMeta');
      if (cloudMeta) {
        const ratio = formatRatio(asset.width, asset.height);
        const bytes = formatBytes(asset.bytes);
        const parts = [
          `${asset.width}x${asset.height}px`,
          ratio ? `ratio ${ratio}` : null,
          bytes,
          asset.format ? asset.format.toUpperCase() : null
        ].filter(Boolean);
        const tagStr = (asset.tags || []).length ? ` | Tags: ${asset.tags.join(', ')}` : '';
        const ctx = asset.context || {};
        const ctxStr = (ctx.caption || ctx.alt) ? ` | ${ctx.caption || ctx.alt}` : '';
        cloudMeta.textContent = `Image: ${parts.join(' / ')}${tagStr}${ctxStr}`;
      }

      applyRatioFromCloud('width');
      applyRatioFromCloud('height');
      autoFillSize();

      toast('Cloudinary data loaded', 'success');
    } catch (err) {
      toast('Failed to inspect asset', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // ============================
  // Event Binding
  // ============================
  function bindEvents() {
    // Login
    $('#loginForm')?.addEventListener('submit', handleLogin);

    // Logout
    $('#logoutBtn')?.addEventListener('click', handleLogout);

    // Refresh
    $('#refreshBtn')?.addEventListener('click', () => {
      fetchArtworks();
      toast('Refreshing...');
    });

    // Dark Mode
    $('#darkModeToggle')?.addEventListener('click', toggleDarkMode);

    // Navigation — Sidebar
    $$('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.view) switchView(btn.dataset.view);
      });
    });

    // Navigation — Bottom Nav
    $$('.bottom-nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // Mobile menu toggle
    $('#menuToggle')?.addEventListener('click', () => {
      $('#sidebar')?.classList.toggle('mobile-open');
    });

    // Mobile new button
    $('#mobileNewBtn')?.addEventListener('click', () => openEditor(null));

    // New Artwork
    $('#newArtworkBtn')?.addEventListener('click', () => openEditor(null));

    // Search
    $('#globalSearch')?.addEventListener('input', debouncedFilter);

    // Filters
    ['statusFilter', 'segmentFilter', 'moodFilter'].forEach(id => {
      $(`#${id}`)?.addEventListener('change', applyFilters);
    });

    // Selection
    $('#selectAllVisible')?.addEventListener('click', selectAllVisible);
    $('#clearSelection')?.addEventListener('click', clearSelection);

    // Artwork Grid
    $('#artworkGrid')?.addEventListener('click', handleGridClick);

    // Editor — Close
    $('#editorCloseBtn')?.addEventListener('click', closeEditor);
    $('#editorOverlay')?.addEventListener('click', closeEditor);

    // Editor — Form submit
    $('#artworkForm')?.addEventListener('submit', e => {
      e.preventDefault();
      saveArtwork(collectFormData());
    });

    // Editor — Status toggles
    $('#statusToggleGroup')?.addEventListener('click', e => {
      const btn = e.target.closest('.status-toggle');
      if (!btn) return;
      setEditorStatus(btn.dataset.status);
    });

    // Editor — Language tabs
    $$('.lang-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const lang = tab.dataset.lang;
        $$('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
        $$('.lang-panel').forEach(p => p.classList.toggle('active', p.dataset.lang === lang));
      });
    });

    // Editor — Mood chips
    $('#moodSelect')?.addEventListener('click', e => {
      const chip = e.target.closest('.mood-chip');
      if (!chip) return;
      setEditorMood(chip.dataset.mood);
    });

    // Editor — Dimensions auto-fill
    $('#editorWidth')?.addEventListener('input', () => {
      applyRatioFromCloud('width');
      autoFillSize();
    });
    $('#editorHeight')?.addEventListener('input', () => {
      applyRatioFromCloud('height');
      autoFillSize();
    });
    $('#editorSize')?.addEventListener('input', () => {
      $('#editorSize').dataset.auto = 'false';
    });

    // Editor — Cloudinary ID input
    const cidInput = $('#editorCloudinaryId');
    cidInput?.addEventListener('input', e => {
      const raw = e.target.value.trim();
      const extracted = extractCloudinaryId(raw);
      if (extracted && extracted !== raw) e.target.value = extracted;
      updateEditorPreview(e.target.value.trim());
      state.cloudinary.ratio = null;
    });

    cidInput?.addEventListener('paste', e => {
      const text = e.clipboardData?.getData('text/plain') || '';
      const id = extractCloudinaryId(text);
      if (id) {
        e.preventDefault();
        cidInput.value = id;
        updateEditorPreview(id);
        state.cloudinary.ratio = null;
        toast('Cloudinary ID applied');
      }
    });

    // Editor — Drop zone
    const dropZone = $('#editorDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const text = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain') || '';
        const id = extractCloudinaryId(text);
        if (id) {
          const input = $('#editorCloudinaryId');
          if (input) input.value = id;
          updateEditorPreview(id);
          state.cloudinary.ratio = null;
          toast('Cloudinary ID applied from drop');
        } else {
          toast('Could not extract Cloudinary ID', 'warning');
        }
      });

      // Click on image zone to zoom
      dropZone.addEventListener('click', e => {
        const img = $('#editorPreviewImg');
        if (img && img.style.display !== 'none' && img.src) {
          const cidVal = $('#editorCloudinaryId')?.value?.trim();
          if (cidVal) showZoom(cidVal);
        }
      });
    }

    // Editor — Inspect / Open / Auto-fill buttons
    $('#editorInspectBtn')?.addEventListener('click', inspectCloudinaryAsset);
    $('#editorAutoFillBtn')?.addEventListener('click', async () => {
      const id = ($('#editorCloudinaryId')?.value || '').trim();
      if (!id) { toast('Enter a Cloudinary ID first', 'warning'); return; }
      try {
        const res = await fetch(`/api/admin/cloudinary/asset?public_id=${encodeURIComponent(id)}`, { headers: authHeadersNoBody() });
        if (res.status === 401) { showLogin(); return; }
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Lookup failed');
        autoFillFromCloudinary(data.asset);
      } catch (err) {
        toast('Failed to fetch metadata', 'error');
      }
    });
    $('#editorOpenCloudBtn')?.addEventListener('click', () => {
      const id = ($('#editorCloudinaryId')?.value || '').trim();
      if (!id) { toast('Enter a Cloudinary ID first', 'warning'); return; }
      window.open(`${CLOUDINARY_BASE}${id}`, '_blank');
    });

    // Editor — Delete
    $('#editorDeleteBtn')?.addEventListener('click', () => {
      if (!state.editingId) return;
      const art = state.artworks.find(a => a.id === state.editingId);
      if (confirm(`Delete "${art?.title_uk || art?.title_en || 'this artwork'}"?`)) {
        deleteArtwork(state.editingId);
      }
    });

    // Editor — Duplicate
    $('#editorDuplicateBtn')?.addEventListener('click', () => {
      if (!state.editingId) return;
      const art = state.artworks.find(a => a.id === state.editingId);
      if (!art) return;
      const dup = { ...art };
      delete dup.id;
      dup.title_uk = (dup.title_uk || '') + ' (copy)';
      dup.title_en = (dup.title_en || '') + ' (copy)';
      dup.title_de = (dup.title_de || '') + ' (copy)';
      state.editingId = null;
      fillEditorForm(dup);
      $('#artworkId').value = '';
      $('#editorTitle').textContent = 'Duplicate Artwork';
      toast('Duplicated -- make changes and save');
    });

    // Bulk operations
    $('#bulkApplyBtn')?.addEventListener('click', bulkUpdate);
    $('#bulkDeleteBtn')?.addEventListener('click', bulkDelete);
    $('#bulkPriceClear')?.addEventListener('change', () => {
      const price = $('#bulkPrice');
      if (price) {
        if ($('#bulkPriceClear').checked) {
          price.value = '';
          price.disabled = true;
        } else {
          price.disabled = false;
        }
      }
    });

    // Cloudinary
    $('#cloudSearchBtn')?.addEventListener('click', () => searchCloudinary(false));
    $('#cloudClearBtn')?.addEventListener('click', clearCloudSearch);
    $('#cloudLoadMore')?.addEventListener('click', () => searchCloudinary(true));

    $('#cloudSearch')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); searchCloudinary(false); }
    });

    // Cloud grid clicks
    $('#cloudGrid')?.addEventListener('click', e => {
      const card = e.target.closest('.cloud-card');
      if (!card) return;
      const id = card.dataset.id;
      const asset = state.cloudinary.assets.find(a => a.public_id === id);
      if (!asset) return;

      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'copy') {
        navigator.clipboard?.writeText(id);
        toast('ID copied to clipboard');
        return;
      }
      if (action === 'autofill') {
        if (!state.editorOpen) openEditor(null);
        autoFillFromCloudinary(asset);
        return;
      }
      // Use asset (either "use" button or card click)
      useCloudinaryAsset(asset);
    });

    // Upload zone
    const uploadZone = $('#uploadZone');
    if (uploadZone) {
      uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
      uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
      uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer?.files;
        if (files?.length) {
          const fileInput = $('#cloudFileInput');
          if (fileInput) {
            fileInput.files = files;
            const uploadBtn = $('#uploadBtn');
            if (uploadBtn) uploadBtn.style.display = '';
          }
        }
      });
    }

    $('#cloudFileInput')?.addEventListener('change', e => {
      const uploadBtn = $('#uploadBtn');
      if (uploadBtn) uploadBtn.style.display = e.target.files?.length ? '' : 'none';
    });

    $('#uploadBtn')?.addEventListener('click', uploadToCloudinary);

    // Zoom overlay
    $('#zoomOverlay')?.addEventListener('click', closeZoom);
    $('#zoomClose')?.addEventListener('click', e => { e.stopPropagation(); closeZoom(); });

    // Shortcuts modal
    $('#shortcutsClose')?.addEventListener('click', () => {
      const modal = $('#shortcutsModal');
      if (modal) modal.style.display = 'none';
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboard);
  }

  // ============================
  // Keyboard Shortcuts
  // ============================
  function handleKeyboard(e) {
    const tag = (e.target.tagName || '').toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

    // Escape — close things
    if (e.key === 'Escape') {
      if ($('#zoomOverlay')?.classList.contains('visible')) { closeZoom(); return; }
      if ($('#shortcutsModal')?.style.display !== 'none') { $('#shortcutsModal').style.display = 'none'; return; }
      if (state.editorOpen) { closeEditor(); return; }
      const sidebar = $('#sidebar');
      if (sidebar?.classList.contains('mobile-open')) { sidebar.classList.remove('mobile-open'); return; }
    }

    // Ctrl+S — Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (state.editorOpen) {
        saveArtwork(collectFormData());
      }
      return;
    }

    // Ctrl+K — Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const search = $('#globalSearch');
      if (search) { search.focus(); search.select(); }
      return;
    }

    // Ctrl+N — New artwork
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      openEditor(null);
      return;
    }

    // Ctrl+D — Toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
      return;
    }

    // ? — Show shortcuts (only when not in input)
    if (e.key === '?' && !isInput) {
      const modal = $('#shortcutsModal');
      if (modal) modal.style.display = modal.style.display === 'none' ? '' : 'none';
    }
  }

  // ============================
  // Initialization
  // ============================
  function init() {
    applyTheme();
    bindEvents();

    if (!state.token) {
      showLogin();
      return;
    }

    hideLogin();
    fetchArtworks();
    fetchCloudinaryStatus();
  }

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
