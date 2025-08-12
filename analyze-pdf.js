/**
 * PDF Field Analysis Script
 * Run this in the browser console to analyze the PDF template
 */

async function analyzePDF() {
    try {
        console.log('🔍 Analyzing PDF Template...');
        
        // Load the PDF template
        const templatePath = 'assets/examples/[TEMPLATE] New CA66 Monterey Bay Academy Airport License Agreement_July29.pdf';
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status}`);
        }
        
        const pdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        
        console.log(`📄 PDF loaded: ${pdfDoc.getPageCount()} pages`);
        
        // Get form and analyze fields
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        console.log(`📋 Form Fields Found: ${fields.length}`);
        
        if (fields.length === 0) {
            console.log('❌ No fillable form fields found. This PDF uses text placeholders.');
            console.log('📝 Current system uses coordinate-based text overlay which is correct for this template.');
            return {
                hasFormFields: false,
                fieldCount: 0,
                fields: [],
                pageCount: pdfDoc.getPageCount()
            };
        } else {
            console.log('✅ Fillable form fields found:');
            
            const fieldDetails = [];
            fields.forEach((field, index) => {
                const name = field.getName();
                const type = field.constructor.name;
                const isRequired = field.isRequired ? field.isRequired() : false;
                const isReadOnly = field.isReadOnly ? field.isReadOnly() : false;
                
                const fieldInfo = {
                    name,
                    type,
                    isRequired,
                    isReadOnly
                };
                
                fieldDetails.push(fieldInfo);
                console.log(`  ${index + 1}. ${name} (${type})`);
            });
            
            return {
                hasFormFields: true,
                fieldCount: fields.length,
                fields: fieldDetails,
                pageCount: pdfDoc.getPageCount()
            };
        }
        
    } catch (error) {
        console.error('❌ Error analyzing PDF:', error);
        return {
            error: error.message
        };
    }
}

// Auto-run if pdf-lib is available
if (typeof PDFLib !== 'undefined') {
    analyzePDF().then(result => {
        console.log('📊 Analysis Result:', result);
    });
} else {
    console.log('❌ PDFLib not loaded. Run this script in the browser with the PDF field analyzer page.');
}