// Inner Garden - Business ROI Metrics System

// Unique stylesheet for ROI metrics module
const roiMetricsStyleSheet = (() => {
  const style = document.createElement('style');
  style.textContent = `
    .roi-dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 2rem;
    }
    .metric-card {
      background: var(--color-surface);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .metric-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--color-accent);
    }
  `;
  document.head.appendChild(style);
  return style;
})();

class ROIMetrics {
  constructor() {
    this.metrics = {
      nps: { current: 22, target: 30, change: '+22%' },
      productivity: { current: 15, target: 25, change: '+15%' },
      stress: { current: -30, target: -40, change: '-30%' },
      satisfaction: { current: 40, target: 50, change: '+40%' }
    };
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.errorHandler = window.InnerGarden?.errorHandler;
    
    if (this.errorHandler) {
      this.errorHandler.logInfo('ROIMetrics initialized');
    }
    
    // Handle form submission errors
    this.handleBusinessFormErrors();
  }

  handleBusinessFormErrors() {
    const businessForm = document.getElementById('business-form');
    if (businessForm) {
      businessForm.addEventListener('submit', (event) => {
        try {
          this.validateBusinessForm(businessForm);
        } catch (error) {
          event.preventDefault();
          if (this.errorHandler) {
            this.errorHandler.handleComponentError('ROIMetrics', error, { form: 'business' });
          }
          this.showFormError('Будь ласка, заповніть всі обов\'язкові поля');
        }
      });
    }
  }

