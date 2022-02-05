using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
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
    public void TestEmptyRequest()
    {
        var request = new RegisterRequest
        {
            FirstName = "",
            LastName = "",
            Email = "",
            Password = ""
        };
        
        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = response.Content.ReadFromJsonAsync<JsonDocument>().Result;
        Assert.Equal(4, responseBody?.RootElement.GetProperty("errors").EnumerateObject().Count());
    }

    [Fact]
    public void TestInvalidEmail()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "not an email", 
            Password = "Pwd^123"
        };
        
        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = response.Content.ReadFromJsonAsync<JsonDocument>().Result;
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("email", out _));
    }

    [Fact]
    public void TestUnsafePassword()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "akari@akaza.moe", 
            Password = "12345"
        };

        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = response.Content.ReadFromJsonAsync<JsonDocument>().Result;
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("password", out _));
    }

    [Fact]
    public void TestShortName()
    {
        var request = new RegisterRequest
        {
            FirstName = "A", 
            LastName = "A", 
            Email = "akari@akaza.moe", 
            Password = "Pwd^123"
        };
        
        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var responseBody = response.Content.ReadFromJsonAsync<JsonDocument>().Result;
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("firstName", out _));
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("lastName", out _));
    }

    [Fact]
    public void TestUserRegistered()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "akari@akaza.moe", 
            Password = "Pwd^123"
        };
        
        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

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
    public void TestDuplicateEmail()
    {
        var request = new RegisterRequest
        {
            FirstName = "Akari", 
            LastName = "Akaza", 
            Email = "kyoko@toshino.moe", 
            Password = "Pwd^123"
        };
        
        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var dupRequest = new RegisterRequest
        {
            FirstName = "Kyoko", 
            LastName = "Toshino", 
            Email = request.Email, 
            Password = "321^dwP"
        };
        
        response = _client.PostAsJsonAsync("/api/v1/users/register", dupRequest).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        
        var responseBody = response.Content.ReadFromJsonAsync<JsonDocument>().Result;
        Assert.True(responseBody?.RootElement.GetProperty("errors").TryGetProperty("email", out _));
    }
}