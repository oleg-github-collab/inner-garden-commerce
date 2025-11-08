// НАДПОТУЖНА СИСТЕМА УПРАВЛІННЯ МОДАЛКАМИ
class UltraModal {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('🎭 Ultra Modal System Loading...');
    this.setupGlobalListeners();
    this.createModalContainer();
    this.isInitialized = true;
    console.log('✅ Ultra Modal System Ready');
  }

  createModalContainer() {
    if (!document.getElementById('ultra-modal-container')) {
      const container = document.createElement('div');
      container.id = 'ultra-modal-container';
      container.className = 'ultra-modal-container';
      container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(container);
    }
  }

  setupGlobalListeners() {
    // Escape key для закриття модалок
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal(this.activeModal.id);
      }
    });

    // Клік поза модалкою для закриття
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('ultra-modal-overlay') && this.activeModal) {
        this.closeModal(this.activeModal.id);
      }
    });
  }

  createModal(options = {}) {
    const {
      id = `modal-${Date.now()}`,
      title = '',
      content = '',
      closable = true,
      closeOnOverlay = true,
      closeOnEscape = true,
      size = 'medium', // small, medium, large, fullscreen
      animation = 'fade', // fade, slide, scale
      buttons = [],
      onOpen = null,
      onClose = null
    } = options;

    if (this.modals.has(id)) {
      console.warn(`Modal with id "${id}" already exists`);
      return this.modals.get(id);
    }

    const modal = {
      id,
      title,
      content,
      closable,
      closeOnOverlay,
      closeOnEscape,
      size,
      animation,
      buttons,
      onOpen,
      onClose,
      element: null,
      isOpen: false,
      previousFocus: null
    };

    this.modals.set(id, modal);
    console.log(`🎭 Created modal: ${id}`);
    
    return modal;
  }

  openModal(id, content = null) {
    const modal = this.modals.get(id);
    if (!modal) {
      console.error(`Modal "${id}" not found`);
      return false;
    }

    if (modal.isOpen) {
      console.warn(`Modal "${id}" is already open`);
      return false;
    }

    // Закриваємо попередню модалку
    if (this.activeModal) {
      this.closeModal(this.activeModal.id);
    }

    console.log(`🎭 Opening modal: ${id}`);

    // Зберігаємо поточний фокус
    modal.previousFocus = document.activeElement;

    // Оновлюємо контент якщо передано
    if (content) {
      modal.content = content;
    }

    // Створюємо DOM елемент
    this.createModalElement(modal);

    // Додаємо до контейнера
    const container = document.getElementById('ultra-modal-container');
    container.appendChild(modal.element);
    container.setAttribute('aria-hidden', 'false');

    // Блокуємо прокрутку body
    document.body.classList.add('modal-open');

    // Показуємо модалку з анімацією
    requestAnimationFrame(() => {
      modal.element.classList.add('show');
      modal.isOpen = true;
      this.activeModal = modal;

      // Фокус на першому елементі
      this.setInitialFocus(modal);

      // Викликаємо callback
      if (typeof modal.onOpen === 'function') {
        modal.onOpen(modal);
      }
    });

    return true;
  }

  closeModal(id) {
    const modal = this.modals.get(id);
    if (!modal || !modal.isOpen) {
      return false;
    }

    console.log(`🎭 Closing modal: ${id}`);

    // Викликаємо callback перед закриттям
    if (typeof modal.onClose === 'function') {
      const shouldClose = modal.onClose(modal);
      if (shouldClose === false) {
        return false;
      }
    }

    // Анімація закриття
    modal.element.classList.remove('show');

    setTimeout(() => {
      // Видаляємо з DOM
      if (modal.element && modal.element.parentNode) {
        modal.element.parentNode.removeChild(modal.element);
      }

      modal.element = null;
      modal.isOpen = false;

      // Відновлюємо фокус
      if (modal.previousFocus) {
        modal.previousFocus.focus();
        modal.previousFocus = null;
      }

      // Відновлюємо прокрутку
      document.body.classList.remove('modal-open');

      // Ховаємо контейнер якщо немає активних модалок
      const container = document.getElementById('ultra-modal-container');
      if (container.children.length === 0) {
        container.setAttribute('aria-hidden', 'true');
      }

      this.activeModal = null;
    }, 300);

    return true;
  }

  createModalElement(modal) {
    const overlay = document.createElement('div');
    overlay.className = `ultra-modal-overlay ultra-modal-${modal.animation}`;
    
    if (!modal.closeOnOverlay) {
      overlay.style.pointerEvents = 'none';
    }

    const modalDialog = document.createElement('div');
    modalDialog.className = `ultra-modal-dialog ultra-modal-${modal.size}`;
    modalDialog.setAttribute('role', 'dialog');
    modalDialog.setAttribute('aria-modal', 'true');
    modalDialog.setAttribute('aria-labelledby', `${modal.id}-title`);

    // Header
    let headerHTML = '';
    if (modal.title || modal.closable) {
      headerHTML = `
        <div class="ultra-modal-header">
          ${modal.title ? `<h2 id="${modal.id}-title" class="ultra-modal-title">${modal.title}</h2>` : ''}
          ${modal.closable ? `<button type="button" class="ultra-modal-close" aria-label="Close">&times;</button>` : ''}
        </div>
      `;
    }

    // Footer
    let footerHTML = '';
    if (modal.buttons.length > 0) {
      const buttonsHTML = modal.buttons.map(btn => 
        `<button type="button" class="ultra-modal-btn ultra-modal-btn-${btn.type || 'secondary'}" data-action="${btn.action || ''}">${btn.text}</button>`
      ).join('');
      
      footerHTML = `<div class="ultra-modal-footer">${buttonsHTML}</div>`;
    }

    modalDialog.innerHTML = `
      ${headerHTML}
      <div class="ultra-modal-body">${modal.content}</div>
      ${footerHTML}
    `;

    overlay.appendChild(modalDialog);

    // Event listeners
    if (modal.closable) {
      const closeBtn = modalDialog.querySelector('.ultra-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal.id));
      }
    }

    // Button handlers
    const buttons = modalDialog.querySelectorAll('.ultra-modal-btn[data-action]');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const buttonConfig = modal.buttons.find(b => b.action === action);
        
        if (buttonConfig && typeof buttonConfig.handler === 'function') {
          const result = buttonConfig.handler(modal, e);
          
          // Автоматично закриваємо якщо handler повернув true
          if (result === true) {
            this.closeModal(modal.id);
          }
        }
      });
    });

    // Trap focus
    this.trapFocus(modalDialog);

    modal.element = overlay;
  }

  setInitialFocus(modal) {
    const focusableElements = modal.element.querySelectorAll(this.focusableElements);
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  trapFocus(element) {
    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = element.querySelectorAll(this.focusableElements);
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
    });
  }

  // Utility methods
  isModalOpen(id = null) {
    if (id) {
      const modal = this.modals.get(id);
      return modal ? modal.isOpen : false;
    }
    return this.activeModal !== null;
  }

  getActiveModal() {
    return this.activeModal;
  }

  closeAllModals() {
    this.modals.forEach((modal, id) => {
      if (modal.isOpen) {
        this.closeModal(id);
      }
    });
  }

  destroyModal(id) {
    const modal = this.modals.get(id);
    if (modal) {
      if (modal.isOpen) {
        this.closeModal(id);
      }
      this.modals.delete(id);
      console.log(`🎭 Destroyed modal: ${id}`);
    }
  }

  // Shortcuts for common modal types
  alert(message, title = 'Alert') {
    const id = `alert-${Date.now()}`;
    this.createModal({
      id,
      title,
      content: `<p>${message}</p>`,
      buttons: [
        {
          text: 'OK',
          type: 'primary',
          action: 'ok',
          handler: () => true
        }
      ]
    });
    this.openModal(id);
    return id;
  }

  confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
      const id = `confirm-${Date.now()}`;
      this.createModal({
        id,
        title,
        content: `<p>${message}</p>`,
        buttons: [
          {
            text: 'Cancel',
            type: 'secondary',
            action: 'cancel',
            handler: () => {
              resolve(false);
              return true;
            }
          },
          {
            text: 'OK',
            type: 'primary',
            action: 'ok',
            handler: () => {
              resolve(true);
              return true;
            }
          }
        ],
        onClose: () => {
          resolve(false);
        }
      });
      this.openModal(id);
    });
  }
}

// Глобальна ініціалізація
window.ultraModal = new UltraModal();

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraModal;
}