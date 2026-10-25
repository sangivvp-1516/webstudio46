/**
 * WEB STUDIO 46 — Project Enquiry Route
 * Founder: Sangiv VP
 * 
 * Handles incoming client project enquiries:
 * 1. Validates and sanitises incoming form fields.
 * 2. Saves enquiry to persistent data storage (data/enquiries.json).
 * 3. Sends Studio Notification email via Nodemailer.
 * 4. Sends Customer Confirmation email via Nodemailer.
 * 5. Returns safe JSON response without exposing server secrets.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Path to persistent data storage (Uses /tmp on Vercel's serverless read-only filesystem)
const ENQUIRIES_FILE = process.env.VERCEL
  ? path.join('/tmp', 'enquiries.json')
  : path.join(__dirname, '..', 'data', 'enquiries.json');

/**
 * Helper function to safely read enquiries from JSON file
 */
function readEnquiries() {
  try {
    if (!fs.existsSync(ENQUIRIES_FILE)) {
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(ENQUIRIES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading enquiries data file:', error.message);
    return [];
  }
}

/**
 * Helper function to safely write enquiries to JSON file
 */
function saveEnquiries(enquiries) {
  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing enquiries data file:', error.message);
    return false;
  }
}

/**
 * Basic sanitisation to prevent HTML injection in emails and logs
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Email format validator
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

/**
 * URL validator
 */
function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Create Nodemailer Transporter based on environment variables
 */
function createTransporter() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || process.env.STUDIO_EMAIL || 'webstudio46.in@gmail.com').trim();
  // Automatically strip spaces from user-entered Google App Password (e.g. "abcd efgh ijkl mnop" -> "abcdefghijklmnop")
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  // If app password is not configured yet, return null to handle gracefully without crashing
  if (!pass) {
    return null;
  }

  // Gmail specific configuration: using service 'gmail' delivers maximum reliability
  if (host === 'smtp.gmail.com' || user.toLowerCase().endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
  });
}


