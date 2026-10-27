import { ApiService, delay } from './apiService';
import serversData from '../mocks/servers.json';

export class ServerService extends ApiService {
  async getServers(): Promise<any[]> {
    if (!this.isMock()) {
      return this.httpGet<any[]>('/servers');
    }

    await delay();
    return [...serversData];
  }

  async getServerById(id: number | string): Promise<any | null> {
    if (!this.isMock()) {
      return this.httpGet<any>(`/servers/${id}`);
    }

    await delay();
    return serversData.find((s) => s.id === Number(id)) || null;
  }

  async createServer(server: { hostname: string; ipAddress: string; os: string; region: string; environment: string }): Promise<any> {
    if (!this.isMock()) {
      return this.httpPost<any>('/servers', server);
    }

    await delay();
    const newEntry = {
      id: Date.now(),
      hostname: server.hostname.toUpperCase(),
      ipAddress: server.ipAddress || '10.0.18.99',
      os: server.os || 'Ubuntu 22.04 LTS',
      region: server.region || 'us-east-1',
      environment: server.environment || 'Production',
      status: 'Healthy',
      cpuUsage: 18,
      memoryUsage: 35,
      diskUsage: 28,
      availability: 100.0,
      uptimeSeconds: 1200,
      lastHeartbeat: new Date().toISOString()
    };
    (serversData as any[]).unshift(newEntry);
    return newEntry;
  }
}

export const serverService = new ServerService();
