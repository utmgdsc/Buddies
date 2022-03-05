using System.Collections.Generic;
using System.Net;
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
            var response = await _client.GetAsync("/api/v1/category/sdaasdasd/2020/2020");
            Assert.True(!response.IsSuccessStatusCode);

        }

        [Fact]
        public async Task SafeBadLocationRequest()
        {
            var response = await _client.GetAsync("/api/v1/locations/sdaasdasd/2020/2020");
            Assert.True(!response.IsSuccessStatusCode);

        }

        [Fact]
        public async Task SafeBadEmailsRequest()
        {
            var response = await _client.GetAsync("/api/v1/email/sdaasdasd/2020/2020");
            Assert.True(!response.IsSuccessStatusCode);

        }

    }
}