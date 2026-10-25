/**
 * WEB STUDIO 46 — Excel Storage & Export Service
 * Founder: Sangiv VP
 * 
 * Automatically records, formats, and exports all client project enquiries
 * into a professional Microsoft Excel (.xlsx) workbook.
 * 
 * Features:
 * - Real-time synchronization with data/enquiries.json
 * - Professional Web Studio 46 branded styling (colors, borders, column widths, text wrap)
 * - Clickable WhatsApp & Email action links directly inside Excel
 * - Multi-sheet workbook: "Client Enquiries" + "Analytics & Studio Info"
 * - Supports direct buffer generation for 1-click browser download
 */

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Target file path for the Excel spreadsheet
const EXCEL_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'enquiries.xlsx')
  : path.join(__dirname, '..', 'data', 'enquiries.xlsx');

const JSON_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'enquiries.json')
  : path.join(__dirname, '..', 'data', 'enquiries.json');

/**
 * Reads enquiries from data/enquiries.json safely
 */
function readEnquiriesData() {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      const defaultDataPath = path.join(__dirname, '..', 'data', 'enquiries.json');
      if (fs.existsSync(defaultDataPath)) {
        try {
          const raw = fs.readFileSync(defaultDataPath, 'utf8');
          return JSON.parse(raw || '[]');
        } catch (_) {}
      }
      return [];
    }
    const raw = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('[EXCEL SERVICE] Error reading enquiries JSON:', err.message);
    return [];
  }
}

/**
 * Formats a clean date string
 */
function formatDisplayDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (_) {
    return dateStr;
  }
}

/**
 * Cleans phone number to create a WhatsApp link
 */
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

/**
 * Builds an ExcelJS Workbook from an array of enquiries
 */
