"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dijkstra = dijkstra;
/**
 * Dijkstra's Algorithm implementation for finding shortest path
 * @param graph The graph represented as adjacency list
 * @param start The starting node
 * @param end The target node
 * @returns Object containing shortest distance and path
 */
function dijkstra(graph, start, end) {
    // Initialize distances and previous nodes
    const distances = {};
    const previous = {};
    const visited = new Set();
    // Set initial distances to infinity and previous to null
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    // Distance to start is 0
    distances[start] = 0;
    // Priority queue (min heap) - we'll simulate with array and sort
    const queue = [{ node: start, distance: 0 }];
    while (queue.length > 0) {
        // Sort queue by distance (ascending) and get the node with minimum distance
        queue.sort((a, b) => a.distance - b.distance);
        const queueItem = queue.shift();
        if (!queueItem)
            continue; // Handle undefined case
        const { node: current } = queueItem;
        // Skip if already visited
        if (visited.has(current))
            continue;
        // Mark as visited
        visited.add(current);
        // If we reached the end, we can stop early
        if (current === end)
            break;
        // Check neighbors
        const neighbors = graph[current] || [];
        for (const neighbor of neighbors) {
            const { to, weight } = neighbor;
            // Skip if already visited
            if (visited.has(to))
                continue;
            // Calculate new distance
            const newDistance = distances[current] + weight;
            // If we found a shorter path, update
            if (newDistance < distances[to]) {
                distances[to] = newDistance;
                previous[to] = current;
                queue.push({ node: to, distance: newDistance });
            }
        }
    }
    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    // If no path exists, return infinity distance
    if (path[0] !== start || distances[end] === Infinity) {
        return { distance: Infinity, path: [] };
    }
    return { distance: distances[end], path };
}
// Example usage:
// const graph: Graph = {
//   NodeA: [{to: 'NodeB', weight: 4}, {to: 'NodeC', weight: 6}],
//   NodeB: [{to: 'NodeA', weight: 4}, {to: 'NodeC', weight: 2}, {to: 'NodeD', weight: 5}],
//   NodeC: [{to: 'NodeA', weight: 6}, {to: 'NodeB', weight: 2}, {to: 'NodeD', weight: 3}],
//   NodeD: [{to: 'NodeB', weight: 5}, {to: 'NodeC', weight: 3}]
// };
// 
// const result = dijkstra(graph, 'NodeA', 'NodeD');
// console.log(result); // {distance: 9, path: ['NodeA', 'NodeB', 'NodeC', 'NodeD']}
//# sourceMappingURL=dijkstra.js.map