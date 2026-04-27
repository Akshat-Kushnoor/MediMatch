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
export function dijkstra(graph: Graph, start: string, end: string): PathResult {
  // Initialize distances and previous nodes
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited: Set<string> = new Set();
  
  // Set initial distances to infinity and previous to null
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  
  // Distance to start is 0
  distances[start] = 0;
  
  // Priority queue (min heap) - we'll simulate with array and sort
  const queue: Array<{node: string; distance: number}> = [{node: start, distance: 0}];
  
  while (queue.length > 0) {
    // Sort queue by distance (ascending) and get the node with minimum distance
    queue.sort((a, b) => a.distance - b.distance);
    const queueItem = queue.shift();
    if (!queueItem) continue; // Handle undefined case
    const {node: current} = queueItem;
    
    // Skip if already visited
    if (visited.has(current)) continue;
    
    // Mark as visited
    visited.add(current);
    
    // If we reached the end, we can stop early
    if (current === end) break;
    
    // Check neighbors
    const neighbors = graph[current] || [];
    for (const neighbor of neighbors) {
      const {to, weight} = neighbor;
      
      // Skip if already visited
      if (visited.has(to)) continue;
      
      // Calculate new distance - current is guaranteed to be in distances because we initialized all nodes
      const currentDistance = distances[current];
      const newDistance = currentDistance + weight;
      
      // If we found a shorter path, update - to is guaranteed to be in distances because we initialized all nodes
      if (newDistance < distances[to]) {
        distances[to] = newDistance;
        previous[to] = current;
        queue.push({node: to, distance: newDistance});
      }
    }
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current: string | null = end;
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  // If no path exists, return infinity distance
  if (path[0] !== start || distances[end] === Infinity) {
    return {distance: Infinity, path: []};
  }
  
  // distances[end] is guaranteed to be a number because we initialized all nodes and updated when found better paths
  return {distance: distances[end], path};
}