/**
 * POST /api/enquiry
 * Handles multi-step project enquiry submission
 */
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      businessName,
      service,
      projectTitle,
      projectDescription,
      budget,
      timeline,
      referenceUrl
    } = req.body;

    // Field Validation
    const errors = [];

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('A valid email address is required.');
    }

    if (!service || typeof service !== 'string' || service.trim().length < 2) {
      errors.push('Please select a service for your project.');
    }

    if (!projectTitle || typeof projectTitle !== 'string' || projectTitle.trim().length < 3) {
      errors.push('Project title is required (minimum 3 characters).');
    }

    if (!projectDescription || typeof projectDescription !== 'string' || projectDescription.trim().length < 10) {
      errors.push('Project description is required (minimum 10 characters).');
    }

    // Optional field checks
    if (referenceUrl && referenceUrl.trim().length > 0 && !isValidUrl(referenceUrl)) {
      errors.push('Reference website URL must be a valid web link starting with http:// or https://');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the errors in your submission.',
        errors
      });
    }

    // Sanitise values
    const cleanFullName = sanitizeInput(fullName);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? sanitizeInput(phone) : 'Not provided';
    const cleanBusinessName = businessName ? sanitizeInput(businessName) : 'Individual / Not specified';
    const cleanService = sanitizeInput(service);
    const cleanProjectTitle = sanitizeInput(projectTitle);
    const cleanProjectDescription = sanitizeInput(projectDescription);
    const cleanBudget = budget ? sanitizeInput(budget) : 'To be discussed';
    const cleanTimeline = timeline ? sanitizeInput(timeline) : 'Flexible';
    const cleanReferenceUrl = referenceUrl ? referenceUrl.trim() : 'None provided';

    // Generate unique enquiry ID and timestamp
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const enquiryId = 'WS46-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    // Prepare record
    const enquiryRecord = {
      id: enquiryId,
      createdAt: timestamp,
      formattedDate,
      customer: {
        fullName: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        businessName: cleanBusinessName
      },
      project: {
        service: cleanService,
        title: cleanProjectTitle,
        description: cleanProjectDescription,
        budget: cleanBudget,
        timeline: cleanTimeline,
        referenceUrl: cleanReferenceUrl
      },
      status: 'Received',
      emailDelivery: {
        studioNotificationSent: false,
        customerConfirmationSent: false,
        details: 'Pending delivery'
      }
    };

    // Save to persistent storage BEFORE attempting email delivery
    // This ensures data is NEVER lost even if SMTP network fails!
    const enquiries = readEnquiries();
    enquiries.unshift(enquiryRecord);
    saveEnquiries(enquiries);

    // Attempt Nodemailer Email Automation
    const transporter = createTransporter();
    const studioEmail = process.env.STUDIO_EMAIL || 'webstudio46.in@gmail.com';

    if (transporter) {
      try {
        const cleanDigitsOnlyPhone = cleanPhone.replace(/[^0-9]/g, '');
        const waLink = cleanDigitsOnlyPhone.length >= 10 ? `https://wa.me/${cleanDigitsOnlyPhone.length === 10 ? '91' + cleanDigitsOnlyPhone : cleanDigitsOnlyPhone}` : null;

        // EMAIL A: Studio Notification to webstudio46.in@gmail.com
        const studioMailOptions = {
          from: `"WEB STUDIO 46 Portal" <${process.env.SMTP_USER || 'webstudio46.in@gmail.com'}>`,
          to: studioEmail,
          replyTo: cleanEmail,
          subject: `🚨 [New Project Enquiry] ${cleanFullName} — ${cleanProjectTitle} (${enquiryId})`,
          text: `WEB STUDIO 46 — NEW CLIENT PROJECT ENQUIRY\n` +
                `===============================================\n\n` +
                `Enquiry ID: ${enquiryId}\n` +
                `Submitted At: ${formattedDate}\n\n` +
                `CLIENT DETAILS:\n` +
                `- Full Name: ${cleanFullName}\n` +
                `- Email: ${cleanEmail}\n` +
                `- Phone: ${cleanPhone}\n` +
                `- Business / Brand: ${cleanBusinessName}\n\n` +
                `PROJECT SPECIFICATIONS:\n` +
                `- Selected Service: ${cleanService}\n` +
                `- Project Title: ${cleanProjectTitle}\n` +
                `- Expected Budget: ${cleanBudget}\n` +
                `- Target Timeline: ${cleanTimeline}\n` +
                `- Reference Website: ${cleanReferenceUrl}\n\n` +
                `PROJECT DESCRIPTION & REQUIREMENTS:\n` +
                `${cleanProjectDescription}\n\n` +
                `===============================================\n` +
                `WEB STUDIO 46 • Founded by Sangiv VP • Gobichettipalayam, Erode Dt\n`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #0c0c0e; color: #f4f4f5; border: 1px solid #27272a; border-radius: 14px; overflow: hidden; padding: 28px;">
              <div style="border-bottom: 1px solid #27272a; padding-bottom: 18px; margin-bottom: 22px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #34d399; font-weight: 700;">WEB STUDIO 46 &bull; NEW ENQUIRY</span>
                  <span style="font-size: 12px; color: #a1a1aa;">${formattedDate}</span>
                </div>
                <h1 style="font-size: 22px; margin: 10px 0 4px 0; color: #ffffff; font-weight: 700;">${cleanProjectTitle}</h1>
                <p style="margin: 0; color: #a1a1aa; font-size: 13px;">Tracking Ref ID: <strong style="color: #ffffff; font-family: monospace;">${enquiryId}</strong></p>
              </div>

              <!-- Quick Action Bar -->
              <div style="background: rgba(52, 211, 153, 0.08); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
                <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #34d399; font-weight: 700; display: block; margin-bottom: 8px;">Direct Response Actions</span>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <a href="mailto:${cleanEmail}?subject=Re:%20${encodeURIComponent(cleanProjectTitle)}%20—%20WEB%20STUDIO%2046%20(${enquiryId})" style="display: inline-block; background: #ffffff; color: #000000; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">✉️ Reply via Email</a>
                  ${waLink ? `<a href="${waLink}" target="_blank" style="display: inline-block; background: #25D366; color: #ffffff; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">💬 Chat on WhatsApp</a>` : ''}
                  ${cleanPhone && cleanPhone !== 'Not provided' ? `<a href="tel:${cleanPhone}" style="display: inline-block; background: #27272a; color: #ffffff; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">📞 Call Client</a>` : ''}
                </div>
              </div>

              <div style="background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px; margin-bottom: 18px;">
                <h3 style="margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; border-bottom: 1px solid #27272a; padding-bottom: 8px;">1. Client Information</h3>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Name:</strong> <span style="color: #ffffff; font-weight: 600;">${cleanFullName}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Email:</strong> <a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: underline;">${cleanEmail}</a></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Phone:</strong> <span style="color: #ffffff;">${cleanPhone}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Business / Brand:</strong> <span style="color: #ffffff;">${cleanBusinessName}</span></p>
              </div>

              <div style="background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px; margin-bottom: 18px;">
                <h3 style="margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #a1a1aa; border-bottom: 1px solid #27272a; padding-bottom: 8px;">2. Project Scope &amp; Budget</h3>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Selected Service:</strong> <span style="color: #34d399; font-weight: 600;">${cleanService}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Project Title:</strong> <span style="color: #ffffff;">${cleanProjectTitle}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Expected Budget:</strong> <span style="color: #facc15; font-weight: 600;">${cleanBudget}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Target Timeline:</strong> <span style="color: #ffffff;">${cleanTimeline}</span></p>
                <p style="margin: 8px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Reference URL:</strong> ${cleanReferenceUrl !== 'None provided' ? `<a href="${cleanReferenceUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline;">${cleanReferenceUrl}</a>` : '<span style="color: #71717a;">None provided</span>'}</p>
                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #27272a;">
                  <strong style="color: #a1a1aa; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Client Requirements / Description:</strong>
                  <div style="font-size: 14px; line-height: 1.6; color: #f4f4f5; background: #0e0e11; padding: 14px; border-radius: 6px; border: 1px solid #27272a; white-space: pre-wrap;">${cleanProjectDescription}</div>
                </div>
              </div>

              <div style="text-align: center; border-top: 1px solid #27272a; padding-top: 18px; color: #71717a; font-size: 12px; line-height: 1.6;">
                WEB STUDIO 46 &bull; Founded by Sangiv VP &bull; Gobichettipalayam, Erode Dt<br>
                Direct internal notification dispatched to ${studioEmail}
              </div>
            </div>
          `
        };


        // EMAIL B: Customer Confirmation
        const customerMailOptions = {
          from: `"WEB STUDIO 46" <${process.env.SMTP_USER || 'webstudio46.in@gmail.com'}>`,
          to: cleanEmail,
          replyTo: studioEmail,
          subject: `We Received Your Project Enquiry — WEB STUDIO 46 (${enquiryId})`,
          text: `Hello ${cleanFullName},\n\n` +
                `Thank you for contacting WEB STUDIO 46.\n\n` +
                `Your project enquiry has been received successfully (Reference: ${enquiryId}). ` +
                `We will review your requirements for "${cleanProjectTitle}" and contact you regarding the next steps.\n\n` +
                `Summary of your enquiry:\n` +
                `- Service: ${cleanService}\n` +
                `- Project Title: ${cleanProjectTitle}\n` +
                `- Budget: ${cleanBudget}\n` +
                `- Preferred Timeline: ${cleanTimeline}\n\n` +
                `Thank you for considering WEB STUDIO 46.\n\n` +
                `Warm regards,\n` +
                `Sangiv VP\n` +
                `Founder, WEB STUDIO 46\n`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0c; color: #f4f4f5; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; padding: 32px 28px;">
              <div style="border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
                <span style="font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; color: #a1a1aa; font-weight: 700;">WEB STUDIO 46</span>
                <h1 style="font-size: 22px; margin: 10px 0 0 0; color: #ffffff; font-weight: 600;">Thank You for Reaching Out</h1>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">Hello <strong>${cleanFullName}</strong>,</p>

              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">
                Thank you for contacting <strong>WEB STUDIO 46</strong>.
              </p>

              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">
                Your project enquiry has been received successfully. We will review your requirements and contact you regarding the next steps.
              </p>

              <div style="background: #141417; border: 1px solid #27272a; border-radius: 8px; padding: 18px; margin: 24px 0;">
                <h3 style="margin-top: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; border-bottom: 1px solid #27272a; padding-bottom: 8px;">Enquiry Summary</h3>
                <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Reference ID:</strong> <span style="color: #ffffff;">${enquiryId}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Selected Service:</strong> <span style="color: #ffffff;">${cleanService}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Project:</strong> <span style="color: #ffffff;">${cleanProjectTitle}</span></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #a1a1aa;">Expected Budget:</strong> <span style="color: #ffffff;">${cleanBudget}</span></p>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">
                Thank you for considering WEB STUDIO 46.
              </p>

              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a;">
                <p style="margin: 0; font-weight: 600; color: #ffffff;">Sangiv VP</p>
                <p style="margin: 2px 0 0 0; color: #a1a1aa; font-size: 13px;">Founder &bull; WEB STUDIO 46</p>
                <p style="margin: 8px 0 0 0; color: #71717a; font-size: 12px;">“Your Vision. Our Digital Craft.”</p>
              </div>
            </div>
          `
        };

        // Send emails
        await transporter.sendMail(studioMailOptions);
        enquiryRecord.emailDelivery.studioNotificationSent = true;

        await transporter.sendMail(customerMailOptions);
        enquiryRecord.emailDelivery.customerConfirmationSent = true;
        enquiryRecord.emailDelivery.details = 'Delivered successfully via SMTP';

        // Update record in persistent storage
        saveEnquiries(enquiries);

        console.log(`[ENQUIRY SUCCESS] ${enquiryId} processed and emails dispatched.`);
      } catch (mailError) {
        // Log mail delivery failure safely without crashing
        console.error(`[SMTP NOTICE] Email delivery issue for ${enquiryId}:`, mailError.message);
        enquiryRecord.emailDelivery.details = 'SMTP error: ' + mailError.message;
        saveEnquiries(enquiries);
      }
    } else {
      console.log(`[DEV NOTICE] SMTP credentials not configured in .env. Enquiry ${enquiryId} saved locally to data/enquiries.json.`);
      enquiryRecord.emailDelivery.details = 'Local storage recorded. SMTP credentials pending configuration.';
      saveEnquiries(enquiries);
    }

    // Return positive confirmation to customer
    return res.status(201).json({
      success: true,
      enquiryId,
      message: 'Your project enquiry has been received successfully. We will review your requirements and reach out to you soon.',
      summary: {
        enquiryId,
        fullName: cleanFullName,
        email: cleanEmail,
        service: cleanService,
        projectTitle: cleanProjectTitle,
        receivedAt: formattedDate
      }
    });

  } catch (serverError) {
    console.error('Unhandled error in enquiry handler:', serverError);
    // Never expose stack trace to user
    return res.status(500).json({
      success: false,
      message: 'We encountered an unexpected issue while saving your enquiry. Please try again or reach out directly.'
    });
  }
});

module.exports = router;
