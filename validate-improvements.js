/**
 * Validation Script for PDF Generation Improvements
 * Run this in the browser console at http://localhost:8000
 */

console.log('🔍 Validating PDF Generation Improvements...');

async function validateImprovements() {
    const results = {
        moduleLoading: false,
        templateDetection: false,
        fieldMapping: false,
        pdfGeneration: false,
        performance: null,
        errors: []
    };

    try {
        // Test 1: Module Loading
        console.log('📦 Testing module imports...');
        
        const { PDFLibGenerator } = await import('./assets/js/pdf-lib-generator.js');
        const { PDFFiller } = await import('./assets/js/pdf-filler.js');
        const { PDFGenerator } = await import('./assets/js/pdf-generator.js');
        
        if (PDFLibGenerator && PDFFiller && PDFGenerator) {
            results.moduleLoading = true;
            console.log('✅ All modules loaded successfully');
        } else {
            throw new Error('Module import failed');
        }

        // Test 2: Template Detection
        console.log('📄 Testing template detection...');
        
        try {
            const response = await fetch('assets/examples/CA66-Agreement-Form.pdf');
            if (response.ok) {
                const bytes = await response.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(bytes);
                const form = pdfDoc.getForm();
                const fields = form.getFields();
                
                results.templateDetection = true;
                console.log(`✅ Fillable template detected with ${fields.length} form fields`);
                
                if (fields.length > 0) {
                    console.log('🏷️ Sample fields:', fields.slice(0, 5).map(f => f.getName()));
                }
            } else {
                console.log('⚠️ Fillable template not found - will use text overlay fallback');
                results.templateDetection = 'fallback';
            }
        } catch (error) {
            console.log('⚠️ Template detection failed - using fallback');
            results.templateDetection = 'fallback';
        }

        // Test 3: Field Mapping
        console.log('🔗 Testing field mapping...');
        
        const testData = {
            'licensee-name': 'Test User',
            'phone': '555-1234',
            'email': 'test@example.com',
            'start-date': '2025-01-15',
            'aircraft-registration': 'N12345'
        };

        const pdfData = PDFFiller.preparePDFData(testData);
        const validation = PDFFiller.validatePDFData(pdfData);
        
        if (pdfData && Object.keys(pdfData).length > 0) {
            results.fieldMapping = true;
            console.log(`✅ Field mapping successful: ${Object.keys(pdfData).length} fields prepared`);
            console.log(`📊 Validation: ${validation.isValid ? 'passed' : 'warnings present'}`);
        } else {
            throw new Error('Field mapping failed');
        }

        // Test 4: PDF Generation
        console.log('🚀 Testing PDF generation...');
        
        const startTime = performance.now();
        const pdfBytes = await PDFLibGenerator.generateFilledPDF(testData);
        const endTime = performance.now();
        
        const duration = endTime - startTime;
        results.performance = {
            duration: Math.round(duration),
            size: Math.round(pdfBytes.length / 1024),
            target: duration < 3000 ? 'met' : 'exceeded'
        };

        if (pdfBytes && pdfBytes.length > 0) {
            results.pdfGeneration = true;
            console.log(`✅ PDF generation successful`);
            console.log(`📄 Size: ${results.performance.size}KB`);
            console.log(`⏱️ Duration: ${results.performance.duration}ms (target: <3000ms)`);
        } else {
            throw new Error('PDF generation produced empty result');
        }

        // Summary
        console.log('\n🏁 VALIDATION SUMMARY:');
        console.log(`📦 Module Loading: ${results.moduleLoading ? '✅' : '❌'}`);
        console.log(`📄 Template Detection: ${results.templateDetection === true ? '✅ Fillable' : results.templateDetection === 'fallback' ? '⚠️ Fallback' : '❌'}`);
        console.log(`🔗 Field Mapping: ${results.fieldMapping ? '✅' : '❌'}`);
        console.log(`🚀 PDF Generation: ${results.pdfGeneration ? '✅' : '❌'}`);
        
        if (results.performance) {
            console.log(`⏱️ Performance: ${results.performance.target === 'met' ? '✅' : '⚠️'} ${results.performance.duration}ms`);
        }

        const allPassed = results.moduleLoading && results.fieldMapping && results.pdfGeneration;
        console.log(`\n🎯 Overall Status: ${allPassed ? '✅ IMPROVEMENTS WORKING' : '❌ ISSUES DETECTED'}`);

        return results;

    } catch (error) {
        results.errors.push(error.message);
        console.error('❌ Validation failed:', error);
        return results;
    }
}

// Run validation
validateImprovements().then(results => {
    console.log('\n📊 Final Results:', results);
    
    // If successful, offer to create download
    if (results.pdfGeneration) {
        console.log('\n💡 To test download, run: testDownload()');
        
        window.testDownload = async () => {
            const testData = {
                'licensee-name': 'Test User Download',
                'phone': '555-1234',
                'email': 'test@example.com',
                'start-date': '2025-01-15'
            };
            
            const { PDFLibGenerator } = await import('./assets/js/pdf-lib-generator.js');
            const pdfBytes = await PDFLibGenerator.generateFilledPDF(testData);
            
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'validation-test.pdf';
            a.click();
            
            console.log('✅ Download initiated!');
        };
    }
});

console.log('🔄 Validation running... check results above.');