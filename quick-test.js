// Quick test of the improved PDF generation system
// Run this in browser console on http://localhost:8000

console.log('🔧 Testing improved PDF generation system...');

// Sample test data
const testData = {
    'licensee-name': 'Test Pilot User',
    'phone': '(555) 123-4567', 
    'email': 'test@example.com',
    'aircraft-registration': 'N12345',
    'aircraft-make-model': 'Cessna 172',
    'insurance-company': 'Test Insurance Co.',
    'policy-number': 'TEST-001',
    'start-date': '2025-01-15',
    'end-date': '2026-01-15'
};

// Test the template detection and field mapping
async function runQuickTest() {
    try {
        console.log('📄 Testing fillable template detection...');
        
        // Test if fillable template exists
        const response = await fetch('assets/examples/CA66-Agreement-Form.pdf');
        if (response.ok) {
            console.log('✅ Fillable template found');
            
            const bytes = await response.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(bytes);
            const form = pdfDoc.getForm();
            const fields = form.getFields();
            
            console.log(`📋 Form has ${fields.length} fields`);
            if (fields.length > 0) {
                console.log('🏷️ Field names:', fields.map(f => f.getName()));
            }
        } else {
            console.log('⚠️ Fillable template not found, will use text overlay');
        }
        
        console.log('🚀 Testing PDF generation...');
        
        // Import and test the modules
        const { PDFLibGenerator } = await import('./assets/js/pdf-lib-generator.js');
        const { PDFFiller } = await import('./assets/js/pdf-filler.js');
        
        console.log('✅ Modules imported successfully');
        
        // Test data preparation
        const pdfData = PDFFiller.preparePDFData(testData);
        console.log('📊 PDF data prepared:', Object.keys(pdfData).length, 'fields');
        
        // Test PDF generation with improved system
        const startTime = performance.now();
        const pdfBytes = await PDFLibGenerator.generateFilledPDF(testData);
        const endTime = performance.now();
        
        console.log('✅ PDF generated successfully!');
        console.log(`📄 Size: ${Math.round(pdfBytes.length / 1024)}KB`);
        console.log(`⏱️ Time: ${(endTime - startTime).toFixed(2)}ms`);
        
        // Create download link
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test-improved-pdf.pdf';
        link.textContent = '💾 Download Test PDF';
        link.click();
        
        console.log('🎉 Test completed successfully!');
        
        return {
            success: true,
            size: pdfBytes.length,
            duration: endTime - startTime,
            fields: Object.keys(pdfData).length
        };
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run the test
runQuickTest().then(result => {
    console.log('🏁 Final result:', result);
});

console.log('Test started - check console for results...');