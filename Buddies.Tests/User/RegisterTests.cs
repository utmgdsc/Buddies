using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Buddies.API.Database;
using Buddies.API.IO;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Buddies.Tests.User;

public class RegisterTests : IClassFixture<TestWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;
    
    public RegisterTests(TestWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }
    
    [Fact]
    public async Task TestEmptyRequest()
    {
        var request = new RegisterRequest
        {
            FirstName = "",
            LastName = "",
            Email = "",
            Password = ""
        };
        
        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.Equal(4, responseBody?.RootElement.GetProperty("errors").EnumerateObject().Count());
    }

    [Fact]
    public async Task TestInvalidEmail()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "not an email", 
            Password = "Pwd^123"
        };
        
        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("email", out _));
    }

    [Fact]
    public async Task TestUnsafePassword()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "akari@akaza.moe", 
            Password = "12345"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("password", out _));
    }

    [Fact]
    public async Task TestShortName()
    {
        var request = new RegisterRequest
        {
            FirstName = "A", 
            LastName = "A", 
            Email = "akari@akaza.moe", 
            Password = "Pwd^123"
        };
        
        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("firstName", out _));
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("lastName", out _));
    }

    [Fact]
    public async Task TestUserRegistered()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "akari@akaza.moe", 
            Password = "Pwd^123"
        };
        
        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var scopeFactory = _factory.Services.GetRequiredService<IServiceScopeFactory>();
        using (var scope = scopeFactory.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApiContext>();
            var user = db.Users.FirstOrDefault(user => user.Email == request.Email);
            Assert.NotNull(user);
            var profile = db.Profiles.First(profile => profile.UserId == user!.Id);
            Assert.Equal(request.FirstName, profile.FirstName);
            Assert.Equal(request.LastName, profile.LastName);
        }
    }

    [Fact]
    public async Task TestDuplicateEmail()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "kyoko@toshino.moe", 
            Password = "Pwd^123"
        };
        
        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var dupRequest = new RegisterRequest
        {
            FirstName = "Kyoko", 
            LastName = "Toshino", 
            Email = request.Email, 
            Password = "321^dwP"
        };
        
        response = await _client.PostAsJsonAsync("/api/v1/users/register", dupRequest);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseBody = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("email", out _));
    }
}