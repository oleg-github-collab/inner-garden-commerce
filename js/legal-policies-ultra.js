// УЛЬТРАПРОДУМАНІ ПРАВОВІ ДОКУМЕНТИ З ЛОКАЛІЗАЦІЄЮ
class UltraLegalPolicies {
  constructor() {
    this.policies = {};
    this.currentModal = null;
    this.init();
  }

  init() {
    console.log('⚖️ Ultra Legal Policies Loading...');
    this.loadPolicyContent();
    this.setupEventListeners();
    console.log('✅ Ultra Legal Policies Ready');
  }

  loadPolicyContent() {
    this.policies = {
      uk: {
        'privacy-policy': {
          title: 'Політика Конфіденційності',
          lastUpdated: '1 грудня 2024',
          content: `
            <h2>1. Збір інформації</h2>
            <p>Ми збираємо інформацію, яку ви надаєте нам безпосередньо, таку як:</p>
            <ul>
              <li>Ім'я та контактна інформація</li>
              <li>Інформація про ваш бізнес</li>
              <li>Преференції щодо мистецтва</li>
              <li>Фотографії просторів для консультацій</li>
            </ul>

            <h2>2. Використання інформації</h2>
            <p>Ми використовуємо зібрану інформацію для:</p>
            <ul>
              <li>Надання персональних рекомендацій</li>
              <li>Організації консультацій</li>
              <li>Покращення наших послуг</li>
              <li>Зв'язку з вами щодо ваших запитів</li>
            </ul>

            <h2>3. Захист даних</h2>
            <p>Ми застосовуємо сучасні методи захисту для збереження безпеки ваших персональних даних. Ваша інформація зберігається на захищених серверах і передається тільки через зашифровані з'єднання.</p>

            <h2>4. Права користувачів</h2>
            <p>Відповідно до GDPR та українського законодавства, ви маєте право:</p>
            <ul>
              <li>Отримувати доступ до своїх даних</li>
              <li>Виправляти неточну інформацію</li>
              <li>Видалити свої дані</li>
              <li>Обмежити обробку даних</li>
              <li>Отримувати дані в структурованому форматі</li>
            </ul>

            <h2>5. Контакти</h2>
            <p>З питань політики конфіденційності звертайтесь: <a href="mailto:privacy@inner-garden.art">privacy@inner-garden.art</a></p>
          `
        },
        'terms-service': {
          title: 'Умови Користування',
          lastUpdated: '1 грудня 2024',
          content: `
            <h2>1. Прийняття умов</h2>
            <p>Використовуючи наш сайт та послуги, ви погоджуєтеся з цими умовами користування.</p>

            <h2>2. Опис послуг</h2>
            <p>Inner Garden надає:</p>
            <ul>
              <li>Консультації щодо мистецтва для бізнес-просторів</li>
              <li>Продаж оригінальних абстрактних картин</li>
              <li>AR-перегляд картин у ваших просторах</li>
              <li>Персональні рекомендації</li>
            </ul>

            <h2>3. Права та обов'язки</h2>
            <h3>Ваші права:</h3>
            <ul>
              <li>Отримувати якісні послуги</li>
              <li>Конфіденційність ваших даних</li>
              <li>Скасування замовлення відповідно до закону</li>
            </ul>

            <h3>Ваші обов'язки:</h3>
            <ul>
              <li>Надавати точну інформацію</li>
              <li>Дотримуватися правил використання сайту</li>
              <li>Своєчасно оплачувати замовлення</li>
            </ul>

            <h2>4. Інтелектуальна власність</h2>
            <p>Всі картини та контент сайту захищені авторським правом Marina Kaminska та Inner Garden.</p>

            <h2>5. Відповідальність</h2>
            <p>Ми прагнемо надавати найкращі послуги, але не несемо відповідальності за непрямі збитки.</p>
          `
        },
        'cookie-policy': {
          title: 'Політика Cookies',
          lastUpdated: '1 грудня 2024',
          content: `
            <h2>1. Що таке cookies?</h2>
            <p>Cookies - це невеликі текстові файли, які зберігаються на вашому пристрої для покращення роботи сайту.</p>

            <h2>2. Типи cookies, які ми використовуємо</h2>
            
            <h3>Необхідні cookies:</h3>
            <ul>
              <li>Вибір мови сайту</li>
              <li>Налаштування сесії</li>
              <li>Безпека сайту</li>
            </ul>

            <h3>Аналітичні cookies:</h3>
            <ul>
              <li>Google Analytics для аналізу відвідуваності</li>
              <li>Статистика використання функцій</li>
            </ul>

            <h3>Маркетингові cookies:</h3>
            <ul>
              <li>Персоналізація контенту</li>
              <li>Соціальні мережі</li>
            </ul>

            <h2>3. Управління cookies</h2>
            <p>Ви можете контролювати cookies через налаштування браузера. Відключення деяких cookies може вплинути на функціональність сайту.</p>

            <h2>4. Третя сторона</h2>
            <p>Деякі cookies встановлюються третіми сторонами (Google Analytics, соціальні мережі). Їх політики конфіденційності доступні на їх сайтах.</p>
          `
        }
      },
      
      en: {
        'privacy-policy': {
          title: 'Privacy Policy',
          lastUpdated: 'December 1, 2024',
          content: `
            <h2>1. Information Collection</h2>
            <p>We collect information that you provide directly to us, such as:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Business information</li>
              <li>Art preferences</li>
              <li>Space photos for consultations</li>
            </ul>

            <h2>2. Use of Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Provide personalized recommendations</li>
              <li>Organize consultations</li>
              <li>Improve our services</li>
              <li>Contact you regarding your inquiries</li>
            </ul>

            <h2>3. Data Protection</h2>
            <p>We implement modern security methods to protect your personal data. Your information is stored on secure servers and transmitted only through encrypted connections.</p>

            <h2>4. User Rights</h2>
            <p>In accordance with GDPR and local legislation, you have the right to:</p>
            <ul>
              <li>Access your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your data</li>
              <li>Restrict data processing</li>
              <li>Receive data in structured format</li>
            </ul>

            <h2>5. Contact</h2>
            <p>For privacy policy questions, contact: <a href="mailto:privacy@inner-garden.art">privacy@inner-garden.art</a></p>
          `
        },
        'terms-service': {
          title: 'Terms of Service',
          lastUpdated: 'December 1, 2024',
          content: `
            <h2>1. Acceptance of Terms</h2>
            <p>By using our website and services, you agree to these terms of service.</p>

            <h2>2. Service Description</h2>
            <p>Inner Garden provides:</p>
            <ul>
              <li>Art consultations for business spaces</li>
              <li>Original abstract painting sales</li>
              <li>AR visualization of artworks in your spaces</li>
              <li>Personal recommendations</li>
            </ul>

            <h2>3. Rights and Obligations</h2>
            <h3>Your Rights:</h3>
            <ul>
              <li>Receive quality services</li>
              <li>Data confidentiality</li>
              <li>Order cancellation according to law</li>
            </ul>

            <h3>Your Obligations:</h3>
            <ul>
              <li>Provide accurate information</li>
              <li>Follow website usage rules</li>
              <li>Pay for orders on time</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>All artworks and website content are protected by copyright of Marina Kaminska and Inner Garden.</p>

            <h2>5. Liability</h2>
            <p>We strive to provide the best services but are not liable for indirect damages.</p>
          `
        },
        'cookie-policy': {
          title: 'Cookie Policy',
          lastUpdated: 'December 1, 2024',
          content: `
            <h2>1. What are cookies?</h2>
            <p>Cookies are small text files stored on your device to improve website functionality.</p>

            <h2>2. Types of cookies we use</h2>
            
            <h3>Necessary cookies:</h3>
            <ul>
              <li>Website language selection</li>
              <li>Session settings</li>
              <li>Website security</li>
            </ul>

            <h3>Analytics cookies:</h3>
            <ul>
              <li>Google Analytics for traffic analysis</li>
              <li>Feature usage statistics</li>
            </ul>

            <h3>Marketing cookies:</h3>
            <ul>
              <li>Content personalization</li>
              <li>Social media integration</li>
            </ul>

            <h2>3. Cookie Management</h2>
            <p>You can control cookies through browser settings. Disabling some cookies may affect website functionality.</p>

            <h2>4. Third Party</h2>
            <p>Some cookies are set by third parties (Google Analytics, social media). Their privacy policies are available on their websites.</p>
          `
        }
      },

      de: {
        'privacy-policy': {
          title: 'Datenschutz-Bestimmungen',
          lastUpdated: '1. Dezember 2024',
          content: `
            <h2>1. Datensammlung</h2>
            <p>Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, wie:</p>
            <ul>
              <li>Name und Kontaktinformationen</li>
              <li>Geschäftsinformationen</li>
              <li>Kunstpräferenzen</li>
              <li>Raumfotos für Beratungen</li>
            </ul>

            <h2>2. Verwendung der Informationen</h2>
            <p>Wir verwenden gesammelte Informationen für:</p>
            <ul>
              <li>Personalisierte Empfehlungen</li>
              <li>Organisation von Beratungen</li>
              <li>Verbesserung unserer Dienstleistungen</li>
              <li>Kontaktaufnahme bezüglich Ihrer Anfragen</li>
            </ul>

            <h2>3. Datenschutz</h2>
            <p>Wir implementieren moderne Sicherheitsmethoden zum Schutz Ihrer persönlichen Daten. Ihre Informationen werden auf sicheren Servern gespeichert und nur über verschlüsselte Verbindungen übertragen.</p>

            <h2>4. Nutzerrechte</h2>
            <p>Entsprechend der DSGVO haben Sie das Recht:</p>
            <ul>
              <li>Auf Ihre Daten zuzugreifen</li>
              <li>Unrichtige Informationen zu korrigieren</li>
              <li>Ihre Daten zu löschen</li>
              <li>Datenverarbeitung zu beschränken</li>
              <li>Daten in strukturiertem Format zu erhalten</li>
            </ul>

            <h2>5. Kontakt</h2>
            <p>Bei Fragen zur Datenschutzrichtlinie wenden Sie sich an: <a href="mailto:privacy@inner-garden.art">privacy@inner-garden.art</a></p>
          `
        },
        'terms-service': {
          title: 'Nutzungsbedingungen',
          lastUpdated: '1. Dezember 2024',
          content: `
            <h2>1. Akzeptanz der Bedingungen</h2>
            <p>Durch die Nutzung unserer Website und Dienstleistungen stimmen Sie diesen Nutzungsbedingungen zu.</p>

            <h2>2. Servicebeschreibung</h2>
            <p>Inner Garden bietet:</p>
            <ul>
              <li>Kunstberatung für Geschäftsräume</li>
              <li>Verkauf originaler abstrakter Gemälde</li>
              <li>AR-Visualisierung von Kunstwerken in Ihren Räumen</li>
              <li>Persönliche Empfehlungen</li>
            </ul>

            <h2>3. Rechte und Pflichten</h2>
            <h3>Ihre Rechte:</h3>
            <ul>
              <li>Qualitätsservice erhalten</li>
              <li>Datenschutz</li>
              <li>Bestellstornierung gemäß Gesetz</li>
            </ul>

            <h3>Ihre Pflichten:</h3>
            <ul>
              <li>Genaue Informationen bereitstellen</li>
              <li>Website-Nutzungsregeln befolgen</li>
              <li>Bestellungen pünktlich bezahlen</li>
            </ul>

            <h2>4. Geistiges Eigentum</h2>
            <p>Alle Kunstwerke und Website-Inhalte sind urheberrechtlich geschützt von Marina Kaminska und Inner Garden.</p>

            <h2>5. Haftung</h2>
            <p>Wir bemühen uns, die besten Services zu bieten, haften aber nicht für indirekte Schäden.</p>
          `
        },
        'cookie-policy': {
          title: 'Cookie-Richtlinie',
          lastUpdated: '1. Dezember 2024',
          content: `
            <h2>1. Was sind Cookies?</h2>
            <p>Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, um die Website-Funktionalität zu verbessern.</p>

            <h2>2. Cookie-Typen, die wir verwenden</h2>
            
            <h3>Notwendige Cookies:</h3>
            <ul>
              <li>Website-Sprachauswahl</li>
              <li>Sitzungseinstellungen</li>
              <li>Website-Sicherheit</li>
            </ul>

            <h3>Analyse-Cookies:</h3>
            <ul>
              <li>Google Analytics für Traffic-Analyse</li>
              <li>Funktionsnutzungsstatistiken</li>
            </ul>

            <h3>Marketing-Cookies:</h3>
            <ul>
              <li>Inhaltspersonalisierung</li>
              <li>Social Media Integration</li>
            </ul>

            <h2>3. Cookie-Verwaltung</h2>
            <p>Sie können Cookies über Browser-Einstellungen steuern. Das Deaktivieren einiger Cookies kann die Website-Funktionalität beeinträchtigen.</p>

            <h2>4. Dritte Parteien</h2>
            <p>Einige Cookies werden von Dritten gesetzt (Google Analytics, soziale Medien). Ihre Datenschutzrichtlinien sind auf ihren Websites verfügbar.</p>
          `
        }
      }
    };
  }

