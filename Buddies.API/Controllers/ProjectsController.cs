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
            var projectList = new List<ProjectResponse>();

            var response = new ProjectListingsResponse();

            for (int i = 0; i < 14; i++)
            {

                if ((project.Location == location || location == "null") &&
                    (project.Capacity == members || members == -1) &&
                    (project.Category == category || category == "null"))
                {
                    var projectResponse = new ProjectResponse
                    {
                        Title = project.Title,
                        Description = project.Description,
                        Location = project.Location,
                        Username = project.Username,
                        BuddyScore = 0,
                        Members = project.Members,
                        Category = project.Category,
                    };
                    response.Projects.Add(project);
                }
            }


            return Ok(response);
        }

    }
}