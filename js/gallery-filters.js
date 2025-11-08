/* Inner Garden - Gallery Filters (Mood & Colors) */
(function() {
  'use strict';

  class GalleryFilters {
    constructor() {
      this.galleryGrid = document.querySelector('.gallery-grid');
      this.artworkCards = null;
      this.filtersContainer = null;
      this.currentMood = 'all';
      this.currentPalette = 'all';

      this.moods = [
        { id: 'all', label: 'Всі', labelEn: 'All' },
        { id: 'calm', label: 'Спокій', labelEn: 'Calm' },
        { id: 'energy', label: 'Енергія', labelEn: 'Energy' },
        { id: 'focus', label: 'Фокус', labelEn: 'Focus' },
        { id: 'luxury', label: 'Розкіш', labelEn: 'Luxury' },
        { id: 'nature', label: 'Природа', labelEn: 'Nature' },
        { id: 'balance', label: 'Баланс', labelEn: 'Balance' }
      ];

      this.palettes = [
        { id: 'all', label: 'Всі кольори', labelEn: 'All Colors' },
        { id: 'warm', label: 'Теплі', labelEn: 'Warm', color: '#E67E22' },
        { id: 'cool', label: 'Холодні', labelEn: 'Cool', color: '#3498DB' },
        { id: 'neutral', label: 'Нейтральні', labelEn: 'Neutral', color: '#95A5A6' },
        { id: 'vibrant', label: 'Яскраві', labelEn: 'Vibrant', color: '#E74C3C' }
      ];

      this.init();
    }

    init() {
      if (!this.galleryGrid) {
        console.warn('Gallery grid not found');
        return;
      }

      // Tag artworks with mood and palette data
      this.tagArtworks();

      // Create filters UI
      this.createFiltersUI();

      // Get all artwork cards
      this.artworkCards = Array.from(this.galleryGrid.querySelectorAll('.artwork-card'));
    }

    tagArtworks() {
      // Mapping artwork images to mood and palette
      const artworkData = {
        'cjdam66bgapeypc6jbmk.webp': { moods: ['luxury', 'balance'], palette: 'neutral' },
        'bophmlcfc59t2gbrojcj.webp': { moods: ['luxury'], palette: 'warm' },
        'ygljcsxleructfousvu6.webp': { moods: ['balance', 'calm'], palette: 'neutral' },
        'sulp2oyw2fibpaamjl9g.webp': { moods: ['calm'], palette: 'cool' },
        'rpj7xhkpotscqnnlnyya.webp': { moods: ['calm', 'nature'], palette: 'cool' },
        'wyjweijtla7vmefwrgyf.webp': { moods: ['calm'], palette: 'cool' },
        't5bknydwmptzvchlzg0x.webp': { moods: ['energy'], palette: 'vibrant' },
        'hgbwalcmihucndkwkwmp.webp': { moods: ['energy'], palette: 'warm' },
        'blb3ggaxi4cqh8rhbvw7.webp': { moods: ['energy'], palette: 'vibrant' },
        'gd7rrqanoxtdv8bxl279.webp': { moods: ['focus'], palette: 'neutral' },
        'spw3eqlbijdqi4hbfcnx.webp': { moods: ['focus'], palette: 'cool' },
        'oqbo7w0mxiregs2vvxcn.webp': { moods: ['energy'], palette: 'cool' },
        'goury05ttnng7amufhjy.webp': { moods: ['calm'], palette: 'neutral' },
        'tn9rnxkjfmxl4dksxwyt.webp': { moods: ['luxury'], palette: 'neutral' },
        'bg1jkup457skyqresjjb.webp': { moods: ['nature', 'calm'], palette: 'cool' },
        'ozjbkvbulpoallgbs7tf.webp': { moods: ['balance', 'calm'], palette: 'neutral' },
        'uaxdkonmzrno2npnj0lw.webp': { moods: ['luxury'], palette: 'warm' },
        'sa8lp78s4uwfysodqj3t.webp': { moods: ['balance'], palette: 'warm' },
        'kgpsgogd0qbi8ubpq1ve.webp': { moods: ['luxury'], palette: 'cool' },
        'sxpva2nwwopdfuykkg83.webp': { moods: ['calm', 'nature'], palette: 'cool' },
        'egoyllyyytpaxho0uvov.webp': { moods: ['focus'], palette: 'neutral' },
        'tvvr9qi4vl27yqc2iw4y.webp': { moods: ['focus', 'energy'], palette: 'neutral' },
        'ous8ji6yspy9jqooyyjy.webp': { moods: ['balance'], palette: 'neutral' },
        'tnzr346cisgnqawzrun7.webp': { moods: ['energy'], palette: 'vibrant' },
        'oiuhcnj1yxm10lylzkxc.webp': { moods: ['nature'], palette: 'cool' },
        'n1w550wvauam6ldnmvnk.webp': { moods: ['calm', 'nature'], palette: 'cool' },
        'vjyoe8gclo0rx32tl2vu.webp': { moods: ['calm'], palette: 'cool' },
        'vjldxxai3uyhinhgifri.webp': { moods: ['calm'], palette: 'neutral' },
        'dhtjtso6nvc0qnxobvov.webp': { moods: ['calm', 'balance'], palette: 'neutral' },
        'jbi0jjdszt7gc8k26wlr.webp': { moods: ['calm'], palette: 'warm' },
        'bgrhzcnztxbn4cco8j0q.webp': { moods: ['nature', 'calm'], palette: 'cool' },
        'ymu2dpujrvowhrlnbbzf.webp': { moods: ['nature'], palette: 'cool' },
        'tdcuqjraki8tfaogokcj.webp': { moods: ['focus'], palette: 'neutral' },
        's8qogt2nk0l2cj9wo0jg.webp': { moods: ['energy', 'focus'], palette: 'warm' },
        'blvif4pbzuquujvvywnk.webp': { moods: ['focus', 'luxury'], palette: 'neutral' },
        'vvgl47pos8etxalpoxo8.webp': { moods: ['focus'], palette: 'warm' },
        '1_tnz1om.webp': { moods: ['energy'], palette: 'warm' },
        '2_pqhm0o.webp': { moods: ['energy'], palette: 'cool' },
        '3_srsm8u.webp': { moods: ['luxury'], palette: 'vibrant' },
        '4_oqebbp.webp': { moods: ['balance'], palette: 'cool' },
        '5_dzvxu4.webp': { moods: ['nature'], palette: 'warm' },
        '6_bh5ewb.webp': { moods: ['balance'], palette: 'cool' },
        '7_vbzzyj.webp': { moods: ['energy'], palette: 'vibrant' },
        '8_x6n48z.webp': { moods: ['energy'], palette: 'cool' },
        '9_uwegmy.webp': { moods: ['luxury'], palette: 'neutral' },
        '10_hbq9lq.webp': { moods: ['balance'], palette: 'neutral' },
        '11_hhphey.webp': { moods: ['balance'], palette: 'warm' },
        '12_zp7xoe.webp': { moods: ['nature'], palette: 'cool' },
        '13_yqg97v.webp': { moods: ['nature'], palette: 'neutral' },
        '14_p5pmkb.webp': { moods: ['calm'], palette: 'cool' },
        '15_axedbv.webp': { moods: ['energy'], palette: 'neutral' },
        '16_xtqzzi.webp': { moods: ['luxury'], palette: 'warm' },
        '17_jjzfzp.webp': { moods: ['luxury'], palette: 'cool' },
        '18_wfgfwg.webp': { moods: ['focus'], palette: 'vibrant' }
      };

      // Apply data attributes to images
      const images = this.galleryGrid.querySelectorAll('.artwork-image img');
      images.forEach(img => {
        const src = img.src;
        const filename = src.split('/').pop();

        if (artworkData[filename]) {
          const card = img.closest('.artwork-card');
          if (card) {
            card.dataset.moods = artworkData[filename].moods.join(',');
            card.dataset.palette = artworkData[filename].palette;
          }
        }
      });
    }

    createFiltersUI() {
      // Create filters container
      this.filtersContainer = document.createElement('div');
      this.filtersContainer.className = 'gallery-filters';
      this.filtersContainer.innerHTML = `
        <div class="filters-wrapper">
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-smile"></i>
              <span data-key="filter-mood">Настрій</span>
            </label>
            <div class="filter-chips mood-chips"></div>
          </div>
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-palette"></i>
              <span data-key="filter-palette">Кольори</span>
            </label>
            <div class="filter-chips palette-chips"></div>
          </div>
        </div>
      `;

      // Insert before gallery grid
      this.galleryGrid.parentNode.insertBefore(this.filtersContainer, this.galleryGrid);

      // Populate chips
      this.createMoodChips();
      this.createPaletteChips();

      // Add styles
      this.addStyles();
    }

    createMoodChips() {
      const container = this.filtersContainer.querySelector('.mood-chips');

      this.moods.forEach(mood => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip' + (mood.id === 'all' ? ' active' : '');
        chip.dataset.mood = mood.id;
        chip.textContent = mood.label;
        chip.addEventListener('click', () => this.onMoodSelect(mood.id));
        container.appendChild(chip);
      });
    }

    createPaletteChips() {
      const container = this.filtersContainer.querySelector('.palette-chips');

      this.palettes.forEach(palette => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip' + (palette.id === 'all' ? ' active' : '');
        chip.dataset.palette = palette.id;

        if (palette.color) {
          chip.innerHTML = `
            <span class="color-dot" style="background: ${palette.color}"></span>
            ${palette.label}
          `;
        } else {
          chip.textContent = palette.label;
        }

        chip.addEventListener('click', () => this.onPaletteSelect(palette.id));
        container.appendChild(chip);
      });
    }

    onMoodSelect(moodId) {
      this.currentMood = moodId;
      this.updateChips('.mood-chips', moodId);
      this.filterArtworks();
    }

    onPaletteSelect(paletteId) {
      this.currentPalette = paletteId;
      this.updateChips('.palette-chips', paletteId);
      this.filterArtworks();
    }

    updateChips(selector, activeValue) {
      const chips = this.filtersContainer.querySelectorAll(`${selector} .filter-chip`);
      chips.forEach(chip => {
        const value = chip.dataset.mood || chip.dataset.palette;
        chip.classList.toggle('active', value === activeValue);
      });
    }

    filterArtworks() {
      if (!this.artworkCards) return;

      let visibleCount = 0;

      this.artworkCards.forEach(card => {
        const cardMoods = (card.dataset.moods || '').split(',');
        const cardPalette = card.dataset.palette || '';

        const moodMatch = this.currentMood === 'all' || cardMoods.includes(this.currentMood);
        const paletteMatch = this.currentPalette === 'all' || cardPalette === this.currentPalette;

        const shouldShow = moodMatch && paletteMatch;

        if (shouldShow) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease-out';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show message if no results
      this.showNoResultsMessage(visibleCount === 0);
    }

    showNoResultsMessage(show) {
      let message = this.galleryGrid.querySelector('.no-results-message');

      if (show && !message) {
        message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
          <i class="fas fa-search"></i>
          <p>Не знайдено картин з обраними фільтрами</p>
          <button class="btn btn-outline reset-filters-btn">Скинути фільтри</button>
        `;
        this.galleryGrid.appendChild(message);

        message.querySelector('.reset-filters-btn').addEventListener('click', () => {
          this.currentMood = 'all';
          this.currentPalette = 'all';
          this.updateChips('.mood-chips', 'all');
          this.updateChips('.palette-chips', 'all');
          this.filterArtworks();
        });
      } else if (!show && message) {
        message.remove();
      }
    }

    addStyles() {
      if (document.getElementById('gallery-filters-styles')) return;

      const style = document.createElement('style');
      style.id = 'gallery-filters-styles';
      style.textContent = `
        .gallery-filters {
          margin-bottom: 3rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .filters-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .filter-label i {
          color: #667eea;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .filter-chip {
          padding: 0.65rem 1.25rem;
          border-radius: 50px;
          border: 2px solid #ddd;
          background: white;
          color: #555;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .filter-chip:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .filter-chip.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .filter-chip.active .color-dot {
          border-color: white;
        }

        .no-results-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-results-message i {
          font-size: 4rem;
          color: #ddd;
          margin-bottom: 1rem;
        }

        .no-results-message p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .reset-filters-btn {
          margin-top: 1rem;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .gallery-filters {
            padding: 1.5rem;
          }

          .filter-chips {
            gap: 0.5rem;
          }

          .filter-chip {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new GalleryFilters();
    });
  } else {
    new GalleryFilters();
  }
})();
