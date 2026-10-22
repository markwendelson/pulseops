using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PulseOps.Backend.Data;
using PulseOps.Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers with JSON String Enum conversion support
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// 2. Register Mock Authentication Service
builder.Services.AddSingleton<IAuthService, AuthService>();

// 3. Configure Database: In-Memory Mock DB (Default for development without live Postgres) or PostgreSQL
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryMockDb", true);
if (useInMemory)
{
    builder.Services.AddDbContext<PulseOpsDbContext>(options =>
        options.UseInMemoryDatabase("PulseOpsMockDb"));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Host=localhost;Port=5432;Database=pulseops;Username=pulseops_user;Password=pulseops_secret";
    builder.Services.AddDbContext<PulseOpsDbContext>(options =>
        options.UseNpgsql(connectionString));
}

// 4. Configure JWT Authentication & RBAC
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "PulseOpsSuperSecretEnterpriseSecurityKey2026!";
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "PulseOpsBackend";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "PulseOpsFrontend";
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("SreOrDevOps", policy => policy.RequireRole("Admin", "SRE", "DevOps"));
});

// 5. Configure CORS for Vite React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("PulseOpsCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 6. Configure Swagger with JWT Bearer support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PulseOps Enterprise API",
        Version = "v1",
        Description = "Enterprise Observability, Incident Intelligence, and AIOps Platform API (.NET 8)"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PulseOps API v1");
        c.RoutePrefix = "swagger";
    });
}

// Enable CORS
app.UseCors("PulseOpsCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Auto-seed database during startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<PulseOpsDbContext>();
        await DbInitializer.SeedAsync(dbContext);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Failed to initialize and seed database.");
    }
}

app.Run();
