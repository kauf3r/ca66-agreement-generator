# CA-66 Airport Usage License Agreement Generator

A single-page web application that generates legal usage license agreements for Monterey Bay Academy Airport (CA-66). Built for AirSpace Integration, Inc. to streamline pilot onboarding while ensuring strict safety, insurance, and operational compliance.

## Features

- **Streamlined Pilot Onboarding** - Complete agreement generation in under 5 minutes
- **Safety-First Validation** - Enforces 300+ flight hour minimum and proper insurance
- **Legal Compliance** - Comprehensive waivers and indemnification protection
- **Sabbath Observance** - Built-in respect for MBA values (no Saturday operations)
- **Print-Ready Agreements** - Professional formatting for signature and filing
- **Mobile Responsive** - Works on all devices with touch-friendly interface

## Business Requirements

### Critical Validations
- Pilot must have 300+ flight hours (mandatory)
- Insurance coverage minimum $1,000,000
- Aircraft restrictions: Single Engine Reciprocating only, MTOW < 12,500 lbs
- Insurance must include 7 specific additional insureds

### Agreement Terms
- Annual fee: $250 (supports aviation education programs)
- Agreement expires: Earlier of insurance expiry OR 1 year from start date
- Sabbath observance: No operations Friday sunset to Saturday sunset

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Architecture**: Single-page application, client-side only
- **Security**: No backend, no data persistence, input sanitization
- **Deployment**: Vercel with automatic HTTPS and CDN
- **Performance**: <100KB total size, <2s load time

## Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/AirSpaceIntegration/ca66-airport-use-agreement.git
cd ca66-airport-use-agreement

# Start local development server
python -m http.server 8000
# OR
npx http-server
# OR use VS Code Live Server extension

# Open browser to http://localhost:8000
```

### Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
/
├── index.html              # Main application
├── assets/
│   ├── css/
│   │   ├── reset.css       # CSS reset/normalize
│   │   ├── variables.css   # CSS custom properties
│   │   ├── layout.css      # Grid/flexbox layouts
│   │   ├── forms.css       # Form styling
│   │   ├── print.css       # Print-specific styles
│   │   └── main.css        # Main stylesheet
│   ├── js/
│   │   ├── config.js       # Configuration constants
│   │   ├── validators.js   # Form validation logic
│   │   ├── calculator.js   # Date/fee calculations
│   │   ├── template.js     # Agreement template engine
│   │   ├── generator.js    # Document generation
│   │   ├── ui.js          # UI interactions
│   │   └── app.js         # Main application
│   └── images/
│       └── logo.svg       # CA-66/AirSpace logo
├── vercel.json            # Vercel deployment config
├── README.md              # Project documentation
├── PLANNING.md            # Detailed project planning
├── TASKS.md               # Development roadmap
└── CLAUDE.md              # Development guidance
```

## Form Sections

1. **Licensee Information** - Name, address, contact details, pilot certification, flight hours
2. **Aircraft Details** - Registration, make/model, weight confirmation, capability verification
3. **Insurance Information** - Company details, policy information, coverage amounts
4. **Agreement Terms** - Auto-calculated dates, fee display, acknowledgments

## Testing

```bash
# Accessibility audit
npm install -g pa11y
pa11y http://localhost:8000

# HTML validation: https://validator.w3.org/
# CSS validation: https://jigsaw.w3.org/css-validator/
# Performance audit: Chrome DevTools > Lighthouse
```

## Performance Targets

- First Contentful Paint: < 1.0s
- Time to Interactive: < 2.0s  
- Total Page Size: < 100KB
- Lighthouse Score: > 95
- Mobile responsive and accessible

## Development Timeline

- **Days 1-2**: Project setup and HTML structure
- **Days 3-4**: Form components and styling
- **Days 5-6**: JavaScript validation and interactions
- **Days 7-8**: Agreement template and generation
- **Days 9-10**: Testing and refinements
- **Days 11-12**: Cross-browser testing and accessibility
- **Days 13-14**: Deployment and documentation

## Legal Notice

This application generates legally binding agreements. All template content should be reviewed by qualified legal counsel before production use.

## License

Copyright © 2025 AirSpace Integration, Inc. All rights reserved.