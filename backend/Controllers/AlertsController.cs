using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/alerts")]
public class AlertsController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public AlertsController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AlertDto>>> GetAlerts()
    {
        var alerts = await _db.Alerts.OrderByDescending(a => a.Timestamp).ToListAsync();
        var dtos = alerts.Select(a => new AlertDto(
            a.Id.ToString(),
            a.Title,
            a.Severity.ToString(),
            a.Source,
            a.TargetResource,
            a.Timestamp.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            a.Status,
            a.AssignedTo
        )).ToList();

        return Ok(dtos);
    }

    [HttpPost("{id}/acknowledge")]
    public async Task<ActionResult<AlertDto>> AcknowledgeAlert(int id, [FromBody] AcknowledgeAlertRequest? req)
    {
        var alert = await _db.Alerts.FindAsync(id);
        if (alert == null) return NotFound(new { message = $"Alert {id} not found." });

        alert.Status = "Acknowledged";
        var responder = req?.User ?? User.Identity?.Name ?? "OnCall Engineer";
        alert.AssignedTo = responder;

        await _db.SaveChangesAsync();

        return Ok(new AlertDto(
            alert.Id.ToString(),
            alert.Title,
            alert.Severity.ToString(),
            alert.Source,
            alert.TargetResource,
            alert.Timestamp.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            alert.Status,
            alert.AssignedTo
        ));
    }
}
