import net from 'net';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { dijkstra } from '../algorithms/dijkstra';
import { greedyMatching } from '../algorithms/greedyMatching';

// Types for our system
interface Hospital {
  id: string;
  name: string;
  location: string;
  blood_bank_capacity: number;
}

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

interface GraphData {
  nodes: string[];
  edges: { from: string; to: string; weight: number }[];
}

// Message types
interface RequestMessage {
  type: 'donor-register' | 'recipient-request' | 'find-hospital' | 'match-request';
  data: any;
}

interface ResponseMessage {
  type: string;
  success: boolean;
  data?: any;
  error?: string;
}

// Load data from JSON files
const loadHospitals = (): Hospital[] => {
  const data = readFileSync(resolve('./src/data/hospitals.json'), 'utf8');
  return JSON.parse(data).hospitals;
};

const loadDonors = (): Donor[] => {
  const data = readFileSync(resolve('./src/data/donors.json'), 'utf8');
  return JSON.parse(data).donors;
};

const loadRequests = (): RecipientRequest[] => {
  const data = readFileSync(resolve('./src/data/recipients.json'), 'utf8');
  return JSON.parse(data).requests;
};

const loadGraph = (): GraphData => {
  const data = readFileSync(resolve('./src/data/graph.json'), 'utf8');
  return JSON.parse(data);
};

// Save data to JSON files
const saveDonors = (donors: Donor[]): void => {
  writeFileSync(
    resolve('./src/data/donors.json'),
    JSON.stringify({ donors }, null, 2)
  );
};

const saveRequests = (requests: RecipientRequest[]): void => {
  writeFileSync(
    resolve('./src/data/recipients.json'),
    JSON.stringify({ requests }, null, 2)
  );
};

// Build adjacency list for Dijkstra's algorithm
const buildGraph = (graphData: GraphData): Record<string, { to: string; weight: number }[]> => {
  const graph: Record<string, { to: string; weight: number }[]> = {};
  
  // Initialize all nodes
  graphData.nodes.forEach(node => {
    graph[node] = [];
  });
  
  // Add edges (bidirectional)
  graphData.edges.forEach(edge => {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];
    
    graph[edge.from].push({ to: edge.to, weight: edge.weight });
    graph[edge.to].push({ to: edge.from, weight: edge.weight }); // Assuming undirected graph
  });
  
  return graph;
};

// Calculate distance between two locations using Dijkstra's
const calculateDistance = (graph: Record<string, { to: string; weight: number }[]>, from: string, to: string): number => {
  const result = dijkstra(graph, from, to);
  return result.distance === Infinity ? -1 : result.distance; // Return -1 if no path
};

// Handle incoming client requests
const handleRequest = (socket: net.Socket, message: RequestMessage): void => {
  let response: ResponseMessage;
  
  try {
    switch (message.type) {
      case 'donor-register': {
        const { donor } = message.data;
        const donors = loadDonors();
        donors.push(donor);
        saveDonors(donors);
        response = {
          type: 'donor-register-response',
          success: true,
          data: { message: 'Donor registered successfully' }
        };
        break;
      }
      
      case 'recipient-request': {
        const { request } = message.data;
        const requests = loadRequests();
        requests.push(request);
        saveRequests(requests);
        response = {
          type: 'recipient-request-response',
          success: true,
          data: { message: 'Blood request submitted successfully' }
        };
        break;
      }
      
      case 'find-hospital': {
        const { location } = message.data;
        const hospitals = loadHospitals();
        const graphData = loadGraph();
        const graph = buildGraph(graphData);
        
        // Find nearest hospital
        let nearestHospital: Hospital | null = null;
        let minDistance = Infinity;
        
        for (const hospital of hospitals) {
          const distance = calculateDistance(graph, location, hospital.location);
          if (distance !== -1 && distance < minDistance) {
            minDistance = distance;
            nearestHospital = hospital;
          }
        }
        
        if (nearestHospital) {
          response = {
            type: 'find-hospital-response',
            success: true,
            data: {
              hospital: nearestHospital,
              distance: minDistance
            }
          };
        } else {
          response = {
            type: 'find-hospital-response',
            success: false,
            error: 'No reachable hospital found'
          };
        }
        break;
      }
      
      case 'match-request': {
        const { requestId } = message.data;
        const donors = loadDonors();
        const requests = loadRequests();
        const graphData = loadGraph();
        const graph = buildGraph(graphData);
        
        // Find the specific request
        const request = requests.find(r => r.id === requestId);
        if (!request) {
          response = {
            type: 'match-request-response',
            success: false,
            error: 'Request not found'
          };
          break;
        }
        
        // Distance function using Dijkstra's
        const distanceFunction = (from: string, to: string): number => {
          return calculateDistance(graph, from, to);
        };
        
        // Perform greedy matching
        const matches = greedyMatching([...donors], [request], distanceFunction);
        const match = matches[0];
        
        if (match && match.donorId) {
          response = {
            type: 'match-request-response',
            success: true,
            data: match
          };
        } else {
          response = {
            type: 'match-request-response',
            success: false,
            error: 'No compatible donor found'
          };
        }
        break;
      }
      
      default:
        response = {
          type: 'error',
          success: false,
          error: 'Unknown request type'
        };
    }
  } catch (error) {
    response = {
      type: 'error',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
  
  // Send response back to client
  socket.write(JSON.stringify(response) + '\n');
};

// Create and start the socket server
const startSocketServer = (port: number = 3000): void => {
  const server = net.createServer((socket: net.Socket) => {
    console.log('Client connected');
    
    socket.on('data', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString().trim()) as RequestMessage;
        handleRequest(socket, message);
      } catch (error) {
        socket.write(JSON.stringify({
          type: 'error',
          success: false,
          error: 'Invalid JSON format'
        }) + '\n');
      }
    });
    
    socket.on('end', () => {
      console.log('Client disconnected');
    });
    
    socket.on('error', (err: Error) => {
      console.error('Socket error:', err);
    });
  });
  
  server.listen(port, () => {
    console.log(`Socket server listening on port ${port}`);
  });
  
  server.on('error', (err: Error) => {
    console.error('Server error:', err);
  });
};

export { startSocketServer };