  validateBusinessForm(form) {
    const requiredFields = ['companyName', 'contactEmail'];
    for (const fieldName of requiredFields) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field || !field.value.trim()) {
        throw new Error(`Required field missing: ${fieldName}`);
      }
    }
  }

  showFormError(message) {
    const businessForm = document.getElementById('business-form');
    if (businessForm) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #f44336;
      `;
      errorDiv.textContent = message;
      
      businessForm.insertBefore(errorDiv, businessForm.firstChild);
      setTimeout(() => errorDiv.remove(), 5000);
    }
    
    this.caseStudies = [
      {
        id: 'hotel-kyiv',
        name: 'Готель Премія - Київ',
        type: 'hotel',
        metrics: {
          npsImprovement: 28,
          satisfactionGrowth: 45,
          bookingIncrease: 18,
          avgStayIncrease: 0.8
        },
        testimonialKey: 'case-study-hotel-testimonial',
        image: 'assets/images/case-studies/hotel-kyiv.jpg'
      },
      {
        id: 'medical-lviv',
        name: 'Медцентр Здоровʼя - Львів',
        type: 'medical',
        metrics: {
          stressReduction: 35,
          waitTimePerception: -40,
          patientSatisfaction: 32,
          staffMorale: 25
        },
        testimonialKey: 'case-study-medical-testimonial',
        image: 'assets/images/case-studies/medical-lviv.jpg'
      },
      {
        id: 'office-dnipro',
        name: 'IT Компанія TechFlow - Дніпро',
        type: 'office',
        metrics: {
          productivityIncrease: 22,
          creativityBoost: 35,
          employeeRetention: 15,
          sickDaysReduction: 18
        },
        testimonialKey: 'case-study-office-testimonial',
        image: 'assets/images/case-studies/office-dnipro.jpg'
      }
    ];

    this.isInitialized = false;
    this.animatedMetrics = new Set();
    this.currentCaseStudy = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupInteractiveMetrics();
    this.setupCaseStudyCarousel();
    this.createROICalculator();
    this.initializeCharts();
    this.isInitialized = true;
  }

  bindEvents() {
    // ROI metric hover effects
    const roiStats = document.querySelectorAll('.roi-stat');
    roiStats.forEach(stat => {
      stat.addEventListener('mouseenter', (e) => {
        this.showMetricTooltip(e.target);
      });
      
      stat.addEventListener('mouseleave', (e) => {
        this.hideMetricTooltip(e.target);
      });
    });

    // Business form enhancements
    this.enhanceBusinessForm();

    // Case study navigation
    this.bindCaseStudyEvents();

    // ROI Calculator events
    this.bindCalculatorEvents();
  }

  setupInteractiveMetrics() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedMetrics.has(entry.target)) {
          this.animateMetric(entry.target);
          this.animatedMetrics.add(entry.target);
        }
      });
    }, { threshold: 0.7 });

    document.querySelectorAll('.roi-stat').forEach(stat => {
      observer.observe(stat);
    });
  }

  animateMetric(element) {
    const numberElement = element.querySelector('.roi-number');
    if (!numberElement) return;

    const targetText = numberElement.textContent;
    const isNegative = targetText.includes('-');
    const isPercentage = targetText.includes('%');
    const targetNumber = parseInt(targetText.replace(/[^\d]/g, ''));
    
    let currentNumber = 0;
    const increment = targetNumber / 50; // Animation duration control
    
    // Add pulse effect
    element.style.transform = 'scale(1.05)';
    element.style.transition = 'transform 0.3s ease';
    
    const timer = setInterval(() => {
      currentNumber += increment;
      
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber;
        clearInterval(timer);
        
        // Reset scale after animation
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 300);
      }
      
      let displayNumber = Math.floor(currentNumber);
      let displayText = displayNumber.toString();
      
      if (isNegative) displayText = '-' + displayText;
      if (isPercentage) displayText = '+' + displayText + '%';
      if (!isPercentage && !isNegative) displayText = '+' + displayText + '%';
      
      numberElement.textContent = displayText;
    }, 30);
  }

  showMetricTooltip(element) {
    const metricType = this.getMetricType(element);
    const tooltipData = this.getTooltipData(metricType);
    
    if (!tooltipData) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'roi-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <h4>${tooltipData.title}</h4>
        <span class="tooltip-trend ${tooltipData.trend}">${tooltipData.change}</span>
      </div>
      <div class="tooltip-body">
        <p>${tooltipData.description}</p>
        <div class="tooltip-details">
          <div class="detail-item">
            <span class="detail-label">Поточний показник:</span>
            <span class="detail-value">${tooltipData.current}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Цільовий показник:</span>
            <span class="detail-value">${tooltipData.target}</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    // Show tooltip
    requestAnimationFrame(() => {
      tooltip.classList.add('show');
    });
  }

  hideMetricTooltip(element) {
    const tooltip = document.querySelector('.roi-tooltip');
    if (tooltip) {
      tooltip.classList.remove('show');
      setTimeout(() => tooltip.remove(), 300);
    }
  }

  getMetricType(element) {
    const label = element.querySelector('.roi-label');
    if (!label) return null;
    
    const text = label.textContent.toLowerCase();
    if (text.includes('nps')) return 'nps';
    if (text.includes('продуктивн')) return 'productivity';
    if (text.includes('стрес')) return 'stress';
    if (text.includes('задоволен')) return 'satisfaction';
    
    return null;
  }

  getTooltipData(metricType) {
    const tooltips = {
      nps: {
        title: 'Net Promoter Score',
        description: 'Показник лояльності клієнтів. Відображає ймовірність рекомендації вашого закладу іншим.',
        current: '8.2/10',
        target: '9.0/10',
        change: '+22%',
        trend: 'positive'
      },
      productivity: {
        title: 'Продуктивність персоналу',
        description: 'Зростання ефективності роботи співробітників завдяки покращенню робочої атмосфери.',
        current: '85%',
        target: '92%',
        change: '+15%',
        trend: 'positive'
      },
      stress: {
        title: 'Рівень стресу',
        description: 'Зниження стресу клієнтів та персоналу через гармонійну атмосферу.',
        current: '3.2/10',
        target: '2.5/10',
        change: '-30%',
        trend: 'negative-good'
      },
      satisfaction: {
        title: 'Задоволеність клієнтів',
        description: 'Загальний рівень задоволеності клієнтів сервісом та атмосферою закладу.',
        current: '8.8/10',
        target: '9.2/10',
        change: '+40%',
        trend: 'positive'
      }
    };
    
    return tooltips[metricType] || null;
  }

  setupCaseStudyCarousel() {
    const businessSection = document.getElementById('business');
    if (!businessSection) return;

    // Create case study carousel HTML
    const caseStudyHTML = `
      <div class="case-studies-section">
        <h3>Кейси клієнтів</h3>
        <div class="case-study-carousel">
          <div class="case-study-track" id="case-study-track">
            ${this.caseStudies.map(study => this.createCaseStudyCard(study)).join('')}
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn prev-btn" id="prev-case-study">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="carousel-indicators">
              ${this.caseStudies.map((_, index) => 
                `<div class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
              ).join('')}
            </div>
            <button class="carousel-btn next-btn" id="next-case-study">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert after ROI infographic
    const roiInfographic = businessSection.querySelector('.roi-infographic');
    if (roiInfographic) {
      roiInfographic.insertAdjacentHTML('afterend', caseStudyHTML);
    }
  }

  createCaseStudyCard(study) {
    return `
      <div class="case-study-card" data-study-id="${study.id}">
        <div class="case-study-image">
          <img src="${study.image}" alt="${study.name}" onerror="this.src='assets/images/placeholder-case-study.jpg'">
          <div class="study-type-badge">${this.getTypeLabel(study.type)}</div>
        </div>
        <div class="case-study-content">
          <h4>${study.name}</h4>
          <p class="study-testimonial">"${window.ultraI18n ? window.ultraI18n.translate(study.testimonialKey) : study.testimonialKey}"</p>
          <div class="study-metrics">
            ${Object.entries(study.metrics).map(([key, value]) => 
              `<div class="metric-item">
                <span class="metric-label">${this.getMetricLabel(key)}:</span>
                <span class="metric-value ${value > 0 ? 'positive' : 'negative'}">${value > 0 ? '+' : ''}${value}%</span>
              </div>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }

  getTypeLabel(type) {
    const labels = {
      hotel: 'Готель',
      medical: 'Медцентр',
      office: 'Офіс',
      wellness: 'Wellness'
    };
    return labels[type] || type;
  }

  getMetricLabel(key) {
    const labels = {
      npsImprovement: 'Покращення NPS',
      satisfactionGrowth: 'Зростання задоволеності',
      bookingIncrease: 'Збільшення бронювань',
      avgStayIncrease: 'Збільшення тривалості',
      stressReduction: 'Зниження стресу',
      waitTimePerception: 'Сприйняття очікування',
      patientSatisfaction: 'Задоволеність пацієнтів',
      staffMorale: 'Моральний дух персоналу',
      productivityIncrease: 'Зростання продуктивності',
      creativityBoost: 'Підвищення креативності',
      employeeRetention: 'Утримання персоналу',
      sickDaysReduction: 'Зменшення лікарняних'
    };
    return labels[key] || key;
  }

  bindCaseStudyEvents() {
    const prevBtn = document.getElementById('prev-case-study');
    const nextBtn = document.getElementById('next-case-study');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.showPreviousCaseStudy();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.showNextCaseStudy();
      });
    }

    indicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.showCaseStudy(index);
      });
    });

    // Auto-rotate case studies
    this.startCaseStudyAutoRotation();
  }

  showCaseStudy(index) {
    const track = document.getElementById('case-study-track');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (!track || !indicators.length) return;

    this.currentCaseStudy = index;
    
    // Update track position
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }

  showNextCaseStudy() {
    const nextIndex = (this.currentCaseStudy + 1) % this.caseStudies.length;
    this.showCaseStudy(nextIndex);
  }

  showPreviousCaseStudy() {
    const prevIndex = this.currentCaseStudy === 0 
      ? this.caseStudies.length - 1 
      : this.currentCaseStudy - 1;
    this.showCaseStudy(prevIndex);
  }

  startCaseStudyAutoRotation() {
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.showNextCaseStudy();
      }
    }, 8000);
  }

  createROICalculator() {
    const businessSection = document.getElementById('business');
    if (!businessSection) return;

    const calculatorHTML = `
      <div class="roi-calculator-section">
        <h3>Калькулятор ROI</h3>
        <p>Розрахуйте потенційну віддачу від інвестицій у картини для вашого бізнесу</p>
        <div class="roi-calculator">
          <div class="calculator-inputs">
            <div class="input-group">
              <label for="space-type-calc">Тип простору:</label>
              <select id="space-type-calc">
                <option value="hotel">Готель</option>
                <option value="office">Офіс</option>
                <option value="medical">Медичний центр</option>
                <option value="retail">Роздрібна торгівля</option>
                <option value="restaurant">Ресторан</option>
              </select>
            </div>
            <div class="input-group">
              <label for="space-size">Площа (м²):</label>
              <input type="number" id="space-size" min="10" max="10000" value="100">
            </div>
            <div class="input-group">
              <label for="monthly-revenue">Місячний дохід (₴):</label>
              <input type="number" id="monthly-revenue" min="10000" max="10000000" value="500000">
            </div>
            <div class="input-group">
              <label for="employee-count">Кількість співробітників:</label>
              <input type="number" id="employee-count" min="1" max="1000" value="10">
            </div>
          </div>
          <div class="calculator-results">
            <h4>Прогнозовані результати:</h4>
            <div class="result-grid">
              <div class="result-item">
                <span class="result-label">Додатковий річний дохід:</span>
                <span class="result-value" id="additional-revenue">₴0</span>
              </div>
              <div class="result-item">
                <span class="result-label">Економія на плинності кадрів:</span>
                <span class="result-value" id="retention-savings">₴0</span>
              </div>
              <div class="result-item">
                <span class="result-label">Зростання продуктивності:</span>
                <span class="result-value" id="productivity-gain">₴0</span>
              </div>
              <div class="result-item total">
                <span class="result-label">Загальна вигода за рік:</span>
                <span class="result-value" id="total-benefit">₴0</span>
              </div>
            </div>
            <div class="roi-ratio">
              <span>ROI: <strong id="roi-percentage">0%</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert before business form
    const businessForm = businessSection.querySelector('.business-form-container');
    if (businessForm) {
      businessForm.insertAdjacentHTML('beforebegin', calculatorHTML);
    }
  }

  bindCalculatorEvents() {
    const inputs = ['space-type-calc', 'space-size', 'monthly-revenue', 'employee-count'];
    
    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('change', () => this.calculateROI());
        input.addEventListener('input', () => this.calculateROI());
      }
    });

    // Initial calculation
    setTimeout(() => this.calculateROI(), 500);
  }

  calculateROI() {
    const spaceType = document.getElementById('space-type-calc')?.value || 'office';
    const spaceSize = parseInt(document.getElementById('space-size')?.value || '100');
    const monthlyRevenue = parseInt(document.getElementById('monthly-revenue')?.value || '500000');
    const employeeCount = parseInt(document.getElementById('employee-count')?.value || '10');

    // ROI multipliers based on space type
    const multipliers = {
      hotel: { revenue: 0.18, retention: 0.12, productivity: 0.15 },
      office: { revenue: 0.22, retention: 0.15, productivity: 0.18 },
      medical: { revenue: 0.25, retention: 0.20, productivity: 0.12 },
      retail: { revenue: 0.30, retention: 0.08, productivity: 0.15 },
      restaurant: { revenue: 0.20, retention: 0.10, productivity: 0.14 }
    };

    const multiplier = multipliers[spaceType] || multipliers.office;
    const yearlyRevenue = monthlyRevenue * 12;

    // Calculations
    const additionalRevenue = yearlyRevenue * multiplier.revenue;
    const retentionSavings = employeeCount * 50000 * multiplier.retention; // Average hiring cost
    const productivityGain = (employeeCount * 600000) * (multiplier.productivity / 100); // Average salary impact

    const totalBenefit = additionalRevenue + retentionSavings + productivityGain;
    const investmentCost = Math.max(spaceSize * 2000, 50000); // Estimated art investment
    const roiPercentage = ((totalBenefit - investmentCost) / investmentCost * 100).toFixed(0);

    // Update display
    this.updateCalculatorDisplay({
      additionalRevenue,
      retentionSavings,
      productivityGain,
      totalBenefit,
      roiPercentage: Math.max(roiPercentage, 0)
    });
  }

  updateCalculatorDisplay(results) {
    const elements = {
      'additional-revenue': results.additionalRevenue,
      'retention-savings': results.retentionSavings,
      'productivity-gain': results.productivityGain,
      'total-benefit': results.totalBenefit,
      'roi-percentage': results.roiPercentage + '%'
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        if (id !== 'roi-percentage') {
          element.textContent = '₴' + this.formatNumber(value);
        } else {
          element.textContent = value;
        }
      }
    });
  }

  formatNumber(num) {
    return new Intl.NumberFormat('uk-UA').format(Math.round(num));
  }

  enhanceBusinessForm() {
    const form = document.getElementById('business-form');
    if (!form) return;

    // Add form fields for better qualification
    const additionalFields = `
      <div class="form-row">
        <div class="form-group">
          <label for="company-size">Розмір компанії:</label>
          <select name="companySize" id="company-size">
            <option value="">Оберіть розмір</option>
            <option value="small">Мала (1-50 співробітників)</option>
            <option value="medium">Середня (51-250 співробітників)</option>
            <option value="large">Велика (250+ співробітників)</option>
          </select>
        </div>
        <div class="form-group">
          <label for="budget-range">Бюджет:</label>
          <select name="budgetRange" id="budget-range">
            <option value="">Оберіть бюджет</option>
            <option value="50k-100k">₴50,000 - ₴100,000</option>
            <option value="100k-250k">₴100,000 - ₴250,000</option>
            <option value="250k-500k">₴250,000 - ₴500,000</option>
            <option value="500k+">₴500,000+</option>
          </select>
        </div>
      </div>
    `;

    // Insert before submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.insertAdjacentHTML('beforebegin', additionalFields);
    }

    // Add form analytics
    form.addEventListener('submit', (e) => {
      this.trackBusinessFormSubmission(form);
    });
  }

  trackBusinessFormSubmission(form) {
    const formData = new FormData(form);
    const data = {
      spaceType: formData.get('spaceType'),
      companySize: formData.get('companySize'),
      budgetRange: formData.get('budgetRange'),
      timestamp: Date.now()
    };

    // Track with analytics
    if (window.gtag) {
      window.gtag('event', 'business_inquiry_qualified', {
        event_category: 'lead_generation',
        event_label: data.spaceType,
        custom_parameters: data
      });
    }

    console.log('Business form submission:', data);
  }

  initializeCharts() {
    // Create mini charts for metrics if Chart.js is available
    if (typeof Chart !== 'undefined') {
      this.createMetricCharts();
    }
  }

  createMetricCharts() {
    // Implementation for Chart.js visualizations
    // This would create small charts showing metric trends over time
    console.log('Charts initialization placeholder');
  }

  // Public API methods
  getMetrics() {
    return { ...this.metrics };
  }

  getCaseStudies() {
    return [...this.caseStudies];
  }

  updateMetric(type, value) {
    if (this.metrics[type]) {
      this.metrics[type].current = value;
      this.refreshMetricDisplay(type);
    }
  }

  refreshMetricDisplay(type) {
    // Update specific metric display
    const statElement = document.querySelector(`[data-metric-type="${type}"]`);
    if (statElement) {
      this.animateMetric(statElement);
    }
  }
}

