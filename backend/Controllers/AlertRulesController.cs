using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/alert-rules")]
public class AlertRulesController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public AlertRulesController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<AlertRuleDto>>> GetAlertRules()
    {
        var rules = await _db.AlertRules.OrderBy(r => r.Id).ToListAsync();
        if (rules.Count == 0)
        {
            rules = new List<AlertRule>
            {
                new() { Id = 1, Name = "CPU Contention High", TargetResource = "All Host Compute", Metric = "CPU Utilization", Threshold = 90.0, DurationMinutes = 5, Condition = "> 90% for 5m", Severity = SeverityLevel.Critical, IsActive = true },
                new() { Id = 2, Name = "HTTP 5xx Rate Exceeded", TargetResource = "All Gateway & APIs", Metric = "Error Rate", Threshold = 4.0, DurationMinutes = 2, Condition = "> 4% for 2m", Severity = SeverityLevel.Critical, IsActive = true },
                new() { Id = 3, Name = "Disk Saturation Warning", TargetResource = "Storage & Database", Metric = "Disk Usage", Threshold = 80.0, DurationMinutes = 15, Condition = "> 80% for 15m", Severity = SeverityLevel.Warning, IsActive = true },
                new() { Id = 4, Name = "TimescaleDB Chunk Lag", TargetResource = "TIMESCALEDB-METRICS-01", Metric = "Hypertable Lag", Threshold = 10.0, DurationMinutes = 10, Condition = "> 10m lag", Severity = SeverityLevel.Warning, IsActive = false }
            };
            await _db.AlertRules.AddRangeAsync(rules);
            await _db.SaveChangesAsync();
        }

        var dtos = rules.Select(r => new AlertRuleDto(
            r.Id.ToString(),
            r.Name,
            r.TargetResource,
            r.Metric,
            r.Threshold,
            r.DurationMinutes,
            r.Condition,
            r.Severity.ToString(),
            r.IsActive
        )).ToList();

        return Ok(dtos);
    }

    [HttpPost]
    public async Task<ActionResult<AlertRuleDto>> CreateAlertRule([FromBody] CreateAlertRuleRequest req)
    {
        var rule = new AlertRule
        {
            Name = req.Name,
            TargetResource = req.TargetResource,
            Metric = req.Metric,
            Threshold = req.Threshold,
            DurationMinutes = req.DurationMinutes,
            Condition = req.Condition,
            Severity = Enum.TryParse<SeverityLevel>(req.Severity, out var sev) ? sev : SeverityLevel.Warning,
            IsActive = true
        };

        _db.AlertRules.Add(rule);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAlertRules), new { id = rule.Id }, new AlertRuleDto(
            rule.Id.ToString(),
            rule.Name,
            rule.TargetResource,
            rule.Metric,
            rule.Threshold,
            rule.DurationMinutes,
            rule.Condition,
            rule.Severity.ToString(),
            rule.IsActive
        ));
    }

    [HttpPatch("{id}/toggle")]
    public async Task<ActionResult<AlertRuleDto>> ToggleAlertRule(int id)
    {
        var rule = await _db.AlertRules.FindAsync(id);
        if (rule == null) return NotFound(new { message = $"Rule {id} not found." });

        rule.IsActive = !rule.IsActive;
        await _db.SaveChangesAsync();

        return Ok(new AlertRuleDto(
            rule.Id.ToString(),
            rule.Name,
            rule.TargetResource,
            rule.Metric,
            rule.Threshold,
            rule.DurationMinutes,
            rule.Condition,
            rule.Severity.ToString(),
            rule.IsActive
        ));
    }
}
