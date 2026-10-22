using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace PulseOps.Backend.Services;

public record AuthUser(
    string Id,
    string Username,
    string Email,
    string FullName,
    string Role,
    string Password
);

public interface IAuthService
{
    (string Token, AuthUser User)? Authenticate(string username, string password);
    AuthUser? GetUserByUsername(string username);
    IEnumerable<AuthUser> GetSeedUsers();
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _config;

    // Realistic seed users with defined enterprise roles (Admin, SRE Lead, DevOps, Viewer)
    private static readonly List<AuthUser> MockUsers = new()
    {
        new AuthUser("usr-1", "admin", "admin@pulseops.internal", "Alex Mercer (Principal Architect)", "Admin", "Admin123!"),
        new AuthUser("usr-2", "sarah", "sarah.connor@pulseops.internal", "Sarah Connor (Lead SRE)", "SRE", "Sre123!"),
        new AuthUser("usr-3", "devops", "devops.oncall@pulseops.internal", "DevOps OnCall (Engineer)", "DevOps", "Dev123!"),
        new AuthUser("usr-4", "viewer", "executive.viewer@pulseops.internal", "Executive Viewer", "Viewer", "View123!")
    };

    public AuthService(IConfiguration config)
    {
        _config = config;
    }

    public IEnumerable<AuthUser> GetSeedUsers() => MockUsers;

    public AuthUser? GetUserByUsername(string username) =>
        MockUsers.FirstOrDefault(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)
                                   || u.Email.Equals(username, StringComparison.OrdinalIgnoreCase));

    public (string Token, AuthUser User)? Authenticate(string username, string password)
    {
        var user = MockUsers.FirstOrDefault(u => 
            (u.Username.Equals(username, StringComparison.OrdinalIgnoreCase) || u.Email.Equals(username, StringComparison.OrdinalIgnoreCase))
            && u.Password == password);

        if (user == null) return null;

        var token = GenerateJwtToken(user);
        return (token, user);
    }

    private string GenerateJwtToken(AuthUser user)
    {
        var secret = _config["JwtSettings:Secret"] ?? "PulseOpsSuperSecretEnterpriseSecurityKey2026!";
        var issuer = _config["JwtSettings:Issuer"] ?? "PulseOpsBackend";
        var audience = _config["JwtSettings:Audience"] ?? "PulseOpsFrontend";
        var expiryMinutes = int.TryParse(_config["JwtSettings:ExpiryMinutes"], out var mins) ? mins : 1440;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Name, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("fullName", user.FullName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
