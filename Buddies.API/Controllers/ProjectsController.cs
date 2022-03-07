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
        /// API route GET /api/v1/postings/{filters}/... for fetching all projects
        /// that pass the filters.
        /// </summary>
        [HttpGet("postings/{location}/{members}/{category}")]
        public async Task<ActionResult> GetProjectListing(string location, int members, string category)
        {
            var projectList = await _context.Projects.ToListAsync();
            var response = new ProjectListingsResponse();
            var locationList = new List<String>();
            var membersList = new List<String>();
            var categoryList = new List<String>();


            foreach (var project in projectList)
            {

                if ((project.Location == location || location == "null") &&
                    (project.MaxMembers == members || members == -1) &&
                    (project.Category == category || category == "null"))
                {
                    var owner = await _context.Profiles.FindAsync(project.OwnerId);
                    if (owner == null)
                    {
                        return NotFound("The owner has deleted his profile");
                    }
                    var projectResponse = new ProjectResponse
                    {
                        Title = project.Title,
                        ProjectId = project.ProjectId,
                        Description = project.Description,
                        Location = project.Location,
                        Username = String.Format("{0} {1}", owner.FirstName, owner.LastName),
                        BuddyScore = 0,
                        Members = project.MaxMembers,
                        Category = project.Category,
                    };
                    response.Projects.Add(projectResponse);
                    locationList.Add("Location: " + project.Location);
                    membersList.Add("Members: " + project.MaxMembers.ToString());
                    categoryList.Add("Category: " + project.Category);
                }
            }

            response.Locations = locationList.OrderBy(p => p).Distinct().ToList();
            response.Locations.Insert(0, "Location: N/A");
            response.Members = membersList.OrderBy(p => p).Distinct().ToList();
            response.Members.Insert(0, "Members: N/A");
            response.Categories = categoryList.OrderBy(p => p).Distinct().ToList();
            response.Categories.Insert(0, "Category: N/A");

            return Ok(response);
        }

    }
}