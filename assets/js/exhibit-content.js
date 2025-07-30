/**
 * Exhibit A Content Module
 * Contains the airport rules and regulations content for both the modal popup
 * and the generated PDF agreement.
 */

export const EXHIBIT_A_CONTENT = `
  <h4>OPERATIONAL REQUIREMENTS</h4>
  <ul>
    <li>All operations must comply with Federal Aviation Regulations</li>
    <li>Grass field operations only - no paved runway access</li>
    <li>Single engine reciprocating aircraft only</li>
    <li>Maximum takeoff weight: 12,500 lbs</li>
    <li>Minimum pilot experience: 300 total flight hours</li>
  </ul>

  <h4>OPERATIONAL RESTRICTIONS</h4>
  <ul>
    <li><strong>Sabbath Observance:</strong> NO operations Friday sunset to Saturday sunset</li>
    <li>Daylight operations only unless specifically authorized</li>
    <li>Weather minimums: VFR conditions required</li>
    <li>Pattern altitude: 1,000 feet AGL</li>
    <li>Noise abatement procedures must be followed</li>
  </ul>

  <h4>SAFETY REQUIREMENTS</h4>
  <ul>
    <li>Current medical certificate required</li>
    <li>Aircraft must be airworthy with current registration</li>
    <li>Minimum insurance: $1,000,000 liability coverage</li>
    <li>Emergency contact information must be filed</li>
    <li>Radio contact required when operations are active</li>
  </ul>

  <h4>GENERAL PROVISIONS</h4>
  <ul>
    <li>Tie-down procedures must be followed</li>
    <li>No overnight parking without prior approval</li>
    <li>Fuel and maintenance services not available on-site</li>
    <li>Licensee responsible for aircraft security</li>
    <li>Airport operator reserves right to suspend operations for safety</li>
  </ul>
`;

/**
 * Get the complete Exhibit A section HTML for PDF templates
 * @returns {string} Complete HTML section with title and content
 */
export function getExhibitASection() {
  return `
    <section class="exhibit-a">
      <h3>EXHIBIT A - AIRPORT RULES AND REGULATIONS</h3>
      <div class="rules-content">
        ${EXHIBIT_A_CONTENT}
      </div>
    </section>
  `;
}

/**
 * Get just the content HTML for modal display
 * @returns {string} Content HTML without section wrapper
 */
export function getExhibitAContent() {
  return EXHIBIT_A_CONTENT.trim();
}