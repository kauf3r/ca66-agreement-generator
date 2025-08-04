/**
 * Generate Debug Analysis for Position Fine-tuning
 * 
 * This script creates a comprehensive position analysis by:
 * 1. Generating debug PDFs with position markers
 * 2. Creating test PDFs with real data
 * 3. Analyzing positioning issues
 */

import { PDFPositionConfig } from './assets/js/pdf-position-config.js';

console.log('🎯 Debug Analysis for Position Fine-tuning');
console.log('==========================================');

// Analyze current configuration
const config = PDFPositionConfig;
const placeholders = config.placeholders;

console.log(`\\n📊 Current Configuration Analysis:`);
console.log(`Total field configurations: ${Object.keys(placeholders).length}`);

// Group by page
const pageGroups = {};
let totalPositions = 0;

Object.entries(placeholders).forEach(([fieldName, fieldConfig]) => {
    const configs = Array.isArray(fieldConfig) ? fieldConfig : [fieldConfig];
    
    configs.forEach((pos, index) => {
        totalPositions++;
        const page = pos.page;
        if (!pageGroups[page]) pageGroups[page] = [];
        
        pageGroups[page].push({
            fieldName: fieldName,
            displayName: Array.isArray(fieldConfig) ? `${fieldName}_${index + 1}` : fieldName,
            ...pos
        });
    });
});

console.log(`Total field positions: ${totalPositions}`);
console.log(`Pages with fields: ${Object.keys(pageGroups).sort().join(', ')}`);

// Analyze each page
Object.entries(pageGroups).forEach(([page, fields]) => {
    console.log(`\\n📄 Page ${page} Analysis (${fields.length} fields):`);
    console.log('─'.repeat(50));
    
    fields.forEach(field => {
        const spacing = field.maxWidth >= 80 ? '✅' : field.maxWidth >= 50 ? '⚠️' : '❌';
        console.log(`${spacing} ${field.displayName.replace(/[\\[\\]]/g, '')}`);
        console.log(`   Position: (${field.x}, ${field.y}) | Size: ${field.size}px | MaxWidth: ${field.maxWidth}px`);
        console.log(`   ${field.description}`);
    });
});

// Identify potential issues
console.log(`\\n🔍 Potential Issues Analysis:`);
console.log('─'.repeat(50));

let issueCount = 0;
Object.entries(pageGroups).forEach(([page, fields]) => {
    fields.forEach(field => {
        const issues = [];
        
        // Check maxWidth constraints
        if (field.maxWidth < 50) {
            issues.push(`Very tight maxWidth (${field.maxWidth}px)`);
        }
        
        // Check for potential overlaps (same page, close coordinates)
        const closeFields = fields.filter(other => 
            other !== field && 
            Math.abs(other.x - field.x) < 100 && 
            Math.abs(other.y - field.y) < 20
        );
        
        if (closeFields.length > 0) {
            issues.push(`Potential overlap with ${closeFields.map(f => f.displayName.replace(/[\\[\\]]/g, '')).join(', ')}`);
        }
        
        // Check positioning near page edges
        if (field.x < 50) issues.push('Very close to left edge');
        if (field.x + field.maxWidth > 550) issues.push('May extend beyond right margin');
        if (field.y < 50) issues.push('Very close to bottom edge');
        if (field.y > 750) issues.push('Very close to top edge');
        
        if (issues.length > 0) {
            issueCount++;
            console.log(`⚠️  ${field.displayName.replace(/[\\[\\]]/g, '')} (Page ${page}):`);
            issues.forEach(issue => console.log(`     - ${issue}`));
        }
    });
});

if (issueCount === 0) {
    console.log('✅ No obvious positioning issues detected');
} else {
    console.log(`Found ${issueCount} potential positioning issues`);
}

// Recommendations
console.log(`\\n💡 Recommendations for Fine-tuning:`);
console.log('─'.repeat(50));

const recommendations = [
    '1. Generate debug PDF to visually inspect current positions',
    '2. Create test PDF with realistic data to check text alignment',
    '3. Focus on fields with maxWidth < 50px for spacing improvements',
    '4. Check for proper alignment within form sections',
    '5. Ensure consistent baseline alignment for related fields',
    '6. Verify signature and date fields are properly positioned'
];

recommendations.forEach(rec => console.log(rec));

console.log(`\\n🚀 Ready for position fine-tuning!`);
console.log(`Use the position-fine-tuning.html tool for interactive adjustments.`);

export { pageGroups, totalPositions, issueCount };