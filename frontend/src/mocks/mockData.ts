import { ServerMetric, ApplicationService, Alert, Incident, ExecutiveSummary } from '../types';

export const mockExecutiveSummary: ExecutiveSummary = {
  overallAvailability: 99.94,
  activeAlertsCount: 14,
  criticalIncidentsCount: 1,
  openIncidentsCount: 3,
  mttdMinutes: 2.4,
  mttaMinutes: 4.8,
  mttrMinutes: 18.2,
  slaCompliancePercent: 99.85,
  totalMonitoredAssets: 184
};

export const mockServers: ServerMetric[] = [
  {
    id: "srv-001",
    hostname: "PAYROLL-API-PROD-01",
    ipAddress: "10.0.12.44",
    os: "Ubuntu 22.04 LTS",
    region: "us-east-1",
    environment: "Production",
    status: "Critical",
    cpuUsage: 94,
    memoryUsage: 89,
    diskUsage: 72,
    availability: 99.98,
    uptimeSeconds: 345600,
    lastHeartbeat: "Just now"
  },
  {
    id: "srv-002",
    hostname: "AUTH-SERVICE-CLUSTER-A",
    ipAddress: "10.0.12.82",
    os: "Alpine Linux 3.19",
    region: "us-east-1",
    environment: "Production",
    status: "Healthy",
    cpuUsage: 38,
    memoryUsage: 54,
    diskUsage: 41,
    availability: 99.99,
    uptimeSeconds: 1209600,
    lastHeartbeat: "Just now"
  },
  {
    id: "srv-003",
    hostname: "PAYMENTS-GATEWAY-02",
    ipAddress: "10.0.14.19",
    os: "Ubuntu 22.04 LTS",
    region: "eu-west-1",
    environment: "Production",
    status: "Warning",
    cpuUsage: 82,
    memoryUsage: 79,
    diskUsage: 65,
    availability: 99.91,
    uptimeSeconds: 432000,
    lastHeartbeat: "10s ago"
  },
  {
    id: "srv-004",
    hostname: "DATA-INGEST-WORKER-09",
    ipAddress: "10.0.22.105",
    os: "Debian 12",
    region: "us-west-2",
    environment: "Production",
    status: "Healthy",
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 55,
    availability: 100.0,
    uptimeSeconds: 864000,
    lastHeartbeat: "Just now"
  },
  {
    id: "srv-005",
    hostname: "TIMESCALEDB-METRICS-HYPER01",
    ipAddress: "10.0.8.12",
    os: "Ubuntu 22.04 LTS",
    region: "us-east-1",
    environment: "Production",
    status: "Healthy",
    cpuUsage: 58,
    memoryUsage: 76,
    diskUsage: 81,
    availability: 99.995,
    uptimeSeconds: 2592000,
    lastHeartbeat: "Just now"
  }
];

export const mockApplications: ApplicationService[] = [
  {
    id: "app-01",
    name: "Payroll Transaction Engine",
    tier: "Microservice",
    status: "Critical",
    healthPercent: 78.4,
    requestsPerSec: 1840,
    avgLatencyMs: 412,
    errorRatePercent: 4.82,
    instancesCount: 6
  },
  {
    id: "app-02",
    name: "Global Identity & SSO Gateway",
    tier: "API Gateway",
    status: "Healthy",
    healthPercent: 99.9,
    requestsPerSec: 5400,
    avgLatencyMs: 38,
    errorRatePercent: 0.02,
    instancesCount: 12
  },
  {
    id: "app-03",
    name: "Stripe & Swift Settlement Bridge",
    tier: "Microservice",
    status: "Warning",
    healthPercent: 94.2,
    requestsPerSec: 920,
    avgLatencyMs: 189,
    errorRatePercent: 1.15,
    instancesCount: 4
  },
  {
    id: "app-04",
    name: "Enterprise Web Console",
    tier: "Frontend",
    status: "Healthy",
    healthPercent: 99.98,
    requestsPerSec: 3200,
    avgLatencyMs: 24,
    errorRatePercent: 0.05,
    instancesCount: 8
  }
];

export const mockAlerts: Alert[] = [
  {
    id: "alt-901",
    title: "High CPU Core Contention (> 92%) on PAYROLL-API-PROD-01",
    severity: "Critical",
    source: "Host Metrics Collector",
    targetResource: "PAYROLL-API-PROD-01",
    timestamp: "3 minutes ago",
    status: "Active",
    assignedTo: "DevOps OnCall (SRE)"
  },
  {
    id: "alt-902",
    title: "HTTP 502 Rate Spike (> 4.5%) on /api/v1/payroll/disburse",
    severity: "Critical",
    source: "Envoy Ingress Monitor",
    targetResource: "Payroll Transaction Engine",
    timestamp: "6 minutes ago",
    status: "Active"
  },
  {
    id: "alt-903",
    title: "TimescaleDB Hypertable Chunk Compaction Lag Warning",
    severity: "Warning",
    source: "TimescaleDB Storage Analyzer",
    targetResource: "TIMESCALEDB-METRICS-HYPER01",
    timestamp: "22 minutes ago",
    status: "Acknowledged",
    assignedTo: "DBA Team"
  },
  {
    id: "alt-904",
    title: "Memory Utilization Threshold Warning (> 80%)",
    severity: "Warning",
    source: "Host Metrics Collector",
    targetResource: "PAYMENTS-GATEWAY-02",
    timestamp: "45 minutes ago",
    status: "Active"
  }
];

export const mockIncidents: Incident[] = [
  {
    id: "inc-102",
    ticketNumber: "INC-8891",
    title: "Payroll API elevated latency & thread exhaustion during batch disbursement",
    severity: "P1 - Blocker",
    status: "Investigating",
    impactedServices: ["Payroll Transaction Engine", "PAYROLL-API-PROD-01"],
    openedAt: "18 minutes ago",
    commander: "Sarah Connor (Lead SRE)",
    rootCauseCandidate: "Connection pool starvation on DB transaction pool during 09:00 AM scheduled salary run.",
    aiSummary: "Correlated 4 metric anomalies: High CPU (94%), Connection Pool Wait (850ms), and 502 Spike. Suggest scaling horizontal pods + increasing MaxPoolSize by 20%."
  },
  {
    id: "inc-101",
    ticketNumber: "INC-8884",
    title: "EU Gateway regional transient network jitter",
    severity: "P3 - Medium",
    status: "Mitigating",
    impactedServices: ["PAYMENTS-GATEWAY-02"],
    openedAt: "2 hours ago",
    commander: "Alex Mercer",
    rootCauseCandidate: "ISP routing table degradation at Frankfurt AWS edge point."
  }
];
