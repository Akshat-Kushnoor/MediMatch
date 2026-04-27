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
interface ResponseMessage {
    type: string;
    success: boolean;
    data?: any;
    error?: string;
}
/**
 * Socket client for communicating with the Blood Donation System server
 */
declare class SocketClient {
    private host;
    private port;
    constructor(host?: string, port?: number);
    /**
     * Send a request to the server and wait for the response
     */
    private sendRequest;
    /**
     * Register a new donor
     */
    registerDonor(donor: Donor): Promise<ResponseMessage>;
    /**
     * Submit a new blood request from a recipient
     */
    submitRecipientRequest(request: RecipientRequest): Promise<ResponseMessage>;
    /**
     * Find the nearest hospital to a given location
     */
    findNearestHospital(location: string): Promise<ResponseMessage>;
    /**
     * Find the best donor match for a specific request
     */
    matchRequest(requestId: string): Promise<ResponseMessage>;
}
export { SocketClient };
export type { Donor, RecipientRequest, Hospital, ResponseMessage };
//# sourceMappingURL=socketClient.d.ts.map