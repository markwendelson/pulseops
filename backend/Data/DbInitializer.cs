using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(PulseOpsDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Servers.AnyAsync()) return; // Database already seeded

        // Seed Servers
        await context.Servers.AddRangeAsync(
            new Server
            {
                Hostname = "PAYROLL-API",
                IpAddress = "10.0.12.44",
                Os = "Ubuntu 22.04 LTS",
                Region = "us-east-1",
                Environment = "Production",
                Status = AssetStatus.Critical,
                CpuUsage = 93,
                MemoryUsage = 88,
                DiskUsage = 74,
                Availability = 99.98,
                UptimeSeconds = 345600
            },
            new Server
            {
                Hostname = "AUTH-SVC-01",
                IpAddress = "10.0.12.82",
                Os = "Alpine Linux 3.19",
                Region = "us-east-1",
                Environment = "Production",
                Status = AssetStatus.Healthy,
                CpuUsage = 32,
                MemoryUsage = 45,
                DiskUsage = 38,
                Availability = 99.99,
                UptimeSeconds = 1209600
            },
            new Server
            {
                Hostname = "PAYMENT-GW-02",
                IpAddress = "10.0.14.19",
                Os = "Ubuntu 22.04 LTS",
                Region = "eu-west-1",
                Environment = "Production",
                Status = AssetStatus.Warning,
                CpuUsage = 81,
                MemoryUsage = 78,
                DiskUsage = 62,
                Availability = 99.91,
                UptimeSeconds = 432000
            },
            new Server
            {
                Hostname = "DATA-INGEST-09",
                IpAddress = "10.0.22.105",
                Os = "Debian 12",
                Region = "us-west-2",
                Environment = "Production",
                Status = AssetStatus.Healthy,
                CpuUsage = 44,
                MemoryUsage = 59,
                DiskUsage = 51,
                Availability = 100.0,
                UptimeSeconds = 864000
            },
            new Server
            {
                Hostname = "TIMESCALEDB-METRICS-01",
                IpAddress = "10.0.8.12",
                Os = "Ubuntu 22.04 LTS",
                Region = "us-east-1",
                Environment = "Production",
                Status = AssetStatus.Healthy,
                CpuUsage = 58,
                MemoryUsage = 76,
                DiskUsage = 81,
                Availability = 99.995,
                UptimeSeconds = 2592000
            }
        );

        // Seed Applications
        await context.Applications.AddRangeAsync(
            new Application
            {
                Name = "Payroll Transaction Engine",
                Tier = "Microservice",
                Status = AssetStatus.Critical,
                HealthPercent = 78.4,
                RequestsPerSec = 1840,
                AvgLatencyMs = 412,
                ErrorRatePercent = 4.82,
                InstancesCount = 6
            },
            new Application
            {
                Name = "Global Identity & SSO Gateway",
                Tier = "API Gateway",
                Status = AssetStatus.Healthy,
                HealthPercent = 99.9,
                RequestsPerSec = 5400,
                AvgLatencyMs = 38,
                ErrorRatePercent = 0.02,
                InstancesCount = 12
            },
            new Application
            {
                Name = "Stripe & Swift Settlement Bridge",
                Tier = "Microservice",
                Status = AssetStatus.Warning,
                HealthPercent = 94.2,
                RequestsPerSec = 920,
                AvgLatencyMs = 189,
                ErrorRatePercent = 1.15,
                InstancesCount = 4
            },
            new Application
            {
                Name = "Enterprise Web Console",
                Tier = "Frontend",
                Status = AssetStatus.Healthy,
                HealthPercent = 99.98,
                RequestsPerSec = 3200,
                AvgLatencyMs = 24,
                ErrorRatePercent = 0.05,
                InstancesCount = 8
            }
        );

        // Seed Alerts
        await context.Alerts.AddRangeAsync(
            new Alert
            {
                Title = "High CPU Core Contention (> 92%) on PAYROLL-API",
                Severity = SeverityLevel.Critical,
                Source = "Host Metrics Collector",
                TargetResource = "PAYROLL-API",
                Status = "Active",
                AssignedTo = "DevOps OnCall (SRE)"
            },
            new Alert
            {
                Title = "HTTP 502 Rate Spike (> 4.5%) on /api/v1/payroll/disburse",
                Severity = SeverityLevel.Critical,
                Source = "Envoy Ingress Monitor",
                TargetResource = "Payroll Transaction Engine",
                Status = "Active",
                AssignedTo = "Sarah Connor"
            },
            new Alert
            {
                Title = "TimescaleDB Hypertable Chunk Compaction Lag Warning",
                Severity = SeverityLevel.Warning,
                Source = "TimescaleDB Storage Analyzer",
                TargetResource = "TIMESCALEDB-METRICS-01",
                Status = "Acknowledged",
                AssignedTo = "DBA Team"
            },
            new Alert
            {
                Title = "Memory Utilization Threshold Warning (> 80%)",
                Severity = SeverityLevel.Warning,
                Source = "Host Metrics Collector",
                TargetResource = "PAYMENT-GW-02",
                Status = "Active"
            }
        );

        // Seed Incidents
        await context.Incidents.AddRangeAsync(
            new Incident
            {
                TicketNumber = "INC-8891",
                Title = "Payroll API elevated latency & thread exhaustion during batch disbursement",
                Severity = "P1 - Blocker",
                Status = IncidentStatus.Investigating,
                ImpactedServicesJson = "[\"Payroll Transaction Engine\", \"PAYROLL-API\"]",
                Commander = "Sarah Connor (Lead SRE)",
                RootCauseCandidate = "Connection pool starvation on DB transaction pool during scheduled salary run.",
                AiSummary = "Correlated 4 metric anomalies: High CPU (93%), Connection Pool Wait (850ms), and 502 Spike. Suggest scaling horizontal pods + increasing MaxPoolSize by 20%."
            },
            new Incident
            {
                TicketNumber = "INC-8884",
                Title = "EU Gateway regional transient network jitter",
                Severity = "P3 - Medium",
                Status = IncidentStatus.Mitigating,
                ImpactedServicesJson = "[\"PAYMENT-GW-02\"]",
                Commander = "Alex Mercer",
                RootCauseCandidate = "ISP routing table degradation at Frankfurt AWS edge point."
            }
        );

        // Seed Reports
        await context.Reports.AddRangeAsync(
            new Report
            {
                Name = "Monthly SLA & Availability Report - October 2026",
                Period = "2026-10-01 to 2026-10-21",
                OverallAvailability = 99.94,
                SlaTarget = 99.90,
                SlaBreaches = 0,
                MttdMinutes = 2.4,
                MttaMinutes = 4.8,
                MttrMinutes = 18.2
            },
            new Report
            {
                Name = "Quarterly MTTR & Root Cause Distribution Q3 2026",
                Period = "2026-07-01 to 2026-09-30",
                OverallAvailability = 99.96,
                SlaTarget = 99.90,
                SlaBreaches = 1,
                MttdMinutes = 3.1,
                MttaMinutes = 5.2,
                MttrMinutes = 22.4
            }
        );

        await context.SaveChangesAsync();
    }
}
