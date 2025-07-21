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

## Session Summary (Last Updated: July 21, 2025)

### Completed Implementation Progress

**✅ Milestone 1: Project Setup & Structure (COMPLETE)**
- Full project architecture with modular CSS and JavaScript
- Semantic HTML5 structure with accessibility features
- Vercel deployment configuration with security headers
- Professional README and comprehensive documentation

**✅ Milestone 2: HTML Form Structure (COMPLETE)**
- Complete 4-section form with all required fields:
  1. Licensee Information (name, address, contact, pilot cert, flight hours)
  2. Aircraft Information (registration, make/model, restrictions, confirmations)
  3. Insurance Information (company details, policy info, coverage validation)
  4. Agreement Terms (auto-populated dates, fee display, acknowledgments)
- Responsive CSS Grid layout with professional styling
- Accessibility compliance (ARIA labels, fieldsets, legends)

**✅ Phase 1: JavaScript Core Functionality (COMPLETE)**
- **Safety-Critical Validation Engine:** 300+ flight hours and $1M insurance enforcement
- **Real-time Form Feedback:** Live validation with error/success states and progress tracking
- **Business Logic Implementation:** Agreement expiry calculation, Sabbath observance, date management
- **Auto-population System:** Start dates, end dates, fee display ($250.00)
- **Data Collection & Management:** Form state tracking, input sanitization, validation state management
- **Professional UX:** Auto-formatting, smooth scrolling, loading states, confirmation dialogs

### Current Technical State

**Form Validation Status:**
- 27 required fields with comprehensive validation
- Real-time progress tracking (0-100%)
- Professional error messaging with visual feedback
- Input sanitization and XSS prevention
- Auto-formatting for phone numbers and aircraft registrations

**Business Logic Enforcement:**
- Flight hours minimum: 300 hours (safety requirement)
- Insurance minimum: $1,000,000 coverage (legal requirement)
- Agreement expiry: Earlier of insurance expiry OR 1 year from start
- Insurance validation: Must be >30 days in future
- All 7 additional insureds configured in system

**Application Architecture:**
- ES6 modular JavaScript with clean separation of concerns
- Comprehensive error handling and edge case management
- Real-time data collection with sanitization
- Form state management with validation tracking
- Progressive enhancement with graceful degradation

### Ready for Next Phase

**Phase 3: Agreement Generation (NEXT)**
- All form data validated and prepared for template merging
- Business logic calculations complete (dates, fees, validation flags)
- Data structure ready for legal document generation
- Template system ready for implementation

**Testing Status:**
- Form validation thoroughly tested for all business rules
- Real-time feedback system operational
- Auto-population and date calculations verified
- Professional UX interactions confirmed

The application now provides full form functionality with safety-critical validation and is ready for agreement generation implementation.

## Project Milestones

- Milestone 2 completion