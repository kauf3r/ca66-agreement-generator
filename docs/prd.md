***
## Brownfield Product Requirements Document (PRD)

```markdown
# Brownfield PRD: Email Integration Feature

## Requirements

### Functional Requirements

* **FR1**: Upon successful form submission and agreement generation, the system must send an email containing the complete agreement text to the email address provided in the `yourEmail` field.

### Non-Functional Requirements

* **NFR1**: The process of sending the email must not significantly delay the API response to the user's browser.
* **NFR2**: API keys for the email service must be stored securely and not be exposed in the frontend or version control.

### Compatibility Requirements

* **CR1**: The existing functionality of generating and displaying the agreement on the screen must remain intact.
* **CR2**: A failure in the email sending process must not prevent the user from receiving the generated agreement on their screen. The API should still return a successful response.

## Technical Constraints and Integration Requirements

### Existing Technology Stack
The enhancement must be built using the existing project technology stack, which includes:
* **Framework**: Next.js (v14.2.3)
* **Language**: TypeScript
* **UI**: React (v18)
* **Styling**: Tailwind CSS

### Integration Approach
* **Primary Integration Point**: The new email logic will be added to the existing API route at `src/app/api/generate/route.ts`.
* **Email Service**: The **Resend** Node.js client library will be added as a dependency.
* **Execution Flow**: The email will be sent *after* the agreement text has been successfully generated within the API route.
* **Secrets Management**: The API key for the Resend service must be managed via environment variables (`.env.local`) and should not be hardcoded.

### Code Organization and Standards
* **Existing Patterns**: All new code must follow the established Next.js App Router file structure and conventions.
* **New Modules**: It is recommended to create a new, separate service module at `src/lib/email.ts` to contain all email-specific logic, keeping the API route clean.

### Risk Assessment and Mitigation
* **Testing**: The project currently lacks automated tests. The new email service module should be written as a pure, testable function, and a unit test should be added for it.
* **Error Handling**: The new email functionality must include specific error handling. A failure to send an email should be logged but must not cause the main API endpoint to fail.

## Epic 1: Implement Agreement Emailing

* **Epic Goal**: To automatically email a copy of the generated agreement to the user upon successful form submission, providing them with a persistent record of the document.

### Stories

**Story 1.1: Configure Email Service**
* *As a developer, I want to install and configure an email service client, so that the application has the foundational capability to send emails.*
* **Acceptance Criteria**:
    1.  The `resend` library is added as a dependency to the project.
    2.  A new service module (`src/lib/email.ts`) is created to house email logic.
    3.  A secure method for managing the email service API key using environment variables is established.

**Story 1.2: Implement Core Email Sending Logic**
* *As a developer, I want to create a reusable function that sends a formatted email, so that this function can be called by the API.*
* **Acceptance Criteria**:
    1.  The function in `src/lib/email.ts` can successfully send a test email with the agreement text as content.
    2.  The function includes specific error handling for potential email service failures.
    3.  The function accepts parameters for the recipient's email, subject, and body content.

**Story 1.3: Integrate Email Feature into API**
* *As a system, I want to trigger the email-sending function after an agreement is generated, so that the user receives their agreement via email.*
* **Acceptance Criteria**:
    1.  The `POST /api/generate` route successfully calls the email function after generating the agreement.
    2.  The end-user successfully receives an email containing the agreement text.
    3.  A failure in the email-sending process is logged correctly and does **not** prevent the API from returning the agreement text to the frontend.