var __importStar: { (mod: any): any; (mod: {}): {} } = (this && this.__importStar) || function <T>(mod: T) {
    if (mod && (mod as any).__esModule) return mod;
    var result = {} as T;
    if (mod != null) {
        for (var k in mod) {
            if (Object.hasOwnProperty.call(mod, k)) {
                (result as any)[k] = (mod as any)[k];
            }
        }
    }
    (result as any)["default"] = mod;
    return result;
};
var __importDefault: { (mod: any): any; (mod: {}): {} } = (this && this.__importDefault) || function <T>(mod: T) {
    return (mod && (mod as any).__esModule) ? mod : { "default": mod as T } as T;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dijkstra_1 = __importDefault(require("../algorithms/dijkstra"));
const greedyMatching_1 = __importDefault(require("../algorithms/greedyMatching"));
const bloodCompatibility_1 = __importDefault(require("../utils/bloodCompatibility"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));

// Helper to load JSON files
function loadJsonFile(filename: string): any {
    const data = fs.readFileSync(path.resolve(__dirname, `../data/${filename}`), 'utf8');
    return JSON.parse(data);
}

// Test data
const hospitalsData = loadJsonFile("hospitals.json");
const donorsData = loadJsonFile("donors.json");
const requestsData = loadJsonFile("recipients.json");
const graphData = loadJsonFile("graph.json");

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

interface Hospital {
    id: string;
    name: string;
    location: string;
    blood_bank_capacity: number;
}

interface GraphData {
    nodes: string[];
    edges: { from: string; to: string; weight: number }[];
}

// Test Dijkstra's algorithm
console.log('Testing Dijkstra\'s Algorithm...');
const graph: Record<string, { to: string; weight: number }[]> = {};

graphData.nodes.forEach((node: string) => {
    graph[node] = [];
});

graphData.edges.forEach((edge: { from: string; to: string; weight: number }) => {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];
    
    graph[edge.from].push({ to: edge.to, weight: edge.weight });
    graph[edge.to].push({ to: edge.from, weight: edge.weight });
});

// Test path from NodeA to NodeD
const result = dijkstra_1.default(graph, 'NodeA', 'NodeD');
console.log(`Shortest path from NodeA to NodeD:`, result);
console.log(`Expected distance: 9 (A->B->C->D or A->C->D)`);

// Test blood compatibility
console.log('\nTesting Blood Compatibility...');
console.log(`O- to A+: ${bloodCompatibility_1.default.isBloodCompatible('O-', 'A+')} (should be true)`);
console.log(`A+ to O-: ${bloodCompatibility_1.default.isBloodCompatible('A+', 'O-')} (should be false)`);
console.log(`AB+ to AB+: ${bloodCompatibility_1.default.isBloodCompatible('AB+', 'AB+')} (should be true)`);
console.log(`O+ to AB-: ${bloodCompatibility_1.default.isBloodCompatible('O+', 'AB-')} (should be false)`);

// Test Greedy Matching
console.log('\nTesting Greedy Matching Algorithm...');
const donors: Donor[] = donorsData.donors.filter((d: Donor) => d.availability);
const requests: RecipientRequest[] = requestsData.requests;

// Simple distance function using pre-calculated distances from our test graph
const distanceMap: Record<string, Record<string, number>> = {
    NodeA: {NodeA: 0, NodeB: 4, NodeC: 6, NodeD: 9},
    NodeB: {NodeA: 4, NodeB: 0, NodeC: 2, NodeD: 5},
    NodeC: {NodeA: 6, NodeB: 2, NodeC: 0, NodeD: 3},
    NodeD: {NodeA: 9, NodeB: 5, NodeC: 3, NodeD: 0}
};

const distanceFunction = (from: string, to: string): number => {
    return distanceMap[from][to] || Infinity;
};

const matches = greedyMatching_1.default(donors, requests, distanceFunction);
console.log('Matching Results:');
matches.forEach((match: any, index: number) => {
    console.log(`  Request ${index + 1}:`);
    console.log(`    Donor: ${match.donorId ? match.donorId : 'None'} (${match.bloodGroup || 'N/A'})`);
    console.log(`    Distance: ${match.distanceScore === Infinity ? 'N/A' : match.distanceScore} km`);
    console.log(`    Status: ${match.status}`);
});

console.log('\nAll tests completed!');