// ROI Metrics styles
const roiStyles = `
  .roi-tooltip {
    position: fixed;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 20px;
    max-width: 300px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .roi-tooltip.show {
    opacity: 1;
    transform: translateY(0);
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-light-gray);
  }

  .tooltip-header h4 {
    margin: 0;
    color: var(--color-primary);
    font-size: 16px;
  }

  .tooltip-trend {
    font-weight: bold;
    font-size: 14px;
  }

  .tooltip-trend.positive {
    color: var(--color-success);
  }

  .tooltip-trend.negative-good {
    color: var(--color-success);
  }

  .tooltip-body p {
    margin: 0 0 12px 0;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5;
  }

  .tooltip-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }

  .detail-label {
    color: var(--color-text-light);
  }

  .detail-value {
    font-weight: 600;
    color: var(--color-primary);
  }

  .case-studies-section {
    margin: 60px 0;
    text-align: center;
  }

  .case-studies-section h3 {
    margin-bottom: 40px;
    color: var(--color-primary);
  }

  .case-study-carousel {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: white;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  .case-study-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .case-study-card {
    min-width: 100%;
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 40px;
  }

  .case-study-image {
    position: relative;
    flex: 0 0 300px;
    height: 200px;
    border-radius: 12px;
    overflow: hidden;
  }

  .case-study-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .study-type-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--color-accent);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
  }

  .case-study-content {
    flex: 1;
    text-align: left;
  }

  .case-study-content h4 {
    margin: 0 0 16px 0;
    color: var(--color-primary);
    font-size: 24px;
  }

  .study-testimonial {
    font-style: italic;
    color: var(--color-text);
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 1.6;
  }

  .study-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .metric-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--color-off-white);
    border-radius: 8px;
  }

  .metric-label {
    font-size: 14px;
    color: var(--color-text);
  }

  .metric-value {
    font-weight: bold;
    font-size: 16px;
  }

  .metric-value.positive {
    color: var(--color-success);
  }

  .metric-value.negative {
    color: var(--color-error);
  }

  .carousel-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: var(--color-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .carousel-btn:hover {
    background: white;
    transform: scale(1.1);
  }

  .carousel-indicators {
    display: flex;
    gap: 8px;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator.active {
    background: white;
    transform: scale(1.2);
  }

  .roi-calculator-section {
    margin: 60px 0;
    padding: 40px;
    background: var(--color-off-white);
    border-radius: 16px;
  }

  .roi-calculator-section h3 {
    text-align: center;
    margin-bottom: 12px;
    color: var(--color-primary);
  }

  .roi-calculator-section > p {
    text-align: center;
    margin-bottom: 40px;
    color: var(--color-text);
  }

  .roi-calculator {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }

  .calculator-inputs {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-group label {
    font-weight: 600;
    color: var(--color-text);
    font-size: 14px;
  }

  .input-group input,
  .input-group select {
    padding: 12px;
    border: 2px solid var(--color-light-gray);
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
  }

  .input-group input:focus,
  .input-group select:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  .calculator-results {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .calculator-results h4 {
    margin: 0 0 24px 0;
    color: var(--color-primary);
    text-align: center;
  }

  .result-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--color-light-gray);
  }

  .result-item.total {
    border-bottom: none;
    padding-top: 20px;
    border-top: 2px solid var(--color-accent);
    font-weight: bold;
  }

  .result-label {
    color: var(--color-text);
    font-size: 14px;
  }

  .result-value {
    font-weight: bold;
    color: var(--color-success);
    font-size: 16px;
  }

  .roi-ratio {
    text-align: center;
    padding: 20px;
    background: var(--color-accent);
    color: white;
    border-radius: 8px;
    font-size: 18px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .case-study-card {
      flex-direction: column;
      text-align: center;
      gap: 20px;
      padding: 20px;
    }

    .case-study-image {
      flex: none;
      width: 100%;
      height: 150px;
    }

    .study-metrics {
      grid-template-columns: 1fr;
    }

    .roi-calculator {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }
`;

// Inject styles
const roiMetricsStyleSheetGlobal = document.createElement('style');
roiMetricsStyleSheetGlobal.textContent = roiStyles;
document.head.appendChild(roiMetricsStyleSheetGlobal);

// Initialize ROI metrics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.roiMetrics = new ROIMetrics();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROIMetrics;
}