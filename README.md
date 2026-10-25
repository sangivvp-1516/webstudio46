# WEB STUDIO 46 — Premium Web Development Studio

> **“Your Vision. Our Digital Craft.”**  
> Founded by **Sangiv VP**

A complete, premium, responsive web development studio website built with plain **HTML5**, **CSS3**, and **Vanilla JavaScript** on the frontend, powered by a lightweight **Node.js** and **Express.js** backend with automated **Nodemailer SMTP** email integration and persistent JSON data storage.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Folder & File Structure](#2-folder--file-structure)
3. [Required Software](#3-required-software)
4. [How to Open in VS Code](#4-how-to-open-in-vs-code)
5. [Installation](#5-installation)
6. [Configuring Environment Variables (.env)](#6-configuring-environment-variables-env)
7. [Starting the Server](#7-starting-the-server)
8. [Configuring SMTP Email Automation](#8-configuring-smtp-email-automation)
9. [Testing the Project Enquiry Form](#9-testing-the-project-enquiry-form)
10. [Updating Services & Pricing](#10-updating-services--pricing)
11. [Troubleshooting Common Errors](#11-troubleshooting-common-errors)
12. [Deployment Guide](#12-deployment-guide)

---

## 1. Project Overview

**WEB STUDIO 46** is a modern digital solutions studio website designed specifically for founder **Sangiv VP** to showcase services, transparent pricing packages in Indian Rupees (₹), concept portfolio projects, and receive client project enquiries.

### Key Features
- **Monochrome Digital Studio Aesthetic:** Deep black palette, subtle borders, sleek typography, rounded cards, and responsive micro-interactions.
- **Mobile-First Experience:** 100% responsive on phones, tablets, and desktops with touch-friendly navigation drawer.
- **Dedicated Pages:**
  - `index.html` (Homepage with hero, featured services, portfolio preview, studio values, FAQ, and CTA)
  - `about.html` (Founder introduction, development philosophy, core skills, and values)
  - `services.html` (Complete service catalog with starting prices, inclusions, and limitations)
  - `pricing.html` (Transparent pricing tables and interactive project cost estimator)
  - `portfolio.html` (Concept project gallery with category filters and interactive preview modals)
  - `how-it-works.html` (Detailed 5-step development process)
  - `contact.html` (Direct contact details and studio consultation channels)
  - `enquiry.html` (Multi-step interactive project enquiry wizard with real-time validation)
  - `faq.html` (Comprehensive FAQ accordion)
  - `privacy.html` (Privacy Policy)
  - `terms.html` (Terms and Conditions)
  - `404.html` (Custom error page)
- **Interactive Project Cost Estimator:** Real-time starting cost calculation in INR (₹) with 1-click transition to the enquiry wizard.
- **Multi-Step Project Enquiry Form:**
  - Step 1: Customer Details (Name, Email, Phone, Business)
  - Step 2: Service Selection (Birthday, Anniversary, Portfolio, Business, E-commerce, App, etc.)
  - Step 3: Project Requirements (Title, Description, Budget, Timeline, Reference URL)
  - Step 4: Summary Review & AJAX Submission
- **Express.js API Backend:** Input sanitisation, rate limiting, request-size limits, and error handling.
- **Data Persistence:** Enquiries are stored persistently in `data/enquiries.json` before email triggers to prevent data loss.
- **Nodemailer SMTP Integration:** Sends studio notification emails and customer confirmation acknowledgements.

---

## 2. Folder & File Structure

```
Studio_46/
├── config/
│   └── services.js          # Central single source of truth for pricing and packages
├── data/
│   └── enquiries.json       # Persistent JSON database for client enquiries
├── public/
│   ├── index.html           # Homepage
│   ├── about.html           # About the Founder & Philosophy
│   ├── services.html        # Services & Packages
│   ├── pricing.html         # Transparent Pricing & Estimator
│   ├── portfolio.html       # Portfolio Gallery & Category Filters
│   ├── how-it-works.html    # 5-Step Development Process
│   ├── contact.html         # Contact Channels
│   ├── enquiry.html         # 4-Step Interactive Project Enquiry Wizard
│   ├── faq.html             # FAQ Accordion
│   ├── privacy.html         # Privacy Policy
│   ├── terms.html           # Terms and Conditions
│   ├── 404.html             # Custom 404 Error Page
│   ├── robots.txt           # Search Engine Instructions
│   ├── sitemap.xml          # XML Sitemap
│   ├── favicon.svg          # Studio Favicon
│   ├── css/
│   │   └── style.css        # Master Design System & Responsive Styles
│   ├── js/
│   │   ├── script.js        # Global UI (Nav drawer, Accordion, Filters, Modals)
│   │   ├── estimator.js     # Project Cost Estimator Widget
│   │   └── enquiry.js       # Multi-Step Enquiry Form Controller & Validation
│   └── images/
│       ├── logo.svg
│       ├── portfolio-personal.svg
│       ├── portfolio-business.svg
│       ├── portfolio-greetings.svg
│       ├── portfolio-ecommerce.svg
│       ├── portfolio-webapp.svg
│       └── portfolio-creator.svg
├── routes/
│   └── enquiry.js           # Express API Route for POST /api/enquiry
├── server.js                # Express Server, Security Headers, Static Serving
├── package.json             # Node.js dependencies and scripts
├── .env.example             # Template for environment configuration
├── .gitignore               # Excludes secrets, node_modules, and logs
└── README.md                # Comprehensive documentation
```

---

## 3. Required Software

Before running this project, ensure you have the following installed on your computer:
1. **Node.js** (Version 18 or higher recommended). Download from [https://nodejs.org](https://nodejs.org).
2. **Visual Studio Code (VS Code)** or any text editor of your choice.

To verify your Node.js installation, open your terminal (PowerShell or Command Prompt on Windows) and run:
```bash
node -v
npm -v
```

---

## 4. How to Open in VS Code

1. Open **Visual Studio Code**.
2. Click **File** > **Open Folder...**
3. Select the folder:
   ```
   C:\Users\Sangiv\OneDrive\Desktop\Studio_46
   ```
4. Open the integrated terminal in VS Code by pressing ``Ctrl + ` `` (backtick) or selecting **Terminal** > **New Terminal**.

---

## 5. Installation

In your VS Code terminal (ensure you are inside the `Studio_46` folder), install the project dependencies:

```bash
npm install
```

This installs:
- `express` — Fast web framework for serving static files and API endpoints.
- `nodemailer` — For sending automated studio notifications and customer confirmations.
- `dotenv` — Loads environment variables securely from `.env`.
- `express-rate-limit` — Protects the enquiry API from spam.

---

## 6. Configuring Environment Variables (.env)

A `.env.example` file is included in the project root. Create your active `.env` file by copying it:

**On Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**On macOS/Linux:**
```bash
cp .env.example .env
```

Open the newly created `.env` file in VS Code:
```env
# Server Port
PORT=3000

# Studio Admin Email (Where you want to receive new client enquiries)
STUDIO_EMAIL=webstudio46.in@gmail.com

# SMTP Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=webstudio46.in@gmail.com
SMTP_PASS=your_gmail_app_password

# Environment Mode
NODE_ENV=development
```

> **Note:** If SMTP credentials are empty or left unconfigured, the server operates in safe development mode: all enquiries are safely saved to `data/enquiries.json` so no submission is ever lost!

---

## 7. Starting the Server

To start the server, run:

```bash
npm start
```

Or for automatic restart whenever you edit a file:
```bash
npm run dev
```

You will see:
```
====================================================
 WEB STUDIO 46 — Digital Studio Server Active
 Founder: Sangiv VP
 Running on: http://localhost:3000
 Environment: development
====================================================
```

Open your web browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 8. Configuring SMTP Email Automation

When a client submits an enquiry on `enquiry.html`:
1. **Email A (Studio Notification):** An email with full client details, selected service, budget, and description is sent to `STUDIO_EMAIL`.
2. **Email B (Customer Confirmation):** A confirmation acknowledgement email is sent to the customer's email address.

### Option 1: Using Gmail (Recommended & Free)
1. Log in to your **Google Account** for `webstudio46.in@gmail.com`.
2. Go to **Security** & ensure **2-Step Verification** is turned ON.
3. Open **App Passwords** (directly at: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. Enter an app name like `Web Studio 46` and click **Create**.
5. Google will display a 16-character code (e.g., `abcd efgh ijkl mnop`).
6. Paste it into your `.env` file under `SMTP_PASS`:
   ```env
   STUDIO_EMAIL=webstudio46.in@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=webstudio46.in@gmail.com
   SMTP_PASS=abcdefghijklmnop
   ```
   *(Note: The server automatically strips any spaces if you copy-paste the 4-block format).*
7. Restart the server (`npm start`). Every enquiry submitted on the website will now instantly deliver directly to `webstudio46.in@gmail.com` with complete client details!


### Option 2: Using Mailtrap (Free for Testing)
1. Create a free account at [mailtrap.io](https://mailtrap.io).
2. Go to **Email Testing** > **Inboxes** > **SMTP Settings**.
3. Select **Integrations: Nodemailer** and copy the host, port, user, and password into your `.env`.

---

## 9. Testing the Project Enquiry Form

1. Start the server (`npm start`).
2. Visit **[http://localhost:3000/enquiry.html](http://localhost:3000/enquiry.html)**.
3. Fill out:
   - **Step 1:** Enter your Name and Email.
   - **Step 2:** Choose a service (e.g. *Personal Portfolio*).
   - **Step 3:** Enter a project title, brief description, and expected budget (e.g. *₹350*).
   - **Step 4:** Review the summary table and click **Submit Project Enquiry**.
4. You will see the green success confirmation screen with your unique **Reference ID** (e.g. `WS46-MVNBEQ9Y-5578`).
5. Open `data/enquiries.json` in VS Code to see your submitted enquiry recorded with full details and timestamps!

---

## 10. Updating Services & Pricing

To update starting prices, features, or add new packages, edit a single file:
📄 `config/services.js`

All prices are organized by category and tier with `startingPrice`, `formattedPrice`, `included` points, and `limitations`. Editing this file updates both the backend configuration and the `/api/services` endpoint.

---

## 11. Troubleshooting Common Errors

### Error: `EADDRINUSE: address already in use :::3000`
Another application is using port 3000. Either change the port in `.env`:
```env
PORT=3001
```
Or terminate the process holding port 3000 in PowerShell:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Enquiries are saved in JSON, but emails are not arriving
- Check that your `.env` contains valid SMTP credentials.
- If using Gmail, make sure you used an **App Password**, not your regular login password.
- Check the terminal output where `node server.js` is running: any SMTP connection issues will be clearly logged without crashing the server.

### Styles or JavaScript changes not appearing in browser
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to perform a hard refresh and clear your browser cache.

---

## 12. Deployment Guide

### Deploying to Render.com (Free & Easy)
1. Push your repository to GitHub (ensure `.env` and `node_modules` are not committed).
2. Create a free account at [render.com](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Set:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Under **Environment Variables**, add:
   - `PORT` = `3000`
   - `STUDIO_EMAIL` = `your_email@example.com`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
7. Click **Deploy Web Service**. Render will build and launch your live website at a free `onrender.com` URL!

---

## Brand & Studio Credits

- **Studio Name:** WEB STUDIO 46
- **Founder:** Sangiv VP
- **Email:** webstudio46.in@gmail.com
- **Phone & WhatsApp:** +91 6381827181
- **Location:** Gobichettipalayam, Erode Dt, Tamil Nadu, India
- **Instagram:** [@web_studio_46](https://instagram.com/web_studio_46)
- **Tagline:** *“Your Vision. Our Digital Craft.”*
- **License:** Proprietary / All Rights Reserved &copy; 2026 WEB STUDIO 46
