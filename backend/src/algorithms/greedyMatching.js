"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null) {
        for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k))
                result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.greedyMatching = void 0;
var bloodCompatibility_1 = require("../utils/bloodCompatibility");
/**
 * Greedy Matching Algorithm implementation
 * @param donors Array of available donors
 * @param requests Array of blood requests
 * @param distanceFunction Function to calculate distance between locations
 * @returns Array of match results for each request
 */
function greedyMatching(donors, requests, distanceFunction) {
    // Filter available donors
    var availableDonors = donors.filter(function (donor) { return donor.availability; });
    // Sort requests by urgency (highest first) - Greedy strategy
    var sortedRequests = requests.slice().sort(function (a, b) { return bloodCompatibility_1.getUrgencyScore(b.urgency) - bloodCompatibility_1.getUrgencyScore(a.urgency); });
    var results = [];
    // Process each request
    for (var _i = 0, sortedRequests_1 = sortedRequests; _i < sortedRequests_1.length; _i++) {
        var request = sortedRequests_1[_i];
        var bestMatch = null;
        var bestScore = Infinity;
        // Find compatible donors
        var compatibleDonors = availableDonors.filter(function (donor) { return bloodCompatibility_1.isBloodCompatible(donor.blood_group, request.required_blood_group); });
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
        for (var _a = 0, compatibleDonors_1 = compatibleDonors; _a < compatibleDonors_1.length; _a++) {
            var donor = compatibleDonors_1[_a];
            var distance = distanceFunction(donor.location, request.location);
            // Score calculation: prioritize shorter distance
            // In a more complex system, we might also factor in urgency, etc.
            var score = distance;
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
            var donorIndex = availableDonors.findIndex(function (d) { return d.id === bestMatch.id; });
            if (donorIndex !== -1) {
                availableDonors.splice(donorIndex, 1);
            }
        }
        else {
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
exports.greedyMatching = greedyMatching;
// Example usage:
// const donors: Donor[] = [
//   {id: 'D1', name: 'John Doe', blood_group: 'O+', location: 'NodeC', availability: true},
//   {id: 'D2', name: 'Jane Smith', blood_group: 'A-', location: 'NodeA', availability: true}
// ];
// 
// const requests: RecipientRequest[] = [
//   {id: 'R1', required_blood_group: 'A+', urgency: 'high', location: 'NodeD'},
//   {id: 'R2', required_blood_group: 'O-', urgency: 'medium', location: 'NodeB'}
// ];
// 
// // Simple distance function (in real system, this would use Dijkstra's)
// const distanceFunction = (from: string, to: string): number => {
//   const distances: Record<string, Record<string, number>> = {
//     NodeA: {NodeA: 0, NodeB: 4, NodeC: 6, NodeD: 9},
//     NodeB: {NodeA: 4, NodeB: 0, NodeC: 2, NodeD: 5},
//     NodeC: {NodeA: 6, NodeB: 2, NodeC: 0, NodeD: 3},
//     NodeD: {NodeA: 9, NodeB: 5, NodeC: 3, NodeD: 0}
//   };
//   return distances[from][to] || Infinity;
// };
// 
// const matches = greedyMatching(donors, requests, distanceFunction);
// console.log(matches);
//# sourceMappingURL=greedyMatching.js.map