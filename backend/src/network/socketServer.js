"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSocketServer = void 0;
const net_1 = __importDefault(require("net"));
const fs_1 = require("fs");
const path_1 = require("path");
const dijkstra_2 = require("../algorithms/dijkstra");
const greedyMatching_2 = require("../algorithms/greedyMatching");
// Load data from JSON files
const loadHospitals = () => {
    const data = (0, fs_1.readFileSync)((0, path_1.resolve)('./src/data/hospitals.json'), 'utf8');
    return JSON.parse(data).hospitals;
};
const loadDonors = () => {
    const data = (0, fs_1.readFileSync)((0, path_1.resolve)('./src/data/donors.json'), 'utf8');
    return JSON.parse(data).donors;
};
const loadRequests = () => {
    const data = (0, fs_1.readFileSync)((0, path_1.resolve)('./src/data/recipients.json'), 'utf8');
    return JSON.parse(data).requests;
};
const loadGraph = () => {
    const data = (0, fs_1.readFileSync)((0, path_1.resolve)('./src/data/graph.json'), 'utf8');
    return JSON.parse(data);
};
// Save data to JSON files
const saveDonors = (donors) => {
    (0, fs_1.writeFileSync)((0, path_1.resolve)('./src/data/donors.json'), JSON.stringify({ donors }, null, 2));
};
const saveRequests = (requests) => {
    (0, fs_1.writeFileSync)((0, path_1.resolve)('./src/data/recipients.json'), JSON.stringify({ requests }, null, 2));
};
// Build adjacency list for Dijkstra's algorithm
const buildGraph = (graphData) => {
    const graph = {};
    // Initialize all nodes
    graphData.nodes.forEach(node => {
        graph[node] = [];
    });
    // Add edges (bidirectional)
    graphData.edges.forEach(edge => {
        if (!graph[edge.from])
            graph[edge.from] = [];
        if (!graph[edge.to])
            graph[edge.to] = [];
        graph[edge.from].push({ to: edge.to, weight: edge.weight });
        graph[edge.to].push({ from: edge.from, weight: edge.weight }); // Assuming undirected graph
    });
    return graph;
};
// Calculate distance between two locations using Dijkstra's
const calculateDistance = (graph, from, to) => {
    const result = (0, dijkstra_2.dijkstra)(graph, from, to);
    return result.distance === Infinity ? -1 : result.distance; // Return -1 if no path
};
// Handle incoming client requests
const handleRequest = (socket, message) => {
    let response;
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
                let nearestHospital = null;
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
                }
                else {
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
                const distanceFunction = (from, to) => {
                    return calculateDistance(graph, from, to);
                };
                // Perform greedy matching
                const matches = (0, greedyMatching_2.greedyMatching)([...donors], [request], distanceFunction);
                const match = matches[0];
                if (match.donorId) {
                    response = {
                        type: 'match-request-response',
                        success: true,
                        data: match
                    };
                }
                else {
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
    }
    catch (error) {
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
const startSocketServer = (port = 3000) => {
    const server = net_1.default.createServer((socket) => {
        console.log('Client connected');
        socket.on('data', (data) => {
            try {
                const message = JSON.parse(data.toString().trim());
                handleRequest(socket, message);
            }
            catch (error) {
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
        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });
    server.listen(port, () => {
        console.log(`Socket server listening on port ${port}`);
    });
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
};
exports.startSocketServer = startSocketServer;
//# sourceMappingURL=socketServer.js.map