// Simple test to verify our implementation works
const fs = require('fs');
const path = require('path');

// Helper to load JSON files
function loadJsonFile(filename) {
    const data = fs.readFileSync(path.resolve(__dirname, `../data/${filename}`), 'utf8');
    return JSON.parse(data);
}

// Load compiled JavaScript modules
const dijkstra = require('./dist/src/algorithms/dijkstra');
const greedyMatching = require('./dist/src/algorithms/greedyMatching');
const bloodCompatibility = require('./dist/src/utils/bloodCompatibility');

// Test data
const hospitalsData = loadJsonFile("hospitals.json");
const donorsData = loadJsonFile("donors.json");
const requestsData = loadJsonFile("recipients.json");
const graphData = loadJsonFile("graph.json");

console.log('=== Blood Donation System Test ===');
console.log(`Loaded ${hospitalsData.hospitals.length} hospitals`);
console.log(`Loaded ${donorsData.donors.length} donors`);
console.log(`Loaded ${requestsData.requests.length} requests`);
console.log(`Graph has ${graphData.nodes.length} nodes and ${graphData.edges.length} edges`);

// Test blood compatibility rules from specification
console.log('\n=== Testing Blood Compatibility Rules ===');
console.log(`O- to A+: ${bloodCompatibility.isBloodCompatible('O-', 'A+')} (should be true)`);
console.log(`A+ to O-: ${bloodCompatibility.isBloodCompatible('A+', 'O-')} (should be false)`);
console.log(`AB+ to AB+: ${bloodCompatibility.isBloodCompatible('AB+', 'AB+')} (should be true)`);
console.log(`O+ to AB-: ${bloodCompatibility.isBloodCompatible('O+', 'AB-')} (should be false)`);

// Test Dijkstra's algorithm
console.log('\n=== Testing Dijkstra Algorithm ===');
// Build adjacency list from graph data
const graph = {};
graphData.nodes.forEach(function(node) {
    graph[node] = [];
});

graphData.edges.forEach(function(edge) {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];
    
    graph[edge.from].push({ to: edge.to, weight: edge.weight });
    graph[edge.to].push({ from: edge.from, weight: edge.weight });
});

// Test path from NodeA to NodeD
const result = dijkstra.dijkstra(graph, 'NodeA', 'NodeD');
console.log(`Shortest path from NodeA to NodeD:`);
console.log(`  Distance: ${result.distance} km`);
console.log(`  Path: ${result.path.join(' → ')}`);
console.log(`Expected distance: 9 km (A->B->C->D or A->C->D)`);

// Test blood compatibility from utility
console.log('\n=== Testing Blood Compatibility Utility ===');
console.log(`O- to A+: ${bloodCompatibility.isBloodCompatible('O-', 'A+')} (should be true)`);
console.log(`A+ to O-: ${bloodCompatibility.isBloodCompatible('A+', 'O-')} (should be false)`);
console.log(`AB+ to AB+: ${bloodCompatibility.isBloodCompatible('AB+', 'AB+')} (should be true)`);
console.log(`O+ to AB-: ${bloodCompatibility.isBloodCompatible('O+', 'AB-')} (should be false)`);

// Test Urgency Score
console.log('\n=== Testing Urgency Score ===');
console.log(`High urgency score: ${bloodCompatibility.getUrgencyScore('high')} (should be 3)`);
console.log(`Medium urgency score: ${bloodCompatibility.getUrgencyScore('medium')} (should be 2)`);
console.log(`Low urgency score: ${bloodCompatibility.getUrgencyScore('low')} (should be 1)`);

// Test Greedy Matching
console.log('\n=== Testing Greedy Matching Algorithm ===');
const donors = donorsData.donors.filter(function(d) { return d.availability; });
const requests = requestsData.requests;

// Simple distance function using pre-calculated distances from our test graph
var distanceMap = {
  NodeA: {NodeA: 0, NodeB: 4, NodeC: 6, NodeD: 9},
  NodeB: {NodeA: 4, NodeB: 0, NodeC: 2, NodeD: 5},
  NodeC: {NodeA: 6, NodeB: 2, NodeC: 0, NodeD: 3},
  NodeD: {NodeA: 9, NodeB: 5, NodeC: 3, NodeD: 0}
};

var distanceFunction = function(from, to) {
  var dist = distanceMap[from];
  if (dist) {
    return dist[to] || Infinity;
  }
  return Infinity;
};

// Convert to proper format for the compiled JS
var donorsForMatching = donors.map(function(d) {
  return {
    id: d.id,
    name: d.name,
    blood_group: d.blood_group,
    location: d.location,
    availability: d.availability
  };
});

var requestsForMatching = requests.map(function(r) {
  return {
    id: r.id,
    required_blood_group: r.required_blood_group,
    urgency: r.urgency,
    location: r.location
  };
});

var matches = greedyMatching.greedyMatching(donorsForMatching, requestsForMatching, distanceFunction);
console.log('Matching Results:');
matches.forEach(function(match, index) {
  console.log(`  Request ${index + 1}:`);
  console.log(`    Donor: ${match.donorId ? match.donorId : 'None'} (${match.bloodGroup || 'N/A'})`);
  console.log(`    Distance: ${match.distanceScore === Infinity ? 'N/A' : match.distanceScore} km`);
  console.log(`    Status: ${match.status}`);
});

console.log('\n=== Test Complete ===');
