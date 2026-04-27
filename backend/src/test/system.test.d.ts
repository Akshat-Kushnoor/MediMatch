declare var __importStar: any;
declare var __importDefault: any;
declare const dijkstra_1: any;
declare const greedyMatching_1: any;
declare const bloodCompatibility_1: any;
declare const fs: any;
declare const path: any;
declare function loadJsonFile(filename: any): any;
declare const hospitalsData: any;
declare const donorsData: any;
declare const requestsData: any;
declare const graphData: any;
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
    edges: {
        from: string;
        to: string;
        weight: number;
    }[];
}
declare const graph: Record<string, {
    to: string;
    weight: number;
}[]>;
declare const result: any;
declare const donors: Donor[];
declare const requests: RecipientRequest[];
declare const distanceMap: Record<string, Record<string, number>>;
declare const distanceFunction: (from: string, to: string) => number;
declare const matches: any;
//# sourceMappingURL=system.test.d.ts.map