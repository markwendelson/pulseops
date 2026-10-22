using Microsoft.AspNetCore.Mvc;
using PulseOps.Backend.DTOs;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
    [HttpGet]
    public ActionResult<MetricsDto> GetMetrics()
    {
        var cpuTimeSeries = new List<CpuTimeSeriesPoint>
        {
            new("09:00", 64, 28, 55),
            new("09:10", 72, 30, 58),
            new("09:20", 88, 31, 67),
            new("09:30", 94, 33, 79),
            new("09:40", 93, 32, 81)
        };

        var requestThroughput = new List<RequestThroughputPoint>
        {
            new("09:00", 8400, 12),
            new("09:10", 9200, 18),
            new("09:20", 11400, 140),
            new("09:30", 12800, 490),
            new("09:40", 11360, 380)
        };

        return Ok(new MetricsDto(cpuTimeSeries, requestThroughput));
    }
}
