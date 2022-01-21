using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Database;

public class ApiContext : DbContext
{
    public ApiContext(DbContextOptions<ApiContext> options) : base(options)
    {
    }
}