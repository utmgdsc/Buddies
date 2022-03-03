using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly UserManager<User> _userManager;
        private static readonly HttpClient client = new HttpClient();

        /// <summary>
        /// Initializes a new ProjectController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// /// <param name="context">database context from Buddies.API.Database.</param>
        public ProjectsController(ApiContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            client.DefaultRequestHeaders.TryAddWithoutValidation("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");
            client.DefaultRequestHeaders.TryAddWithoutValidation("Referer", "http://www.microsoft.com");
        }

        /// <summary>
        /// API route POST /api/v1/projects for creating project.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateProject(CreateProjectRequest project)
        {
            var userEntity = _userManager.GetUserAsync(User).Result;
            if (userEntity == null)
            {
                return Unauthorized();
            }

            String url = String.Format("https://nominatim.openstreetmap.org/search/lookup?city={0}&format=json&addressdetails=1", project.Location);

            var responseString = await client.GetStringAsync(url);
            if (responseString == "[]")
            {
                return NotFound("Invalid City");
            }

            Project dbProject = new Project(userEntity.Id);
            dbProject.Title = project.Title;
            dbProject.Description = project.Description;
            dbProject.Location = project.Location;

            foreach (int invitation in project.InvitedUsers)
            {
                var dbProfile = await _context.Users.FindAsync(invitation);
                if (dbProfile == null)
                {
                    return NotFound();
                }
                dbProject.InvitedUsers.Add(dbProfile);

            }

            await _context.AddAsync(dbProject);
            await _context.SaveChangesAsync();


            return Ok();
        }

        /// <summary>
        /// API route GET /api/v1/projects/locations for fetching profile.
        /// </summary>
        [HttpGet("locations")]
        public async Task<ActionResult> GetProfile()
        {

            String url = "https://raw.githubusercontent.com/SyedTahaA/test/main/data.json";
            var CityResponseString = await client.GetStringAsync(url);
            return Ok(CityResponseString);
            List<string> cities = new List<string>();
            using (StringReader reader = new StringReader(CityResponseString))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    line = line.Split(',').ToList()[0];
                    cities.Add(line);
                }
            }

            return Ok(cities);
        }

    }
}