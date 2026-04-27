"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketClient = void 0;
const net_1 = __importDefault(require("net"));
/**
 * Socket client for communicating with the Blood Donation System server
 */
class SocketClient {
    constructor(host = 'localhost', port = 3000) {
        this.host = host;
        this.port = port;
    }
    /**
     * Send a request to the server and wait for the response
     */
    sendRequest(message) {
        return new Promise((resolve, reject) => {
            const socket = new net_1.default.Socket();
            socket.connect(this.port, this.host, () => {
                // Send the message as JSON with newline delimiter
                socket.write(JSON.stringify(message) + '\n');
            });
            let dataBuffer = '';
            socket.on('data', (chunk) => {
                dataBuffer += chunk.toString();
                // Check if we have a complete message (ending with newline)
                if (dataBuffer.includes('\n')) {
                    const messageEnd = dataBuffer.indexOf('\n');
                    const jsonString = dataBuffer.substring(0, messageEnd);
                    dataBuffer = dataBuffer.substring(messageEnd + 1); // Keep any extra data
                    try {
                        const response = JSON.parse(jsonString);
                        socket.end();
                        resolve(response);
                    }
                    catch (parseError) {
                        socket.end();
                        reject(new Error('Failed to parse server response'));
                    }
                }
            });
            socket.on('error', (err) => {
                socket.end();
                reject(new Error(`Connection error: ${err.message}`));
            });
            socket.on('timeout', () => {
                socket.end();
                reject(new Error('Connection timeout'));
            });
            // Set timeout to 5 seconds
            socket.setTimeout(5000);
        });
    }
    /**
     * Register a new donor
     */
    async registerDonor(donor) {
        const message = {
            type: 'donor-register',
            data: { donor }
        };
        return this.sendRequest(message);
    }
    /**
     * Submit a new blood request from a recipient
     */
    async submitRecipientRequest(request) {
        const message = {
            type: 'recipient-request',
            data: { request }
        };
        return this.sendRequest(message);
    }
    /**
     * Find the nearest hospital to a given location
     */
    async findNearestHospital(location) {
        const message = {
            type: 'find-hospital',
            data: { location }
        };
        return this.sendRequest(message);
    }
    /**
     * Find the best donor match for a specific request
     */
    async matchRequest(requestId) {
        const message = {
            type: 'match-request',
            data: { requestId }
        };
        return this.sendRequest(message);
    }
}
exports.SocketClient = SocketClient;
//# sourceMappingURL=socketClient.js.map