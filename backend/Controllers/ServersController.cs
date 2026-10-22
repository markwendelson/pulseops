using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Data;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/servers")]
public class ServersController : ControllerBase
{
    private readonly PulseOpsDbContext _db;

    public ServersController(PulseOpsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ServerDto>>> GetServers()
    {
        var servers = await _db.Servers.OrderBy(s => s.Id).ToListAsync();
        var dtos = servers.Select(s => new ServerDto(
            s.Id.ToString(),
            s.Hostname,
            s.IpAddress,
            s.Os,
            s.Region,
            s.Environment,
            s.Status.ToString(),
            s.CpuUsage,
            s.MemoryUsage,
            s.DiskUsage,
            s.Availability,
            s.UptimeSeconds,
            s.LastHeartbeat.ToString("yyyy-MM-ddTHH:mm:ssZ")
        )).ToList();

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServerDto>> GetServerById(int id)
    {
        var s = await _db.Servers.FindAsync(id);
        if (s == null) return NotFound(new { message = $"Server with id {id} not found." });

        return Ok(new ServerDto(
            s.Id.ToString(),
            s.Hostname,
            s.IpAddress,
            s.Os,
            s.Region,
            s.Environment,
            s.Status.ToString(),
            s.CpuUsage,
            s.MemoryUsage,
            s.DiskUsage,
            s.Availability,
            s.UptimeSeconds,
            s.LastHeartbeat.ToString("yyyy-MM-ddTHH:mm:ssZ")
        ));
    }

    [HttpPost]
    public async Task<ActionResult<ServerDto>> CreateServer([FromBody] CreateServerRequest req)
    {
        var server = new Server
        {
            Hostname = req.Hostname.ToUpperInvariant(),
            IpAddress = string.IsNullOrWhiteSpace(req.IpAddress) ? "10.0.15.50" : req.IpAddress,
            Os = string.IsNullOrWhiteSpace(req.Os) ? "Ubuntu 22.04 LTS" : req.Os,
            Region = string.IsNullOrWhiteSpace(req.Region) ? "us-east-1" : req.Region,
            Environment = string.IsNullOrWhiteSpace(req.Environment) ? "Production" : req.Environment,
            Status = AssetStatus.Healthy,
            CpuUsage = 25.0,
            MemoryUsage = 40.0,
            DiskUsage = 35.0,
            Availability = 100.0,
            UptimeSeconds = 3600,
            LastHeartbeat = DateTime.UtcNow
        };

        _db.Servers.Add(server);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetServerById), new { id = server.Id }, new ServerDto(
            server.Id.ToString(),
            server.Hostname,
            server.IpAddress,
            server.Os,
            server.Region,
            server.Environment,
            server.Status.ToString(),
            server.CpuUsage,
            server.MemoryUsage,
            server.DiskUsage,
            server.Availability,
            server.UptimeSeconds,
            server.LastHeartbeat.ToString("yyyy-MM-ddTHH:mm:ssZ")
        ));
    }
}