  setupEventListeners() {
    // Legal links clicks
    document.addEventListener('click', (event) => {
      const target = event.target;
      
      // Handle data-policy attributes
      if (target.matches('[data-policy]')) {
        event.preventDefault();
        const policyType = target.getAttribute('data-policy');
        this.showPolicy(policyType);
        return;
      }

      // Handle legal links with data-key attributes
      if (target.matches('.legal-link[data-key]')) {
        event.preventDefault();
        const policyKey = target.getAttribute('data-key');
        const policyMap = {
          'privacy-policy': 'privacy',
          'terms-service': 'terms',  
          'cookie-policy': 'cookies'
        };
        const policyType = policyMap[policyKey];
        if (policyType) {
          this.showPolicy(policyType);
        }
        return;
      }

      // Close modal on overlay click
      if (target.matches('.legal-modal-overlay')) {
        this.closeModal();
        return;
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.currentModal) {
        this.closeModal();
      }
    });
  }

  showPolicy(policyType) {
    const currentLang = window.ultraI18n ? window.ultraI18n.getCurrentLanguage() : 'uk';
    const policyData = this.policies[currentLang]?.[`${policyType}-policy`];
    
    if (!policyData) {
      console.error(`Policy ${policyType} not found for language ${currentLang}`);
      return;
    }

    this.createModal(policyData, policyType);
  }

