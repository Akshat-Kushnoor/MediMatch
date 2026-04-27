"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketServer_1 = require("./network/socketServer");
// Start the socket server
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
(0, socketServer_1.startSocketServer)(PORT);
console.log('Blood Donation System Server Started');
console.log(`Listening on port ${PORT}`);
console.log('Press Ctrl+C to stop the server');
//# sourceMappingURL=index.js.map