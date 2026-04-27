import net from 'net';

// Define types that match the server's expectations
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

/**
 * Socket client for communicating with the Blood Donation System server
 */
class SocketClient {
  private host: string;
  private port: number;

  constructor(host: string = 'localhost', port: number = 3000) {
    this.host = host;
    this.port = port;
  }

  /**
   * Send a request to the server and wait for the response
   */
  private sendRequest(message: RequestMessage): Promise<ResponseMessage> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      
      socket.connect(this.port, this.host, () => {
        // Send the message as JSON with newline delimiter
        socket.write(JSON.stringify(message) + '\n');
      });

      let dataBuffer = '';

      socket.on('data', (chunk: Buffer) => {
        dataBuffer += chunk.toString();
        
        // Check if we have a complete message (ending with newline)
        if (dataBuffer.includes('\n')) {
          const messageEnd = dataBuffer.indexOf('\n');
          const jsonString = dataBuffer.substring(0, messageEnd);
          dataBuffer = dataBuffer.substring(messageEnd + 1); // Keep any extra data
          
          try {
            const response = JSON.parse(jsonString) as ResponseMessage;
            socket.end();
            resolve(response);
          } catch (parseError) {
            socket.end();
            reject(new Error('Failed to parse server response'));
          }
        }
      });

      socket.on('error', (err: Error) => {
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
  async registerDonor(donor: Donor): Promise<ResponseMessage> {
    const message: RequestMessage = {
      type: 'donor-register',
      data: { donor }
    };
    return this.sendRequest(message);
  }

  /**
   * Submit a new blood request from a recipient
   */
  async submitRecipientRequest(request: RecipientRequest): Promise<ResponseMessage> {
    const message: RequestMessage = {
      type: 'recipient-request',
      data: { request }
    };
    return this.sendRequest(message);
  }

  /**
   * Find the nearest hospital to a given location
   */
  async findNearestHospital(location: string): Promise<ResponseMessage> {
    const message: RequestMessage = {
      type: 'find-hospital',
      data: { location }
    };
    return this.sendRequest(message);
  }

  /**
   * Find the best donor match for a specific request
   */
  async matchRequest(requestId: string): Promise<ResponseMessage> {
    const message: RequestMessage = {
      type: 'match-request',
      data: { requestId }
    };
    return this.sendRequest(message);
  }
}

export { SocketClient };
export type { Donor, RecipientRequest, Hospital, ResponseMessage };