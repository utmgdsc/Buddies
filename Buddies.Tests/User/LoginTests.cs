using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Buddies.API.IO;
using Xunit;

namespace Buddies.Tests.User;

public class LoginTests : IClassFixture<TestWebApplicationFactory<Program>>
{


    private readonly HttpClient _client;
    private readonly TestWebApplicationFactory<Program> _factory;

    public LoginTests(TestWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task TestEmptyRequest()
    {
        var request = new LoginRequest
        {
            Email = "",
            Password = ""
        };

        var response = await _client.PostAsJsonAsync("/api/v1/users/login", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

    }

    [Fact]
    public async Task TestUnauthorizedLogin()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "123@email.com",
            Password = "Abc123."
        };

        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "123@email.com",
            Password = "WRONGPASSWORD"
        };

        var loginResponse = await _client.PostAsJsonAsync("/api/v1/users/login", loginRequest);
        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }


    [Fact]
    public async Task TestAuthorizedLogin()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "1234@email.com",
            Password = "Abc123."
        };

        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "1234@email.com",
            Password = "Abc123."
        };
        var loginResponse = await _client.PostAsJsonAsync("/api/v1/users/login", loginRequest);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
    }

    [Fact]
    public async Task TestRefreshToken()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "12345@email.com",
            Password = "Abc123."
        };

        var response = await _client.PostAsJsonAsync("/api/v1/users/register", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "12345@email.com",
            Password = "Abc123."
        };
        var loginResponse = await _client.PostAsJsonAsync("/api/v1/users/login", loginRequest);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var tokenresponse = await _client.GetAsync("/api/v1/users/refresh");   
        Assert.True(tokenresponse.IsSuccessStatusCode);
        var responseBody = tokenresponse.Content.ReadAsStringAsync().Result;
        Assert.Contains("accessToken", responseBody);
    }

    [Fact]
    public async Task TestInvalidRefreshToken()
    {
        var tokenresponse = await _client.GetAsync("/api/v1/users/refresh");
        Assert.True(!tokenresponse.IsSuccessStatusCode);
    }
}
