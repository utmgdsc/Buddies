using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Buddies.API.IO;
using Xunit;

namespace Buddies.Tests.Project
{
    public class PagingEndpointsTests : IClassFixture<TestWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory<Program> _factory;

        public PagingEndpointsTests(TestWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task SafeBadCategoryRequest()
        {
            var response = await _client.GetAsync("/api/v1/projects/category/sdaasdasd/2020/2020");
            Assert.True(response.IsSuccessStatusCode);

        }

        [Fact]
        public async Task GoodCategoryRequest()
        {
            var response = await _client.GetAsync("/api/v1/projects/category/computer/1/10");
            string stringResponse = response.Content.ReadAsStringAsync().Result;
            //var searchResponse = JObject.Parse(stringResponse);

            Assert.Contains("Computer Science", stringResponse);

        }

        [Fact]
        public async Task SafeBadLocationRequest()
        {
            var response = await _client.GetAsync("/api/v1/projects/locations/sdaasdasd/2020/2020");
            Assert.True(response.IsSuccessStatusCode);

        }

        [Fact]
        public async Task GoodLocationRequest()
        {
            var response = await _client.GetAsync("/api/v1/projects/locations/waterloo/1/10");
            string stringResponse = response.Content.ReadAsStringAsync().Result;
            //var searchResponse = JObject.Parse(stringResponse);

            Assert.Contains("Waterloo, Ontario", stringResponse);

        }

        [Fact]
        public async Task SafeBadEmailsRequest()
        {
            var response = await _client.GetAsync("/api/v1/projects/email/sdaasdasd/2020/2020");
            Assert.True(response.IsSuccessStatusCode);

        }

        [Fact]
        public async Task GoodEmailRequest()
        {
            var request = new RegisterRequest
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "test@email.com",
                Password = "Abc123."
            };

            await _client.PostAsJsonAsync("/api/v1/users/register", request);

            var response = await _client.GetAsync("/api/v1/projects/email/test/1/10");
            string stringResponse = response.Content.ReadAsStringAsync().Result;
            //var searchResponse = JObject.Parse(stringResponse);

            Assert.Contains("test@email.com", stringResponse);

        }

    }
}