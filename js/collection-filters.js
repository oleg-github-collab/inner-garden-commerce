/* Inner Garden - Collection Filters with Emoji */
(function() {
  'use strict';

  class CollectionFilters {
    constructor() {
      this.collectionGrid = document.querySelector('.collection-grid');
      this.artworkCards = null;
      this.filtersContainer = null;
      this.currentMood = 'all';

      this.moods = [
        { id: 'all', emoji: '🎨', label: 'Всі', labelEn: 'All' },
        { id: 'calm', emoji: '😌', label: 'Спокій', labelEn: 'Calm' },
        { id: 'energy', emoji: '⚡', label: 'Енергія', labelEn: 'Energy' },
        { id: 'focus', emoji: '🎯', label: 'Фокус', labelEn: 'Focus' },
        { id: 'luxury', emoji: '✨', label: 'Розкіш', labelEn: 'Luxury' },
        { id: 'nature', emoji: '🌿', label: 'Природа', labelEn: 'Nature' },
        { id: 'balance', emoji: '⚖️', label: 'Баланс', labelEn: 'Balance' }
      ];

      this.init();
    }

    init() {
      if (!this.collectionGrid) {
        console.log('Collection grid not found');
        return;
      }

      // Tag collection items
      this.tagCollectionItems();

      // Create filters UI
      this.createFiltersUI();

      // Get all cards
      this.artworkCards = Array.from(this.collectionGrid.querySelectorAll('.collection-card, .artwork-card'));

      console.log(`Collection Filters initialized with ${this.artworkCards.length} items`);
    }

    tagCollectionItems() {
      // Mapping based on Cloudinary image URLs
      const artworkData = {
        'cjdam66bgapeypc6jbmk.webp': { moods: ['luxury', 'balance'] },
        'bophmlcfc59t2gbrojcj.webp': { moods: ['luxury'] },
        'ygljcsxleructfousvu6.webp': { moods: ['balance', 'calm'] },
        'sulp2oyw2fibpaamjl9g.webp': { moods: ['calm'] },
        'rpj7xhkpotscqnnlnyya.webp': { moods: ['calm', 'nature'] },
        'wyjweijtla7vmefwrgyf.webp': { moods: ['calm'] },
        't5bknydwmptzvchlzg0x.webp': { moods: ['energy'] },
        'hgbwalcmihucndkwkwmp.webp': { moods: ['energy'] },
        'blb3ggaxi4cqh8rhbvw7.webp': { moods: ['energy'] },
        'gd7rrqanoxtdv8bxl279.webp': { moods: ['focus'] },
        'spw3eqlbijdqi4hbfcnx.webp': { moods: ['focus'] },
        'oqbo7w0mxiregs2vvxcn.webp': { moods: ['energy'] },
        'goury05ttnng7amufhjy.webp': { moods: ['calm'] },
        'tn9rnxkjfmxl4dksxwyt.webp': { moods: ['luxury'] },
        'bg1jkup457skyqresjjb.webp': { moods: ['nature', 'calm'] },
        'ozjbkvbulpoallgbs7tf.webp': { moods: ['balance', 'calm'] },
        'uaxdkonmzrno2npnj0lw.webp': { moods: ['luxury'] },
        'sa8lp78s4uwfysodqj3t.webp': { moods: ['balance'] },
        'kgpsgogd0qbi8ubpq1ve.webp': { moods: ['luxury'] },
        'sxpva2nwwopdfuykkg83.webp': { moods: ['calm', 'nature'] },
        'egoyllyyytpaxho0uvov.webp': { moods: ['focus'] },
        'tvvr9qi4vl27yqc2iw4y.webp': { moods: ['focus', 'energy'] },
        'ous8ji6yspy9jqooyyjy.webp': { moods: ['balance'] },
        'tnzr346cisgnqawzrun7.webp': { moods: ['energy'] },
        'oiuhcnj1yxm10lylzkxc.webp': { moods: ['nature'] },
        'n1w550wvauam6ldnmvnk.webp': { moods: ['calm', 'nature'] },
        'vjyoe8gclo0rx32tl2vu.webp': { moods: ['calm'] },
        'vjldxxai3uyhinhgifri.webp': { moods: ['calm'] },
        'dhtjtso6nvc0qnxobvov.webp': { moods: ['calm', 'balance'] },
        'jbi0jjdszt7gc8k26wlr.webp': { moods: ['calm'] },
        '9_uwegmy.webp': { moods: ['focus'] },
        '26-1_lmigw1.webp': { moods: ['nature'] },
        '15_axedbv.webp': { moods: ['focus', 'energy'] },
        '25_my6afc.webp': { moods: ['balance', 'calm'] },
        // commerce.html additional
        'bophmlcfc59t2gbrojcj.webp': { moods: ['luxury'] },
        '22_peebeg.webp': { moods: ['luxury', 'focus'] },
        '5_dzvxu4.webp': { moods: ['calm', 'nature'] },
        '7_vbzzyj.webp': { moods: ['energy'] },
        '4_oqebbp.webp': { moods: ['balance', 'calm'] },
        's8qogt2nk0l2cj9wo0jg.webp': { moods: ['energy'] },
        'blvif4pbzuquujvvywnk.webp': { moods: ['focus'] },
        'vvgl47pos8etxalpoxo8.webp': { moods: ['focus'] },
        'bgrhzcnztxbn4cco8j0q.webp': { moods: ['nature', 'calm'] },
        'ymu2dpujrvowhrlnbbzf.webp': { moods: ['nature'] },
        'tdcuqjraki8tfaogokcj.webp': { moods: ['focus'] },
        'bgg3zbi1tya3ulkhambv.webp': { moods: ['nature', 'calm'] },
        // home.html additional
        'zexgajiullzotnlsadie.webp': { moods: ['calm', 'nature'] },
        'yx9odf0ylt4d1kwbsu2i.webp': { moods: ['calm'] },
        'k1exyxun7e1dvkatzr97.webp': { moods: ['calm'] },
        'pjyyzmxl5qkog3fqbdsl.webp': { moods: ['energy'] }
      };

      // Apply data to all images in collection
      const images = this.collectionGrid.querySelectorAll('img');
      images.forEach(img => {
        const src = img.src || img.dataset.src || '';
        const filename = src.split('/').pop();

        if (artworkData[filename]) {
          const card = img.closest('.collection-card, .artwork-card');
          if (card) {
            card.dataset.moods = artworkData[filename].moods.join(',');
          }
        }
      });
    }

    createFiltersUI() {
      // Create filters container
      this.filtersContainer = document.createElement('div');
      this.filtersContainer.className = 'collection-mood-filters';
      this.filtersContainer.innerHTML = `
        <div class="mood-filters-wrapper">
          <h3 class="filters-title">
            <i class="fas fa-sliders-h"></i>
            <span data-key="collection-filter-title">Оберіть настрій</span>
          </h3>
          <div class="mood-buttons-grid"></div>
        </div>
      `;

      // Insert before collection grid
      this.collectionGrid.parentNode.insertBefore(this.filtersContainer, this.collectionGrid);

      // Create mood buttons
      this.createMoodButtons();

      // Add styles
      this.addStyles();
    }

    createMoodButtons() {
      const container = this.filtersContainer.querySelector('.mood-buttons-grid');

      this.moods.forEach(mood => {
        const button = document.createElement('button');
        button.className = 'mood-filter-btn' + (mood.id === 'all' ? ' active' : '');
        button.dataset.mood = mood.id;
        button.innerHTML = `
          <span class="mood-emoji">${mood.emoji}</span>
          <span class="mood-label">${mood.label}</span>
        `;
        button.addEventListener('click', () => this.onMoodSelect(mood.id));
        container.appendChild(button);
      });
    }

    onMoodSelect(moodId) {
      this.currentMood = moodId;
      this.updateButtons(moodId);
      this.filterCollection();
    }

    updateButtons(activeMood) {
      const buttons = this.filtersContainer.querySelectorAll('.mood-filter-btn');
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === activeMood);
      });
    }

    filterCollection() {
      if (!this.artworkCards) return;

      let visibleCount = 0;

      this.artworkCards.forEach(card => {
        const cardMoods = (card.dataset.moods || '').split(',').filter(m => m);
        const shouldShow = this.currentMood === 'all' || cardMoods.includes(this.currentMood);

        if (shouldShow) {
          card.style.display = '';
          card.classList.add('fade-in-scale');
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.classList.remove('fade-in-scale');
        }
      });

      console.log(`Filtered: ${visibleCount} items visible for mood "${this.currentMood}"`);

      // Show no results message
      this.showNoResultsMessage(visibleCount === 0);
    }

    showNoResultsMessage(show) {
      let message = this.collectionGrid.querySelector('.no-mood-results');

      if (show && !message) {
        message = document.createElement('div');
        message.className = 'no-mood-results';
        message.innerHTML = `
          <div class="no-results-icon">😔</div>
          <p class="no-results-text">Не знайдено картин з обраним настроєм</p>
          <button class="btn btn-primary reset-mood-btn">Показати всі</button>
        `;
        this.collectionGrid.appendChild(message);

        message.querySelector('.reset-mood-btn').addEventListener('click', () => {
          this.currentMood = 'all';
          this.updateButtons('all');
          this.filterCollection();
        });
      } else if (!show && message) {
        message.remove();
      }
    }

    addStyles() {
      if (document.getElementById('collection-filters-styles')) return;

      const style = document.createElement('style');
      style.id = 'collection-filters-styles';
      style.textContent = `
        .collection-mood-filters {
          margin-bottom: 3rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          padding: 2.5rem;
          border-radius: 20px;
          border: 2px solid rgba(102, 126, 234, 0.1);
        }

        .mood-filters-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .filters-title {
          text-align: center;
          font-size: 1.75rem;
          color: #2c3e50;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .filters-title i {
          color: #667eea;
        }

        .mood-buttons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .mood-filter-btn {
          background: white;
          border: 3px solid #e0e0e0;
          border-radius: 16px;
          padding: 1.25rem 1rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .mood-filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 0;
        }

        .mood-emoji {
          font-size: 2.5rem;
          position: relative;
          z-index: 1;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mood-label {
          font-size: 1rem;
          font-weight: 600;
          color: #555;
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
        }

        .mood-filter-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .mood-filter-btn:hover .mood-emoji {
          transform: scale(1.15) rotate(5deg);
        }

        .mood-filter-btn.active {
          border-color: #667eea;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
          transform: translateY(-2px);
        }

        .mood-filter-btn.active::before {
          opacity: 1;
        }

        .mood-filter-btn.active .mood-emoji {
          transform: scale(1.2);
        }

        .mood-filter-btn.active .mood-label {
          color: white;
        }

        .no-mood-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-results-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
        }

        .no-results-text {
          font-size: 1.3rem;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .fade-in-scale {
          animation: fadeInScale 0.5s ease-out;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .collection-mood-filters {
            padding: 1.5rem;
          }

          .filters-title {
            font-size: 1.4rem;
          }

          .mood-buttons-grid {
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
            gap: 0.75rem;
          }

          .mood-filter-btn {
            padding: 1rem 0.5rem;
          }

          .mood-emoji {
            font-size: 2rem;
          }

          .mood-label {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .mood-buttons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CollectionFilters();
    });
  } else {
    new CollectionFilters();
  }
})();
