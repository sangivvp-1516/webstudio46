/**
 * WEB STUDIO 46 — Admin Enquiries & Excel Portal Script (PIN Protected)
 * Founder: Sangiv VP
 */

document.addEventListener('DOMContentLoaded', () => {
  let allEnquiries = [];
  let currentPin = sessionStorage.getItem('studio_admin_pin') || '';

  // PIN Gate Elements
  const pinGateModal = document.getElementById('pinGateModal');
  const pinForm = document.getElementById('pinForm');
  const inputPin = document.getElementById('inputPin');
  const pinErrorMsg = document.getElementById('pinErrorMsg');
  const adminDashboardContent = document.getElementById('adminDashboardContent');
  const btnLockPortal = document.getElementById('btnLockPortal');

  // Action Buttons
  const btnHeaderDownload = document.getElementById('btnHeaderDownload');
  const btnExcelDownload = document.getElementById('btnExcelDownload');
  const btnCsvDownload = document.getElementById('btnCsvDownload');

  // DOM Elements
  const tableBody = document.getElementById('tableBody');
  const statTotalCount = document.getElementById('statTotalCount');
  const statTopService = document.getElementById('statTopService');
  const searchInput = document.getElementById('searchInput');
  const filteredCountLabel = document.getElementById('filteredCountLabel');
  const btnRefreshList = document.getElementById('btnRefreshList');

  // Modal Elements
  const detailModal = document.getElementById('detailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
  const modalRefId = document.getElementById('modalRefId');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalClientName = document.getElementById('modalClientName');
  const modalClientPhone = document.getElementById('modalClientPhone');
  const modalClientEmail = document.getElementById('modalClientEmail');
  const modalBusinessName = document.getElementById('modalBusinessName');
  const modalServiceTag = document.getElementById('modalServiceTag');
  const modalBudgetTag = document.getElementById('modalBudgetTag');
  const modalFullDescription = document.getElementById('modalFullDescription');
  const modalRefUrlWrap = document.getElementById('modalRefUrlWrap');
  const modalRefUrl = document.getElementById('modalRefUrl');
  const modalQuickActions = document.getElementById('modalQuickActions');

  // Check initial authentication
  if (currentPin) {
    unlockPortal(currentPin);
  } else {
    lockPortal();
  }

  // Handle PIN Form Submit
  if (pinForm) {
    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredPin = inputPin.value.trim();
      if (!enteredPin) return;

      pinErrorMsg.style.display = 'none';

      try {
        const res = await fetch('/api/enquiry/verify-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: enteredPin })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          sessionStorage.setItem('studio_admin_pin', enteredPin);
          currentPin = enteredPin;
          unlockPortal(enteredPin);
        } else {
          pinErrorMsg.textContent = data.message || 'Incorrect PIN. Access restricted to founder Sangiv VP.';
          pinErrorMsg.style.display = 'block';
          inputPin.value = '';
          inputPin.focus();
        }
      } catch (err) {
        pinErrorMsg.textContent = 'Network error verifying PIN. Please try again.';
        pinErrorMsg.style.display = 'block';
      }
    });
  }

  // Lock portal handler
  if (btnLockPortal) {
    btnLockPortal.addEventListener('click', () => {
      lockPortal();
    });
  }

  function unlockPortal(pin) {
    if (pinGateModal) pinGateModal.style.display = 'none';
    if (adminDashboardContent) adminDashboardContent.style.display = 'block';

    // Update download URLs to include the authenticated pin
    const pinParam = '?pin=' + encodeURIComponent(pin);
    if (btnHeaderDownload) btnHeaderDownload.href = '/api/enquiry/export-excel' + pinParam;
    if (btnExcelDownload) btnExcelDownload.href = '/api/enquiry/export-excel' + pinParam;
    if (btnCsvDownload) btnCsvDownload.href = '/api/enquiry/export-csv' + pinParam;

    loadEnquiries(pin);
  }

  function lockPortal() {
    sessionStorage.removeItem('studio_admin_pin');
    currentPin = '';
    if (adminDashboardContent) adminDashboardContent.style.display = 'none';
    if (pinGateModal) pinGateModal.style.display = 'flex';
    if (inputPin) {
      inputPin.value = '';
      inputPin.focus();
    }
  }

  // Fetch enquiries from API with PIN authorization
  async function loadEnquiries(pin) {
    try {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Fetching enquiries from server...
          </td>
        </tr>
      `;

      const res = await fetch('/api/enquiry/all?t=' + Date.now(), {
        headers: {
          'x-admin-pin': pin || currentPin
        }
      });

      if (res.status === 401) {
        // Expired or invalid PIN
        lockPortal();
        pinErrorMsg.textContent = 'Session authorization failed. Please re-enter Studio PIN.';
        pinErrorMsg.style.display = 'block';
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.enquiries)) {
        allEnquiries = data.enquiries;
        updateMetrics(allEnquiries);
        renderTable(allEnquiries);
      } else {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 2.5rem; color: #f87171;">
              Failed to load enquiries: ${data.message || 'Unknown error'}
            </td>
          </tr>
        `;
      }
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: #f87171;">
            Network error loading enquiries: ${err.message}
          </td>
        </tr>
      `;
    }
  }

  // Update Summary Metrics
  function updateMetrics(enquiries) {
    if (statTotalCount) {
      statTotalCount.textContent = enquiries.length;
    }

    if (statTopService) {
      if (enquiries.length === 0) {
        statTopService.textContent = 'None yet';
        return;
      }
      const counts = {};
      enquiries.forEach(e => {
        const s = (e.project && e.project.service) || 'Other';
        counts[s] = (counts[s] || 0) + 1;
      });

      let topS = '';
      let maxC = 0;
      for (const [srv, c] of Object.entries(counts)) {
        if (c > maxC) {
          maxC = c;
          topS = srv;
        }
      }
      statTopService.textContent = topS || 'Web Development';
    }
  }

  // Helper to format WhatsApp URL
  function getWhatsAppUrl(phoneStr) {
    if (!phoneStr) return null;
    const digits = String(phoneStr).replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      return `https://wa.me/91${digits}`;
    } else if (digits.length > 10) {
      return `https://wa.me/${digits}`;
    }
    return null;
  }

  // Render Table
  function renderTable(enquiries) {
    if (enquiries.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            No enquiries recorded yet. Submit an enquiry to see it appear here and in the Excel sheet!
          </td>
        </tr>
      `;
      if (filteredCountLabel) filteredCountLabel.textContent = '0 enquiries';
      return;
    }

    if (filteredCountLabel) {
      filteredCountLabel.textContent = `Showing ${enquiries.length} of ${allEnquiries.length} enquiries`;
    }

    let rowsHtml = '';
    enquiries.forEach((item, index) => {
      const c = item.customer || {};
      const p = item.project || {};
      const waUrl = getWhatsAppUrl(c.phone);

      const clientName = escapeHtml(c.fullName || 'Anonymous');
      const email = escapeHtml(c.email || 'N/A');
      const phone = escapeHtml(c.phone || 'N/A');
      const business = escapeHtml(c.businessName || 'Individual');
      const service = escapeHtml(p.service || 'Web Development');
      const title = escapeHtml(p.title || 'Untitled Project');
      const budget = escapeHtml(p.budget || 'Flexible');
      const desc = escapeHtml(p.description || 'No description');
      const date = escapeHtml(item.formattedDate || item.createdAt || 'N/A');
      const refId = escapeHtml(item.id || 'N/A');
      const status = escapeHtml(item.status || 'Received');

      rowsHtml += `
        <tr>
          <td style="color: var(--text-muted); font-size: 0.8rem; font-weight: 600;">${index + 1}</td>
          <td>
            <span class="ref-badge">${refId}</span>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${date}</div>
          </td>
          <td>
            <div class="client-name-bold">${clientName}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${business}</div>
            <div class="quick-contact-row">
              ${waUrl ? `<a href="${waUrl}" target="_blank" class="table-btn-wa">💬 WhatsApp</a>` : ''}
              ${phone !== 'N/A' && phone !== 'Not provided' ? `<a href="tel:${phone}" class="table-btn-call">📞 Call</a>` : ''}
              ${email !== 'N/A' ? `<a href="mailto:${email}" class="table-btn-mail">✉️ Email</a>` : ''}
            </div>
          </td>
          <td>
            <span class="service-tag">${service}</span>
            <div class="budget-tag" style="margin-top: 4px;">${budget}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHtml(p.timeline || 'Flexible')}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: #ffffff; font-size: 0.88rem; margin-bottom: 2px;">${title}</div>
            <div class="desc-preview" title="${desc}">${desc}</div>
            <span class="view-more-link" onclick="window.viewEnquiryDetails('${item.id}')">View full requirement scope &rarr;</span>
          </td>
          <td>
            <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: rgba(52, 211, 153, 0.12); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.25);">
              ${status}
            </span>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            <button onclick="window.viewEnquiryDetails('${item.id}')" class="btn-action-outline" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;">
              Inspect Details
            </button>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = rowsHtml;
  }

  // Filter Enquiries
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        renderTable(allEnquiries);
        return;
      }

      const filtered = allEnquiries.filter(item => {
        const c = item.customer || {};
        const p = item.project || {};
        const text = [
          item.id,
          c.fullName,
          c.email,
          c.phone,
          c.businessName,
          p.service,
          p.title,
          p.description,
          p.budget,
          item.status
        ].filter(Boolean).join(' ').toLowerCase();

        return text.includes(q);
      });

      renderTable(filtered);
    });
  }

  // Refresh & Sync Button
  if (btnRefreshList) {
    btnRefreshList.addEventListener('click', async () => {
      const origHtml = btnRefreshList.innerHTML;
      btnRefreshList.disabled = true;
      btnRefreshList.innerHTML = `Syncing...`;

      try {
        await fetch('/api/enquiry/sync', {
          headers: { 'x-admin-pin': currentPin }
        });
        await loadEnquiries(currentPin);
      } catch (err) {
        console.error(err);
      } finally {
        btnRefreshList.disabled = false;
        btnRefreshList.innerHTML = origHtml;
      }
    });
  }

  // Detail Modal Handler
  window.viewEnquiryDetails = function(enquiryId) {
    const item = allEnquiries.find(e => e.id === enquiryId);
    if (!item) return;

    const c = item.customer || {};
    const p = item.project || {};
    const waUrl = getWhatsAppUrl(c.phone);

    modalRefId.textContent = item.id || 'N/A';
    modalProjectTitle.textContent = p.title || 'Untitled Project';
    modalClientName.textContent = c.fullName || 'Anonymous';
    modalClientPhone.textContent = `Phone: ${c.phone || 'Not provided'}`;
    modalClientEmail.textContent = c.email || 'Not provided';
    modalBusinessName.textContent = c.businessName || 'Individual / Not specified';
    modalServiceTag.textContent = p.service || 'Web Development';
    modalBudgetTag.textContent = `Budget: ${p.budget || 'Flexible'}`;
    modalFullDescription.textContent = p.description || 'No description provided';

    if (p.referenceUrl && (p.referenceUrl.startsWith('http://') || p.referenceUrl.startsWith('https://'))) {
      modalRefUrl.href = p.referenceUrl;
      modalRefUrl.textContent = p.referenceUrl;
      modalRefUrlWrap.style.display = 'block';
    } else {
      modalRefUrlWrap.style.display = 'none';
    }

    let actionsHtml = '';
    if (waUrl) {
      actionsHtml += `<a href="${waUrl}" target="_blank" class="table-btn-wa" style="padding: 0.5rem 0.9rem; font-size: 0.85rem;">💬 WhatsApp Client</a>`;
    }
    if (c.phone && c.phone !== 'Not provided') {
      actionsHtml += `<a href="tel:${c.phone}" class="table-btn-call" style="padding: 0.5rem 0.9rem; font-size: 0.85rem;">📞 Call Client</a>`;
    }
    if (c.email) {
      actionsHtml += `<a href="mailto:${c.email}?subject=Regarding your enquiry ${item.id} — WEB STUDIO 46" class="table-btn-mail" style="padding: 0.5rem 0.9rem; font-size: 0.85rem;">✉️ Reply via Email</a>`;
    }
    modalQuickActions.innerHTML = actionsHtml;

    detailModal.classList.add('active');
  };

  function closeModal() {
    detailModal.classList.remove('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseBtn2) modalCloseBtn2.addEventListener('click', closeModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeModal();
    });
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
