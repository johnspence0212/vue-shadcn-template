using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Api.Tests;

public class AuthIntegrationTests(CustomWebApplicationFactory factory) : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client = factory.CreateClient();
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    [Fact]
    public async Task Health_ReturnsOk()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Register_CreatesUser()
    {
        var email = $"user-{Guid.NewGuid():N}@test.local";
        var response = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Password123!",
            displayName = "Test User"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.False(string.IsNullOrWhiteSpace(body?.AccessToken));
    }

    [Fact]
    public async Task Login_ValidCredentials()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "admin@template.local",
            password = "AdminPassword123!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.False(string.IsNullOrWhiteSpace(body?.AccessToken));
    }

    [Fact]
    public async Task Login_InvalidCredentials()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "admin@template.local",
            password = "wrong-password"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_RequiresAuth()
    {
        var response = await _client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithToken()
    {
        var login = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "admin@template.local",
            password = "AdminPassword123!"
        });
        var auth = await login.Content.ReadFromJsonAsync<AuthResponseDto>(JsonOptions);
        Assert.NotNull(auth?.AccessToken);

        var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var user = await response.Content.ReadFromJsonAsync<UserDto>(JsonOptions);
        Assert.Equal("admin@template.local", user?.Email);
    }

    [Fact]
    public async Task Task_GetAll_RequiresAuth()
    {
        var response = await _client.GetAsync("/api/task");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private sealed record AuthResponseDto(string AccessToken, DateTime ExpiresAt);
    private sealed record UserDto(int Id, string Email, string? DisplayName);
}
