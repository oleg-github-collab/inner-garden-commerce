// Inner Garden - Newsletter Integration with Google Apps Script

class NewsletterManager {
  constructor() {
    this.isSubmitting = false;
    this.subscribers = new Set();
    this.googleAppsScriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    this.emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.i18nUnsubscribe = null;
    
    this.init();
  }

  init() {
    this.loadSubscribersFromStorage();
    this.bindEvents();
    this.setupFormValidation();
    this.initializeGoogleAppsScript();
  }

  t(key, fallback) {
    return window.ultraI18n?.translate(key, fallback) || fallback;
  }

  applyTranslations() {
    if (window.ultraI18n?.updateAllElements) {
      window.ultraI18n.updateAllElements();
    }
  }

  loadSubscribersFromStorage() {
    // Load existing subscribers from localStorage
    const stored = localStorage.getItem('inner-garden-newsletter-emails');
    if (stored) {
      try {
        const emails = JSON.parse(stored);
        emails.forEach(email => this.subscribers.add(email));
      } catch (error) {
        console.warn('Error loading newsletter data:', error);
      }
    }
  }

  bindEvents() {
    // Main newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitNewsletter(newsletterForm);
      });
    }

    // Business form newsletter checkbox
    const businessForm = document.getElementById('business-form');
    if (businessForm) {
      businessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitBusinessForm(businessForm);
      });
    }

    // Email input validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateEmailInput(input);
      });

      input.addEventListener('input', () => {
        this.clearEmailError(input);
      });
    });

    if (window.ultraI18n?.subscribe) {
      this.i18nUnsubscribe = window.ultraI18n.subscribe((event) => {
        if (event === 'languageChanged') {
          this.applyTranslations();
        }
      });
    }
  }

  setupFormValidation() {
    // Add real-time validation styles
    const validationStyles = `
      .email-valid {
        border-color: var(--color-success) !important;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M10 3L4.5 8.5L2 6' stroke='%2327ae60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        padding-right: 40px !important;
      }

      .email-error {
        border-color: var(--color-error) !important;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M9 3L3 9M3 3l6 6' stroke='%23e74c3c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e") !important;
        background-repeat: no-repeat !important;
        background-position: right 12px center !important;
        background-size: 16px !important;
        padding-right: 40px !important;
      }

      .error-message {
        color: var(--color-error);
        font-size: 12px;
        margin-top: 4px;
        display: none;
      }

      .error-message.show {
        display: block;
        animation: fadeInError 0.3s ease;
      }

      @keyframes fadeInError {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .newsletter-success {
        background: var(--color-success);
        color: white;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        margin-top: 16px;
        display: none;
      }

      .newsletter-success.show {
        display: block;
        animation: fadeIn 0.5s ease;
      }

      .newsletter-success i {
        margin-right: 8px;
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = validationStyles;
    document.head.appendChild(styleSheet);
  }

  initializeGoogleAppsScript() {
    // Create the Google Apps Script deployment URL
    // This will be created based on your script deployment
    this.scriptConfig = {
      url: this.googleAppsScriptUrl,
      fallbackUrl: null, // Backup webhook
      timeout: 10000, // 10 seconds
      retryAttempts: 2
    };
  }

  validateEmailInput(input) {
    const email = input.value.trim();
    const errorElement = this.getOrCreateErrorElement(input);

    if (!email) {
      this.clearEmailError(input);
      return false;
    }

    if (!this.emailValidationPattern.test(email)) {
      this.showEmailError(input, this.t('newsletter-error-email-invalid', 'Будь ласка, введіть правильну email адресу'));
      return false;
    }

    if (this.subscribers.has(email.toLowerCase())) {
      this.showEmailError(input, this.t('newsletter-error-already-subscribed', 'Ви вже підписані на нашу розсилку'));
      return false;
    }

    this.showEmailValid(input);
    return true;
  }

  getOrCreateErrorElement(input) {
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    return errorElement;
  }

  showEmailError(input, message) {
    input.classList.remove('email-valid');
    input.classList.add('email-error');
    
    const errorElement = this.getOrCreateErrorElement(input);
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }

  showEmailValid(input) {
    input.classList.remove('email-error');
    input.classList.add('email-valid');
    
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  clearEmailError(input) {
    input.classList.remove('email-error', 'email-valid');
    
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  async submitNewsletter(form) {
    if (this.isSubmitting) return;

    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!emailInput || !submitBtn) return;

    // Validate email
    if (!this.validateEmailInput(emailInput)) {
      return;
    }

    const email = emailInput.value.trim().toLowerCase();

    try {
      this.isSubmitting = true;
      this.showSubmitLoading(submitBtn, true);

      // Submit to Google Apps Script
      const success = await this.submitToGoogleScript({
        email: email,
        source: 'newsletter',
        timestamp: new Date().toISOString(),
        language: document.documentElement.lang || 'uk',
        page: window.location.pathname
      });

      if (success) {
        // Add to local storage
        this.subscribers.add(email);
        this.saveSubscribersToStorage();
        
        // Show success message
        this.showNewsletterSuccess(form);
        
        // Reset form
        form.reset();
        this.clearEmailError(emailInput);
        
        // Track subscription
        this.trackSubscription(email, 'newsletter');
        
      } else {
        throw new Error('Subscription failed');
      }

    } catch (error) {
      console.error('Newsletter submission error:', error);
      this.showError(this.t('newsletter-error-subscribe-failed', 'Помилка підписки. Спробуйте пізніше.'));
    } finally {
      this.isSubmitting = false;
      this.showSubmitLoading(submitBtn, false);
    }
  }

  async submitBusinessForm(form) {
    if (this.isSubmitting) return;

    const formData = new FormData(form);
    const businessData = {
      companyName: formData.get('companyName'),
      spaceType: formData.get('spaceType'),
      budgetRange: formData.get('budgetRange'),
      email: formData.get('email'),
      details: formData.get('details'),
      source: 'business_inquiry',
      timestamp: new Date().toISOString(),
      language: document.documentElement.lang || 'uk'
    };

    // Validate required fields
    if (!this.validateBusinessForm(businessData)) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    
    try {
      this.isSubmitting = true;
      this.showSubmitLoading(submitBtn, true);

      // Submit to Google Apps Script
      const success = await this.submitToGoogleScript(businessData);

      if (success) {
        // Add email to newsletter if not already subscribed
        if (businessData.email) {
          this.subscribers.add(businessData.email.toLowerCase());
          this.saveSubscribersToStorage();
        }
        
        // Show success message
        this.showBusinessSuccess(form);
        
        // Reset form
        form.reset();
        
        // Track business inquiry
        this.trackSubscription(businessData.email, 'business_inquiry');
        
      } else {
        throw new Error('Business form submission failed');
      }

    } catch (error) {
      console.error('Business form error:', error);
      this.showError(this.t('newsletter-error-request-failed', 'Помилка надсилання запиту. Спробуйте пізніше.'));
    } finally {
      this.isSubmitting = false;
      this.showSubmitLoading(submitBtn, false);
    }
  }

  validateBusinessForm(data) {
    if (!data.companyName) {
      this.showError(this.t('newsletter-error-company-required', 'Введіть назву компанії'));
      return false;
    }

    if (!data.spaceType) {
      this.showError(this.t('newsletter-error-space-required', 'Оберіть тип простору'));
      return false;
    }

    if (!data.email || !this.emailValidationPattern.test(data.email)) {
      this.showError(this.t('newsletter-error-email-invalid', 'Введіть правильну email адресу'));
      return false;
    }

    return true;
  }

  async submitToGoogleScript(data) {
    const maxRetries = this.scriptConfig.retryAttempts;
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Create controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.scriptConfig.timeout);

        const response = await fetch(this.scriptConfig.url, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          return result.success === true;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await this.delay(1000 * Math.pow(2, attempt));
        }
      }
    }

    // Try fallback URL if available
    if (this.scriptConfig.fallbackUrl) {
      try {
        const response = await fetch(this.scriptConfig.fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.warn('Fallback also failed:', error);
      }
    }

    throw lastError;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showSubmitLoading(button, loading) {
    if (loading) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.t('newsletter-sending', 'Надсилання...')}`;
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
  }

  showNewsletterSuccess(form) {
    let successElement = form.parentNode.querySelector('.newsletter-success');
    
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'newsletter-success';
      successElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span data-key="newsletter-success">Дякуємо! Ви успішно підписалися на розсилку.</span>
      `;
      form.parentNode.appendChild(successElement);
      this.applyTranslations();
    }

    successElement.classList.add('show');

    // Hide after 5 seconds
    setTimeout(() => {
      successElement.classList.remove('show');
    }, 5000);
  }

  showBusinessSuccess(form) {
    // Create success modal or notification
    this.showSuccessModal(
      this.t('newsletter-request-sent', 'Запит надіслано!'), 
      this.t('newsletter-request-message', 'Дякуємо за ваш інтерес! Ми зв\'яжемося з вами протягом 24 годин для обговорення деталей проекту.')
    );
  }

  showSuccessModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal success-modal open';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="success-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>${title}</h3>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
            ${this.t('action-ok', 'Добре')}
          </button>
        </div>
      </div>
    `;

    // Add success modal styles
    const styles = `
      .success-modal .modal-content {
        max-width: 400px;
        text-align: center;
      }

      .success-content {
        padding: 40px 30px;
      }

      .success-icon {
        font-size: 64px;
        color: var(--color-success);
        margin-bottom: 20px;
        animation: successPulse 0.6s ease;
      }

      .success-content h3 {
        color: var(--color-primary);
        margin-bottom: 16px;
      }

      .success-content p {
        color: var(--color-text-light);
        line-height: 1.6;
        margin-bottom: 24px;
      }

      @keyframes successPulse {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    this.applyTranslations();
    this.applyTranslations();

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
        document.body.classList.remove('modal-open');
      }
    }, 10000);
  }

  showError(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.style.backgroundColor = 'var(--color-error)';
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
        toast.style.backgroundColor = 'var(--color-accent)';
      }, 4000);
    }
  }

  saveSubscribersToStorage() {
    const emails = Array.from(this.subscribers);
    localStorage.setItem('inner-garden-newsletter-emails', JSON.stringify(emails));
  }

  trackSubscription(email, source) {
    // Analytics tracking
    if (window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: source,
        value: 1,
        user_properties: {
          subscriber_source: source
        }
      });
    }

    // Track in console for development
    console.log('Newsletter subscription:', {
      email: email.replace(/(.{2}).*@/, '$1***@'), // Partially hide email for privacy
      source: source,
      timestamp: new Date().toISOString()
    });
  }

  // Advanced email validation with domain checking
  async validateEmailAdvanced(email) {
    // Basic validation first
    if (!this.emailValidationPattern.test(email)) {
      return { valid: false, reason: 'invalid_format' };
    }

    // Check for common typos in domain names
    const commonTypos = {
      'gmail.co': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahoo.co': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'hotmial.com': 'hotmail.com'
    };

    const domain = email.split('@')[1];
    const suggestedDomain = commonTypos[domain];

    if (suggestedDomain) {
      return {
        valid: false,
        reason: 'typo_suggestion',
        suggestion: email.replace(domain, suggestedDomain)
      };
    }

    return { valid: true };
  }

  // Email suggestion system
  showEmailSuggestion(input, suggestion) {
    const suggestionElement = document.createElement('div');
    suggestionElement.className = 'email-suggestion';
    suggestionElement.innerHTML = `
      <span>${this.t('newsletter-suggestion-prefix', 'Можливо, ви мали на увазі: ')}</span>
      <button type="button" class="suggestion-btn">${suggestion}</button>
    `;

    const existingSuggestion = input.parentNode.querySelector('.email-suggestion');
    if (existingSuggestion) {
      existingSuggestion.remove();
    }

    input.parentNode.appendChild(suggestionElement);

    // Accept suggestion
    suggestionElement.querySelector('.suggestion-btn').addEventListener('click', () => {
      input.value = suggestion;
      suggestionElement.remove();
      this.validateEmailInput(input);
    });

    // Add suggestion styles
    this.addSuggestionStyles();
  }

  addSuggestionStyles() {
    if (document.getElementById('email-suggestion-styles')) return;

    const styles = `
      .email-suggestion {
        margin-top: 8px;
        padding: 8px 12px;
        background: var(--color-off-white);
        border: 1px solid var(--color-light-gray);
        border-radius: 6px;
        font-size: 14px;
        color: var(--color-text-light);
        animation: slideDown 0.3s ease;
      }

      .suggestion-btn {
        background: none;
        border: none;
        color: var(--color-accent);
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
      }

      .suggestion-btn:hover {
        color: var(--color-accent-darker);
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'email-suggestion-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Newsletter preferences and segmentation
  showNewsletterPreferences(email) {
    const modal = document.createElement('div');
    modal.className = 'modal newsletter-preferences-modal open';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="preferences-container">
          <h3 data-key="newsletter-preferences-title">Налаштування розсилки</h3>
          <p data-key="newsletter-preferences-intro">Виберіть, про що ви хочете отримувати інформацію:</p>
          
          <form id="preferences-form" class="preferences-form">
            <input type="hidden" name="email" value="${email}">
            
            <div class="preference-group">
              <label class="preference-item">
                <input type="checkbox" name="interests" value="new_artworks" checked>
                <span class="checkmark"></span>
                <div class="preference-info">
                  <strong data-key="newsletter-pref-new-artworks-title">Нові роботи</strong>
                  <p data-key="newsletter-pref-new-artworks-desc">Повідомлення про нові картини та колекції</p>
                </div>
              </label>
            </div>
            
            <div class="preference-group">
              <label class="preference-item">
                <input type="checkbox" name="interests" value="business_insights">
                <span class="checkmark"></span>
                <div class="preference-info">
                  <strong data-key="newsletter-pref-business-title">Бізнес-інсайти</strong>
                  <p data-key="newsletter-pref-business-desc">Статті про вплив мистецтва на бізнес</p>
                </div>
              </label>
            </div>
            
            <div class="preference-group">
              <label class="preference-item">
                <input type="checkbox" name="interests" value="meditation_content">
                <span class="checkmark"></span>
                <div class="preference-info">
                  <strong data-key="newsletter-pref-meditation-title">Медитативний контент</strong>
                  <p data-key="newsletter-pref-meditation-desc">Медитації та практики гармонії</p>
                </div>
              </label>
            </div>
            
            <div class="preference-group">
              <label class="preference-item">
                <input type="checkbox" name="interests" value="exclusive_offers">
                <span class="checkmark"></span>
                <div class="preference-info">
                  <strong data-key="newsletter-pref-offers-title">Спеціальні пропозиції</strong>
                  <p data-key="newsletter-pref-offers-desc">Знижки та ексклюзивні пропозиції</p>
                </div>
              </label>
            </div>
            
            <button type="submit" class="btn btn-primary">
              <span data-key="newsletter-preferences-save">Зберегти налаштування</span>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Bind events
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
      document.body.classList.remove('modal-open');
    });

    modal.querySelector('#preferences-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveNewsletterPreferences(e.target);
    });
  }

  async saveNewsletterPreferences(form) {
    const formData = new FormData(form);
    const preferences = {
      email: formData.get('email'),
      interests: formData.getAll('interests'),
      timestamp: new Date().toISOString()
    };

    try {
      // Save to Google Apps Script
      await this.submitToGoogleScript({
        ...preferences,
        action: 'update_preferences'
      });

      // Save locally
      const key = `newsletter-preferences-${preferences.email}`;
      localStorage.setItem(key, JSON.stringify(preferences));

      // Close modal
      form.closest('.modal').remove();
      document.body.classList.remove('modal-open');

      // Show success
      this.showToast(this.t('newsletter-preferences-saved', 'Налаштування збережено!'), 'success');

    } catch (error) {
      console.error('Error saving preferences:', error);
      this.showError(this.t('newsletter-preferences-error', 'Помилка збереження налаштувань'));
    }
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      
      if (type === 'success') {
        toast.style.backgroundColor = 'var(--color-success)';
      } else if (type === 'error') {
        toast.style.backgroundColor = 'var(--color-error)';
      } else {
        toast.style.backgroundColor = 'var(--color-accent)';
      }
      
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // Public methods for external use
  isSubscribed(email) {
    return this.subscribers.has(email.toLowerCase());
  }

  getSubscriberCount() {
    return this.subscribers.size;
  }

  unsubscribe(email) {
    if (this.subscribers.has(email.toLowerCase())) {
      this.subscribers.delete(email.toLowerCase());
      this.saveSubscribersToStorage();
      
      // Submit unsubscribe to Google Apps Script
      this.submitToGoogleScript({
        email: email,
        action: 'unsubscribe',
        timestamp: new Date().toISOString()
      });
      
      return true;
    }
    return false;
  }

  // Newsletter campaign metrics (for admin use)
  getNewsletterMetrics() {
    return {
      totalSubscribers: this.subscribers.size,
      subscribersToday: 0, // Would need to track signup dates
      openRate: 0, // Would need tracking
      clickRate: 0, // Would need tracking
      unsubscribeRate: 0 // Would need tracking
    };
  }
}