async function buildWorkbook(enquiriesList) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'WEB STUDIO 46 — Sangiv VP';
  workbook.lastModifiedBy = 'WEB STUDIO 46 Automated System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // ----------------------------------------------------
  // SHEET 1: CLIENT ENQUIRIES MASTER
  // ----------------------------------------------------
  const sheet = workbook.addWorksheet('Client Enquiries', {
    pageSetup: { orientation: 'landscape', paperSize: 9 },
    views: [{ state: 'frozen', ySplit: 4 }] // Freeze top 4 header rows
  });

  // Top Title Banner (Rows 1-2)
  sheet.mergeCells('A1:P1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'WEB STUDIO 46 — CLIENT PROJECT ENQUIRIES MASTER';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF09090B' } // Studio dark tone
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 36;

  sheet.mergeCells('A2:P2');
  const subtitleCell = sheet.getCell('A2');
  subtitleCell.value = `Founder: Sangiv VP  |  Gobichettipalayam, Erode Dt, Tamil Nadu  |  WhatsApp/Call: +91 6381827181  |  Last Synced: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  subtitleCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF34D399' } }; // Emerald green
  subtitleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF18181B' }
  };
  subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 22;

  // Empty Spacer Row 3
  sheet.getRow(3).height = 8;

  // Column Headers (Row 4)
  const columns = [
    { key: 'index', header: 'S.No', width: 8 },
    { key: 'id', header: 'Enquiry Ref ID', width: 22 },
    { key: 'date', header: 'Submission Date (IST)', width: 22 },
    { key: 'name', header: 'Client Full Name', width: 24 },
    { key: 'email', header: 'Email Address', width: 28 },
    { key: 'phone', header: 'Phone Number', width: 18 },
    { key: 'whatsapp', header: 'WhatsApp Direct Link', width: 24 },
    { key: 'business', header: 'Business / Brand', width: 24 },
    { key: 'service', header: 'Selected Service', width: 26 },
    { key: 'title', header: 'Project Title', width: 30 },
    { key: 'description', header: 'Requirements & Specifications', width: 50 },
    { key: 'budget', header: 'Expected Budget', width: 18 },
    { key: 'timeline', header: 'Timeline', width: 16 },
    { key: 'referenceUrl', header: 'Reference Website', width: 30 },
    { key: 'status', header: 'Lead Status', width: 15 },
    { key: 'emailDelivery', header: 'Email Log / Notes', width: 24 }
  ];

  sheet.columns = columns.map(col => ({
    key: col.key,
    width: col.width
  }));

  // Re-write headers at Row 4 to keep our custom banner at Rows 1-2
  const headerRow = sheet.getRow(4);
  headerRow.height = 30;

  columns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.header;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF047857' } // Emerald green header
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF065F46' } },
      left: { style: 'thin', color: { argb: 'FF065F46' } },
      bottom: { style: 'medium', color: { argb: 'FF065F46' } },
      right: { style: 'thin', color: { argb: 'FF065F46' } }
    };
  });

  // Populate Data Rows starting at Row 5
  enquiriesList.forEach((item, index) => {
    const rowIndex = 5 + index;
    const row = sheet.getRow(rowIndex);
    const isEven = index % 2 === 0;

    const rowBgColor = isEven ? 'FFFFFFFF' : 'FFF9FAFB'; // Subtle alternating zebra
    const customer = item.customer || {};
    const project = item.project || {};
    const emailDelivery = item.emailDelivery || {};

    const waLink = getWhatsAppUrl(customer.phone);
    const dateFormatted = item.formattedDate || formatDisplayDate(item.createdAt);

    // Populate cell values
    row.getCell(1).value = index + 1;
    row.getCell(2).value = item.id || 'N/A';
    row.getCell(3).value = dateFormatted;
    row.getCell(4).value = customer.fullName || 'N/A';
    row.getCell(5).value = customer.email ? { text: customer.email, hyperlink: `mailto:${customer.email}` } : 'N/A';
    row.getCell(6).value = customer.phone || 'N/A';
    
    // WhatsApp direct clickable link
    if (waLink) {
      row.getCell(7).value = { text: '💬 Chat on WhatsApp', hyperlink: waLink, tooltip: `Open WhatsApp chat with ${customer.fullName}` };
    } else {
      row.getCell(7).value = 'N/A';
    }

    row.getCell(8).value = customer.businessName || 'Individual';
    row.getCell(9).value = project.service || 'Web Development';
    row.getCell(10).value = project.title || 'Untitled Project';
    row.getCell(11).value = project.description || 'No description provided';
    row.getCell(12).value = project.budget || 'To be discussed';
    row.getCell(13).value = project.timeline || 'Flexible';
    
    if (project.referenceUrl && (project.referenceUrl.startsWith('http://') || project.referenceUrl.startsWith('https://'))) {
      row.getCell(14).value = { text: project.referenceUrl, hyperlink: project.referenceUrl };
    } else {
      row.getCell(14).value = project.referenceUrl || 'None';
    }

    row.getCell(15).value = item.status || 'Received';
    row.getCell(16).value = emailDelivery.details || (emailDelivery.studioNotificationSent ? 'Dispatched' : 'Recorded');

    // Style the row cells
    for (let c = 1; c <= 16; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1F2937' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowBgColor }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };

      // Alignment rules
      if ([1, 2, 6, 7, 12, 13, 15].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (c === 3) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (c === 11) {
        // Requirements column: Enable wrap text so long descriptions are formatted nicely
        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }

      // Highlight links
      if (c === 5 || c === 7 || c === 14) {
        if (typeof cell.value === 'object' && cell.value.hyperlink) {
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF2563EB' }, underline: true };
        }
      }

      // Highlight status
      if (c === 15) {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF065F46' } };
      }
    }

    row.height = 36;
  });

  // Enable Auto-filters on header row
  sheet.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + Math.max(enquiriesList.length, 1), column: 16 }
  };

  // ----------------------------------------------------
  // SHEET 2: ANALYTICS & STUDIO INFORMATION
  // ----------------------------------------------------
  const summarySheet = workbook.addWorksheet('Summary & Studio Info');
  summarySheet.views = [{ showGridLines: true }];

  summarySheet.mergeCells('A1:E1');
  const sumTitle = summarySheet.getCell('A1');
  sumTitle.value = 'WEB STUDIO 46 — ENQUIRY SUMMARY METRICS';
  sumTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sumTitle.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' }
  };
  sumTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(1).height = 30;

  // Key metrics breakdown
  const totalCount = enquiriesList.length;
  const serviceStats = {};
  enquiriesList.forEach(item => {
    const s = (item.project && item.project.service) || 'Unspecified';
    serviceStats[s] = (serviceStats[s] || 0) + 1;
  });

  summarySheet.getCell('A3').value = 'Total Enquiries Recorded:';
  summarySheet.getCell('A3').font = { bold: true };
  summarySheet.getCell('B3').value = totalCount;
  summarySheet.getCell('B3').font = { bold: true, size: 13, color: { argb: 'FF047857' } };

  summarySheet.getCell('A5').value = 'Service Category';
  summarySheet.getCell('A5').font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
  summarySheet.getCell('B5').value = 'Enquiry Count';
  summarySheet.getCell('B5').font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getCell('B5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

  let statRow = 6;
  for (const [srv, count] of Object.entries(serviceStats)) {
    summarySheet.getCell(`A${statRow}`).value = srv;
    summarySheet.getCell(`B${statRow}`).value = count;
    summarySheet.getCell(`B${statRow}`).alignment = { horizontal: 'center' };
    statRow++;
  }

  // Founder Contact Box
  const founderStartRow = statRow + 2;
  summarySheet.mergeCells(`A${founderStartRow}:D${founderStartRow}`);
  const founderHeader = summarySheet.getCell(`A${founderStartRow}`);
  founderHeader.value = 'STUDIO CONTACT DIRECTORY';
  founderHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  founderHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF047857' } };

  const infoRows = [
    ['Studio Name', 'WEB STUDIO 46'],
    ['Founder & Developer', 'Sangiv VP'],
    ['Mobile / WhatsApp', '+91 6381827181'],
    ['Email', 'webstudio46.in@gmail.com'],
    ['Studio Location', 'Gobichettipalayam, Erode Dt, Tamil Nadu, India'],
    ['Instagram Handle', '@web_studio_46'],
    ['Official Website', 'https://webstudio46.in (or local server)']
  ];

  infoRows.forEach((pair, idx) => {
    const curRow = founderStartRow + 1 + idx;
    summarySheet.getCell(`A${curRow}`).value = pair[0];
    summarySheet.getCell(`A${curRow}`).font = { bold: true };
    summarySheet.getCell(`B${curRow}`).value = pair[1];
  });

  summarySheet.getColumn('A').width = 32;
  summarySheet.getColumn('B').width = 45;
  summarySheet.getColumn('C').width = 20;

  return workbook;
}

/**
 * Generates and saves the Excel spreadsheet to data/enquiries.xlsx
 */
async function syncExcelFile() {
  try {
    const data = readEnquiriesData();
    const workbook = await buildWorkbook(data);

    // Ensure parent directory exists
    const dir = path.dirname(EXCEL_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    console.log(`[EXCEL SERVICE] Successfully updated Excel file at: ${EXCEL_FILE_PATH} (${data.length} records)`);
    return { success: true, count: data.length, filePath: EXCEL_FILE_PATH };
  } catch (error) {
    console.error('[EXCEL SERVICE] Failed to generate Excel file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Returns an Excel workbook buffer for direct HTTP download
 */
async function generateExcelBuffer() {
  const data = readEnquiriesData();
  const workbook = await buildWorkbook(data);
  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer, count: data.length };
}

/**
 * Generates a standard CSV representation of enquiries
 */
function generateCsvData() {
  const enquiries = readEnquiriesData();
  const headers = [
    'Enquiry ID',
    'Date & Time',
    'Client Full Name',
    'Email Address',
    'Phone Number',
    'WhatsApp Direct Link',
    'Business / Brand',
    'Selected Service',
    'Project Title',
    'Requirements & Scope',
    'Budget',
    'Timeline',
    'Reference URL',
    'Status'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = enquiries.map((item, idx) => {
    const c = item.customer || {};
    const p = item.project || {};
    const wa = getWhatsAppUrl(c.phone) || '';
    return [
      escapeCsv(item.id),
      escapeCsv(item.formattedDate || item.createdAt),
      escapeCsv(c.fullName),
      escapeCsv(c.email),
      escapeCsv(c.phone),
      escapeCsv(wa),
      escapeCsv(c.businessName),
      escapeCsv(p.service),
      escapeCsv(p.title),
      escapeCsv(p.description),
      escapeCsv(p.budget),
      escapeCsv(p.timeline),
      escapeCsv(p.referenceUrl),
      escapeCsv(item.status || 'Received')
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

module.exports = {
  EXCEL_FILE_PATH,
  syncExcelFile,
  generateExcelBuffer,
  generateCsvData,
  readEnquiriesData
};
