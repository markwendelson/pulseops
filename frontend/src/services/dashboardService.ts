import { ApiService, delay } from './apiService';
import alertsData from '../mocks/alerts.json';
import incidentsData from '../mocks/incidents.json';

export interface DashboardSummary {
  availability: number;
  activeAlerts: number;
  openIncidents: number;
  criticalIncidents: number;
  mttr: number;
  mttd: number;
  mtta: number;
  slaCompliance: number;
}

export class DashboardService extends ApiService {
  async getSummary(): Promise<DashboardSummary> {
    if (!this.isMock()) {
      const data = await this.httpGet<any>('/dashboard/summary');
      return {
        availability: data.overallAvailability ?? data.availability ?? 99.94,
        activeAlerts: data.activeAlertsCount ?? data.activeAlerts ?? 0,
        openIncidents: data.openIncidentsCount ?? data.openIncidents ?? 0,
        criticalIncidents: data.criticalIncidentsCount ?? data.criticalIncidents ?? 0,
        mttr: data.mttrMinutes ?? data.mttr ?? 18.2,
        mttd: data.mttdMinutes ?? data.mttd ?? 2.4,
        mtta: data.mttaMinutes ?? data.mtta ?? 4.8,
        slaCompliance: data.slaCompliancePercent ?? data.slaCompliance ?? 99.85,
      };
    }

    await delay();
    return {
      availability: 99.94,
      activeAlerts: alertsData.filter((a) => a.status === 'Active').length,
      openIncidents: incidentsData.filter((i) => i.status !== 'Resolved').length,
      criticalIncidents: incidentsData.filter((i) => i.severity.includes('P1')).length,
      mttr: 18.2,
      mttd: 2.4,
      mtta: 4.8,
      slaCompliance: 99.85,
    };
  }
}

export const dashboardService = new DashboardService();
