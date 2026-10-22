using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public DashboardController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ExecutiveSummaryDto>> GetSummary()
    {
        var servers = await _db.Servers.ToListAsync();
        var applications = await _db.Applications.ToListAsync();
        var activeAlerts = await _db.Alerts.CountAsync(a => a.Status == "Active");
        var openIncidents = await _db.Incidents.CountAsync(i => i.Status != IncidentStatus.Resolved);
        var criticalIncidents = await _db.Incidents.CountAsync(i => i.Status != IncidentStatus.Resolved && i.Severity.Contains("P1"));

        var avgAvailability = servers.Count > 0 ? servers.Average(s => s.Availability) : 99.94;
        var totalAssets = servers.Count + applications.Count;

        return Ok(new ExecutiveSummaryDto(
            OverallAvailability: Math.Round(avgAvailability, 2),
            ActiveAlertsCount: activeAlerts,
            CriticalIncidentsCount: criticalIncidents,
            OpenIncidentsCount: openIncidents,
            MttdMinutes: 2.4,
            MttaMinutes: 4.8,
            MttrMinutes: 18.2,
            SlaCompliancePercent: 99.4,
            TotalMonitoredAssets: totalAssets
        ));
    }
}
