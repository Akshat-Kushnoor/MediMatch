/**
 * Blood compatibility rules based on the specification
 * 
 * O− → Universal donor
 * O+ → O+, A+, B+, AB+
 * A− → A−, A+, AB−, AB+
 * A+ → A+, AB+
 * B− → B−, B+, AB−, AB+
 * B+ → B+, AB+
 * AB− → AB−, AB+
 * AB+ → AB+
 */

/**
 * Returns list of blood groups that can receive from the given donor blood group
 */
export const compatibleRecipients: Record<string, string[]> = {
  'O-': ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

/**
 * Returns list of blood groups that can donate to the given recipient blood group
 */
export const compatibleDonors: Record<string, string[]> = {
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], // Universal recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-']
};

/**
 * Check if donor blood group is compatible with recipient's required blood group
 * @param donorBloodGroup The blood group of the donor
 * @param recipientBloodGroup The required blood group of the recipient
 * @returns true if compatible, false otherwise
 */
export function isBloodCompatible(donorBloodGroup: string, recipientBloodGroup: string): boolean {
  const compatibleRecipientList = compatibleRecipients[donorBloodGroup] || [];
  return compatibleRecipientList.includes(recipientBloodGroup);
}

/**
 * Get urgency score for sorting requests (higher number = higher priority)
 * @param urgency The urgency level ('high', 'medium', or 'low')
 * @returns numeric score (3 for high, 2 for medium, 1 for low)
 */
export function getUrgencyScore(urgency: 'high' | 'medium' | 'low'): number {
  switch (urgency) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 1;
  }
}
