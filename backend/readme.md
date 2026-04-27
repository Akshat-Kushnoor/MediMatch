# Blood Donation System

A TypeScript implementation of a Blood Donation System that combines Computer Networks (socket programming) and Algorithms Design & Analysis (Dijkstra's and Greedy algorithms).

## Features

- **Dijkstra's Algorithm**: Finds the nearest hospital from a donor or recipient location
- **Greedy Matching Algorithm**: Matches blood donors and recipients based on compatibility, distance, and urgency
- **Socket Programming**: Implements client-server communication using TCP sockets
- **JSON Database**: Uses local JSON files for data storage (hospitals, donors, recipients, hospital network graph)
- **Modular Architecture**: Separated concerns into distinct modules

## Project Structure

```
backend/
├── src/
│   ├── algorithms/           # Algorithm implementations
│   │   ├── dijkstra.ts       # Dijkstra's shortest path algorithm
│   │   └── greedyMatching.ts # Greedy donor-recipient matching
│   ├── client/               # Client-side socket interface
│   │   └── socketClient.ts   # Socket client for communicating with server
│   ├── data/                 # JSON database files
│   │   ├── hospitals.json    # Hospital information
│   │   ├── donors.json       # Donor information
│   │   ├── recipients.json   # Blood requests
│   │   └── graph.json        # Hospital network graph
│   ├── network/              # Server-side socket implementation
│   │   └── socketServer.ts   # Socket server handling client requests
│   ├── utils/                # Utility functions
│   │   └── bloodCompatibility.ts # Blood group compatibility rules
│   ├── test/                 # Test files
│   │   └── system.test.js    # System functionality tests
│   ├── demoClient.ts         # Demo client showing system usage
│   └── index.ts              # Server entry point
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Algorithms Implemented

### 1. Dijkstra's Algorithm
- Finds shortest path between nodes in a weighted graph
- Used to determine the nearest hospital from a given location
- Returns both the shortest distance and the optimal path

### 2. Greedy Matching Algorithm
- Matches blood donors to recipients based on:
  - Blood group compatibility
  - Distance between donor and recipient
  - Urgency level of the request
  - Donor availability
- Processes requests in priority order (highest urgency first)
- Selects the best available match for each request (no backtracking)

## Blood Compatibility Rules

The system implements the following blood compatibility rules:
- O− → Universal donor (can donate to all blood types)
- O+ → O+, A+, B+, AB+
- A− → A−, A+, AB−, AB+
- A+ → A+, AB+
- B− → B−, B+, AB−, AB+
- B+ → B+, AB+
- AB− → AB−, AB+
- AB+ → AB+

## Installation and Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile TypeScript to JavaScript:
   ```bash
   npx tsc
   ```

3. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   node dist/index.js
   ```

## Usage

### Server
The server runs on port 3000 by default and accepts socket connections.

### Client
Use the `SocketClient` class to communicate with the server:

```typescript
import { SocketClient } from './src/client/socketClient';

const client = new SocketClient('localhost', 3000);

// Register a donor
await client.registerDonor({
    id: 'D1',
    name: 'John Doe',
    blood_group: 'O+',
    location: 'NodeA',
    availability: true
});

// Submit a blood request
await client.submitRecipientRequest({
    id: 'R1',
    required_blood_group: 'A+',
    urgency: 'high',
    location: 'NodeB'
});

// Find nearest hospital
const hospitalResponse = await client.findNearestHospital('NodeA');

// Match a donor to a request
const matchResponse = await client.matchRequest('R1');
```

## Testing

Run the system tests:
```bash
node src/test/system.test.js
```

## Design Notes

1. **Client-Server Architecture**: The system uses TCP sockets for communication between client and server modules
2. **JSON Database**: All data is stored in local JSON files for simplicity
3. **Modular Design**: Each major component (algorithms, networking, data access) is separated into its own module
4. **Error Handling**: Comprehensive error handling throughout the system
5. **Type Safety**: Written in TypeScript for strong typing and better maintainability

## Future Enhancements

- GUI interface for easier interaction
- Real-time updates using WebSockets
- Persistent database (MongoDB, PostgreSQL) instead of JSON files
- More sophisticated matching algorithms
- Hospital blood inventory management
- Donation history tracking
- Notification system for matched donors/recipients
