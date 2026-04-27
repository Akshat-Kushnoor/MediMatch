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
export declare const compatibleRecipients: Record<string, string[]>;
/**
 * Returns list of blood groups that can donate to the given recipient blood group
 */
export declare const compatibleDonors: Record<string, string[]>;
/**
 * Check if donor blood group is compatible with recipient's required blood group
 * @param donorBloodGroup The blood group of the donor
 * @param recipientBloodGroup The required blood group of the recipient
 * @returns true if compatible, false otherwise
 */
export declare function isBloodCompatible(donorBloodGroup: string, recipientBloodGroup: string): boolean;
/**
 * Get urgency score for sorting requests (higher number = higher priority)
 * @param urgency The urgency level ('high', 'medium', or 'low')
 * @returns numeric score (3 for high, 2 for medium, 1 for low)
 */
export declare function getUrgencyScore(urgency: 'high' | 'medium' | 'low'): number;
//# sourceMappingURL=bloodCompatibility.d.ts.map