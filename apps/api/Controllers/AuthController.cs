using Api.Contracts.Auth;
using Api.Data;
using Api.Models;
using Api.Options;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    AppDbContext context,
    IJwtTokenService jwtTokenService,
    IOptions<AuthOptions> authOptions) : ControllerBase
{
  private readonly AuthOptions _authOptions = authOptions.Value;

  [AllowAnonymous]
  [HttpPost("login")]
  public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
  {
    var email = request.Email.Trim().ToLowerInvariant();
    var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
    if (user is null)
    {
      return Unauthorized();
    }

    var hasher = new PasswordHasher<User>();
    var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
    if (result == PasswordVerificationResult.Failed)
    {
      return Unauthorized();
    }

    var (token, expiresAt) = jwtTokenService.CreateToken(user);
    return Ok(new AuthResponse(token, expiresAt));
  }

  [AllowAnonymous]
  [HttpPost("register")]
  public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
  {
    if (!_authOptions.AllowRegistration)
    {
      return Forbid();
    }

    if (string.IsNullOrWhiteSpace(request.Email) || request.Password.Length < 8)
    {
      return BadRequest("Email and password (min 8 characters) are required.");
    }

    var email = request.Email.Trim().ToLowerInvariant();
    var exists = await context.Users.AnyAsync(u => u.Email == email);
    if (exists)
    {
      return Conflict("Email is already registered.");
    }

    var hasher = new PasswordHasher<User>();
    var user = new User
    {
      Email = email,
      DisplayName = request.DisplayName?.Trim(),
      PasswordHash = hasher.HashPassword(null!, request.Password)
    };

    context.Users.Add(user);

    try
    {
      await context.SaveChangesAsync();
    }
    catch (DbUpdateException)
    {
      return Conflict("Email is already registered.");
    }

    var (token, expiresAt) = jwtTokenService.CreateToken(user);
    return Ok(new AuthResponse(token, expiresAt));
  }

  [Authorize]
  [HttpGet("me")]
  public async Task<ActionResult<UserResponse>> Me()
  {
    var sub = User.FindFirst("sub")?.Value
      ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    if (!int.TryParse(sub, out var userId))
    {
      return Unauthorized();
    }

    var user = await context.Users.FindAsync(userId);
    if (user is null)
    {
      return NotFound();
    }

    return Ok(new UserResponse(user.Id, user.Email, user.DisplayName));
  }
}
