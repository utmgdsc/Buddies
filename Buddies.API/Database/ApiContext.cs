using Buddies.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Database;

public class ApiContext : IdentityDbContext<User, Role, int>
{
    public ApiContext(DbContextOptions<ApiContext> options) : base(options)
    {
    }
    
    /// <summary>
    /// Collection of all profiles.
    /// </summary>
    public DbSet<Profile> Profiles { get; set; } = null!;

    /// <summary>
    /// Collection of all Skills that belong 
    /// to a User Profile.
    /// </summary>
    public DbSet<Skills> Skills { get; set; } = null!;
}