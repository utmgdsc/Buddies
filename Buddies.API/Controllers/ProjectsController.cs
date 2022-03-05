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
                if (location == "null")
                {
                    location == project.Location;
                }

                if (members == -1)
                {
                    members == project.Capacity;
                }

                if (category == "null")
                {
                    category == project.Category;
                }

                if (project.Location == location && project.Capacity == members && project.Category == category)
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
                location = "null"; members = -1; category = "null"; 
            }


            return Ok(response);
        }

    }
}