// Create Google Apps Script for backend processing
const createGoogleAppsScript = () => {
  return `
    // Google Apps Script code for Inner Garden Newsletter
    function doPost(e) {
      try {
        const data = JSON.parse(e.postData.contents);
        
        // Get or create spreadsheet
        const spreadsheet = getOrCreateSpreadsheet();
        
        if (data.action === 'unsubscribe') {
          handleUnsubscribe(spreadsheet, data);
        } else if (data.action === 'update_preferences') {
          handlePreferencesUpdate(spreadsheet, data);
        } else if (data.source === 'business_inquiry') {
          handleBusinessInquiry(spreadsheet, data);
        } else {
          handleNewsletterSignup(spreadsheet, data);
        }
        
        return ContentService
          .createTextOutput(JSON.stringify({ success: true }))
          .setMimeType(ContentService.MimeType.JSON);
        
      } catch (error) {
        console.error('Error processing request:', error);
        
        return ContentService
          .createTextOutput(JSON.stringify({ 
            success: false, 
            error: error.toString() 
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    function getOrCreateSpreadsheet() {
      const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with actual ID
      
      try {
        return SpreadsheetApp.openById(SPREADSHEET_ID);
      } catch (error) {
        // Create new spreadsheet if not found
        const spreadsheet = SpreadsheetApp.create('Inner Garden Newsletter');
        
        // Set up sheets
        setupNewsletterSheet(spreadsheet);
        setupBusinessSheet(spreadsheet);
        setupPreferencesSheet(spreadsheet);
        
        return spreadsheet;
      }
    }
    
    function handleNewsletterSignup(spreadsheet, data) {
      const sheet = spreadsheet.getSheetByName('Newsletter') || 
                   spreadsheet.insertSheet('Newsletter');
      
      // Add headers if first row
      if (sheet.getLastRow() === 0) {
        sheet.getRange(1, 1, 1, 6).setValues([
          ['Email', 'Source', 'Language', 'Timestamp', 'Page', 'Status']
        ]);
      }
      
      // Add subscriber data
      sheet.appendRow([
        data.email,
        data.source,
        data.language,
        data.timestamp,
        data.page,
        'active'
      ]);
      
      // Send welcome email
      sendWelcomeEmail(data.email, data.language);
    }
    
    function sendWelcomeEmail(email, language) {
      const subject = language === 'en' ? 
        'Welcome to Inner Garden!' : 
        'Ласкаво просимо до Inner Garden!';
      
      const body = language === 'en' ?
        'Thank you for subscribing to our newsletter! We will keep you updated with our latest artworks and insights.' :
        'Дякуємо за підписку на нашу розсилку! Ми будемо тримати вас в курсі наших останніх робіт та інсайтів.';
      
      GmailApp.sendEmail(email, subject, body);
    }
    
    // Additional functions would be added here for business inquiries,
    // preferences management, etc.
  `;
};

// Initialize newsletter manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.newsletterManager = new NewsletterManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NewsletterManager, createGoogleAppsScript };
}
