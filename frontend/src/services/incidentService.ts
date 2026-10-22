import { ApiService, delay } from './apiService';
import incidentsData from '../mocks/incidents.json';

export class IncidentService extends ApiService {
  async getIncidents(): Promise<any[]> {
    if (!this.isMock()) {
      return this.httpGet<any[]>('/incidents');
    }

    await delay();
    return [...incidentsData];
  }

  async getIncidentById(id: number | string): Promise<any | null> {
    if (!this.isMock()) {
      return this.httpGet<any>(`/incidents/${id}`);
    }

    await delay();
    return incidentsData.find((i) => i.id === Number(id)) || null;
  }
}

export const incidentService = new IncidentService();
