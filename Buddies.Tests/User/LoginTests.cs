using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using Buddies.API.Database;
using Buddies.API.Entities;
using Buddies.API.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
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
    public void TestEmptyRequest()
    {
        var request = new LoginRequest
        {
            Email = "",
            Password = ""
        };

        var response = _client.PostAsJsonAsync("/api/v1/users/login", request).Result;
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

    }

    [Fact]
    public void TestUnauthorizedLogin()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "123@email.com",
            Password = "Abc123."
        };

        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "123@email.com",
            Password = "WRONGPASSWORD"
        };

        var loginResponse = _client.PostAsJsonAsync("/api/v1/users/login", request).Result;
        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }


    [Fact]
    public void TestAuthorizedLogin()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "1234@email.com",
            Password = "Abc123."
        };

        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "1234@email.com",
            Password = "Abc123."
        };
        var loginResponse = _client.PostAsJsonAsync("/api/v1/users/login", loginRequest).Result;
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
    }

    [Fact]
    public void TestRefreshToken()
    {
        var request = new RegisterRequest
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "1234@email.com",
            Password = "Abc123."
        };

        var response = _client.PostAsJsonAsync("/api/v1/users/register", request).Result;
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var loginRequest = new LoginRequest
        {
            Email = "1234@email.com",
            Password = "Abc123."
        };
        var loginResponse = _client.PostAsJsonAsync("/api/v1/users/login", loginRequest).Result;
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        var tokenresponse = _client.GetAsync("/api/v1/users/refresh").Result;   
        Assert.True(tokenresponse.IsSuccessStatusCode);
        var body = tokenresponse.Content.ReadAsStringAsync().Result;
        Assert.Contains("accessToken", body);
    }

    [Fact]
    public void TestUnvalidRefreshToken()
    {
        var tokenresponse = _client.GetAsync("/api/v1/users/refresh").Result;
        Assert.True(!tokenresponse.IsSuccessStatusCode);
    }









}




