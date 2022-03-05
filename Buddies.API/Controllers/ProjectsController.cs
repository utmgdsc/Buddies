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

        /// <summary>
        /// Initializes a new ProjectController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// /// <param name="context">database context from Buddies.API.Database.</param>
        public ProjectsController(ApiContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;

        }

        /// <summary>
        /// API route GET /api/v1/profiles/:id for fetching profile.
        /// </summary>
        [HttpGet("postings/{location}/{members}/{category}")]
        public async Task<ActionResult> GetProjectListing(string location, int members, string category)
        {
            var projectList = await _context.Projects.ToListAsync();

            var response = new ProjectListingsResponse();

            foreach (var project in projectList)
            {

                if ((project.Location == location || location == "null") &&
                    (project.Capacity == members || members == -1) &&
                    (project.Category == category || category == "null"))
                {
                    var owner = await _context.Profiles.FindAsync(project.Owner);
                    var projectResponse = new ProjectResponse
                    {
                        Title = project.Title,
                        Description = project.Description,
                        Location = project.Location,
                        Username = String.Format("{0} {1}", owner.FirstName, owner.LastName),
                        BuddyScore = 0,
                        Members = project.Capacity,
                        Category = project.Category,
                    };
                    response.Projects.Add(project);
                }
            }


            return Ok(response);
        }

    }
}