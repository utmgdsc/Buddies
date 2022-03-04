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
        base.OnModelCreating(builder);
        builder.Entity<Category>().HasData(
            new Category("Accounting") { 
                Id = 1,
            },
            new Category("Anthropology")
            {
                Id = 2,
            },
            new Category("Statistics")
            {
                Id = 3,
            },
            new Category("Mathematics")
            {
                Id = 4,
            },
            new Category("Religion")
            {
                Id = 5,
            },
            new Category("Architect")
            {
                Id = 6,
            },
            new Category("Art")
            {
                Id = 7,
            },
            new Category("Computer Science")
            {
                Id = 8,
            },
            new Category("Computer Engineering")
            {
                Id = 9,
            },
            new Category("Physics")
            {
                Id = 10,
            },
            new Category("Chemistry")
            {
                Id = 11,
            },
            new Category("Biology")
            {
                Id = 12,
            },
            new Category("Language")
            {
                Id = 13,
            }
            );
    }

    /// <summary>
    /// Collection of all profiles.
    /// </summary>
    public DbSet<Profile> Profiles { get; set; } = null!;

    /// <summary>
    /// Collection of all projects.
    /// </summary>
    public DbSet<Project> Projects { get; set; } = null!;

    /// <summary>
    /// Collection of all project categories.
    /// </summary>
    public DbSet<Category> Categories { get; set; } = null!;
}