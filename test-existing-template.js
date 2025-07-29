/**
 * Test script to analyze the existing CA66-Agreement-Form.pdf template
 * and test the improved PDF generation system
 */

console.log('🔍 Testing existing fillable PDF template...');

async function testExistingTemplate() {
    try {
        // Load the existing fillable template
        const templatePath = 'assets/examples/CA66-Agreement-Form.pdf';
        console.log(`📄 Loading template: ${templatePath}`);
        
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Template not found: ${response.status}`);
        }
        
        const templateBytes = await response.arrayBuffer();
        console.log(`✅ Template loaded: ${Math.round(templateBytes.byteLength / 1024)}KB`);
        
        // Load with pdf-lib
        const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        console.log(`📋 Form analysis results:`);
        console.log(`   Pages: ${pdfDoc.getPageCount()}`);
        console.log(`   Form fields: ${fields.length}`);
        
        if (fields.length > 0) {
            console.log(`\n🏷️  Available form fields:`);
            fields.forEach((field, index) => {
                const name = field.getName();
                const type = field.constructor.name;
                console.log(`   ${index + 1}. "${name}" (${type})`);
            });
            
            // Test field mapping with sample data
            const sampleData = {
                'licensee-name': 'John Doe Test',
                'phone': '(555) 123-4567',
                'email': 'john@example.com',
                'aircraft-registration': 'N12345',
                'start-date': '2025-01-15'
            };
            
            console.log(`\n🧪 Testing field mapping with sample data...`);
            
            // Import the improved modules
            const { PDFFiller } = await import('./assets/js/pdf-filler.js');
            const pdfData = PDFFiller.preparePDFData(sampleData);
            
            console.log(`✅ PDF data prepared: ${Object.keys(pdfData).length} fields`);
            
            // Test field matching
            let matchCount = 0;
            const fieldNames = fields.map(f => f.getName());
            
            Object.keys(pdfData).forEach(dataKey => {
                const variations = [
                    dataKey,
                    dataKey.toLowerCase(),
                    dataKey.toUpperCase(),
                    dataKey.replace(/[-_]/g, ' '),
                    dataKey.replace(/[-_]/g, ''),
                ];
                
                const found = variations.some(variation => fieldNames.includes(variation));
                if (found) {
                    matchCount++;
                    console.log(`   ✅ Match found for: ${dataKey}`);
                } else {
                    console.log(`   ⚠️  No match for: ${dataKey}`);
                }
            });
            
            console.log(`\n📊 Field matching results:`);
            console.log(`   Data fields: ${Object.keys(pdfData).length}`);
            console.log(`   PDF fields: ${fields.length}`);
            console.log(`   Matches: ${matchCount}`);
            console.log(`   Match rate: ${Math.round((matchCount / Object.keys(pdfData).length) * 100)}%`);
            
            if (matchCount > 0) {
                console.log(`\n🎉 Template is compatible! Ready for fillable form approach.`);
                return {
                    success: true,
                    templateFields: fields.length,
                    dataFields: Object.keys(pdfData).length,
                    matches: matchCount,
                    matchRate: Math.round((matchCount / Object.keys(pdfData).length) * 100)
                };
            } else {
                console.log(`\n⚠️  No field matches found. May need field name adjustments.`);
                return {
                    success: false,
                    reason: 'No field name matches',
                    templateFields: fields.length,
                    dataFields: Object.keys(pdfData).length
                };
            }
            
        } else {
            console.log(`⚠️  No form fields found in template`);
            return {
                success: false,
                reason: 'No form fields in template'
            };
        }
        
    } catch (error) {
        console.error(`❌ Template test failed:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testExistingTemplate };
} else if (typeof window !== 'undefined') {
    window.testExistingTemplate = testExistingTemplate;
}

// Auto-run if loaded directly
if (typeof window !== 'undefined' && window.PDFLib) {
    testExistingTemplate().then(result => {
        console.log('\n🏁 Test completed:', result);
    });
} else {
    console.log('⏳ Waiting for PDF-lib to load...');
}