/**
 * WEB STUDIO 46 — Application Server
 * Founder: Sangiv VP
 * 
 * Built with Node.js and Express.js.
 * Serves static frontend assets and handles project enquiry API requests.
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const enquiryRouter = require('./routes/enquiry');
const { services, pricingDisclaimer } = require('./config/services');
const { syncExcelFile } = require('./utils/excelStorage');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Request body size limits to prevent abuse
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// General Rate Limiter (200 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});
app.use('/api/', generalLimiter);

// Specific Rate Limiter for Enquiry Submissions (15 enquiries per 15 minutes per IP)
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'We have received multiple enquiries from your network recently. Please wait a few minutes before submitting another.'
  }
});

// API Routes (Apply submission limiter only to POST requests, allowing unrestricted admin export)
app.use('/api/enquiry', (req, res, next) => {
  if (req.method === 'POST') {
    return enquiryLimiter(req, res, next);
  }
  next();
}, enquiryRouter);

// Service configuration endpoint for frontend dynamic features & cost estimator
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    disclaimer: pricingDisclaimer,
    services
  });
});

// Serve static frontend assets from public directory with instant revalidation
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'htm'],
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Fallback for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 Handler for undefined routes
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
      if (err) {
        res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Return to WEB STUDIO 46 Home</a></p>');
      }
    });
    return;
  }
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Safe Error Handler (Never leaks stack traces)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message || err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred. Please try again later.'
  });
});

// Start listening (Only when running standalone, not in Vercel serverless environment)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` WEB STUDIO 46 — Digital Studio Server Active`);
    console.log(` Founder: Sangiv VP`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Enquiries Excel: data/enquiries.xlsx (Automated)`);
    console.log(`====================================================`);

    // Verify and synchronize Excel spreadsheet on server start
    syncExcelFile().catch(() => {});
  });

  // Graceful termination handling
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server gracefully.');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  });
}

module.exports = app;
