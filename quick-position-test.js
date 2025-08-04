/**
 * Quick Position Test - Verify Updated maxWidth Values
 * 
 * This script tests if our updated position configuration eliminates
 * the width constraint warnings we were seeing before.
 */

import { PDFLibGenerator } from './assets/js/pdf-lib-generator.js';
import { PDFPositionConfig } from './assets/js/pdf-position-config.js';
import { DateCalculator } from './assets/js/calculator.js';

// Test data that was causing width warnings
const testData = {
    'licensee-name': 'John A. Smith',
    'phone': '(831) 555-0123',
    'email': 'john.smith@skywardaviation.com',
    'aircraft-registration': 'N847SA',
    'aircraft-make-model': 'Cessna 172S Skyhawk', // Was causing width warning
    'insurance-company': 'Avemco Insurance Company', // Was causing width warning  
    'insurance-address': '411 Aviation Way',
    'insurance-city': 'Frederick',
    'insurance-state': 'MD',
    'insurance-zip': '21701',
    'insurance-phone': '(800) 638-8440', // Was causing width warning
    'policy-number': 'AV-2025-001847', // Was causing width warning
    'policy-expiry': '2025-12-31',
    'coverage-amount': 1000000,
    'start-date': '2025-02-01', // Date fields were causing width warnings
    'end-date': '2026-02-01'
};

console.log('🧪 Testing Updated Position Configuration...');
console.log('📋 Test data prepared with problematic values that caused width warnings');

// Test field mapping to verify our improvements
console.log('\n📊 Analyzing Field Mapping:');
Object.entries(testData).forEach(([key, value]) => {
    const positions = PDFPositionConfig.getAllPositions(`[${key.toUpperCase().replace(/-/g, '-')}]`);
    if (positions.length > 0) {
        positions.forEach((pos, index) => {
            const textLength = String(value).length;
            const estimatedWidth = textLength * (pos.size || 10) * 0.6; // Rough text width estimation
            const fitsInWidth = estimatedWidth <= pos.maxWidth;
            
            console.log(`  ${key}: "${value}" (${textLength} chars)`);
            console.log(`    Position ${index + 1}: maxWidth=${pos.maxWidth}px, estimated=${Math.round(estimatedWidth)}px, fits=${fitsInWidth ? '✅' : '❌'}`);
        });
    }
});

console.log('\n🎯 Field Width Analysis Complete');
console.log('📈 Expected improvements:');
console.log('  - AIRCRAFT-MAKE-MODEL: 100px → 180px');
console.log('  - POLICY-NUMBER: 25px → 120px');
console.log('  - INSURANCE-PHONE: 25px → 100px');
console.log('  - Date fields: 15px → 80px');
console.log('  - LICENSEE fields: 75px → 120px');

export { testData };