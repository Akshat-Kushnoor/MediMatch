const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || 'http://localhost:3001';

export interface Donor {
  id: string;
  name: string;
  blood_group: string;
  location: string;
  availability: boolean;
}

export interface RecipientRequest {
  id: string;
  required_blood_group: string;
  urgency: 'high' | 'medium' | 'low';
  location: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  blood_bank_capacity: number;
}

export interface MatchResult {
  donorId?: string;
  bloodGroup?: string;
  distanceScore: number;
  status: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function sendRequest<T>(type: string, data: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${PROXY_URL}/api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isConnectionError = errorMessage.includes('fetch') || errorMessage.includes('network');
    return {
      success: false,
      error: isConnectionError 
        ? 'Cannot connect to server. Make sure proxy (port 3001) and backend (port 3000) are running.'
        : errorMessage,
    };
  }
}

export const api = {
  registerDonor: (donor: Omit<Donor, 'id'>) =>
    sendRequest<{ message: string }>('donor-register', { donor }),

  submitRequest: (request: Omit<RecipientRequest, 'id'>) =>
    sendRequest<{ message: string }>('recipient-request', { request }),

  findHospital: (location: string) =>
    sendRequest<{ hospital: Hospital; distance: number }>('find-hospital', { location }),

  findMatch: (requestId: string) =>
    sendRequest<MatchResult>('match-request', { requestId }),
};