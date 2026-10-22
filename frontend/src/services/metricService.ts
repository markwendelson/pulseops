import { ApiService, delay } from './apiService';
import metricsData from '../mocks/metrics.json';

export class MetricService extends ApiService {
  async getMetrics(): Promise<any> {
    if (!this.isMock()) {
      return this.httpGet<any>('/metrics');
    }

    await delay();
    return { ...metricsData };
  }
}

export const metricService = new MetricService();
