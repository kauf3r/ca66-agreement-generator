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
- Git repository initialization with comprehensive structure
- Professional documentation and project organization

**✅ Milestone 2: HTML Form Structure (COMPLETE)**
- Complete 4-section form with all required fields
- Responsive design with professional styling
- Accessibility compliance (ARIA labels, fieldsets, legends)
- Form progress indicators and user feedback systems

**✅ Phase 1: JavaScript Core Functionality (COMPLETE)**
- **Safety-Critical Validation Engine:** 300+ flight hours and $1M insurance enforcement
- **Real-time Form Feedback:** Live validation with error/success states and progress tracking
- **Business Logic Implementation:** Date calculations, Sabbath observance, fee management
- **Auto-population System:** Dynamic date calculations and fee displays
- **Data Collection & Management:** Form state tracking, input sanitization, validation management

**✅ Phase 3: Agreement Generation (COMPLETE)**
- **Legal Agreement Template System:** Complete legal document with all required sections
- **Data Merging Engine:** Form data integration with template placeholders
- **Document Generation Workflow:** End-to-end agreement creation and preview
- **Print Optimization:** Professional legal document formatting for 8.5x11 paper
- **UI Integration:** Seamless form-to-document generation workflow

### Recent Bug Fixes & Improvements (July 21, 2025 Session)

**🔧 Critical Bug Fixes:**
1. **Form Field Name Mapping** - Fixed mismatch between HTML field names and JavaScript expectations (26 fields updated)
2. **Button Validation Logic** - Resolved infinite recursion loop preventing Generate Agreement button from enabling
3. **DocumentGenerator Access** - Fixed module import issues for proper agreement generation workflow
4. **End Date Logic** - Updated to always use 1 year from start date instead of "earlier of insurance/1 year"
5. **Aircraft Registration Validation** - Fixed regex pattern to allow 5-digit registrations (N12345)
6. **Auto-Population Logic** - Fixed form field updates to consistently show 1 year from start date

**📝 Content Updates:**
- **Licensor Information**: Updated from "Andy Kaufman" to "Christopher Bley" throughout all templates and configs
- **Additional Insureds**: Updated insurance requirements to reflect correct signatory
- **Agreement Terms**: Clarified that agreements are always 1-year terms with insurance expiry noted separately

### Current Technical State

**✅ Fully Functional System:**
- **End-to-End Workflow**: Form validation → Agreement generation → Print-ready document
- **All Validations Working**: 300+ hours, $1M+ insurance, required field validation
- **Professional Legal Documents**: Complete agreements with proper formatting and signatures
- **Real-time Feedback**: Button states, progress tracking, validation messaging
- **Print Optimization**: Legal document formatting with proper margins and typography

**Business Logic Enforcement:**
- Flight hours minimum: 300 hours (safety requirement)
- Insurance minimum: $1,000,000 coverage (legal requirement)
- **Agreement expiry: ALWAYS 1 year from start date** (insurance expiry noted separately)
- Insurance validation: Must be >30 days in future
- Christopher Bley as AirSpace Integration representative

**Application Architecture:**
- ES6 modular JavaScript with clean separation of concerns
- Complete form-to-document generation pipeline
- Professional error handling and user feedback
- Print-ready legal document generation
- Accessibility and responsive design compliance

### Ready for Deployment

**✅ Core Functionality Complete:**
- Form validation system operational
- Agreement generation working end-to-end
- Legal document templates with proper formatting
- Print functionality tested and working
- Professional user experience with real-time feedback

**Remaining Tasks:**
- Add complete state dropdown (currently has limited states)
- Create GitHub repository and push code
- Deploy to Vercel production environment
- Final cross-browser testing

The CA-66 Agreement Generator is now a fully functional legal document generation system ready for production deployment.

## Project Milestones

- Milestone 2 completion

## Memories

- The CA-66 Agreement Generator is now functionally complete with all Phase 1-3 requirements implemented.