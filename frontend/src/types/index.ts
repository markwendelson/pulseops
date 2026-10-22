export type StatusType = 'Healthy' | 'Degraded' | 'Critical' | 'Warning' | 'Offline';

export interface ServerMetric {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  region: string;
  environment: 'Production' | 'Staging' | 'Development';
  status: StatusType;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  availability: number;
  uptimeSeconds: number;
  lastHeartbeat: string;
}

export interface ApplicationService {
  id: string;
  name: string;
  tier: 'Frontend' | 'API Gateway' | 'Microservice' | 'Worker' | 'Database';
  status: StatusType;
  healthPercent: number;
  requestsPerSec: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  instancesCount: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  source: string;
  targetResource: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  assignedTo?: string;
}

export interface Incident {
  id: string;
  ticketNumber: string;
  title: string;
  severity: 'P1 - Blocker' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low';
  status: 'Investigating' | 'Identified' | 'Mitigating' | 'Resolved';
  impactedServices: string[];
  openedAt: string;
  resolvedAt?: string;
  commander: string;
  rootCauseCandidate?: string;
  aiSummary?: string;
}

export interface ExecutiveSummary {
  overallAvailability: number;
  activeAlertsCount: number;
  criticalIncidentsCount: number;
  openIncidentsCount: number;
  mttdMinutes: number;
  mttaMinutes: number;
  mttrMinutes: number;
  slaCompliancePercent: number;
  totalMonitoredAssets: number;
}
