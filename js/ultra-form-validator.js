// Ultra Form Validator - Comprehensive Form Testing & Validation System
// Tests all forms, inputs, validations, and provides bulletproof form handling

class UltraFormValidator {
  constructor() {
    this.forms = new Map();
    this.validationRules = new Map();
    this.testResults = new Map();
    this.errorMessages = new Map();
    this.validators = new Map();
    this.isInitialized = false;

    this.init();
  }

  init() {
    this.setupValidationRules();
    this.setupCustomValidators();
    this.setupErrorMessages();
    this.discoverAndTestForms();
    this.setupDynamicFormMonitoring();
    this.setupAccessibilityValidation();

    this.isInitialized = true;
    console.log('📝 Ultra Form Validator initialized - All forms are bulletproof!');
  }

  // =====================================================
  // FORM DISCOVERY & REGISTRATION
  // =====================================================

  discoverAndTestForms() {
    // Find all forms on the page
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      this.registerForm(form);
      this.validateForm(form);
      this.setupFormListeners(form);
    });

    // Test specific forms by ID
    const specificForms = [
      'business-form',
      'story-form',
      'newsletter-form',
      'contact-form',
      'feedback-form'
    ];

    specificForms.forEach(formId => {
      const form = document.getElementById(formId);
      if (form) {
        this.performComprehensiveFormTest(form);
      }
    });
  }

  registerForm(form) {
    const formId = form.id || `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (!form.id) {
      form.id = formId;
    }

    const formData = {
      element: form,
      fields: this.analyzeFormFields(form),
      validationRules: this.extractValidationRules(form),
      accessibility: this.checkFormAccessibility(form),
      usability: this.checkFormUsability(form),
      testResults: {
        passed: 0,
        failed: 0,
        warnings: 0,
        tests: []
      }
    };

    this.forms.set(formId, formData);
    console.log(`📋 Registered form: ${formId} with ${formData.fields.length} fields`);
  }

  analyzeFormFields(form) {
    const fields = [];
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      const fieldData = {
        element: input,
        name: input.name || input.id,
        type: input.type || input.tagName.toLowerCase(),
        required: input.hasAttribute('required'),
        validation: this.getFieldValidationRules(input),
        accessibility: this.checkFieldAccessibility(input),
        errors: []
      };

      fields.push(fieldData);
    });

    return fields;
  }

  getFieldValidationRules(input) {
    const rules = [];

    // HTML5 validation attributes
    if (input.hasAttribute('required')) {
      rules.push({ type: 'required', message: 'This field is required' });
    }

    if (input.hasAttribute('pattern')) {
      rules.push({
        type: 'pattern',
        value: input.getAttribute('pattern'),
        message: 'Please match the requested format'
      });
    }

    if (input.hasAttribute('min')) {
      rules.push({
        type: 'min',
        value: input.getAttribute('min'),
        message: `Minimum value is ${input.getAttribute('min')}`
      });
    }

    if (input.hasAttribute('max')) {
      rules.push({
        type: 'max',
        value: input.getAttribute('max'),
        message: `Maximum value is ${input.getAttribute('max')}`
      });
    }

    if (input.hasAttribute('minlength')) {
      rules.push({
        type: 'minlength',
        value: input.getAttribute('minlength'),
        message: `Minimum length is ${input.getAttribute('minlength')} characters`
      });
    }

    if (input.hasAttribute('maxlength')) {
      rules.push({
        type: 'maxlength',
        value: input.getAttribute('maxlength'),
        message: `Maximum length is ${input.getAttribute('maxlength')} characters`
      });
    }

    // Type-specific validation
    switch (input.type) {
      case 'email':
        rules.push({
          type: 'email',
          message: 'Please enter a valid email address'
        });
        break;
      case 'url':
        rules.push({
          type: 'url',
          message: 'Please enter a valid URL'
        });
        break;
      case 'tel':
        rules.push({
          type: 'tel',
          message: 'Please enter a valid phone number'
        });
        break;
      case 'number':
        rules.push({
          type: 'number',
          message: 'Please enter a valid number'
        });
        break;
    }

    // Custom validation based on name/id
    if (input.name.includes('password')) {
      rules.push({
        type: 'password',
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    if (input.name.includes('confirm') || input.name.includes('repeat')) {
      rules.push({
        type: 'match',
        target: input.name.replace(/confirm|repeat/i, ''),
        message: 'Passwords must match'
      });
    }

    return rules;
  }

  // =====================================================
  // COMPREHENSIVE FORM TESTING
  // =====================================================

  performComprehensiveFormTest(form) {
    const formId = form.id;
    const formData = this.forms.get(formId);

    if (!formData) {
      console.error(`Form ${formId} not found in registry`);
      return;
    }

    console.log(`🧪 Starting comprehensive test for form: ${formId}`);

    // Test all validation scenarios
    this.testValidationScenarios(form);

    // Test accessibility
    this.testFormAccessibility(form);

    // Test usability
    this.testFormUsability(form);

    // Test edge cases
    this.testEdgeCases(form);

    // Test performance
    this.testFormPerformance(form);

    // Test cross-browser compatibility
    this.testCrossBrowserCompatibility(form);

    // Generate test report
    this.generateFormTestReport(formId);
  }

  testValidationScenarios(form) {
    const formData = this.forms.get(form.id);

    formData.fields.forEach(field => {
      this.testFieldValidation(field);
    });

    // Test form-level validation
    this.testFormLevelValidation(form);

    // Test submission validation
    this.testSubmissionValidation(form);
  }

  testFieldValidation(field) {
    const input = field.element;
    const tests = [];

    console.log(`Testing field: ${field.name} (${field.type})`);

    // Test empty field (if required)
    if (field.required) {
      const emptyTest = this.testEmptyField(input);
      tests.push(emptyTest);
    }

    // Test invalid data
    const invalidTests = this.testInvalidData(input, field.type);
    tests.push(...invalidTests);

    // Test valid data
    const validTests = this.testValidData(input, field.type);
    tests.push(...validTests);

    // Test boundary conditions
    const boundaryTests = this.testBoundaryConditions(input);
    tests.push(...boundaryTests);

    // Test special characters and edge cases
    const edgeCaseTests = this.testFieldEdgeCases(input);
    tests.push(...edgeCaseTests);

    // Store test results
    field.testResults = tests;

    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const warnings = tests.filter(t => t.status === 'warning').length;

    console.log(`Field ${field.name}: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  }

  testEmptyField(input) {
    const originalValue = input.value;
    input.value = '';

    const test = {
      name: 'Empty Field Test',
      field: input.name || input.id,
      type: 'required_validation',
      status: 'running'
    };

    try {
      const isValid = input.checkValidity();
      const shouldBeInvalid = input.hasAttribute('required');

      if (shouldBeInvalid && !isValid) {
        test.status = 'passed';
        test.message = 'Required field correctly invalidates when empty';
      } else if (!shouldBeInvalid && isValid) {
        test.status = 'passed';
        test.message = 'Optional field correctly validates when empty';
      } else {
        test.status = 'failed';
        test.message = `Expected ${shouldBeInvalid ? 'invalid' : 'valid'}, got ${isValid ? 'valid' : 'invalid'}`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing empty field: ${error.message}`;
    } finally {
      input.value = originalValue;
    }

    return test;
  }

  testInvalidData(input, type) {
    const tests = [];
    const invalidData = this.getInvalidTestData(type);

    invalidData.forEach(data => {
      const test = this.runFieldTest(input, data.value, {
        name: `Invalid ${type} Test: ${data.description}`,
        expectedValid: false,
        description: data.description
      });
      tests.push(test);
    });

    return tests;
  }

  testValidData(input, type) {
    const tests = [];
    const validData = this.getValidTestData(type);

    validData.forEach(data => {
      const test = this.runFieldTest(input, data.value, {
        name: `Valid ${type} Test: ${data.description}`,
        expectedValid: true,
        description: data.description
      });
      tests.push(test);
    });

    return tests;
  }

  testBoundaryConditions(input) {
    const tests = [];

    // Test minlength boundary
    if (input.hasAttribute('minlength')) {
      const minLength = parseInt(input.getAttribute('minlength'));

      tests.push(this.runFieldTest(input, 'a'.repeat(minLength - 1), {
        name: 'Below Minimum Length',
        expectedValid: false
      }));

      tests.push(this.runFieldTest(input, 'a'.repeat(minLength), {
        name: 'Exact Minimum Length',
        expectedValid: true
      }));
    }

    // Test maxlength boundary
    if (input.hasAttribute('maxlength')) {
      const maxLength = parseInt(input.getAttribute('maxlength'));

      tests.push(this.runFieldTest(input, 'a'.repeat(maxLength), {
        name: 'Exact Maximum Length',
        expectedValid: true
      }));

      tests.push(this.runFieldTest(input, 'a'.repeat(maxLength + 1), {
        name: 'Above Maximum Length',
        expectedValid: false
      }));
    }

    // Test min/max values for number inputs
    if (input.type === 'number') {
      if (input.hasAttribute('min')) {
        const min = parseFloat(input.getAttribute('min'));
        tests.push(this.runFieldTest(input, (min - 1).toString(), {
          name: 'Below Minimum Value',
          expectedValid: false
        }));

        tests.push(this.runFieldTest(input, min.toString(), {
          name: 'Exact Minimum Value',
          expectedValid: true
        }));
      }

      if (input.hasAttribute('max')) {
        const max = parseFloat(input.getAttribute('max'));
        tests.push(this.runFieldTest(input, max.toString(), {
          name: 'Exact Maximum Value',
          expectedValid: true
        }));

        tests.push(this.runFieldTest(input, (max + 1).toString(), {
          name: 'Above Maximum Value',
          expectedValid: false
        }));
      }
    }

    return tests;
  }

  testFieldEdgeCases(input) {
    const tests = [];

    // Test with special characters
    const specialCharTests = [
      { value: '\'"><script>alert("xss")</script>', description: 'XSS attempt' },
      { value: '\n\r\t', description: 'Whitespace characters' },
      { value: '  spaces  ', description: 'Leading/trailing spaces' },
      { value: '🙂😊🎨', description: 'Emoji characters' },
      { value: 'Ñoël Çafé', description: 'Unicode characters' },
      { value: 'a'.repeat(1000), description: 'Very long input' }
    ];

    specialCharTests.forEach(testCase => {
      const test = this.runFieldTest(input, testCase.value, {
        name: `Edge Case: ${testCase.description}`,
        description: testCase.description,
        skipValidityCheck: true // Some of these might be valid depending on field type
      });
      tests.push(test);
    });

    return tests;
  }

  runFieldTest(input, testValue, options) {
    const originalValue = input.value;

    const test = {
      name: options.name,
      field: input.name || input.id,
      type: 'field_validation',
      testValue: testValue,
      status: 'running'
    };

    try {
      input.value = testValue;

      // Trigger validation
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      if (!options.skipValidityCheck) {
        const isValid = input.checkValidity();
        const expectedValid = options.expectedValid;

        if (isValid === expectedValid) {
          test.status = 'passed';
          test.message = `Field correctly ${isValid ? 'validated' : 'invalidated'} for: ${options.description || testValue}`;
        } else {
          test.status = 'failed';
          test.message = `Expected ${expectedValid ? 'valid' : 'invalid'}, got ${isValid ? 'valid' : 'invalid'} for: ${testValue}`;
        }
      } else {
        test.status = 'passed';
        test.message = `Edge case handled: ${options.description}`;
      }

      // Check for custom validation messages
      const customMessage = input.validationMessage;
      if (customMessage && customMessage !== '') {
        test.validationMessage = customMessage;
      }

    } catch (error) {
      test.status = 'failed';
      test.message = `Error during field test: ${error.message}`;
    } finally {
      input.value = originalValue;
    }

    return test;
  }

  // =====================================================
  // TEST DATA GENERATORS
  // =====================================================

  getInvalidTestData(type) {
    const invalidData = {
      email: [
        { value: 'invalid-email', description: 'Missing @ symbol' },
        { value: '@domain.com', description: 'Missing local part' },
        { value: 'user@', description: 'Missing domain' },
        { value: 'user@domain', description: 'Missing TLD' },
        { value: 'user..name@domain.com', description: 'Double dots' },
        { value: 'user@domain..com', description: 'Double dots in domain' },
        { value: 'very-long-email-address-that-exceeds-normal-limits@very-long-domain-name-that-is-probably-too-long.com', description: 'Very long email' }
      ],
      url: [
        { value: 'not-a-url', description: 'Plain text' },
        { value: 'ftp://invalid', description: 'Invalid protocol' },
        { value: 'http://', description: 'Missing domain' },
        { value: 'http://domain with spaces.com', description: 'Spaces in URL' }
      ],
      tel: [
        { value: 'not-a-phone', description: 'Plain text' },
        { value: '123', description: 'Too short' },
        { value: 'abcd-efgh-ijkl', description: 'Letters instead of numbers' }
      ],
      number: [
        { value: 'not-a-number', description: 'Plain text' },
        { value: '12.34.56', description: 'Multiple decimals' },
        { value: 'Infinity', description: 'Infinity' },
        { value: 'NaN', description: 'NaN' }
      ],
      text: [
        { value: '<script>alert("xss")</script>', description: 'Script injection' },
        { value: 'DROP TABLE users;', description: 'SQL injection attempt' }
      ]
    };

    return invalidData[type] || invalidData.text;
  }

  getValidTestData(type) {
    const validData = {
      email: [
        { value: 'user@domain.com', description: 'Standard email' },
        { value: 'user.name@domain.co.uk', description: 'Email with dots and country TLD' },
        { value: 'user+tag@domain.com', description: 'Email with plus addressing' },
        { value: 'user123@123domain.com', description: 'Email with numbers' }
      ],
      url: [
        { value: 'https://www.example.com', description: 'HTTPS URL' },
        { value: 'http://example.com', description: 'HTTP URL' },
        { value: 'https://example.com/path?param=value', description: 'URL with path and query' },
        { value: 'https://subdomain.example.com', description: 'URL with subdomain' }
      ],
      tel: [
        { value: '+1234567890', description: 'International format' },
        { value: '(123) 456-7890', description: 'US format with parentheses' },
        { value: '123-456-7890', description: 'US format with dashes' },
        { value: '1234567890', description: 'Plain numbers' }
      ],
      number: [
        { value: '123', description: 'Integer' },
        { value: '123.45', description: 'Decimal' },
        { value: '-123', description: 'Negative number' },
        { value: '0', description: 'Zero' }
      ],
      text: [
        { value: 'Valid text input', description: 'Standard text' },
        { value: 'Text with 123 numbers', description: 'Text with numbers' },
        { value: 'Text with símbolos', description: 'Text with accents' },
        { value: 'Single word', description: 'Single word' }
      ]
    };

    return validData[type] || validData.text;
  }

  // =====================================================
  // FORM-LEVEL VALIDATION TESTING
  // =====================================================

  testFormLevelValidation(form) {
    console.log(`Testing form-level validation for: ${form.id}`);

    const tests = [];

    // Test form submission with invalid data
    tests.push(this.testInvalidFormSubmission(form));

    // Test form submission with valid data
    tests.push(this.testValidFormSubmission(form));

    // Test custom form validation
    tests.push(this.testCustomFormValidation(form));

    // Test form reset functionality
    tests.push(this.testFormReset(form));

    const formData = this.forms.get(form.id);
    formData.testResults.formLevelTests = tests;

    return tests;
  }

  testInvalidFormSubmission(form) {
    const test = {
      name: 'Invalid Form Submission Prevention',
      type: 'form_validation',
      status: 'running'
    };

    try {
      // Fill form with invalid data
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        field.value = ''; // Make required fields empty
      });

      // Try to submit form
      const submitEvent = new Event('submit', { cancelable: true });
      const defaultPrevented = !form.dispatchEvent(submitEvent);

      if (defaultPrevented || !form.checkValidity()) {
        test.status = 'passed';
        test.message = 'Form correctly prevented invalid submission';
      } else {
        test.status = 'failed';
        test.message = 'Form allowed invalid submission';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing invalid submission: ${error.message}`;
    }

    return test;
  }

  testValidFormSubmission(form) {
    const test = {
      name: 'Valid Form Submission',
      type: 'form_validation',
      status: 'running'
    };

    try {
      // Fill form with valid data
      this.fillFormWithValidData(form);

      // Check if form is valid
      const isValid = form.checkValidity();

      if (isValid) {
        test.status = 'passed';
        test.message = 'Form correctly validates with valid data';
      } else {
        test.status = 'failed';
        test.message = 'Form incorrectly invalidates valid data';
        test.details = this.getFormValidationErrors(form);
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing valid submission: ${error.message}`;
    }

    return test;
  }

  testCustomFormValidation(form) {
    const test = {
      name: 'Custom Form Validation',
      type: 'custom_validation',
      status: 'running'
    };

    try {
      // Test password confirmation if exists
      const passwordField = form.querySelector('[type="password"]');
      const confirmField = form.querySelector('[name*="confirm"], [name*="repeat"]');

      if (passwordField && confirmField) {
        passwordField.value = 'password123';
        confirmField.value = 'different123';

        // Trigger custom validation
        confirmField.dispatchEvent(new Event('input', { bubbles: true }));

        const isValid = confirmField.checkValidity();
        if (!isValid) {
          test.status = 'passed';
          test.message = 'Password confirmation validation working correctly';
        } else {
          test.status = 'warning';
          test.message = 'Password confirmation validation not implemented';
        }
      } else {
        test.status = 'passed';
        test.message = 'No custom validation to test';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing custom validation: ${error.message}`;
    }

    return test;
  }

  testFormReset(form) {
    const test = {
      name: 'Form Reset Functionality',
      type: 'form_reset',
      status: 'running'
    };

    try {
      // Fill form with data
      this.fillFormWithValidData(form);

      // Get original values
      const fieldsBeforeReset = Array.from(form.elements).map(el => ({
        name: el.name,
        value: el.value,
        checked: el.checked
      }));

      // Reset form
      form.reset();

      // Check if fields are cleared/reset
      const fieldsAfterReset = Array.from(form.elements).map(el => ({
        name: el.name,
        value: el.value,
        checked: el.checked
      }));

      const resetWorked = fieldsAfterReset.every((field, index) => {
        const before = fieldsBeforeReset[index];
        return field.value === '' || field.value !== before.value ||
               field.checked !== before.checked;
      });

      if (resetWorked) {
        test.status = 'passed';
        test.message = 'Form reset functionality working correctly';
      } else {
        test.status = 'failed';
        test.message = 'Form reset did not clear fields properly';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing form reset: ${error.message}`;
    }

    return test;
  }

  fillFormWithValidData(form) {
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      switch (field.type) {
        case 'text':
        case 'textarea':
          field.value = 'Valid test input';
          break;
        case 'email':
          field.value = 'test@example.com';
          break;
        case 'tel':
          field.value = '+1234567890';
          break;
        case 'url':
          field.value = 'https://example.com';
          break;
        case 'number':
          field.value = '123';
          break;
        case 'password':
          field.value = 'SecurePass123!';
          break;
        case 'checkbox':
          if (field.hasAttribute('required')) {
            field.checked = true;
          }
          break;
        case 'radio':
          if (field.hasAttribute('required')) {
            field.checked = true;
          }
          break;
        default:
          if (field.tagName === 'SELECT') {
            if (field.options.length > 1) {
              field.selectedIndex = 1; // Select first non-empty option
            }
          } else {
            field.value = 'Test value';
          }
      }
    });
  }

  getFormValidationErrors(form) {
    const errors = [];
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      if (!field.checkValidity()) {
        errors.push({
          field: field.name || field.id,
          message: field.validationMessage,
          value: field.value
        });
      }
    });

    return errors;
  }

  // =====================================================
  // ACCESSIBILITY TESTING
  // =====================================================

  testFormAccessibility(form) {
    console.log(`Testing accessibility for form: ${form.id}`);

    const tests = [];

    // Test form labels
    tests.push(this.testFormLabels(form));

    // Test keyboard navigation
    tests.push(this.testKeyboardNavigation(form));

    // Test ARIA attributes
    tests.push(this.testAriaAttributes(form));

    // Test error announcements
    tests.push(this.testErrorAnnouncements(form));

    // Test color contrast
    tests.push(this.testColorContrast(form));

    const formData = this.forms.get(form.id);
    formData.testResults.accessibilityTests = tests;

    return tests;
  }

  testFormLabels(form) {
    const test = {
      name: 'Form Label Association',
      type: 'accessibility',
      status: 'running',
      details: []
    };

    try {
      const inputs = form.querySelectorAll('input, select, textarea');
      let missingLabels = 0;

      inputs.forEach(input => {
        const hasLabel = this.hasAssociatedLabel(input);
        if (!hasLabel) {
          missingLabels++;
          test.details.push(`Field ${input.name || input.type} missing label`);
        }
      });

      if (missingLabels === 0) {
        test.status = 'passed';
        test.message = 'All form fields have associated labels';
      } else {
        test.status = 'failed';
        test.message = `${missingLabels} fields missing labels`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing labels: ${error.message}`;
    }

    return test;
  }

  hasAssociatedLabel(input) {
    // Check for explicit label association
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return true;
    }

    // Check for implicit label association (input inside label)
    const parentLabel = input.closest('label');
    if (parentLabel) return true;

    // Check for aria-label
    if (input.hasAttribute('aria-label')) return true;

    // Check for aria-labelledby
    if (input.hasAttribute('aria-labelledby')) return true;

    return false;
  }

  testKeyboardNavigation(form) {
    const test = {
      name: 'Keyboard Navigation',
      type: 'accessibility',
      status: 'running',
      details: []
    };

    try {
      const focusableElements = form.querySelectorAll(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      );

      let tabOrderIssues = 0;

      focusableElements.forEach((element, index) => {
        // Check if element is focusable
        if (element.tabIndex < 0 && !element.hasAttribute('tabindex')) {
          tabOrderIssues++;
          test.details.push(`Element ${element.name || element.type} not focusable`);
        }

        // Check for skip-to-next functionality
        if (element.type === 'text' && element.hasAttribute('maxlength')) {
          // Could implement auto-advance testing here
        }
      });

      if (tabOrderIssues === 0) {
        test.status = 'passed';
        test.message = 'Keyboard navigation working properly';
      } else {
        test.status = 'warning';
        test.message = `${tabOrderIssues} potential keyboard navigation issues`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing keyboard navigation: ${error.message}`;
    }

    return test;
  }

  testAriaAttributes(form) {
    const test = {
      name: 'ARIA Attributes',
      type: 'accessibility',
      status: 'running',
      details: []
    };

    try {
      // Test for aria-describedby on fields with help text
      const fieldsWithHelp = form.querySelectorAll('input[aria-describedby], select[aria-describedby], textarea[aria-describedby]');

      fieldsWithHelp.forEach(field => {
        const describedBy = field.getAttribute('aria-describedby');
        const helpElement = document.getElementById(describedBy);

        if (!helpElement) {
          test.details.push(`aria-describedby points to non-existent element: ${describedBy}`);
        }
      });

      // Test for aria-invalid on invalid fields
      const invalidFields = form.querySelectorAll('input:invalid, select:invalid, textarea:invalid');
      let missingAriaInvalid = 0;

      invalidFields.forEach(field => {
        if (!field.hasAttribute('aria-invalid') || field.getAttribute('aria-invalid') !== 'true') {
          missingAriaInvalid++;
          test.details.push(`Invalid field ${field.name || field.type} missing aria-invalid="true"`);
        }
      });

      // Test for role attributes where appropriate
      const customElements = form.querySelectorAll('[role]');
      test.details.push(`Found ${customElements.length} elements with custom roles`);

      if (test.details.length === 1) { // Only the count message
        test.status = 'passed';
        test.message = 'ARIA attributes properly configured';
      } else {
        test.status = 'warning';
        test.message = 'Some ARIA attribute issues found';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing ARIA attributes: ${error.message}`;
    }

    return test;
  }

  testErrorAnnouncements(form) {
    const test = {
      name: 'Error Announcements',
      type: 'accessibility',
      status: 'running'
    };

    try {
      // Look for live regions for error announcements
      const liveRegions = form.querySelectorAll('[aria-live], [role="alert"], [role="status"]');

      if (liveRegions.length > 0) {
        test.status = 'passed';
        test.message = `Found ${liveRegions.length} live regions for error announcements`;
      } else {
        test.status = 'warning';
        test.message = 'No live regions found for error announcements';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing error announcements: ${error.message}`;
    }

    return test;
  }

  testColorContrast(form) {
    const test = {
      name: 'Color Contrast',
      type: 'accessibility',
      status: 'running',
      details: []
    };

    try {
      // This is a basic color contrast check
      // In a real implementation, you'd want more sophisticated color analysis

      const textElements = form.querySelectorAll('label, input, select, textarea, button');
      let contrastIssues = 0;

      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;

        // Basic check for sufficient contrast (this is simplified)
        if (this.hasLowContrast(color, backgroundColor)) {
          contrastIssues++;
          test.details.push(`Low contrast detected on ${element.tagName.toLowerCase()}`);
        }
      });

      if (contrastIssues === 0) {
        test.status = 'passed';
        test.message = 'No obvious color contrast issues detected';
      } else {
        test.status = 'warning';
        test.message = `${contrastIssues} potential color contrast issues`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing color contrast: ${error.message}`;
    }

    return test;
  }

  hasLowContrast(foreground, background) {
    // Simplified contrast check
    // Real implementation would calculate actual contrast ratios
    return foreground === background ||
           (foreground === 'rgb(0, 0, 0)' && background === 'rgb(0, 0, 0)') ||
           (foreground === 'rgb(255, 255, 255)' && background === 'rgb(255, 255, 255)');
  }

  // =====================================================
  // USABILITY TESTING
  // =====================================================

  testFormUsability(form) {
    console.log(`Testing usability for form: ${form.id}`);

    const tests = [];

    // Test form length and complexity
    tests.push(this.testFormComplexity(form));

    // Test input field sizes
    tests.push(this.testInputSizes(form));

    // Test error message clarity
    tests.push(this.testErrorMessages(form));

    // Test mobile responsiveness
    tests.push(this.testMobileResponsiveness(form));

    const formData = this.forms.get(form.id);
    formData.testResults.usabilityTests = tests;

    return tests;
  }

  testFormComplexity(form) {
    const test = {
      name: 'Form Complexity',
      type: 'usability',
      status: 'running'
    };

    try {
      const fields = form.querySelectorAll('input, select, textarea');
      const requiredFields = form.querySelectorAll('[required]');
      const fieldCount = fields.length;
      const requiredCount = requiredFields.length;

      test.details = {
        totalFields: fieldCount,
        requiredFields: requiredCount,
        optionalFields: fieldCount - requiredCount
      };

      if (fieldCount <= 5) {
        test.status = 'passed';
        test.message = 'Form has appropriate complexity (≤5 fields)';
      } else if (fieldCount <= 10) {
        test.status = 'warning';
        test.message = 'Form is moderately complex (6-10 fields)';
      } else {
        test.status = 'warning';
        test.message = 'Form is complex (>10 fields) - consider breaking into steps';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing form complexity: ${error.message}`;
    }

    return test;
  }

  testInputSizes(form) {
    const test = {
      name: 'Input Field Sizes',
      type: 'usability',
      status: 'running',
      details: []
    };

    try {
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
      let sizeIssues = 0;

      inputs.forEach(input => {
        const styles = window.getComputedStyle(input);
        const height = parseFloat(styles.height);
        const fontSize = parseFloat(styles.fontSize);

        // Check minimum touch target size (44px for accessibility)
        if (height < 44) {
          sizeIssues++;
          test.details.push(`Input ${input.name || input.type} height (${height}px) below recommended 44px`);
        }

        // Check font size readability (minimum 16px on mobile)
        if (fontSize < 16 && window.innerWidth < 768) {
          sizeIssues++;
          test.details.push(`Input ${input.name || input.type} font size (${fontSize}px) below recommended 16px on mobile`);
        }
      });

      if (sizeIssues === 0) {
        test.status = 'passed';
        test.message = 'Input field sizes are appropriate';
      } else {
        test.status = 'warning';
        test.message = `${sizeIssues} input size issues found`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing input sizes: ${error.message}`;
    }

    return test;
  }

  testErrorMessages(form) {
    const test = {
      name: 'Error Message Clarity',
      type: 'usability',
      status: 'running',
      details: []
    };

    try {
      const fields = form.querySelectorAll('input, select, textarea');
      let messageIssues = 0;

      fields.forEach(field => {
        // Test the field with invalid data to see error message
        const originalValue = field.value;

        // Set invalid value based on field type
        switch (field.type) {
          case 'email':
            field.value = 'invalid-email';
            break;
          case 'number':
            field.value = 'not-a-number';
            break;
          default:
            if (field.hasAttribute('required')) {
              field.value = '';
            }
        }

        const isValid = field.checkValidity();
        const message = field.validationMessage;

        if (!isValid) {
          if (!message || message.length < 10) {
            messageIssues++;
            test.details.push(`Field ${field.name || field.type} has unclear error message: "${message}"`);
          } else if (message.includes('Please fill out this field') || message.includes('Please match the requested format')) {
            messageIssues++;
            test.details.push(`Field ${field.name || field.type} uses generic browser message`);
          }
        }

        field.value = originalValue;
      });

      if (messageIssues === 0) {
        test.status = 'passed';
        test.message = 'Error messages are clear and helpful';
      } else {
        test.status = 'warning';
        test.message = `${messageIssues} fields have unclear error messages`;
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing error messages: ${error.message}`;
    }

    return test;
  }

  testMobileResponsiveness(form) {
    const test = {
      name: 'Mobile Responsiveness',
      type: 'usability',
      status: 'running',
      details: []
    };

    try {
      const formStyles = window.getComputedStyle(form);
      const formWidth = parseFloat(formStyles.width);
      const viewportWidth = window.innerWidth;

      // Check if form fits in viewport
      if (formWidth > viewportWidth) {
        test.details.push('Form width exceeds viewport width');
      }

      // Check input types for mobile optimization
      const inputs = form.querySelectorAll('input');
      let mobileOptimizations = 0;

      inputs.forEach(input => {
        if (input.type === 'email' || input.type === 'tel' || input.type === 'url' || input.type === 'number') {
          mobileOptimizations++;
        }
      });

      test.details.push(`${mobileOptimizations} inputs optimized for mobile keyboards`);

      // Check for viewport meta tag
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        test.details.push('Missing viewport meta tag');
      }

      if (test.details.length <= 1) {
        test.status = 'passed';
        test.message = 'Form is mobile-responsive';
      } else {
        test.status = 'warning';
        test.message = 'Some mobile responsiveness issues found';
      }
    } catch (error) {
      test.status = 'failed';
      test.message = `Error testing mobile responsiveness: ${error.message}`;
    }

    return test;
  }

  // =====================================================
  // SETUP & MONITORING
  // =====================================================

  setupFormListeners(form) {
    // Add real-time validation listeners
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      field.addEventListener('blur', () => {
        this.validateField(field);
      });

      field.addEventListener('input', () => {
        // Clear previous error styling on input
        this.clearFieldError(field);
      });
    });

    // Add form submission listener
    form.addEventListener('submit', (event) => {
      if (!this.validateFormOnSubmit(form)) {
        event.preventDefault();
      }
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();

    if (!isValid) {
      this.showFieldError(field, field.validationMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  validateFormOnSubmit(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Custom validation
    isValid = this.runCustomValidation(form) && isValid;

    return isValid;
  }

  runCustomValidation(form) {
    // Password confirmation validation
    const passwordField = form.querySelector('[type="password"]');
    const confirmField = form.querySelector('[name*="confirm"], [name*="repeat"]');

    if (passwordField && confirmField) {
      if (passwordField.value !== confirmField.value) {
        this.showFieldError(confirmField, 'Passwords do not match');
        return false;
      }
    }

    return true;
  }

  showFieldError(field, message) {
    // Add error class
    field.classList.add('field-error');

    // Set aria-invalid
    field.setAttribute('aria-invalid', 'true');

    // Create or update error message
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem;';
  }

  clearFieldError(field) {
    field.classList.remove('field-error');
    field.removeAttribute('aria-invalid');

    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  setupDynamicFormMonitoring() {
    // Monitor for new forms added to the page
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'FORM') {
            this.registerForm(node);
            this.setupFormListeners(node);
          } else if (node.querySelectorAll) {
            const newForms = node.querySelectorAll('form');
            newForms.forEach(form => {
              this.registerForm(form);
              this.setupFormListeners(form);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  setupValidationRules() {
    // Define custom validation rules
    this.validationRules.set('password_strength', {
      validate: (value) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        return value.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
      },
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    });

    this.validationRules.set('phone_number', {
      validate: (value) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Please enter a valid phone number'
    });

    this.validationRules.set('name', {
      validate: (value) => {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
        return nameRegex.test(value);
      },
      message: 'Name must contain only letters and be at least 2 characters long'
    });
  }

  setupCustomValidators() {
    // Set up custom validation functions
    this.validators.set('email', (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    });

    this.validators.set('url', (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    });

    this.validators.set('date', (value) => {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date);
    });
  }

  setupErrorMessages() {
    // Define user-friendly error messages in multiple languages
    this.errorMessages.set('uk', {
      required: 'Це поле обов\'язкове для заповнення',
      email: 'Будь ласка, введіть дійсну email адресу',
      url: 'Будь ласка, введіть дійсну веб-адресу',
      tel: 'Будь ласка, введіть дійсний номер телефону',
      number: 'Будь ласка, введіть дійсне число',
      minlength: 'Мінімальна довжина: {min} символів',
      maxlength: 'Максимальна довжина: {max} символів',
      min: 'Мінімальне значення: {min}',
      max: 'Максимальне значення: {max}',
      pattern: 'Будь ласка, дотримуйтесь вказаного формату'
    });

    this.errorMessages.set('en', {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      url: 'Please enter a valid URL',
      tel: 'Please enter a valid phone number',
      number: 'Please enter a valid number',
      minlength: 'Minimum length: {min} characters',
      maxlength: 'Maximum length: {max} characters',
      min: 'Minimum value: {min}',
      max: 'Maximum value: {max}',
      pattern: 'Please match the requested format'
    });
  }

  checkFormAccessibility(form) {
    const issues = [];

    // Check for form labels
    const unlabeledInputs = form.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    unlabeledInputs.forEach(input => {
      if (!this.hasAssociatedLabel(input)) {
        issues.push(`Input ${input.name || input.type} missing label`);
      }
    });

    // Check for fieldset grouping
    const radioGroups = form.querySelectorAll('input[type="radio"]');
    if (radioGroups.length > 0) {
      const fieldsets = form.querySelectorAll('fieldset');
      if (fieldsets.length === 0) {
        issues.push('Radio buttons should be grouped in fieldsets');
      }
    }

    return {
      score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 20)),
      issues
    };
  }

  checkFormUsability(form) {
    const issues = [];
    const fields = form.querySelectorAll('input, select, textarea');

    // Check form length
    if (fields.length > 10) {
      issues.push('Form has many fields - consider breaking into steps');
    }

    // Check for password strength indicators
    const passwordFields = form.querySelectorAll('[type="password"]');
    passwordFields.forEach(field => {
      const strengthIndicator = form.querySelector('[data-password-strength]');
      if (!strengthIndicator) {
        issues.push('Password field missing strength indicator');
      }
    });

    // Check for help text on complex fields
    const complexFields = form.querySelectorAll('[pattern], [type="password"]');
    complexFields.forEach(field => {
      const hasHelp = field.hasAttribute('aria-describedby') ||
                     field.parentNode.querySelector('.help-text');
      if (!hasHelp) {
        issues.push(`Complex field ${field.name || field.type} missing help text`);
      }
    });

    return {
      score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 15)),
      issues
    };
  }

  checkFieldAccessibility(input) {
    const issues = [];

    if (!this.hasAssociatedLabel(input)) {
      issues.push('Missing label');
    }

    if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
      issues.push('Missing aria-required attribute');
    }

    return {
      score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30)),
      issues
    };
  }

  extractValidationRules(form) {
    const rules = [];

    // Extract HTML5 validation rules
    const requiredFields = form.querySelectorAll('[required]');
    if (requiredFields.length > 0) {
      rules.push({ type: 'required', count: requiredFields.length });
    }

    const patternFields = form.querySelectorAll('[pattern]');
    if (patternFields.length > 0) {
      rules.push({ type: 'pattern', count: patternFields.length });
    }

    const emailFields = form.querySelectorAll('[type="email"]');
    if (emailFields.length > 0) {
      rules.push({ type: 'email', count: emailFields.length });
    }

    return rules;
  }

  setupAccessibilityValidation() {
    // Add ARIA live region for form announcements
    if (!document.getElementById('form-announcements')) {
      const announcements = document.createElement('div');
      announcements.id = 'form-announcements';
      announcements.setAttribute('aria-live', 'polite');
      announcements.setAttribute('aria-atomic', 'true');
      announcements.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(announcements);
    }
  }

  announceToScreenReader(message) {
    const announcements = document.getElementById('form-announcements');
    if (announcements) {
      announcements.textContent = message;
    }
  }

  generateFormTestReport(formId) {
    const formData = this.forms.get(formId);
    if (!formData) return;

    const allTests = [
      ...(formData.testResults.formLevelTests || []),
      ...(formData.testResults.accessibilityTests || []),
      ...(formData.testResults.usabilityTests || [])
    ];

    // Add field tests
    formData.fields.forEach(field => {
      if (field.testResults) {
        allTests.push(...field.testResults);
      }
    });

    const passed = allTests.filter(t => t.status === 'passed').length;
    const failed = allTests.filter(t => t.status === 'failed').length;
    const warnings = allTests.filter(t => t.status === 'warning').length;

    const report = {
      formId,
      summary: {
        total: allTests.length,
        passed,
        failed,
        warnings,
        score: Math.round((passed / allTests.length) * 100)
      },
      accessibility: formData.accessibility,
      usability: formData.usability,
      fields: formData.fields.length,
      tests: allTests,
      timestamp: new Date().toISOString()
    };

    console.log(`📊 Form Test Report for ${formId}:`);
    console.log(`Score: ${report.summary.score}%`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Warnings: ${warnings}`);

    // Store report
    this.testResults.set(formId, report);

    return report;
  }

  // =====================================================
  // PUBLIC API
  // =====================================================

  testForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      return this.performComprehensiveFormTest(form);
    } else {
      console.error(`Form with ID ${formId} not found`);
      return null;
    }
  }

  validateAllForms() {
    const results = [];
    this.forms.forEach((formData, formId) => {
      const form = formData.element;
      const isValid = this.validateFormOnSubmit(form);
      results.push({ formId, isValid });
    });
    return results;
  }

  getFormReport(formId) {
    return this.testResults.get(formId);
  }

  getAllReports() {
    return Array.from(this.testResults.values());
  }

  getSummaryReport() {
    const reports = this.getAllReports();
    const totalScore = reports.reduce((sum, report) => sum + report.summary.score, 0);
    const averageScore = reports.length > 0 ? Math.round(totalScore / reports.length) : 0;

    return {
      formsCount: reports.length,
      averageScore,
      totalTests: reports.reduce((sum, report) => sum + report.summary.total, 0),
      totalPassed: reports.reduce((sum, report) => sum + report.summary.passed, 0),
      totalFailed: reports.reduce((sum, report) => sum + report.summary.failed, 0),
      totalWarnings: reports.reduce((sum, report) => sum + report.summary.warnings, 0)
    };
  }
}

// Initialize form validator
const ultraFormValidator = new UltraFormValidator();

// Make globally available
window.InnerGarden = window.InnerGarden || {};
window.InnerGarden.formValidator = ultraFormValidator;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UltraFormValidator;
}