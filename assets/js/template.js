// Legal Agreement Template System - Phase 3 Implementation with Exhibit A Module
import { ValidationHelpers } from './validators.js';
import { DateCalculator, FeeCalculator } from './calculator.js';
import { AppConfig } from './config.js';
import { getExhibitASection } from './exhibit-content.js';

// Security: HTML escaping function to prevent XSS attacks
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') {
    unsafe = String(unsafe || '');
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const AgreementTemplate = {
  // Main agreement template with placeholder variables
  template: `
    <div class="agreement-document">
      <header class="agreement-header">
        <h1>CA-66 AIRPORT USAGE LICENSE AGREEMENT</h1>
        <h2>Monterey Bay Academy Airport</h2>
        <div class="agreement-meta">
          <p><strong>Agreement Date:</strong> {{agreementDate}}</p>
          <p><strong>Agreement Period:</strong> {{startDate}} to {{endDate}}</p>
        </div>
      </header>

      <main class="agreement-body">
        <section class="parties-section">
          <h3>PARTIES</h3>
          <p>This Airport Usage License Agreement ("Agreement") is entered into between:</p>
          
          <div class="party-block">
            <p><strong>LICENSEE:</strong></p>
            <p>{{licenseeName}}{{#if companyName}} / {{companyName}}{{/if}}</p>
            <p>Phone: {{phone}} | Email: {{email}}</p>
          </div>
          
          <div class="party-block">
            <p><strong>LICENSOR:</strong></p>
            <p>Christopher Bley</p>
            <p>AirSpace Integration, Inc.</p>
            <p>Acting as operator of Monterey Bay Academy Airport (CA-66)</p>
          </div>
        </section>

        <section class="aircraft-section">
          <h3>AIRCRAFT INFORMATION</h3>
          <p><strong>Aircraft Registration:</strong> {{aircraftRegistration}}</p>
          <p><strong>Aircraft Make/Model:</strong> {{aircraftMakeModel}}</p>
          <p><strong>Restrictions:</strong> Single Engine Reciprocating Aircraft Only, MTOW < 12,500 lbs</p>
          <div class="notice-box">
            <p><strong>IMPORTANT:</strong> This agreement is valid ONLY for single-engine reciprocating aircraft with Maximum Takeoff Weight under 12,500 pounds capable of safe grass field operations.</p>
          </div>
        </section>

        <section class="insurance-section">
          <h3>INSURANCE REQUIREMENTS</h3>
          <p><strong>Insurance Company:</strong> {{insuranceCompany}}</p>
          <p>{{insuranceAddress}}, {{insuranceCity}}, {{insuranceState}} {{insuranceZip}}</p>
          <p><strong>Policy Number:</strong> {{policyNumber}}</p>
          <p><strong>Policy Expiration:</strong> {{policyExpiry}}</p>
          <p><strong>Coverage Amount:</strong> {{formattedCoverage}}</p>
          
          <div class="additional-insureds">
            <h4>REQUIRED ADDITIONAL INSUREDS</h4>
            <p>The insurance policy must name the following as additional insureds:</p>
            <ol>
              {{#each additionalInsureds}}
              <li>{{this}}</li>
              {{/each}}
            </ol>
          </div>
        </section>

        <section class="terms-section">
          <h3>TERMS AND CONDITIONS</h3>
          
          <div class="term-block">
            <h4>1. LICENSE PERIOD</h4>
            <p>This agreement is effective from <strong>{{startDate}}</strong> to <strong>{{endDate}}</strong> (one year from start date). <em>Note: Insurance policy expires on {{policyExpiry}} - insurance must be renewed if it expires before this agreement.</em></p>
          </div>

          <div class="term-block">
            <h4>2. ANNUAL FEE</h4>
            <p>Licensee shall pay an annual fee of <strong>{{feeFormatted}}</strong> to support aviation education programs at Monterey Bay Academy. This fee is due upon execution of this agreement.</p>
          </div>

          <div class="term-block">
            <h4>3. SABBATH OBSERVANCE</h4>
            <p><strong>MANDATORY:</strong> In respect for Monterey Bay Academy's values, NO AIRCRAFT OPERATIONS are permitted from Friday sunset to Saturday sunset. Violation of this restriction will result in immediate termination of this agreement.</p>
          </div>

          <div class="term-block">
            <h4>4. PILOT QUALIFICATIONS</h4>
            <p>Licensee certifies having a minimum of 300 total flight hours and maintains a valid medical certificate as required by Federal Aviation Regulations.</p>
          </div>

          <div class="term-block">
            <h4>5. COMPLIANCE WITH AIRPORT RULES</h4>
            <p>Licensee agrees to comply with all airport rules and regulations as set forth in Exhibit A, attached hereto and incorporated by reference.</p>
          </div>
        </section>

        <section class="liability-section">
          <h3>LIABILITY AND INDEMNIFICATION</h3>
          
          <div class="waiver-block">
            <h4>ASSUMPTION OF RISK AND WAIVER</h4>
            <p>Licensee acknowledges that aviation activities involve inherent risks and dangers. Licensee voluntarily assumes all risks associated with the use of the airport facilities and RELEASES, WAIVES, and DISCHARGES AirSpace Integration, Inc., Monterey Bay Academy, and all related parties from any and all liability.</p>
          </div>

          <div class="indemnity-block">
            <h4>INDEMNIFICATION</h4>
            <p>Licensee agrees to INDEMNIFY, DEFEND, and HOLD HARMLESS AirSpace Integration, Inc., Monterey Bay Academy, their officers, directors, employees, and agents from and against any and all claims, damages, losses, and expenses arising from Licensee's use of the airport.</p>
          </div>

          <div class="civil-code-waiver">
            <h4>CALIFORNIA CIVIL CODE SECTION 1542 WAIVER</h4>
            <p>Licensee waives the benefits of California Civil Code Section 1542, which provides: "A general release does not extend to claims that the creditor or releasing party does not know or suspect to exist in his or her favor at the time of executing the release and that, if known by him or her, would have materially affected his or her settlement with the debtor or released party."</p>
          </div>
        </section>

        <section class="execution-section">
          <h3>EXECUTION</h3>
          <p>By signing below, the parties agree to the terms and conditions set forth in this Agreement.</p>
          
          <div class="signature-blocks">
            <div class="signature-block">
              <div class="signature-line">
                <div class="line"></div>
                <p><strong>LICENSEE SIGNATURE</strong></p>
              </div>
              <p>{{licenseeName}}</p>
              <div class="date-line">
                <span>Date: </span>
                <div class="line-short"></div>
              </div>
            </div>

            <div class="signature-block">
              <div class="signature-line">
                <div class="line"></div>
                <p><strong>LICENSOR SIGNATURE</strong></p>
              </div>
              <p>Christopher Bley, AirSpace Integration, Inc.</p>
              <div class="date-line">
                <span>Date: </span>
                <div class="line-short"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="agreement-footer">
        <div class="page-break"></div>
${getExhibitASection()}
        
        <div class="document-footer">
          <p><em>CA-66 Airport Usage License Agreement | Generated {{generatedDate}} | Version {{version}}</em></p>
        </div>
      </footer>
    </div>
  `,

  // Convert template from {{field}} to [FIELD] format
  convertToESignatureFormat: (template) => {
    // Map of mustache fields to e-signature tags
    const fieldMap = {
      'agreementDate': 'START-DATE',
      'startDate': 'START-DATE', 
      'endDate': 'END-DATE',
      'licenseeName': 'LICENSEE',
      'companyName': 'COMPANY-NAME',
      'phone': 'PHONE',
      'email': 'EMAIL',
      'aircraftRegistration': 'AIRCRAFT-REGISTRATION',
      'aircraftMakeModel': 'AIRCRAFT',
      'insuranceCompany': 'INSURANCE-COMPANY',
      'insuranceAddress': 'INSURANCE-ADDRESS',
      'insuranceCity': 'INSURANCE-CITY',
      'insuranceState': 'INSURANCE-STATE',
      'insuranceZip': 'INSURANCE-ZIP',
      'policyNumber': 'INSURANCE-POLICY-NUMBER',
      'policyExpiry': 'INSURANCE-EXPIRATION',
      'formattedCoverage': 'INSURANCE-COVERAGE',
      'feeFormatted': 'ANNUAL-FEE'
    };
    
    let converted = template;
    
    // Replace {{field}} with [FIELD]
    Object.entries(fieldMap).forEach(([mustacheField, tagField]) => {
      const regex = new RegExp(`{{${mustacheField}}}`, 'g');
      converted = converted.replace(regex, `[${tagField}]`);
    });
    
    // Handle conditional sections - remove for e-signature format
    converted = converted.replace(/{{#if companyName}}.*?{{\/if}}/gs, '[COMPANY-NAME]');
    converted = converted.replace(/{{#each additionalInsureds}}.*?{{\/each}}/gs, '[ADDITIONAL-INSUREDS]');
    
    return converted;
  },

  // Generate complete agreement from form data
  generate: (agreementData) => {
    try {
      // Process and format the data
      const processedData = AgreementTemplate.processData(agreementData);
      
      // Replace placeholders with actual data
      let agreement = AgreementTemplate.template;
      
      if (AppConfig.templateFormat === 'esignature') {
        // Convert template to use [FIELD] format for e-signature compatibility
        agreement = AgreementTemplate.convertToESignatureFormat(agreement);
        
        // Build additional insureds as formatted text
        const insureds = processedData.additionalInsureds || [];
        const insuredsText = insureds.map((insured, index) => `${index + 1}. ${insured}`).join('\n');
        
        // Replace with actual values using the field map
        const replacements = {
          'START-DATE': processedData.agreementDate,
          'END-DATE': processedData.endDate,
          'LICENSEE': processedData.licenseeName,
          'COMPANY-NAME': processedData.companyName || '',
          'PHONE': processedData.phone,
          'EMAIL': processedData.email,
          'AIRCRAFT-REGISTRATION': processedData.aircraftRegistration || 'N/A',
          'AIRCRAFT': processedData.aircraftMakeModel,
          'INSURANCE-COMPANY': processedData.insuranceCompany,
          'INSURANCE-ADDRESS': processedData.insuranceAddress,
          'INSURANCE-CITY': processedData.insuranceCity,
          'INSURANCE-STATE': processedData.insuranceState,
          'INSURANCE-ZIP': processedData.insuranceZip,
          'INSURANCE-POLICY-NUMBER': processedData.policyNumber,
          'INSURANCE-EXPIRATION': processedData.policyExpiry,
          'INSURANCE-COVERAGE': processedData.formattedCoverage,
          'ANNUAL-FEE': processedData.feeFormatted,
          'ADDITIONAL-INSUREDS': insuredsText
        };
        
        Object.entries(replacements).forEach(([tag, value]) => {
          const regex = new RegExp(`\\[${tag}\\]`, 'g');
          agreement = agreement.replace(regex, escapeHtml(value || ''));
        });
      } else {
        // Use original {{field}} format - with XSS protection
        Object.keys(processedData).forEach(key => {
          const placeholder = new RegExp(`{{${key}}}`, 'g');
          agreement = agreement.replace(placeholder, escapeHtml(processedData[key] || ''));
        });
        
        // Handle conditional company name
        const companyCondition = /{{#if companyName}}(.*?){{\/if}}/g;
        agreement = agreement.replace(companyCondition, (match, content) => {
          return processedData.companyName ? content : '';
        });
        
        // Handle additional insureds list - with XSS protection
        const insureds = processedData.additionalInsureds || [];
        let insuredsHtml = '';
        insureds.forEach((insured, index) => {
          insuredsHtml += `<li>${escapeHtml(insured)}</li>`;
        });
        agreement = agreement.replace(/{{#each additionalInsureds}}.*?{{\/each}}/s, insuredsHtml);
      }
      
      return agreement;
      
    } catch (error) {
      console.error('Error generating agreement:', error);
      return AgreementTemplate.generateErrorTemplate(error);
    }
  },

  // Process and format form data for template
  processData: (rawData) => {
    const currentDate = new Date();
    
    return {
      // Licensee Information
      licenseeName: rawData.licenseeName || '[LICENSEE NAME]',
      companyName: rawData.companyName || null,
      phone: rawData.phone || '[PHONE]',
      email: rawData.email || '[EMAIL]',
      flightHoursConfirmed: rawData.flightHoursConfirmed || false,
      
      // Aircraft Information
      aircraftRegistration: rawData.aircraftRegistration || '[AIRCRAFT REGISTRATION]',
      aircraftMakeModel: rawData.aircraftMakeModel || '[AIRCRAFT MAKE/MODEL]',
      
      // Insurance Information
      insuranceCompany: rawData.insuranceCompany || '[INSURANCE COMPANY]',
      insuranceAddress: rawData.insuranceAddress || '[INSURANCE ADDRESS]',
      insuranceCity: rawData.insuranceCity || '[CITY]',
      insuranceState: rawData.insuranceState || '[STATE]',
      insuranceZip: rawData.insuranceZip || '[ZIP]',
      policyNumber: rawData.policyNumber || '[POLICY NUMBER]',
      policyExpiry: DateCalculator.formatDateForDisplay(rawData.policyExpiry) || '[POLICY EXPIRY]',
      formattedCoverage: ValidationHelpers.formatCurrency(rawData.coverageAmount) || '[COVERAGE AMOUNT]',
      
      // Agreement Terms
      startDate: DateCalculator.formatDateForDisplay(rawData.startDate) || DateCalculator.formatDateForDisplay(new Date()),
      endDate: (() => {
        // Always use 1 year from start date
        const startDate = new Date(rawData.startDate || new Date());
        const oneYearLater = DateCalculator.addOneYear(startDate);
        return DateCalculator.formatDateForDisplay(oneYearLater);
      })(),
      feeFormatted: FeeCalculator.formatFee(rawData.annualFee || 250),
      
      // Additional Insureds
      additionalInsureds: rawData.additionalInsureds || [
        'Monterey Bay Academy',
        'AirSpace Integration, Inc.',
        'Christopher Bley',
        'Property owner and management companies',
        'Agents and employees',
        'Successors and assigns',
        'All related parties'
      ],
      
      // Metadata
      agreementDate: DateCalculator.formatDateForDisplay(currentDate),
      generatedDate: currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      version: rawData.version || '1.0'
    };
  },

  // Error template if generation fails
  generateErrorTemplate: (error) => {
    return `
      <div class="agreement-document error">
        <header class="agreement-header">
          <h1>CA-66 AIRPORT USAGE LICENSE AGREEMENT</h1>
          <h2>Generation Error</h2>
        </header>
        <main class="agreement-body">
          <div class="error-message">
            <h3>Unable to Generate Agreement</h3>
            <p>An error occurred while generating your agreement. Please check your form data and try again.</p>
            <p><strong>Error Details:</strong> ${escapeHtml(error.message || 'Unknown error')}</p>
            <p>If this problem persists, please contact support.</p>
          </div>
        </main>
      </div>
    `;
  },

  // Format agreement for print (optimized for legal documents)
  formatForPrint: (html) => {
    // Add print-specific classes and formatting
    return html.replace(
      'class="agreement-document"', 
      'class="agreement-document print-ready"'
    );
  }
};

console.log('CA-66 Agreement Generator - Legal Template System loaded');
