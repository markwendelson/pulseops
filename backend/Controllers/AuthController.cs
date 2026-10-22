using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PulseOps.Backend.DTOs;
using PulseOps.Backend.Services;
using System.Security.Claims;

namespace PulseOps.Backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticate against mock user store and return a signed JWT token.
    /// Default credentials:
    /// admin / Admin123! (Role: Admin)
    /// sarah / Sre123!   (Role: SRE)
    /// devops / Dev123!  (Role: DevOps)
    /// viewer / View123! (Role: Viewer)
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        var result = _authService.Authenticate(request.Username, request.Password);
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid credentials. Use admin / Admin123! or devops / Dev123!" });
        }

        var (token, user) = result.Value;
        var profile = new UserProfileDto(user.Id, user.Username, user.Email, user.FullName, user.Role);

        return Ok(new LoginResponse(token, profile));
    }

    /// <summary>
    /// Returns the currently authenticated user's profile and RBAC roles from claims.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<UserProfileDto> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub") ?? "";
        var username = User.FindFirstValue(ClaimTypes.Name) ?? "";
        var email = User.FindFirstValue(ClaimTypes.Email) ?? "";
        var fullName = User.FindFirstValue("fullName") ?? username;
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Viewer";

        return Ok(new UserProfileDto(userId, username, email, fullName, role));
    }

    /// <summary>
    /// List available test users and role profiles for testing.
    /// </summary>
    [HttpGet("mock-users")]
    [AllowAnonymous]
    public ActionResult<IEnumerable<object>> GetMockUsers()
    {
        var users = _authService.GetSeedUsers().Select(u => new
        {
            u.Id,
            u.Username,
            u.Email,
            u.FullName,
            u.Role,
            PasswordHint = u.Password
        });

        return Ok(users);
    }
}
