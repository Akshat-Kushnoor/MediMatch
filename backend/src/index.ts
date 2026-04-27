import { startSocketServer } from './network/socketServer';

// Start the socket server
const PORT = 8000;
startSocketServer(PORT);

console.log('Blood Donation System Server Started');
console.log(`Listening on port ${PORT}`);
console.log('Press Ctrl+C to stop the server');