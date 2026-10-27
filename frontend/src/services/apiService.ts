// Base API client and mock-toggle abstraction for PulseOps services

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const delay = (ms: number = 80): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

export class ApiService {
  protected isMock(): boolean {
    return USE_MOCKS;
  }

  protected getBaseUrl(): string {
    return BASE_URL;
  }

  /**
   * Universal fetch wrapper for live backend calls with error handling
   */
  protected async httpGet<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = localStorage.getItem('pulseops_token');
    const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} fetching ${url}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  protected async httpPost<T, B = unknown>(endpoint: string, body: B, options?: RequestInit): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = localStorage.getItem('pulseops_token');
    const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...options?.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} posting to ${url}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
