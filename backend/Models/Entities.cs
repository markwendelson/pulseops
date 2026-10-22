using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PulseOps.Backend.Models;

public enum AssetStatus
{
    Healthy,
    Warning,
    Critical,
    Degraded,
    Offline
}

public enum SeverityLevel
{
    Info,
    Warning,
    Critical,
    P1_Blocker,
    P2_High,
    P3_Medium,
    P4_Low
}

public enum IncidentStatus
{
    Investigating,
    Identified,
    Mitigating,
    Resolved
}

public class User
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "DevOps Engineer";
    public string? Avatar { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Server
{
    public int Id { get; set; }
    [Required] public string Hostname { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string Os { get; set; } = string.Empty;
    public string Region { get; set; } = "us-east-1";
    public string Environment { get; set; } = "Production";
    public AssetStatus Status { get; set; } = AssetStatus.Healthy;
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double DiskUsage { get; set; }
    public double Availability { get; set; } = 99.99;
    public long UptimeSeconds { get; set; }
    public DateTime LastHeartbeat { get; set; } = DateTime.UtcNow;
}

public class Application
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    public string Tier { get; set; } = "Microservice";
    public AssetStatus Status { get; set; } = AssetStatus.Healthy;
    public double HealthPercent { get; set; } = 99.9;
    public int RequestsPerSec { get; set; }
    public double AvgLatencyMs { get; set; }
    public double ErrorRatePercent { get; set; }
    public int InstancesCount { get; set; } = 4;
}

public class AlertRule
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    public string TargetResource { get; set; } = string.Empty;
    public string Metric { get; set; } = string.Empty;
    public double Threshold { get; set; }
    public int DurationMinutes { get; set; } = 5;
    public string Condition { get; set; } = string.Empty;
    public SeverityLevel Severity { get; set; } = SeverityLevel.Warning;
    public bool IsActive { get; set; } = true;
}

public class Alert
{
    public int Id { get; set; }
    [Required] public string Title { get; set; } = string.Empty;
    public SeverityLevel Severity { get; set; } = SeverityLevel.Warning;
    public string Source { get; set; } = string.Empty;
    public string TargetResource { get; set; } = string.Empty;
    public string Status { get; set; } = "Active"; // Active, Acknowledged, Resolved
    public string? AssignedTo { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class Incident
{
    public int Id { get; set; }
    [Required] public string TicketNumber { get; set; } = string.Empty;
    [Required] public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "P1 - Blocker";
    public IncidentStatus Status { get; set; } = IncidentStatus.Investigating;
    public string ImpactedServicesJson { get; set; } = "[]";
    public string Commander { get; set; } = string.Empty;
    public string? RootCauseCandidate { get; set; }
    public string? AiSummary { get; set; }
    public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}

public class Report
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public double OverallAvailability { get; set; }
    public double SlaTarget { get; set; } = 99.90;
    public int SlaBreaches { get; set; }
    public double MttdMinutes { get; set; }
    public double MttaMinutes { get; set; }
    public double MttrMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class NotificationHistory
{
    public int Id { get; set; }
    public string Channel { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public int AlertId { get; set; }
    public string Status { get; set; } = "Delivered";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
