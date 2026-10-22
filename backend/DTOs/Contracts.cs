using System.Text.Json.Serialization;

namespace PulseOps.Backend.DTOs;

public record ServerDto(
    string Id,
    string Hostname,
    string IpAddress,
    string Os,
    string Region,
    string Environment,
    string Status,
    double CpuUsage,
    double MemoryUsage,
    double DiskUsage,
    double Availability,
    long UptimeSeconds,
    string LastHeartbeat
);

public record CreateServerRequest(
    string Hostname,
    string IpAddress,
    string Os,
    string Region,
    string Environment
);

public record CreateApplicationRequest(
    string Name,
    string Tier,
    int InstancesCount
);

public record ApplicationDto(
    string Id,
    string Name,
    string Tier,
    string Status,
    double HealthPercent,
    int RequestsPerSec,
    double AvgLatencyMs,
    double ErrorRatePercent,
    int InstancesCount
);

public record AlertDto(
    string Id,
    string Title,
    string Severity,
    string Source,
    string TargetResource,
    string Timestamp,
    string Status,
    string? AssignedTo
);

public record IncidentDto(
    string Id,
    string TicketNumber,
    string Title,
    string Severity,
    string Status,
    string[] ImpactedServices,
    string OpenedAt,
    string? ResolvedAt,
    string Commander,
    string? RootCauseCandidate,
    string? AiSummary
);

public record ExecutiveSummaryDto(
    double OverallAvailability,
    int ActiveAlertsCount,
    int CriticalIncidentsCount,
    int OpenIncidentsCount,
    double MttdMinutes,
    double MttaMinutes,
    double MttrMinutes,
    double SlaCompliancePercent,
    int TotalMonitoredAssets
);

public record ReportDto(
    string Id,
    string Name,
    string Period,
    double OverallAvailability,
    double SlaTarget,
    int SlaBreaches,
    double MttdMinutes,
    double MttaMinutes,
    double MttrMinutes
);

public record NotificationDto(
    string Id,
    string Channel,
    string Target,
    string AlertId,
    string Status,
    string Timestamp
);

public record AlertRuleDto(
    string Id,
    string Name,
    string TargetResource,
    string Metric,
    double Threshold,
    int DurationMinutes,
    string Condition,
    string Severity,
    bool IsActive
);

public record CreateAlertRuleRequest(
    string Name,
    string TargetResource,
    string Metric,
    double Threshold,
    int DurationMinutes,
    string Condition,
    string Severity
);

public record CpuTimeSeriesPoint(
    string Timestamp,
    [property: JsonPropertyName("PAYROLL-API")] double PayrollApi,
    [property: JsonPropertyName("AUTH-SVC-01")] double AuthSvc01,
    [property: JsonPropertyName("PAYMENT-GW-02")] double PaymentGw02
);

public record RequestThroughputPoint(
    string Timestamp,
    int Requests,
    int Errors
);

public record MetricsDto(
    List<CpuTimeSeriesPoint> CpuTimeSeries,
    List<RequestThroughputPoint> RequestThroughput
);

public record AcknowledgeAlertRequest(
    string? User
);

public record LoginRequest(
    string Username,
    string Password
);

public record UserProfileDto(
    string Id,
    string Username,
    string Email,
    string FullName,
    string Role
);

public record LoginResponse(
    string Token,
    UserProfileDto User
);
