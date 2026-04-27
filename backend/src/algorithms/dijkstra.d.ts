interface Edge {
    to: string;
    weight: number;
}
interface Graph {
    [node: string]: Edge[];
}
interface PathResult {
    distance: number;
    path: string[];
}
/**
 * Dijkstra's Algorithm implementation for finding shortest path
 * @param graph The graph represented as adjacency list
 * @param start The starting node
 * @param end The target node
 * @returns Object containing shortest distance and path
 */
export declare function dijkstra(graph: Graph, start: string, end: string): PathResult;
export {};
//# sourceMappingURL=dijkstra.d.ts.map