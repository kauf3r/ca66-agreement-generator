/**
 * PDF Position Configuration for CA-66 Agreement Template
 * 
 * This file contains the precise positions for text replacement in the PDF template.
 * Positions are measured from the bottom-left corner of the page (PDF coordinate system).
 * 
 * To adjust positions:
 * 1. Open the template PDF in a viewer that shows coordinates
 * 2. Measure the x,y position where each placeholder should be replaced
 * 3. Update the coordinates below
 * 
 * Note: PDF coordinate system has (0,0) at bottom-left, not top-left
 */

export const PDFPositionConfig = {
  // Page dimensions (standard 8.5x11 inch page)
  pageWidth: 612,   // 8.5 inches * 72 points/inch
  pageHeight: 792,  // 11 inches * 72 points/inch
  
  // Default font settings
  defaultFont: 'Helvetica',
  defaultFontSize: 11,
  defaultColor: [0, 0, 0], // RGB black
  
  // Placeholder positions (measured from bottom-left corner)
  // These need to be adjusted based on the actual template layout
  placeholders: {
    // Page 1 - Main Agreement
    '[LICENSEE-NAME]': { 
      page: 1, 
      x: 260, 
      y: 672, 
      size: 10,
      maxWidth: 120,
      description: 'Licensee full name in header section'
    },
    
    '[LICENSEE]': [
      { 
        page: 3, 
        x: 140, 
        y: 385, 
        size: 10,
        maxWidth: 120,
        description: 'Licensee name on page 3 insurance section'
      },
      { 
        page: 4, 
        x: 355, 
        y: 468, 
        size: 10,
        maxWidth: 200,
        description: 'Licensee name on page 4'
      },
      { 
        page: 5, 
        x: 100, 
        y: 162, 
        size: 10,
        maxWidth: 200,
        description: 'Licensee name on page 5'
      }
    ],
    
    '[PHONE]': { 
      page: 4, 
      x: 360, 
      y: 442, 
      size: 10,
      maxWidth: 150,
      description: 'Phone number on page 4'
    },
    
    '[EMAIL]': { 
      page: 4, 
      x: 355, 
      y: 388, 
      size: 10,
      maxWidth: 250,
      description: 'Email address on page 4'
    },
    
    // Aircraft Information Section (removed from page 1)
    
    '[AIRCRAFT-MAKE-MODEL]': { 
      page: 1, 
      x: 103, 
      y: 248, 
      size: 10,
      maxWidth: 180,
      description: 'Aircraft make and model'
    },
    
    // Insurance Information Section
    '[INSURANCE-COMPANY]': { 
      page: 3, 
      x: 145, 
      y: 308, 
      size: 10,
      maxWidth: 150,
      description: 'Insurance company name'
    },
    
    '[POLICY-NUMBER]': { 
      page: 3, 
      x: 145, 
      y: 360, 
      size: 10,
      maxWidth: 120,
      description: 'Insurance policy number'
    },
    
    '[INSURANCE-PHONE]': { 
      page: 3, 
      x: 355, 
      y: 308, 
      size: 10,
      maxWidth: 100,
      description: 'Insurance company phone number on page 3'
    },
    
    
    '[POLICY-EXPIRY]': { 
      page: 3, 
      x: 385, 
      y: 360, 
      size: 10,
      maxWidth: 80,
      description: 'Insurance policy expiration date'
    },
    
    '[INSURANCE-ADDRESS]': { 
      page: 3, 
      x: 145, 
      y: 280, 
      size: 10,
      maxWidth: 120,
      description: 'Insurance company address'
    },
    
    '[INSURANCE-CITY]': { 
      page: 3, 
      x: 145, 
      y: 259, 
      size: 10,
      maxWidth: 80,
      description: 'Insurance company city'
    },
    
    '[INSURANCE-STATE]': { 
      page: 3, 
      x: 255, 
      y: 259, 
      size: 10,
      maxWidth: 30,
      description: 'Insurance company state'
    },
    
    '[INSURANCE-ZIP]': { 
      page: 3, 
      x: 305, 
      y: 259, 
      size: 10,
      maxWidth: 50,
      description: 'Insurance company ZIP code'
    },
    
    // Agreement Terms Section - Multiple Locations Example
    '[START-DATE]': [
      { 
        page: 1, 
        x: 345, 
        y: 685, 
        size: 10,
        maxWidth: 80,
        description: 'Agreement start date in main section'
      },
      { 
        page: 1, 
        x: 180, 
        y: 143, 
        size: 10,
        maxWidth: 80,
        description: 'Agreement start date in signature section'
      }
    ],
    
    '[END-DATE]': { 
      page: 1, 
      x: 390, 
      y: 143, 
      size: 10,
      maxWidth: 80,
      description: 'Agreement end date on page 1'
    },
    
    
    // Signature fields removed from page 1 as requested
  },
  
  /**
   * Get position configuration for a placeholder
   * @param {string} placeholder - The placeholder text (with or without brackets)
   * @returns {Array|Object|null} Position configuration(s) or null if not found
   */
  getPosition(placeholder) {
    // Handle both [PLACEHOLDER] and PLACEHOLDER formats
    const normalizedPlaceholder = placeholder.startsWith('[') ? placeholder : `[${placeholder}]`;
    return this.placeholders[normalizedPlaceholder] || null;
  },
  
  /**
   * Get all positions for a placeholder (converts single position to array)
   * @param {string} placeholder - The placeholder text (with or without brackets)
   * @returns {Array} Array of position configurations
   */
  getAllPositions(placeholder) {
    const position = this.getPosition(placeholder);
    if (!position) return [];
    
    // If it's already an array, return it
    if (Array.isArray(position)) return position;
    
    // If it's a single position, wrap it in an array
    return [position];
  },
  
  /**
   * Get all placeholders for a specific page
   * @param {number} pageNumber - Page number (1-based)
   * @returns {Array} Array of placeholder configurations for the page
   */
  getPlaceholdersForPage(pageNumber) {
    const results = [];
    
    Object.entries(this.placeholders).forEach(([placeholder, config]) => {
      if (Array.isArray(config)) {
        // Handle multiple positions
        config.forEach((pos, index) => {
          if (pos.page === pageNumber) {
            results.push({ 
              placeholder: `${placeholder}_${index + 1}`, 
              originalPlaceholder: placeholder,
              ...pos 
            });
          }
        });
      } else {
        // Handle single position
        if (config.page === pageNumber) {
          results.push({ 
            placeholder, 
            originalPlaceholder: placeholder,
            ...config 
          });
        }
      }
    });
    
    return results;
  },
  
  /**
   * Validate that text fits within the specified width
   * @param {string} text - Text to validate
   * @param {Object} position - Position configuration
   * @param {Object} font - PDF font object
   * @returns {boolean} True if text fits
   */
  validateTextFit(text, position, font) {
    if (!text || !position.maxWidth) return true;
    
    const textWidth = font.widthOfTextAtSize(text, position.size || this.defaultFontSize);
    return textWidth <= position.maxWidth;
  }
};

console.log('PDF Position Configuration loaded');