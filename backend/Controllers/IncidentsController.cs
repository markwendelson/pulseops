using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/incidents")]
public class IncidentsController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public IncidentsController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<IncidentDto>>> GetIncidents()
    {
        var incidents = await _db.Incidents.OrderByDescending(i => i.OpenedAt).ToListAsync();
        var dtos = incidents.Select(i =>
        {
            string[] impactedServices;
            try
            {
                impactedServices = JsonSerializer.Deserialize<string[]>(i.ImpactedServicesJson) ?? Array.Empty<string>();
            }
            catch
            {
                impactedServices = Array.Empty<string>();
            }

            return new IncidentDto(
                i.Id.ToString(),
                i.TicketNumber,
                i.Title,
                i.Severity,
                i.Status.ToString(),
                impactedServices,
                i.OpenedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                i.ResolvedAt?.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                i.Commander,
                i.RootCauseCandidate,
                i.AiSummary
            );
        }).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IncidentDto>> GetIncidentById(int id)
    {
        var i = await _db.Incidents.FindAsync(id);
        if (i == null) return NotFound(new { message = $"Incident with id {id} not found." });

        string[] impactedServices;
        try
        {
            impactedServices = JsonSerializer.Deserialize<string[]>(i.ImpactedServicesJson) ?? Array.Empty<string>();
        }
        catch
        {
            impactedServices = Array.Empty<string>();
        }

        return Ok(new IncidentDto(
            i.Id.ToString(),
            i.TicketNumber,
            i.Title,
            i.Severity,
            i.Status.ToString(),
            impactedServices,
            i.OpenedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            i.ResolvedAt?.ToString("yyyy-MM-ddTHH:mm:ssZ"),
            i.Commander,
            i.RootCauseCandidate,
            i.AiSummary
        ));
    }
}
