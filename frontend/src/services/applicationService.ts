import { ApiService, delay } from './apiService';
import applicationsData from '../mocks/applications.json';

export class ApplicationService extends ApiService {
  async getApplications(): Promise<any[]> {
    if (!this.isMock()) {
      return this.httpGet<any[]>('/applications');
    }

    await delay();
    return [...applicationsData];
  }

  async getApplicationById(id: number | string): Promise<any | null> {
    if (!this.isMock()) {
      return this.httpGet<any>(`/applications/${id}`);
    }

    await delay();
    return applicationsData.find((a) => a.id === Number(id)) || null;
  }
}

export const applicationService = new ApplicationService();
