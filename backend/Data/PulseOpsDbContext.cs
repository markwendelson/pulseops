using Microsoft.EntityFrameworkCore;
using PulseOps.Backend.Models;

namespace PulseOps.Backend.Data;

public class PulseOpsDbContext : DbContext
{
    public PulseOpsDbContext(DbContextOptions<PulseOpsDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Server> Servers => Set<Server>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<AlertRule> AlertRules => Set<AlertRule>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<NotificationHistory> NotificationHistories => Set<NotificationHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure indexes for high performance monitoring lookups
        modelBuilder.Entity<Server>().HasIndex(s => s.Hostname);
        modelBuilder.Entity<Alert>().HasIndex(a => a.Status);
        modelBuilder.Entity<Incident>().HasIndex(i => i.TicketNumber).IsUnique();
    }
}
