using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Microsoft.EntityFrameworkCore;

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
        /// API route GET /api/v1/projects/locations for fetching categories.
        /// </summary>
        [HttpGet("category/{search}/{page}/{results}")]
        public async Task<ActionResult<CategoryResponse>> GetCategory(string search, int page, float results)
        {
            if (_context.Categories == null)
            {
                return NotFound();
            }
            
            var categoryList = await _context.Categories.ToListAsync();
            int tolerance = 1; 
            var matchingCategories = categoryList.Where(p =>
            {
                //Check Contains
                bool contains = p.Name.Contains(search);
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = LongestCommonSubsequence(p.Name, search, out output) >= search.Length - tolerance; // if substring matches at least
                                                                                                                               // this many characters.
                return subsequenceTolerated;
            }).ToList();

            if (matchingCategories.Count == 0)
            {
                return NotFound("No searches found :(");
            }

            var pageCount = Math.Ceiling(matchingCategories.Count() / results);
            var categories = matchingCategories
                .Skip((page - 1) * (int)results)
                .Take((int)results)
                .ToList();

            var response = new CategoryResponse
            {
                Categories = categories,
                TotalPages = (int)pageCount,
                CurrentPage = page
            };

            return Ok(categories);
        }


       

    }
}
