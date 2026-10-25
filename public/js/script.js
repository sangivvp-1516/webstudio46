/**
 * WEB STUDIO 46 — Master Frontend Script
 * Founder: Sangiv VP
 * 
 * Features:
 * - Mobile navigation menu toggle with ARIA & keyboard support
 * - Sticky header background blur styling on scroll
 * - Active navigation link detection
 * - FAQ Accordion interactive toggle
 * - Portfolio category filter tabs
 * - Portfolio project demo modal dialogs
 * - Back to top scroll button
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initStickyHeader();
  initFaqAccordion();
  initPortfolioFilters();
  initPortfolioModals();
  initBackToTop();
});

/**
 * 1. Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navPanel = document.getElementById('mobileNavPanel');

  if (!toggleBtn || !navPanel) return;

  function toggleMenu() {
    const isOpen = navPanel.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navPanel.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMenu() {
    navPanel.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking on any mobile nav link
  const mobileLinks = navPanel.querySelectorAll('.mobile-nav-link, .btn');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navPanel.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 2. Sticky Header elevation on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.16)';
      header.style.backgroundColor = 'rgba(8, 8, 10, 0.95)';
    } else {
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      header.style.backgroundColor = 'rgba(10, 10, 13, 0.85)';
    }
  }, { passive: true });
}

/**
 * 3. FAQ Accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close all other accordion items for clean single-view experience
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isAlreadyActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/**
 * 4. Portfolio Category Filtering
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  if (!filterButtons.length || !portfolioCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * 5. Portfolio Project Demo Modals
 */
function initPortfolioModals() {
  const viewButtons = document.querySelectorAll('[data-modal-target]');
  const modalBackdrop = document.getElementById('projectModal');

  if (!modalBackdrop || !viewButtons.length) return;

  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalTech = document.getElementById('modalTech');
  const modalClose = modalBackdrop.querySelector('.modal-close-btn');

  viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const title = button.getAttribute('data-title') || 'Demo Project Concept';
      const badge = button.getAttribute('data-badge') || 'Concept Project';
      const desc = button.getAttribute('data-desc') || 'Detailed concept created by WEB STUDIO 46.';
      const featuresRaw = button.getAttribute('data-features') || '';
      const techRaw = button.getAttribute('data-tech') || 'HTML5, CSS3, JavaScript';

      if (modalTitle) modalTitle.textContent = title;
      if (modalBadge) modalBadge.textContent = badge;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalFeatures) {
        modalFeatures.innerHTML = '';
        const features = featuresRaw.split('|').filter(f => f.trim().length > 0);
        features.forEach(feat => {
          const li = document.createElement('li');
          li.className = 'service-feature-item';
          li.innerHTML = `<span style="color:#ffffff; margin-right:6px;">&bull;</span> ${feat.trim()}`;
          modalFeatures.appendChild(li);
        });
      }

      if (modalTech) {
        modalTech.innerHTML = '';
        const techs = techRaw.split(',').filter(t => t.trim().length > 0);
        techs.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = t.trim();
          modalTech.appendChild(span);
        });
      }

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 6. Back To Top Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
