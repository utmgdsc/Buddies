using Buddies.API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Database;

public class ApiContext : IdentityDbContext<User, Role, int>
{

    private readonly HttpClient client = new HttpClient();
    public ApiContext(DbContextOptions<ApiContext> options) : base(options)
    {
        client.DefaultRequestHeaders.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
        client.DefaultRequestHeaders.Add("Referer", "http://www.microsoft.com");

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
            new Category("Architecture")
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

        String url = "https://raw.githubusercontent.com/SyedTahaA/test/main/canadacities.csv";
        List<Location> cities = new List<Location>();
        var CityResponseString = client.GetStringAsync(url);
        var i = 1;
        if (CityResponseString != null)
        {
            using (StringReader reader = new StringReader(CityResponseString.Result))
            {
                string? line;
                while ((line = reader.ReadLine()) != null)
                {
                    var lst = line.Split(',').ToList();
                    var city = lst[1].Remove(0, 1);
                    city = city.Remove(city.Count() - 1, 1);

                    var province = lst[3].Remove(0, 1);
                    province = province.Remove(province.Count() - 1, 1);
                    var loc = new Location
                    {
                        LocationID = i,
                        Address = String.Format("{0}, {1}", city, province)
                    };
                    if (loc.Address != "city_ascii, province_name")
                    {
                        cities.Add(loc);
                        i = i + 1;
                    }
                }
            }

            foreach (Location location in cities)
            {
                builder.Entity<Location>().HasData(location);
            }

            builder.Entity<Project>()
            .HasOne(p => p.Owner);

            builder.Entity<Project>()
            .HasMany(p => p.Members)
            .WithMany(u => u.Projects);

            builder.Entity<Project>()
            .HasMany(p => p.InvitedUsers)
            .WithMany(u => u.InvitedTo);

        }
    }

    /// <summary>
    /// Collection of all projects.
    /// </summary>
    public DbSet<Project> Projects { get; set; } = null!;

    /// <summary>
    /// Collection of all project categories.
    /// </summary>
    public DbSet<Category> Categories { get; set; } = null!;

    /// <summary>
    /// Collection of all valid locations.
    /// </summary>
    public DbSet<Location> Locations { get; set; } = null!;

    /// <summary>
    /// Collection of all profiles.
    /// </summary>
    public DbSet<Profile> Profiles { get; set; } = null!;

    /// </summary>
    /// Collection of all Skills that belong 
    /// to a User Profile.
    /// </summary>
    public DbSet<Skill> Skills { get; set; } = null!;

    /// </summary>
    /// Collection of all Skills that belong 
    /// to a Project.
    /// </summary>
    public DbSet<ProjectSkill> ProjectSkills { get; set; } = null!;

    /// </summary>
    /// Collection of all the user to user ratings
    /// </summary>
    public DbSet<UserRating> Ratings { get; set; } = null!;
}