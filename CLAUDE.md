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

[... rest of existing content remains the same ...]

## Memories

- **July 29, 2025**: **v1.0 Release** - Complete CA-66 Agreement Generator with fillable PDF system production-ready
- **July 30, 2025**: Created comprehensive development roadmap for future document management features
- **August 1, 2025**: Git pushed