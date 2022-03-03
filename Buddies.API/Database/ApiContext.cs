using Buddies.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Database;

public class ApiContext : IdentityDbContext<User, Role, int>
{
    public ApiContext(DbContextOptions<ApiContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Category>().HasData(
            new Category("Accounting"),
            new Category("Anthropology"),
            new Category("Statistics"),
            new Category("Mathematics"),
            new Category("Religion"),
            new Category("Architect"),
            new Category("Art"),
            new Category("Computer Science"),
            new Category("Computer Engineering"),
            new Category("Physics"),
            new Category("Chemistry"),
            new Category("Biology"),
            new Category("Language")
            );
    }

    /// <summary>
    /// Collection of all profiles.
    /// </summary>
    public DbSet<Profile> Profiles { get; set; } = null!;

    /// <summary>
    /// Collection of all projects
    /// </summary>
    public DbSet<Profile> Projects { get; set; } = null!;

    /// <summary>
    /// Collection of all projects
    /// </summary>
    public DbSet<Category> Categories { get; set; } = null!;
}