import { ApiService, delay } from './apiService';
import reportsData from '../mocks/reports.json';

export class ReportService extends ApiService {
  async getReports(): Promise<any[]> {
    if (!this.isMock()) {
      return this.httpGet<any[]>('/reports');
    }

    await delay();
    return [...reportsData];
  }
}

export const reportService = new ReportService();
