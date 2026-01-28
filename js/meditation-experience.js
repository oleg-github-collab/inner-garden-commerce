/* Inner Garden - Meditation Experience (Completely Rebuilt) */
(function() {
  'use strict';

  class MeditationExperience {
    constructor() {
      this.meditationSection = document.querySelector('.meditation-section');
      this.modal = null;
      this.audioElement = null;
      this.currentTrack = null;
      this.progressInterval = null;

      this.tracks = [
        {
          id: 'ocean-waves',
          name: 'Океанські Хвилі',
          duration: 300,
          image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/sulp2oyw2fibpaamjl9g.webp',
          description: 'Заспокійливі звуки океану для глибокої релаксації'
        },
        {
          id: 'forest-rain',
          name: 'Лісовий Дощ',
          duration: 300,
          image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/bg1jkup457skyqresjjb.webp',
          description: 'М\'які звуки дощу та природи'
        },
        {
          id: 'tibetan-bowls',
          name: 'Тибетські Чаші',
          duration: 300,
          image: 'https://res.cloudinary.com/djdc6wcpg/image/upload/q_auto/wyjweijtla7vmefwrgyf.webp',
          description: 'Гармонійні вібрації для медитації'
        }
      ];

      this.init();
    }

    init() {
      if (!this.meditationSection) {
        console.log('Meditation section not found');
        return;
      }

      this.createMeditationButton();
      this.createModal();
      this.addStyles();
    }

    createMeditationButton() {
      const triggers = this.meditationSection.querySelectorAll('#meditation-play-btn, [data-trigger="meditation-play"]');
      if (!triggers.length) {
        return;
      }
      triggers.forEach((btn) => {
        btn.addEventListener('click', () => this.openModal());
      });
    }

    createModal() {
      this.modal = document.createElement('div');
      this.modal.className = 'meditation-modal-new';
      this.modal.innerHTML = `
        <div class="meditation-modal-overlay-new"></div>
        <div class="meditation-modal-content-new">
          <button class="meditation-close-new">
            <i class="fas fa-times"></i>
          </button>

          <div class="meditation-header-new">
            <h2><i class="fas fa-om"></i> Оберіть медитаційну композицію</h2>
            <p>Знайдіть свій внутрішній спокій</p>
          </div>

          <div class="meditation-tracks-new">
            ${this.tracks.map(track => `
              <div class="meditation-track-new" data-track-id="${track.id}">
                <div class="track-image-new">
                  <img src="${track.image}" alt="${track.name}">
                  <div class="track-play-new">
                    <i class="fas fa-play"></i>
                  </div>
                </div>
                <div class="track-info-new">
                  <h3>${track.name}</h3>
                  <p>${track.description}</p>
                  <div class="track-duration-new">
                    <i class="far fa-clock"></i> ${Math.floor(track.duration / 60)} хв
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="meditation-player-new hidden">
            <div class="player-artwork-new">
              <img src="" alt="" class="player-track-img-new">
              <div class="player-controls-new">
                <button class="player-btn-new player-back-new"><i class="fas fa-step-backward"></i></button>
                <button class="player-btn-new player-play-pause-new"><i class="fas fa-pause"></i></button>
                <button class="player-btn-new player-forward-new"><i class="fas fa-step-forward"></i></button>
              </div>
            </div>
            <div class="player-info-new">
              <h3 class="player-track-name-new"></h3>
              <div class="player-progress-container-new">
                <div class="player-progress-bar-new">
                  <div class="player-progress-fill-new"></div>
                </div>
                <div class="player-time-new">
                  <span class="player-current-new">0:00</span>
                  <span class="player-total-new">5:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(this.modal);
      this.attachEvents();
    }

    attachEvents() {
      this.modal.querySelector('.meditation-close-new').addEventListener('click', () => this.closeModal());
      this.modal.querySelector('.meditation-modal-overlay-new').addEventListener('click', () => this.closeModal());

      const tracks = this.modal.querySelectorAll('.meditation-track-new');
      tracks.forEach(track => {
        track.addEventListener('click', () => {
          const trackId = track.dataset.trackId;
          this.playTrack(trackId);
        });
      });

      this.modal.querySelector('.player-play-pause-new')?.addEventListener('click', () => this.togglePlayPause());
      this.modal.querySelector('.player-back-new')?.addEventListener('click', () => this.previousTrack());
      this.modal.querySelector('.player-forward-new')?.addEventListener('click', () => this.nextTrack());
    }

    openModal() {
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    closeModal() {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';

      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      const player = this.modal.querySelector('.meditation-player-new');
      const tracksGrid = this.modal.querySelector('.meditation-tracks-new');
      player?.classList.add('hidden');
      tracksGrid?.classList.remove('hidden');

      this.currentTrack = null;
    }

    playTrack(trackId) {
      const track = this.tracks.find(t => t.id === trackId);
      if (!track) return;

      this.currentTrack = track;

      const tracksGrid = this.modal.querySelector('.meditation-tracks-new');
      const player = this.modal.querySelector('.meditation-player-new');
      tracksGrid.classList.add('hidden');
      player.classList.remove('hidden');

      const playerImg = player.querySelector('.player-track-img-new');
      const playerName = player.querySelector('.player-track-name-new');
      const totalTime = player.querySelector('.player-total-new');

      playerImg.src = track.image;
      playerName.textContent = track.name;
      totalTime.textContent = this.formatTime(track.duration);

      this.simulateProgress();
    }

    togglePlayPause() {
      const playPauseBtn = this.modal.querySelector('.player-play-pause-new i');
      const isPaused = playPauseBtn.classList.contains('fa-play');

      if (isPaused) {
        playPauseBtn.className = 'fas fa-pause';
        this.simulateProgress();
      } else {
        playPauseBtn.className = 'fas fa-play';
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
      }
    }

    previousTrack() {
      if (!this.currentTrack) return;
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.tracks.length - 1;
      this.playTrack(this.tracks[prevIndex].id);
    }

    nextTrack() {
      if (!this.currentTrack) return;
      const currentIndex = this.tracks.findIndex(t => t.id === this.currentTrack.id);
      const nextIndex = (currentIndex + 1) % this.tracks.length;
      this.playTrack(this.tracks[nextIndex].id);
    }

    simulateProgress() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      let elapsed = 0;
      this.progressInterval = setInterval(() => {
        if (!this.currentTrack) {
          clearInterval(this.progressInterval);
          return;
        }

        elapsed += 1;
        const percent = (elapsed / this.currentTrack.duration) * 100;

        const progressFill = this.modal.querySelector('.player-progress-fill-new');
        const currentTimeDisplay = this.modal.querySelector('.player-current-new');

        if (progressFill) progressFill.style.width = `${percent}%`;
        if (currentTimeDisplay) currentTimeDisplay.textContent = this.formatTime(elapsed);

        if (elapsed >= this.currentTrack.duration) {
          clearInterval(this.progressInterval);
          this.nextTrack();
        }
      }, 1000);
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    addStyles() {
      if (document.getElementById('meditation-modal-styles-new')) return;

      const style = document.createElement('style');
      style.id = 'meditation-modal-styles-new';
      style.textContent = `
        .meditation-modal-new {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .meditation-modal-new.open {
          display: flex;
        }

        .meditation-modal-overlay-new {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
        }

        .meditation-modal-content-new {
          position: relative;
          background: white;
          border-radius: 24px;
          max-width: 900px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.5s ease-out;
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .meditation-close-new {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: #555;
        }

        .meditation-close-new:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: rotate(90deg);
        }

        .meditation-header-new {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .meditation-header-new h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .meditation-header-new h2 i {
          color: #667eea;
        }

        .meditation-header-new p {
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .meditation-tracks-new {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .meditation-track-new {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          border: 2px solid transparent;
        }

        .meditation-track-new:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .track-image-new {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .track-image-new img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .meditation-track-new:hover .track-image-new img {
          transform: scale(1.1);
        }

        .track-play-new {
          position: absolute;
          inset: 0;
          background: rgba(102, 126, 234, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s ease;
        }

        .meditation-track-new:hover .track-play-new {
          background: rgba(102, 126, 234, 0.7);
        }

        .track-play-new i {
          font-size: 3rem;
          color: white;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.4s ease;
        }

        .meditation-track-new:hover .track-play-new i {
          opacity: 1;
          transform: scale(1);
        }

        .track-info-new {
          padding: 1.25rem;
        }

        .track-info-new h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .track-info-new p {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 0.75rem;
        }

        .track-duration-new {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #667eea;
          font-weight: 600;
        }

        .meditation-player-new.hidden {
          display: none;
        }

        .meditation-tracks-new.hidden {
          display: none;
        }

        .player-artwork-new {
          position: relative;
          max-width: 400px;
          margin: 0 auto 2rem;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        .player-track-img-new {
          width: 100%;
          height: auto;
          display: block;
        }

        .player-controls-new {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .player-btn-new {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: white;
          color: #667eea;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .player-btn-new:hover {
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .player-play-pause-new {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          font-size: 1.5rem;
        }

        .player-info-new {
          max-width: 500px;
          margin: 0 auto;
        }

        .player-track-name-new {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .player-progress-bar-new {
          height: 8px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          cursor: pointer;
        }

        .player-progress-fill-new {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          width: 0%;
          transition: width 0.3s ease;
        }

        .player-time-new {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .meditation-modal-content-new {
            padding: 2rem 1.5rem;
          }

          .meditation-tracks-new {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function initMeditation() {
    try {
      new MeditationExperience();
    } catch (error) {
      console.error('[meditation-experience] Initialization error:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeditation);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // DOM is ready, but wait a tick to ensure all other scripts loaded
    setTimeout(initMeditation, 0);
  }
})();
