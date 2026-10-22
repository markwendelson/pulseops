using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public ApplicationsController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ApplicationDto>>> GetApplications()
    {
        var apps = await _db.Applications.OrderBy(a => a.Id).ToListAsync();
        var dtos = apps.Select(a => new ApplicationDto(
            a.Id.ToString(),
            a.Name,
            a.Tier,
            a.Status.ToString(),
            a.HealthPercent,
            a.RequestsPerSec,
            a.AvgLatencyMs,
            a.ErrorRatePercent,
            a.InstancesCount
        )).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationDto>> GetApplicationById(int id)
    {
        var a = await _db.Applications.FindAsync(id);
        if (a == null) return NotFound(new { message = $"Application {id} not found." });

        return Ok(new ApplicationDto(
            a.Id.ToString(),
            a.Name,
            a.Tier,
            a.Status.ToString(),
            a.HealthPercent,
            a.RequestsPerSec,
            a.AvgLatencyMs,
            a.ErrorRatePercent,
            a.InstancesCount
        ));
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationDto>> CreateApplication([FromBody] CreateApplicationRequest req)
    {
        var app = new Application
        {
            Name = req.Name,
            Tier = string.IsNullOrWhiteSpace(req.Tier) ? "Microservice" : req.Tier,
            Status = AssetStatus.Healthy,
            HealthPercent = 99.9,
            RequestsPerSec = 1200,
            AvgLatencyMs = 45,
            ErrorRatePercent = 0.01,
            InstancesCount = req.InstancesCount > 0 ? req.InstancesCount : 2
        };

        _db.Applications.Add(app);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetApplicationById), new { id = app.Id }, new ApplicationDto(
            app.Id.ToString(),
            app.Name,
            app.Tier,
            app.Status.ToString(),
            app.HealthPercent,
            app.RequestsPerSec,
            app.AvgLatencyMs,
            app.ErrorRatePercent,
            app.InstancesCount
        ));
    }
}
