# TOMITECH Compware Services Limited — Website Rebuild

Modern, conversion-focused B2B marketing website for **TOMITECH Compware Services Limited**, an established Lagos-based ICT and electronic security systems contractor.

Rebuilt strictly according to the Product Requirements Document (`tomitech-website-prd.pdf`) prepared by Inioluwa Elisha (Iniesta Automation Hub).

---

## 🏢 Overview

TOMITECH delivers enterprise-grade IP surveillance (CCTV), video management systems (VMS), biometric access control, Cisco structured networking, and Sophos cybersecurity across Nigeria. Proven deliverer of the **151-camera IP surveillance system for the New Tejuosho Market**, Yaba, Lagos.

---

## 🚀 Key Features

* **Authoritative Brand Identity**: High-contrast deep navy palette (`#070e18`, `#0a1424`) with conversion-focused red accents (`#d90429`).
* **Conversion-Driven Flow**:
  * Sticky header with persistent *"Request a Quote"* CTA and mobile direct calling.
  * Interactive Quote Request Form with client validation, honeypot spam protection, and instant modal feedback.
  * Drag-and-drop architectural floor plan & BOQ file uploader.
  * Floating WhatsApp button with pre-filled greeting.
* **Tier-1 Technology Partner Trust Strip**: Cisco Certified Partner, Microsoft Solutions, and Sophos Certified Security.
* **Detailed Project Case Studies**:
  * **New Tejuosho Ultra-Modern Market**: 151 IP cameras, 4 floors, 1Gbps fiber ring, Milestone VMS control room, 82% reduction in theft.
  * **Victoria Island Corporate Tower**: Biometric speed gates, anti-tailgating sensors, Sophos XGS firewall protection.
  * **Lekki Peninsula Gated Community**: 3.8km surge-protected fiber ring and waterfront thermal surveillance.
* **Interactive Project Lightbox**: High-resolution gallery with full project captions and filterable categories.
* **Dual Lagos Operational Hubs**: Interactive map switchers for **Ipaja Mainland HQ** and **Yaba Commercial Tech Hub**.
* **SEO & Compliance**:
  * Schema.org `LocalBusiness` and `Organization` structured data.
  * Open Graph and Twitter card meta tags.
  * `sitemap.xml` and `robots.txt`.
  * Fully compliant with the **Nigeria Data Protection Act (NDPA)**.

---

## 📁 Repository Structure

```
Tomitech/
├── assets/
│   ├── css/
│   │   └── style.css            # Responsive B2B design system & tokens
│   ├── js/
│   │   └── main.js              # Sticky header, lightbox, forms, drawers, FAQs
│   └── images/                  # Real installation, control room & team imagery
├── index.html                   # Homepage
├── services.html                # Comprehensive services hub (6 core capabilities)
├── projects.html                # Case studies & interactive lightbox portfolio
├── about.html                   # Company story, leadership, team & certifications
├── contact.html                 # Interactive quote request, floor plan upload & maps
├── blog.html                    # Engineering guides & SEO articles
├── privacy.html                 # NDPA compliance & privacy policy
├── sitemap.xml                  # XML sitemap
├── robots.txt                   # Crawler rules
├── tomitech-website-prd.pdf     # Client Product Requirements Document
└── README.md                    # Project documentation
```

---

## 🛠️ Local Development

To run the site locally, launch any static HTTP server in the repository root:

```bash
# Using Python:
python -m http.server 8080

# Using Node.js (npx serve):
npx serve .
```

Then open `http://localhost:8080` in your web browser.

---

## 📄 License & Credits

* **Client**: TOMITECH Compware Services Limited (`tomitechservices.com`)
* **PRD & Project Lead**: Inioluwa Elisha, Iniesta Automation Hub
