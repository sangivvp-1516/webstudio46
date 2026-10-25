/**
 * WEB STUDIO 46 — Project Cost Estimator Widget
 * Founder: Sangiv VP
 * 
 * Provides an instant, non-binding starting cost estimate based on
 * the selected service tier and optional project add-ons.
 * Allows the customer to carry their selected configuration straight
 * into the Project Enquiry multi-step form!
 */

document.addEventListener('DOMContentLoaded', () => {
  initCostEstimator();
});

function initCostEstimator() {
  const serviceSelect = document.getElementById('estimatorService');
  const estimatePriceEl = document.getElementById('estimateDisplayPrice');
  const estimateScopeEl = document.getElementById('estimateDisplayScope');
  const proceedBtn = document.getElementById('estimatorProceedBtn');
  const addonCheckboxes = document.querySelectorAll('.estimator-addon-check');

  if (!serviceSelect || !estimatePriceEl) return;

  // Service base pricing catalogue mapping
  const serviceCatalogue = {
    'birthday-wishes': {
      name: 'Birthday Wishes Website',
      basePrice: 99,
      formattedPrice: '₹99',
      scope: 'Single-page celebratory greeting with custom name, wishes, 1-3 photos, confetti animation, and shareable link.',
      isCustomQuote: false
    },
    'anniversary-wishes': {
      name: 'Anniversary Wishes Website',
      basePrice: 99,
      formattedPrice: '₹99',
      scope: 'Romantic couple milestone greeting with custom text, photo gallery placeholder, and mobile-friendly link.',
      isCustomQuote: false
    },
    'personalised-greeting': {
      name: 'Personalised Greeting Website',
      basePrice: 199,
      formattedPrice: '₹199',
      scope: 'Celebration greeting with up to 8 photos, custom typography theme, interactive tap cards, and fast mobile speed.',
      isCustomQuote: false
    },
    'premium-interactive-greeting': {
      name: 'Premium Interactive Greeting',
      basePrice: 499,
      formattedPrice: '₹499',
      scope: 'Multi-section interactive experience with photo vault, optional background music player, and gift box animation.',
      isCustomQuote: false
    },
    'personal-portfolio': {
      name: 'Personal Portfolio Website',
      basePrice: 350,
      formattedPrice: '₹350',
      scope: 'Clean online profile featuring your bio, skills overview, 4 showcased projects, and social profile links.',
      isCustomQuote: false
    },
    'student-portfolio': {
      name: 'Student Portfolio Website',
      basePrice: 499,
      formattedPrice: '₹499',
      scope: 'Recruiter-ready layout with resume/CV download button, academic coursework, GitHub links, and contact form.',
      isCustomQuote: false
    },
    'creator-portfolio': {
      name: 'Creator Portfolio Website',
      basePrice: 999,
      formattedPrice: '₹999',
      scope: 'Visual grid layout for designers & creators with case study sections, filterable galleries, and media embeds.',
      isCustomQuote: false
    },
    'small-business-website': {
      name: 'Small Business Website',
      basePrice: 1999,
      formattedPrice: '₹1,999',
      scope: 'Up to 5 custom-styled business pages (Home, About, Services, Gallery, Contact) with WhatsApp chat & basic SEO.',
      isCustomQuote: false
    },
    'premium-business-website': {
      name: 'Premium Business Website',
      basePrice: 4999,
      formattedPrice: '₹4,999',
      scope: 'Up to 8 bespoke pages with custom branding, lead capture forms, full SEO foundation, and 14 days launch support.',
      isCustomQuote: false
    },
    'starter-store': {
      name: 'Starter E-commerce Store',
      basePrice: 10000,
      formattedPrice: '₹10,000',
      scope: 'Online store setup for up to 25 products with shopping cart, checkout, payment gateway, and order email alerts.',
      isCustomQuote: false
    },
    'business-store': {
      name: 'Business E-commerce Store',
      basePrice: 25000,
      formattedPrice: '₹25,000',
      scope: 'Full-featured store for up to 100 products with admin management dashboard, discount coupons, and inventory tools.',
      isCustomQuote: false
    },
    'premium-ecommerce': {
      name: 'Premium E-commerce Infrastructure',
      basePrice: null,
      formattedPrice: '₹50,000 to ₹1,00,000+',
      scope: 'High-volume scalable architecture with courier API shipping, custom accounts, and 30 days dedicated optimization.',
      isCustomQuote: true
    },
    'custom-web-app': {
      name: 'Custom Web Application',
      basePrice: null,
      formattedPrice: 'Custom Quotation',
      scope: 'Tailored web software, business dashboards, client portals, or interactive prototypes based on specific business rules.',
      isCustomQuote: true
    },
    'website-redesign': {
      name: 'Website Redesign',
      basePrice: 1499,
      formattedPrice: '₹1,499+',
      scope: 'Full visual and responsive overhaul of existing website with faster loading speeds and modern studio aesthetics.',
      isCustomQuote: false
    },
    'landing-page-dev': {
      name: 'Landing Page Development',
      basePrice: 799,
      formattedPrice: '₹799',
      scope: 'High-conversion laser-focused single page for product launch or campaign with contact lead capture.',
      isCustomQuote: false
    }
  };

  function updateEstimate() {
    const selectedKey = serviceSelect.value;
    const service = serviceCatalogue[selectedKey] || serviceCatalogue['personal-portfolio'];

    let total = service.basePrice;
    let selectedAddonsList = [];

    // Calculate add-ons if service has a numerical starting price
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const addonCost = parseInt(cb.getAttribute('data-price') || '0', 10);
        const addonName = cb.getAttribute('data-name') || 'Addon';
        if (total !== null) {
          total += addonCost;
        }
        selectedAddonsList.push(addonName);
      }
    });

    // Update UI elements
    if (service.isCustomQuote || total === null) {
      estimatePriceEl.textContent = service.formattedPrice;
    } else {
      estimatePriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    if (estimateScopeEl) {
      let scopeText = service.scope;
      if (selectedAddonsList.length > 0) {
        scopeText += ` Includes selected add-ons: ${selectedAddonsList.join(', ')}.`;
      }
      estimateScopeEl.textContent = scopeText;
    }

    // Update Proceed CTA button link
    if (proceedBtn) {
      const budgetValue = total !== null ? `₹${total.toLocaleString('en-IN')}` : 'Custom Quote';
      const url = `enquiry.html?service=${encodeURIComponent(service.name)}&budget=${encodeURIComponent(budgetValue)}`;
      proceedBtn.setAttribute('href', url);
    }
  }

  serviceSelect.addEventListener('change', updateEstimate);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimate));

  // Run initial calculation
  updateEstimate();
}
