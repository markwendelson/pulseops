using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public ReportsController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReportDto>>> GetReports()
    {
        var reports = await _db.Reports.OrderBy(r => r.Id).ToListAsync();
        var dtos = reports.Select(r => new ReportDto(
            r.Id.ToString(),
            r.Name,
            r.Period,
            r.OverallAvailability,
            r.SlaTarget,
            r.SlaBreaches,
            r.MttdMinutes,
            r.MttaMinutes,
            r.MttrMinutes
        )).ToList();

        return Ok(dtos);
    }
}