  createModal(policyData, policyType) {
    // Remove existing modal
    this.closeModal();

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'legal-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="legal-modal-content">
        <div class="legal-modal-header">
          <h1 class="legal-modal-title">${policyData.title}</h1>
          <button class="legal-modal-close" aria-label="${window.ultraI18n ? window.ultraI18n.translate('btn-close') : 'Close'}">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="legal-modal-body">
          <p class="policy-last-updated">
            <strong>${window.ultraI18n ? window.ultraI18n.translate('policy-last-updated') : 'Last updated'}: </strong>
            ${policyData.lastUpdated}
          </p>
          <div class="policy-content">
            ${policyData.content}
          </div>
        </div>
        <div class="legal-modal-footer">
          <button class="btn btn-outline legal-modal-decline">
            <span>${window.ultraI18n ? window.ultraI18n.translate('policy-decline') : 'Decline'}</span>
          </button>
          <button class="btn btn-primary legal-modal-accept">
            <span>${window.ultraI18n ? window.ultraI18n.translate('policy-accept') : 'Accept'}</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    this.currentModal = modalOverlay;

    // Setup modal event listeners
    const closeBtn = modalOverlay.querySelector('.legal-modal-close');
    const acceptBtn = modalOverlay.querySelector('.legal-modal-accept');
    const declineBtn = modalOverlay.querySelector('.legal-modal-decline');

    closeBtn.addEventListener('click', () => this.closeModal());
    acceptBtn.addEventListener('click', () => {
      this.acceptPolicy(policyType);
      this.closeModal();
    });
    declineBtn.addEventListener('click', () => this.closeModal());

    // Show modal with animation
    requestAnimationFrame(() => {
      modalOverlay.classList.add('active');
    });

    // Trap focus in modal
    this.trapFocus(modalOverlay);
  }

  closeModal() {
    if (this.currentModal) {
      this.currentModal.classList.remove('active');
      setTimeout(() => {
        if (this.currentModal && this.currentModal.parentNode) {
          this.currentModal.parentNode.removeChild(this.currentModal);
        }
        this.currentModal = null;
      }, 300);
    }
  }

  acceptPolicy(policyType) {
    try {
      localStorage.setItem(`policy-accepted-${policyType}`, new Date().toISOString());
      console.log(`✅ Policy accepted: ${policyType}`);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('policyAccepted', {
        detail: { policyType }
      }));
    } catch (error) {
      console.warn('Cannot save policy acceptance:', error);
    }
  }

  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Trap focus
    modal.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  // Public methods
  isPolicyAccepted(policyType) {
    try {
      return localStorage.getItem(`policy-accepted-${policyType}`) !== null;
    } catch (error) {
      return false;
    }
  }

  getAllAcceptedPolicies() {
    const accepted = [];
    ['privacy', 'terms', 'cookies'].forEach(type => {
      if (this.isPolicyAccepted(type)) {
        accepted.push(type);
      }
    });
    return accepted;
  }
}

// Global initialization
window.ultraLegalPolicies = new UltraLegalPolicies();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraLegalPolicies;
}