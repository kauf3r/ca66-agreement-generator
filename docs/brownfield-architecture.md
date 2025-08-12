CA66 Agreement Generator Brownfield Architecture Document
Introduction
This document captures the CURRENT STATE of the CA66 Agreement Generator codebase, including its patterns and components. It serves as a reference for AI agents working on the enhancement to add email functionality. 

Document Scope
Focused on areas relevant to: 

Adding a feature to email the generated agreement after form submission. 

Change Log
Date	Version	Description	Author
2025-08-08	1.0	Initial brownfield analysis for email feature.	Mary (Analyst)

Export to Sheets
Quick Reference - Key Files and Entry Points
Critical Files for Understanding the System

Main Entry: src/app/page.tsx (The main page component) 


Core Business Logic: src/app/api/generate/route.ts (The API endpoint that handles form submission and agreement generation) 


Key Components: src/components/AgreementForm.tsx, src/components/GeneratedAgreement.tsx 


Configuration: next.config.mjs, tailwind.config.ts 

Enhancement Impact Areas

src/app/api/generate/route.ts: This file will need to be modified to add the email-sending logic. 

A new service file, likely 

src/lib/email.ts, will be needed to encapsulate the email-sending functionality. 


package.json: Will require a new dependency for an email service client (e.g., Nodemailer, SendGrid, Resend). 

High Level Architecture
Technical Summary
The project is a Next.js full-stack application that provides a user interface for filling out a form and an API endpoint to generate a text-based agreement from that form data. The application is styled with Tailwind CSS. The planned enhancement will integrate a third-party email service into the existing API endpoint to mail the generated agreement.

Actual Tech Stack (from package.json)
Category	Technology	Version	Notes
Framework	Next.js	14.2.3	
Language	TypeScript	5	
UI	React	18	
Styling	Tailwind CSS	3.4.1	
Validation	Zod	^3.23.8	For form validation

Export to Sheets
Repository Structure Reality Check
Type: Polyrepo (Single standalone repository)

Package Manager: npm

Notable: Standard Next.js App Router structure.

Source Tree and Module Organization
Project Structure (Actual)
Plaintext

project-root/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts    # Core logic for handling submission
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Main application page
│   ├── components/
│   │   ├── AgreementForm.tsx       # The main form component
│   │   └── GeneratedAgreement.tsx  # Component to display output
│   └── lib/
│       └── utils.ts
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
└── tsconfig.json
Key Modules and Their Purpose
AgreementForm: src/components/AgreementForm.tsx - A client-side component that uses zod for validation and manages form state. It submits data to the /api/generate endpoint.

API Route: src/app/api/generate/route.ts - A backend endpoint that receives form data, processes it, and returns the generated agreement text as a response. This is the primary integration point for the new feature.

Data Models and APIs
Data Models
The primary data model is defined by the Zod schema in src/components/AgreementForm.tsx.

User Model: Implicitly defined by form fields:

governingLaw: string

counterpartyName: string

counterpartyAddress: string

counterpartyEmail: string

counterpartyWallet: string

yourName: string

yourAddress: string

yourEmail: string

yourWallet: string

API Specifications
Endpoint: POST /api/generate

Request Body: A JSON object matching the User Model defined above.

Success Response: 200 OK with a JSON payload: { "agreementText": "..." }

Error Response: 500 Internal Server Error with a JSON payload: { "error": "Failed to generate agreement" }

Technical Debt and Known Issues

No Unit or Integration Tests: The project currently has no automated tests, which increases the risk of regressions. 


Minimal Error Handling: The API endpoint has a generic try...catch block that returns a 500 status code on any failure, without specific error logging or reporting. 


No Secrets Management: There is no defined pattern for managing API keys or secrets, which will be required for the email service. 

Development and Deployment
Local Development Setup
Run npm install to install dependencies.

Run npm run dev to start the development server.

Build and Deployment Process

Build Command: npm run build 

Deployment: The README.md indicates deployment is handled via Vercel.

Impact Analysis for Email Enhancement
Files That Will Need Modification

src/app/api/generate/route.ts: To add the email sending logic. 

package.json: To add a new email client dependency.

New Files/Modules Needed

src/lib/email.ts (Recommended): A new module to abstract the email service client and logic. 


.env.local or similar: A file to manage the email service API key securely. 

Integration Considerations
The email functionality should be triggered only after the agreement text is successfully generated.

The function should handle potential email service failures gracefully without preventing the agreement from being returned to the user.

An API key for the chosen email service must be managed securely and not hardcoded.