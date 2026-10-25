/**
 * WEB STUDIO 46 - Services & Pricing Configuration
 * Founder: Sangiv VP
 * 
 * This file serves as the single source of truth for all services, package tiers,
 * starting prices (in INR ₹), included features, and scope limitations.
 * Sangiv VP can easily edit prices and details here at any time.
 */

const pricingDisclaimer = "All prices are starting prices. Final pricing depends on project requirements, features, complexity, content, and delivery timeline.";

const services = [
  {
    id: "digital-greetings",
    categoryName: "Digital Greeting Websites",
    categorySlug: "greetings",
    description: "Creative, interactive, and shareable web greetings crafted for birthdays, anniversaries, and celebratory moments.",
    packages: [
      {
        id: "birthday-wishes",
        name: "Birthday Wishes Website",
        startingPrice: 99,
        formattedPrice: "₹99",
        timeline: "24–48 hours",
        shortDescription: "A sweet, mobile-ready celebratory birthday webpage to surprise loved ones.",
        included: [
          "Personalised recipient name & birthday age/message",
          "Single-page responsive celebratory layout",
          "1 to 3 photo placements",
          "Delightful entrance confetti / birthday animation",
          "Direct shareable link for WhatsApp & social apps",
          "Free temporary hosting link included"
        ],
        limitations: [
          "Single-page layout",
          "Static content (no user accounts or database)",
          "Custom domain not included (uses sub-link/free hosting link)"
        ]
      },
      {
        id: "anniversary-wishes",
        name: "Anniversary Wishes Website",
        startingPrice: 99,
        formattedPrice: "₹99",
        timeline: "24–48 hours",
        shortDescription: "An elegant, romantic web greeting to celebrate couple milestones.",
        included: [
          "Couple names and heartfelt anniversary note",
          "Romantic, clean typography & subtle motion effects",
          "Photo gallery placeholder (up to 4 photos)",
          "Mobile-friendly touch interaction",
          "Direct shareable link for WhatsApp & social apps",
          "Free temporary hosting link included"
        ],
        limitations: [
          "Single-page layout",
          "Static content (no database)",
          "Custom domain not included"
        ]
      },
      {
        id: "personalised-greeting",
        name: "Personalised Greeting Website",
        startingPrice: 199,
        formattedPrice: "₹199",
        timeline: "1–2 days",
        shortDescription: "Tailored greeting with multiple photo memories and animated transitions.",
        included: [
          "Custom theme (Festival, Congratulations, Farewell, Graduation)",
          "Up to 8 curated photos in an interactive gallery",
          "Custom typography and countdown or memory timeline",
          "Smooth scroll animations and interactive tap cards",
          "Optimised for fast mobile loading",
          "Shareable website link"
        ],
        limitations: [
          "Custom audio playback depends on browser autoplay permissions",
          "Custom domain registration not included"
        ]
      },
      {
        id: "premium-interactive-greeting",
        name: "Premium Interactive Greeting",
        startingPrice: 499,
        formattedPrice: "₹499",
        timeline: "2–3 days",
        shortDescription: "Rich multi-section experience with interactive mini-games, memory vault, or background music.",
        included: [
          "Multi-section interactive storytelling experience",
          "Photo vault / memory timeline slider",
          "Optional background music integration (with user play/pause control)",
          "Interactive surprise elements (tap to reveal, virtual gift box)",
          "High-definition responsive styling across all screens",
          "QR Code generated for easy gift card / invitation sharing"
        ],
        limitations: [
          "Client provides media files (photos/music audio)",
          "Custom domain optional at actual registrar cost"
        ]
      }
    ]
  },
  {
    id: "portfolio-business",
    categoryName: "Portfolio & Business Websites",
    categorySlug: "portfolio-business",
    description: "Modern, professional websites designed to showcase personal skills, creative work, or established business credibility.",
    packages: [
      {
        id: "personal-portfolio",
        name: "Personal Portfolio Website",
        startingPrice: 350,
        formattedPrice: "₹350",
        timeline: "2–4 days",
        shortDescription: "A sleek online presence introducing who you are, your bio, and your projects.",
        included: [
          "Single-page modern personal profile",
          "Hero section, About Me, Skills overview",
          "Project showcase section (up to 4 projects)",
          "Direct contact links & social profile buttons",
          "100% mobile-friendly responsive layout"
        ],
        limitations: [
          "Domain name & web hosting not included (guidance provided)",
          "Content and project descriptions supplied by client"
        ]
      },
      {
        id: "student-portfolio",
        name: "Student Portfolio Website",
        startingPrice: 499,
        formattedPrice: "₹499",
        timeline: "3–5 days",
        shortDescription: "Designed for students, interns, and fresh graduates entering the professional world.",
        included: [
          "Professional resume/CV download button integration",
          "Education, coursework, certifications & skills breakdown",
          "Academic / personal project showcase with GitHub links",
          "Contact form linking directly to your email",
          "Clean, recruiter-friendly visual structure"
        ],
        limitations: [
          "Single-page or 2-page lightweight structure",
          "Domain & hosting fees not included"
        ]
      },
      {
        id: "creator-portfolio",
        name: "Creator Portfolio Website",
        startingPrice: 999,
        formattedPrice: "₹999",
        timeline: "4–6 days",
        shortDescription: "Built for designers, photographers, writers, and digital content creators.",
        included: [
          "Visual-rich grid layout with image & video embeds",
          "Case study sections with project overview cards",
          "Filterable project gallery by category",
          "Social media & YouTube/Instagram feeds or links",
          "Sleek dark or light studio aesthetics"
        ],
        limitations: [
          "Client provides portfolio imagery and media",
          "Domain & cloud hosting billed separately"
        ]
      },
      {
        id: "small-business-website",
        name: "Small Business Website",
        startingPrice: 1999,
        formattedPrice: "₹1,999",
        timeline: "5–8 days",
        shortDescription: "A credible 3 to 5 page online storefront for local shops, consultants, and service providers.",
        included: [
          "Up to 5 custom-styled pages (Home, About, Services, Gallery, Contact)",
          "Working enquiry / consultation contact form",
          "Google Maps location embed and WhatsApp click-to-chat",
          "On-page foundational SEO (title tags, meta descriptions)",
          "Fast loading speeds with responsive mobile design"
        ],
        limitations: [
          "Excludes e-commerce payment checkout",
          "Domain, server hosting, and business emails not included",
          "Copywriting/content creation provided by client"
        ]
      },
      {
        id: "premium-business-website",
        name: "Premium Business Website",
        startingPrice: 4999,
        formattedPrice: "₹4,999",
        timeline: "7–14 days",
        shortDescription: "Comprehensive web experience with interactive elements, brand strategy, and multi-page architecture.",
        included: [
          "Multi-page architecture (up to 8 custom designed pages)",
          "Custom visual branding & polished micro-interactions",
          "Lead capture forms with automated email notifications",
          "Complete SEO foundation & Open Graph social sharing tags",
          "Google Analytics / tag integration assistance",
          "14 days of post-launch bug fixing support"
        ],
        limitations: [
          "Third-party subscriptions (domain, email server, paid plugins) billed at actuals",
          "Database-driven custom dashboards require Web Application package"
        ]
      }
    ]
  },
  {
    id: "ecommerce-development",
    categoryName: "E-Commerce Website Development",
    categorySlug: "ecommerce",
    description: "Sell products directly to customers online with secure catalogues, shopping carts, and order management.",
    packages: [
      {
        id: "starter-store",
        name: "Starter Store",
        startingPrice: 10000,
        formattedPrice: "₹10,000",
        timeline: "10–18 days",
        shortDescription: "Essential online store for emerging brands launching up to 25 products.",
        included: [
          "Product catalogue with categories & individual detail pages",
          "Interactive shopping cart & checkout flow",
          "Payment gateway integration setup (Razorpay/Stripe/UPI)",
          "Order notification emails to customer & store owner",
          "Basic stock / inventory listing setup",
          "Mobile-first responsive shopping experience"
        ],
        limitations: [
          "Payment gateway merchant account verification required from client",
          "Hosting, domain, and gateway transaction fees not included"
        ]
      },
      {
        id: "business-store",
        name: "Business Store",
        startingPrice: 25000,
        formattedPrice: "₹25,000",
        timeline: "18–25 days",
        shortDescription: "Full-featured online store with admin management and customer accounts.",
        included: [
          "Expanded catalogue (up to 100 products configured)",
          "Product search, filtering, and sorting options",
          "Discount coupons & promotional banner integration",
          "Admin dashboard for managing orders, products & inventory",
          "Automated invoice / receipt email triggers",
          "Comprehensive payment integration & COD support option"
        ],
        limitations: [
          "Payment gateway setup requires active business bank account / GST",
          "Third-party SMS gateway / WhatsApp API requires external subscription"
        ]
      },
      {
        id: "premium-ecommerce",
        name: "Premium E-Commerce",
        startingPrice: 50000,
        formattedPrice: "₹50,000 to ₹1,00,000+",
        timeline: "4–8 weeks",
        shortDescription: "Custom, scalable e-commerce infrastructure for high-volume retail brands.",
        included: [
          "Bespoke UI/UX design tailored specifically to your brand",
          "Advanced filtering, search autocomplete, and recommendations",
          "Automated shipping partner API integration (Shiprocket/Delhivery)",
          "Customer accounts, order tracking, and wishlist system",
          "Multi-currency / multi-tax configuration options",
          "30 days dedicated post-launch maintenance & optimization"
        ],
        limitations: [
          "Custom quotation based on total SKU count and API integrations",
          "Cloud infrastructure and payment gateway merchant fees billed at actuals"
        ]
      }
    ]
  },
  {
    id: "web-applications",
    categoryName: "Web Application & App Development",
    categorySlug: "web-apps",
    description: "Custom software tools, dynamic business portals, client dashboards, and interactive web application prototypes.",
    packages: [
      {
        id: "custom-web-apps",
        name: "Custom Web Applications",
        startingPrice: null,
        formattedPrice: "Custom quotation based on requirements",
        timeline: "Based on scope",
        shortDescription: "Tailored web-based software built to solve specific business workflows.",
        included: [
          "Requirements analysis and architectural blueprint",
          "Clean frontend interface with responsive design",
          "Backend API development with Node.js / Express",
          "Database design and secure data storage",
          "Role-based user authentication and data protection"
        ],
        limitations: [
          "Final cost determined by feature complexity and database scope",
          "Native Android & iOS apps require separate cross-platform or native frameworks"
        ]
      },
      {
        id: "business-dashboards",
        name: "Business Management Dashboards",
        startingPrice: null,
        formattedPrice: "Custom quotation based on requirements",
        timeline: "Based on scope",
        shortDescription: "Visual control panels to track metrics, leads, orders, and company operations.",
        included: [
          "Data visualization charts, tables, and metric cards",
          "Filterable data views and CSV/Excel export tools",
          "Admin user roles and access controls",
          "Responsive tablet and desktop viewing modes"
        ],
        limitations: [
          "Dependent on data sources or API availability"
        ]
      },
      {
        id: "booking-applications",
        name: "Booking & Appointment Applications",
        startingPrice: null,
        formattedPrice: "Custom quotation based on requirements",
        timeline: "Based on scope",
        shortDescription: "Interactive calendar scheduling, consultation booking, and confirmation workflows.",
        included: [
          "Interactive date/time slot picker with availability rules",
          "Customer booking forms and confirmation system",
          "Email and SMS / WhatsApp notification integration",
          "Google Calendar sync or admin calendar review"
        ],
        limitations: [
          "Requires third-party notification or calendar API accounts"
        ]
      },
      {
        id: "app-prototypes",
        name: "Custom Application Prototypes (MVP)",
        startingPrice: null,
        formattedPrice: "Custom quotation based on requirements",
        timeline: "Based on scope",
        shortDescription: "Interactive working minimum viable products (MVPs) for startups and innovators.",
        included: [
          "Rapid prototyping of core functionality",
          "Investor/customer demo readiness",
          "Clean, modular codebase ready for future expansion"
        ],
        limitations: [
          "Focuses strictly on essential core features for rapid validation"
        ]
      }
    ]
  },
  {
    id: "additional-services",
    categoryName: "Additional Services & Maintenance",
    categorySlug: "additional",
    description: "Keep your digital presence fast, secure, modern, and bug-free with ongoing support.",
    packages: [
      {
        id: "website-redesign",
        name: "Website Redesign",
        startingPrice: 1499,
        formattedPrice: "₹1,499+",
        timeline: "3–7 days",
        shortDescription: "Modernise an outdated website with fresh visuals, responsive layouts, and faster loading speeds.",
        included: [
          "Full UI/UX refresh to modern standards",
          "Mobile-first responsive optimization",
          "Content migration from existing website",
          "Speed optimization for assets and scripts"
        ],
        limitations: [
          "Requires existing site access or asset files"
        ]
      },
      {
        id: "landing-page-dev",
        name: "Landing Page Development",
        startingPrice: 799,
        formattedPrice: "₹799",
        timeline: "2–4 days",
        shortDescription: "High-converting, laser-focused single page for product launches, ad campaigns, or events.",
        included: [
          "Persuasive layout structure with clear call-to-actions",
          "High conversion rate design best practices",
          "Form integration with email alerts",
          "Ultra-fast loading speed optimization"
        ],
        limitations: [
          "Single-page scope"
        ]
      },
      {
        id: "bug-fixing-ui",
        name: "Website Bug Fixing & UI Improvements",
        startingPrice: 299,
        formattedPrice: "₹299+",
        timeline: "24–48 hours",
        shortDescription: "Troubleshooting broken layouts, mobile display glitches, script errors, or form failures.",
        included: [
          "Detailed diagnosis of layout or script issues",
          "Fixing responsive breakpoint errors on mobile/tablet",
          "Contact form and script debugging",
          "Code cleanup and performance verification"
        ],
        limitations: [
          "Priced per issue scope; extensive refactoring quoted separately"
        ]
      },
      {
        id: "ongoing-maintenance",
        name: "Monthly Website Maintenance",
        startingPrice: 499,
        formattedPrice: "₹499 / month",
        timeline: "Ongoing",
        shortDescription: "Peace of mind support with periodic backups, content updates, and uptime checks.",
        included: [
          "Monthly asset and content updates (up to 2 hours)",
          "Security checks and dependency updates",
          "Periodic offline backup creation",
          "Priority email and WhatsApp support"
        ],
        limitations: [
          "Major feature additions quoted as separate projects"
        ]
      }
    ]
  }
];

module.exports = {
  pricingDisclaimer,
  services
};
