/**
 * WEB STUDIO 46 — Multi-Step Project Enquiry Form Wizard
 * Founder: Sangiv VP
 * 
 * Features:
 * - 4-step interactive enquiry flow (Details -> Service -> Scope -> Review)
 * - Strict client-side validation with instant visual feedback
 * - URL query parameter pre-filling support (e.g. from Cost Estimator)
 * - Duplicate submission prevention and loading state
 * - AJAX POST to /api/enquiry with graceful error/success handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnquiryWizard();
});

function initEnquiryWizard() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 4;

  // DOM Elements
  const stepElements = {
    1: document.getElementById('step1'),
    2: document.getElementById('step2'),
    3: document.getElementById('step3'),
    4: document.getElementById('step4')
  };

  const progressSteps = {
    1: document.getElementById('progressStep1'),
    2: document.getElementById('progressStep2'),
    3: document.getElementById('progressStep3'),
    4: document.getElementById('progressStep4')
  };

  // Step 1 Inputs
  const inputFullName = document.getElementById('fullName');
  const inputEmail = document.getElementById('email');
  const inputPhone = document.getElementById('phone');
  const inputBusinessName = document.getElementById('businessName');

  // Step 2 Inputs (Radio buttons)
  const serviceCards = document.querySelectorAll('.service-choice-card');
  const serviceRadios = document.querySelectorAll('input[name="selectedService"]');

  // Step 3 Inputs
  const inputProjectTitle = document.getElementById('projectTitle');
  const inputProjectDesc = document.getElementById('projectDescription');
  const inputBudget = document.getElementById('expectedBudget');
  const inputTimeline = document.getElementById('preferredTimeline');
  const inputReferenceUrl = document.getElementById('referenceUrl');

  // Step 4 Review summary outputs
  const reviewFullName = document.getElementById('revFullName');
  const reviewEmail = document.getElementById('revEmail');
  const reviewPhone = document.getElementById('revPhone');
  const reviewBusiness = document.getElementById('revBusiness');
  const reviewService = document.getElementById('revService');
  const reviewTitle = document.getElementById('revTitle');
  const reviewDesc = document.getElementById('revDesc');
  const reviewBudget = document.getElementById('revBudget');
  const reviewTimeline = document.getElementById('revTimeline');
  const reviewReference = document.getElementById('revReference');

  // Nav buttons
  const btnNext1 = document.getElementById('btnNext1');
  const btnPrev2 = document.getElementById('btnPrev2');
  const btnNext2 = document.getElementById('btnNext2');
  const btnPrev3 = document.getElementById('btnPrev3');
  const btnNext3 = document.getElementById('btnNext3');
  const btnPrev4 = document.getElementById('btnPrev4');
  const btnSubmit = document.getElementById('btnSubmitEnquiry');

  // Feedback alerts
  const formAlert = document.getElementById('formAlert');
  const successBox = document.getElementById('submissionSuccessBox');
  const formCard = document.getElementById('enquiryCard');

  // Pre-fill from URL parameters (e.g., from Services or Cost Estimator)
  const urlParams = new URLSearchParams(window.location.search);
  const paramService = urlParams.get('service');
  const paramBudget = urlParams.get('budget');

  if (paramBudget && inputBudget) {
    inputBudget.value = paramBudget;
  }

  if (paramService) {
    serviceRadios.forEach(radio => {
      if (radio.value.toLowerCase() === paramService.toLowerCase() ||
          radio.value.toLowerCase().includes(paramService.toLowerCase())) {
        radio.checked = true;
        const parentCard = radio.closest('.service-choice-card');
        if (parentCard) {
          serviceCards.forEach(c => c.classList.remove('selected'));
          parentCard.classList.add('selected');
        }
      }
    });
  }

  // Handle service card selection styling
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        clearError('serviceGroup');
      }
    });
  });

  // Validation helpers
  function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim());
  }

  function isValidUrl(str) {
    if (!str || !str.trim()) return true; // Optional field
    try {
      const url = new URL(str.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  function showError(groupId, message) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.classList.add('has-error');
    const msgEl = group.querySelector('.form-error-msg');
    if (msgEl) {
      msgEl.textContent = message;
      msgEl.style.display = 'block';
    }
  }

  function clearError(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.classList.remove('has-error');
    const msgEl = group.querySelector('.form-error-msg');
    if (msgEl) {
      msgEl.style.display = 'none';
    }
  }

  // Clear errors on input
  if (inputFullName) inputFullName.addEventListener('input', () => clearError('fullNameGroup'));
  if (inputEmail) inputEmail.addEventListener('input', () => clearError('emailGroup'));
  if (inputProjectTitle) inputProjectTitle.addEventListener('input', () => clearError('projectTitleGroup'));
  if (inputProjectDesc) inputProjectDesc.addEventListener('input', () => clearError('projectDescGroup'));
  if (inputReferenceUrl) inputReferenceUrl.addEventListener('input', () => clearError('referenceUrlGroup'));

  // Step 1 Validation
  function validateStep1() {
    let valid = true;
    const nameVal = inputFullName.value.trim();
    const emailVal = inputEmail.value.trim();

    if (!nameVal || nameVal.length < 2) {
      showError('fullNameGroup', 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else {
      clearError('fullNameGroup');
    }

    if (!emailVal || !isValidEmail(emailVal)) {
      showError('emailGroup', 'Please enter a valid email address where we can reach you.');
      valid = false;
    } else {
      clearError('emailGroup');
    }

    return valid;
  }

  // Step 2 Validation
  function validateStep2() {
    let selected = false;
    serviceRadios.forEach(r => {
      if (r.checked) selected = true;
    });

    if (!selected) {
      showError('serviceGroup', 'Please select a service category for your project.');
      return false;
    }
    clearError('serviceGroup');
    return true;
  }

  // Step 3 Validation
  function validateStep3() {
    let valid = true;
    const titleVal = inputProjectTitle.value.trim();
    const descVal = inputProjectDesc.value.trim();
    const urlVal = inputReferenceUrl.value.trim();

    if (!titleVal || titleVal.length < 3) {
      showError('projectTitleGroup', 'Please provide a short project title (at least 3 characters).');
      valid = false;
    } else {
      clearError('projectTitleGroup');
    }

    if (!descVal || descVal.length < 10) {
      showError('projectDescGroup', 'Please write a brief description of what you need (at least 10 characters).');
      valid = false;
    } else {
      clearError('projectDescGroup');
    }

    if (urlVal && !isValidUrl(urlVal)) {
      showError('referenceUrlGroup', 'Please enter a valid website link (starting with https:// or http://).');
      valid = false;
    } else {
      clearError('referenceUrlGroup');
    }

    return valid;
  }

  // Populate Review Table
  function populateReviewStep() {
    let selectedServiceVal = 'Not Selected';
    serviceRadios.forEach(r => {
      if (r.checked) selectedServiceVal = r.value;
    });

    if (reviewFullName) reviewFullName.textContent = inputFullName.value.trim();
    if (reviewEmail) reviewEmail.textContent = inputEmail.value.trim();
    if (reviewPhone) reviewPhone.textContent = inputPhone.value.trim() || 'Not provided';
    if (reviewBusiness) reviewBusiness.textContent = inputBusinessName.value.trim() || 'Individual';
    if (reviewService) reviewService.textContent = selectedServiceVal;
    if (reviewTitle) reviewTitle.textContent = inputProjectTitle.value.trim();
    if (reviewDesc) reviewDesc.textContent = inputProjectDesc.value.trim();
    if (reviewBudget) reviewBudget.textContent = inputBudget.value.trim() || 'To be discussed';
    if (reviewTimeline) reviewTimeline.textContent = inputTimeline.value.trim() || 'Flexible';
    if (reviewReference) reviewReference.textContent = inputReferenceUrl.value.trim() || 'None';
  }

  // Step Navigation logic
  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > totalSteps) return;

    // Update active class on steps
    for (let i = 1; i <= totalSteps; i++) {
      if (stepElements[i]) {
        stepElements[i].classList.remove('active');
      }
      if (progressSteps[i]) {
        progressSteps[i].classList.remove('active', 'completed');
        if (i < stepNum) {
          progressSteps[i].classList.add('completed');
        } else if (i === stepNum) {
          progressSteps[i].classList.add('active');
        }
      }
    }

    stepElements[stepNum].classList.add('active');
    currentStep = stepNum;

    // Smooth scroll up to wizard container
    const wizardWrap = document.querySelector('.enquiry-wizard-wrap');
    if (wizardWrap) {
      const offsetTop = wizardWrap.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  // Button Listeners
  if (btnNext1) {
    btnNext1.addEventListener('click', () => {
      if (validateStep1()) goToStep(2);
    });
  }

  if (btnPrev2) {
    btnPrev2.addEventListener('click', () => goToStep(1));
  }

  if (btnNext2) {
    btnNext2.addEventListener('click', () => {
      if (validateStep2()) goToStep(3);
    });
  }

  if (btnPrev3) {
    btnPrev3.addEventListener('click', () => goToStep(2));
  }

  if (btnNext3) {
    btnNext3.addEventListener('click', () => {
      if (validateStep3()) {
        populateReviewStep();
        goToStep(4);
      }
    });
  }

  if (btnPrev4) {
    btnPrev4.addEventListener('click', () => goToStep(3));
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Final validation pass
      if (!validateStep1() || !validateStep2() || !validateStep3()) {
        formAlert.className = 'form-status-alert alert-error';
        formAlert.textContent = 'Please make sure all required fields are filled out correctly.';
        formAlert.style.display = 'block';
        return;
      }

      // Hide previous alerts
      formAlert.style.display = 'none';

      // Get selected service
      let selectedService = '';
      serviceRadios.forEach(r => {
        if (r.checked) selectedService = r.value;
      });

      // Prepare payload
      const payload = {
        fullName: inputFullName.value.trim(),
        email: inputEmail.value.trim(),
        phone: inputPhone.value.trim(),
        businessName: inputBusinessName.value.trim(),
        service: selectedService,
        projectTitle: inputProjectTitle.value.trim(),
        projectDescription: inputProjectDesc.value.trim(),
        budget: inputBudget.value.trim(),
        timeline: inputTimeline.value.trim(),
        referenceUrl: inputReferenceUrl.value.trim()
      };

      // Show loading state
      const originalSubmitBtnHtml = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span class="spinner"></span> Processing Enquiry...`;

      try {
        const response = await fetch('/api/enquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Hide form, show prominent success screen
          if (formCard) formCard.style.display = 'none';
          if (successBox) {
            const refEl = document.getElementById('successRefId');
            const emailEl = document.getElementById('successClientEmail');
            const directMailBtn = document.getElementById('btnDirectMailto');
            const directWhatsAppBtn = document.getElementById('btnDirectWhatsApp');

            const refId = data.enquiryId || 'WS46-RECEIVED';
            if (refEl) refEl.textContent = refId;
            if (emailEl) emailEl.textContent = payload.email;

            // Pre-fill 1-click Email dispatch with complete details
            if (directMailBtn) {
              const emailSubject = encodeURIComponent(`[Project Enquiry ${refId}] ${payload.projectTitle}`);
              const emailBody = encodeURIComponent(
                `Hello Sangiv VP,\n\n` +
                `I have submitted a project enquiry on WEB STUDIO 46.\n\n` +
                `ENQUIRY SPECIFICATIONS:\n` +
                `-------------------------------------\n` +
                `Tracking Ref: ${refId}\n` +
                `Full Name: ${payload.fullName}\n` +
                `Email: ${payload.email}\n` +
                `Phone: ${payload.phone || 'Not provided'}\n` +
                `Brand / Business: ${payload.businessName || 'Not specified'}\n` +
                `Selected Service: ${payload.service}\n` +
                `Project Title: ${payload.projectTitle}\n` +
                `Expected Budget: ${payload.budget || 'Flexible'}\n` +
                `Preferred Timeline: ${payload.timeline || 'Flexible'}\n` +
                `Reference URL: ${payload.referenceUrl || 'None'}\n\n` +
                `PROJECT DESCRIPTION & REQUIREMENTS:\n` +
                `${payload.projectDescription}\n\n` +
                `-------------------------------------\n` +
                `Looking forward to your quotation and consultation.`
              );
              directMailBtn.href = `mailto:webstudio46.in@gmail.com?subject=${emailSubject}&body=${emailBody}`;
            }

            // Pre-fill 1-click WhatsApp dispatch
            if (directWhatsAppBtn) {
              const waText = encodeURIComponent(
                `Hello Sangiv VP! I just submitted an enquiry on WEB STUDIO 46:\n\n` +
                `🆔 *Ref ID:* ${refId}\n` +
                `👤 *Name:* ${payload.fullName}\n` +
                `💼 *Service:* ${payload.service}\n` +
                `📌 *Project:* ${payload.projectTitle}\n` +
                `💰 *Budget:* ${payload.budget || 'Flexible'}\n` +
                `📞 *Phone:* ${payload.phone || 'Not provided'}\n` +
                `✉️ *Email:* ${payload.email}\n\n` +
                `Please review my requirements and let me know the next steps!`
              );
              directWhatsAppBtn.href = `https://wa.me/916381827181?text=${waText}`;
            }

            successBox.style.display = 'block';

            // Scroll to success message
            successBox.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          // Display friendly error
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalSubmitBtnHtml;

          formAlert.className = 'form-status-alert alert-error';
          formAlert.innerHTML = `<strong>Submission Notice:</strong> ${data.message || 'Unable to submit enquiry. Please check your connection and try again.'}`;
          formAlert.style.display = 'block';
        }
      } catch (networkError) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalSubmitBtnHtml;

        formAlert.className = 'form-status-alert alert-error';
        formAlert.innerHTML = `<strong>Network Connection Issue:</strong> We could not connect to the server. Please check your internet connection or email us directly at <em>webstudio46.in@gmail.com</em>.`;
        formAlert.style.display = 'block';
      }
    });
  }
}
