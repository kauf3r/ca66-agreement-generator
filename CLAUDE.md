# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CA-66 Airport Use Agreement Generator** - A single-page web application that generates legal usage license agreements for Monterey Bay Academy Airport. Built for AirSpace Integration, Inc. to streamline pilot onboarding while ensuring strict safety, insurance, and operational compliance.

## Architecture

**Technology Stack:**
- Vanilla JavaScript (ES6+ with modules) - zero dependencies for security
- HTML5 + CSS3 (Grid & Flexbox) - no frameworks
- Client-side only - no backend, no data persistence
- Deployment: Vercel with automatic HTTPS

**Core Components:**
```javascript
const FormValidator = {
  validateEmail: (email) => { /* ... */ },
  validatePilotHours: (hours) => { /* min 300 required */ },
  validateInsurance: (coverage) => { /* min $1M required */ }
};

const AgreementGenerator = {
  template: `...legal agreement template...`,
  generate: (data) => { /* merge data with template */ },
  formatForPrint: (html) => { /* 8.5x11 print styles */ }
};
```

## Development Commands

**Local Development:**
```bash
# Python (recommended)
python -m http.server 8000

# Node.js alternative
npx http-server

# VS Code Live Server extension (preferred in VS Code)
```

**Deployment:**
```bash
# Deploy to production
vercel --prod

# Link repository (first time)
vercel
```

**Testing & Validation:**
```bash
# Accessibility audit
npm install -g pa11y
pa11y http://localhost:8000

# HTML validation (manual)
# Visit: https://validator.w3.org/

# Performance audit
# Chrome DevTools > Lighthouse
```

## Critical Business Rules

**Mandatory Validations:**
- Pilot must have 300+ flight hours (hard requirement)
- Insurance coverage minimum $1,000,000
- Insurance must include 7 specific additional insureds:
  1. Monterey Bay Academy
  2. AirSpace Integration, Inc.
  3. Andy Kaufman
  4. Property owner
  5. Management companies
  6. Agents and employees
  7. Successors and assigns

**Agreement Terms:**
- Annual fee: $250 (supports aviation education)
- Sabbath observance: No operations Friday sunset to Saturday sunset
- Agreement expires: Earlier of insurance expiry OR 1 year from start
- Aircraft restrictions: Single Engine Reciprocating only, MTOW < 12,500 lbs

**Form Structure:**
1. **Licensee Information** - Name, address, contact, pilot cert, flight hours
2. **Aircraft Details** - Registration, make/model, weight confirmation
3. **Insurance Information** - Company, policy details, coverage amounts
4. **Agreement Terms** - Auto-calculated dates, fee display, acknowledgments

## Key Features

**Data Flow:**
1. User Input → Client Validation → State Update
2. Preview Generation → Final Agreement → Print/Sign

**Template System:**
- JavaScript template literals with placeholder replacement
- Print-optimized CSS (@media print)
- Signature blocks and legal formatting
- Exhibit A (Airport Rules) appendix

**Responsive Design:**
- Mobile-first approach (320px base)
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly targets (44px minimum)
- Print styles for 8.5x11 paper

## Security Considerations

- No backend = no attack surface for data breaches
- Client-side only = no stored PII
- Input sanitization for XSS prevention
- HTTPS required for all deployments
- No external dependencies = reduced supply chain risk

## Performance Targets

- First Contentful Paint: < 1.0s
- Time to Interactive: < 2.0s
- Total Page Size: < 100KB
- Lighthouse Score: > 95
- Mobile-responsive and accessible

## File Organization

```
/
├── index.html          # Main application
├── styles.css          # All styling (including print)
├── script.js           # Core JavaScript
├── agreement-template.js # Legal template
└── validation.js       # Form validation logic
```

## Development Notes

- Use semantic HTML for accessibility
- Implement keyboard navigation
- Test print preview functionality
- Validate all inputs before agreement generation
- Handle edge cases (past dates, special characters)
- Mobile-first responsive design
- No console.log statements in production