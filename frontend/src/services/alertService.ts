import { ApiService, delay } from './apiService';
import alertsData from '../mocks/alerts.json';

export class AlertService extends ApiService {
  async getAlerts(): Promise<any[]> {
    if (!this.isMock()) {
      return this.httpGet<any[]>('/alerts');
    }

    await delay();
    return [...alertsData];
  }

  async acknowledgeAlert(id: number | string): Promise<boolean> {
    if (!this.isMock()) {
      await this.httpPost(`/alerts/${id}/acknowledge`, {});
      return true;
    }

    await delay(50);
    const alert = alertsData.find((a) => a.id === Number(id));
    if (alert) {
      alert.status = 'Acknowledged';
      return true;
    }
    return false;
  }
}

export const alertService = new AlertService();
