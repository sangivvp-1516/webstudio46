/**
 * WEB STUDIO 46 — Google Sheets Live Webhook Script (Google Apps Script)
 * Founder: Sangiv VP
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new sheet: "WEB STUDIO 46 — Client Leads"
 * 2. Click "Extensions" -> "Apps Script"
 * 3. Delete existing code in Code.gs, paste this entire code, and click Save (Floppy icon / Ctrl+S)
 * 4. Click "Deploy" (top right) -> "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy" -> "Authorize access" -> Allow
 * 9. Copy the generated Web App URL and paste it into your .env file:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Auto-create branded headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "S.No",
        "Enquiry ID",
        "Submission Date (IST)",
        "Client Full Name",
        "Email Address",
        "Phone Number",
        "WhatsApp Direct Link",
        "Business / Brand Name",
        "Selected Service",
        "Project Title",
        "Requirements & Scope",
        "Budget",
        "Timeline",
        "Reference Website",
        "Lead Status"
      ];
      sheet.appendRow(headers);

      // Style header row (Web Studio 46 Emerald Green)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#047857");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    // Parse incoming enquiry JSON payload
    var payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    var nextIndex = Math.max(sheet.getLastRow(), 1);

    // Clean phone number for clickable WhatsApp link
    var phone = payload.phone || "";
    var digitsOnly = phone.toString().replace(/[^0-9]/g, "");
    var waLink = "";
    if (digitsOnly.length === 10) {
      waLink = "https://wa.me/91" + digitsOnly;
    } else if (digitsOnly.length > 10) {
      waLink = "https://wa.me/" + digitsOnly;
    }

    var rowData = [
      nextIndex,
      payload.enquiryId || "WS46-LEAD",
      payload.date || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      payload.fullName || "Anonymous",
      payload.email || "",
      phone,
      waLink ? '=HYPERLINK("' + waLink + '", "💬 Chat on WhatsApp")' : "",
      payload.businessName || "Individual",
      payload.service || "Web Development",
      payload.projectTitle || "Untitled Project",
      payload.description || "No description provided",
      payload.budget || "Flexible",
      payload.timeline || "Flexible",
      payload.referenceUrl || "None",
      payload.status || "Received"
    ];

    sheet.appendRow(rowData);

    // Set row height and alignment
    var newRowIndex = sheet.getLastRow();
    sheet.setRowHeight(newRowIndex, 30);
    sheet.getRange(newRowIndex, 11).setWrap(true); // Wrap text for description

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      enquiryId: payload.enquiryId,
      rowNumber: newRowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("WEB STUDIO 46 — Google Sheets Webhook is Active & Ready.");
}
