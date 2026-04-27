import { isBloodCompatible, getUrgencyScore } from '../utils/bloodCompatibility';

interface Donor {
  id: string;
  name: string;
  blood_group: string;
  location: string;
  availability: boolean;
}

interface RecipientRequest {
  id: string;
  required_blood_group: string;
  urgency: 'high' | 'medium' | 'low';
  location: string;
}

interface MatchResult {
  donorId: string | null;
  donorName: string | null;
  bloodGroup: string | null;
  distanceScore: number;
  status: string; // 'Confirmed', 'No Match', etc.
}

/**
 * Greedy Matching Algorithm implementation
 * @param donors Array of available donors
 * @param requests Array of blood requests
 * @param distanceFunction Function to calculate distance between locations
 * @returns Array of match results for each request
 */
export function greedyMatching(
  donors: Donor[],
  requests: RecipientRequest[],
  distanceFunction: (from: string, to: string) => number
): MatchResult[] {
  // Filter available donors
  const availableDonors = donors.filter(donor => donor.availability);
  
  // Sort requests by urgency (highest first) - Greedy strategy
  const sortedRequests = [...requests].sort((a, b) => 
    getUrgencyScore(b.urgency) - getUrgencyScore(a.urgency)
  );
  
  const results: MatchResult[] = [];
  
  // Process each request
  for (const request of sortedRequests) {
    let bestMatch: Donor | null = null;
    let bestScore = Infinity;
    
    // Find compatible donors
    const compatibleDonors = availableDonors.filter(donor => 
      isBloodCompatible(donor.blood_group, request.required_blood_group)
    );
    
    // If no compatible donors, add no match result
    if (compatibleDonors.length === 0) {
      results.push({
        donorId: null,
        donorName: null,
        bloodGroup: null,
        distanceScore: Infinity,
        status: 'No Match'
      });
      continue;
    }
    
    // Greedy selection: find best match based on distance and availability
    for (const donor of compatibleDonors) {
      const distance = distanceFunction(donor.location, request.location);
      
      // Score calculation: prioritize shorter distance
      // In a more complex system, we might also factor in urgency, etc.
      const score = distance;
      
      if (score < bestScore) {
        bestScore = score;
        bestMatch = donor;
      }
    }
    
    // If we found a match
    if (bestMatch) {
      results.push({
        donorId: bestMatch.id,
        donorName: bestMatch.name,
        bloodGroup: bestMatch.blood_group,
        distanceScore: bestScore,
        status: 'Confirmed'
      });
      
      // Mark donor as unavailable (removed from pool) - this simulates the "no backtracking" aspect
      // In a real system, we might update availability in the database
      const donorIndex = availableDonors.findIndex(d => d.id === bestMatch!.id);
      if (donorIndex !== -1) {
        availableDonors.splice(donorIndex, 1);
      }
    } else {
      // No match found
      results.push({
        donorId: null,
        donorName: null,
        bloodGroup: null,
        distanceScore: Infinity,
        status: 'No Match'
      });
    }
  }
  
  return results;
}
