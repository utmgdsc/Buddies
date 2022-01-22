using Buddies.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Database;

public class ApiContext : IdentityDbContext<User, Role, int>
{
    public ApiContext(DbContextOptions<ApiContext> options) : base(options)
    {
    }
}