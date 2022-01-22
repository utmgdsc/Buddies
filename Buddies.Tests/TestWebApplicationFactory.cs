using System.Linq;
using Buddies.API.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Buddies.Tests;

public class TestWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => 
                d.ServiceType == typeof(DbContextOptions<ApiContext>));

            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<ApiContext>(options => 
                options.UseInMemoryDatabase("ApiContext"));

            var provider = services.BuildServiceProvider();

            using (var scope = provider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApiContext>();
                db.Database.EnsureCreated();
            }
            
        });
    }
}