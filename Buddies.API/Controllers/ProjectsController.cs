using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Buddies.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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
        /// API route POST /api/v1/projects for creating project.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateProject(CreateProjectRequest project)
        {
            var userEntity = _userManager.GetUserAsync(User).Result;


            var dbLocation = await _context.Locations.FirstOrDefaultAsync(x => x.Address == project.Location);

            if (dbLocation == null)
            {
                return NotFound("Invalid Location");
            }


            var check = _context.Categories.FirstOrDefaultAsync(p => p.Name == project.Category);
            if (check == null)
            {
                return NotFound("Invalid Category");
            }

            Project dbProject = new Project();
            dbProject.OwnerId = userEntity.Id;
            dbProject.Title = project.Title;
            dbProject.Description = project.Description;
            dbProject.Location = project.Location;
            dbProject.MaxMembers = project.MaxMembers;
            dbProject.Category = project.Category;
            dbProject.Members.Add(userEntity);

            foreach (string invitation in project.InvitedUsers)
            {
                if (invitation != userEntity.Email)
                {
                    var dbProfile = await _context.Users.FirstOrDefaultAsync(user => user.Email == invitation);
                    if (dbProfile == null)
                    {
                        return NotFound("No such user");
                    }
                    dbProject.InvitedUsers.Add(dbProfile);

                }
            }

            await _context.Projects.AddAsync(dbProject);
            await _context.SaveChangesAsync();


            return Ok();
        }

        /// <summary>
        /// API route GET /api/v1/projects/category for fetching categories.
        /// </summary>
        /// <param name="search">Category to search for</param>
        /// <param name="page">current page</param>
        /// <param name="results">number of results per page</param>
        [HttpGet("category/{search}/{page}/{results}")]
        public async Task<ActionResult<SearchResponse>> GetCategory(string search, int page, float results)
        {
            SearchResponse badResponse = new SearchResponse
            {
                Searches = new List<string>(),
                TotalPages = 1,
                CurrentPage = 1
            };

            if (_context.Categories == null)
            {
                return Ok(badResponse);
            }
            
            var categoryList = await _context.Categories.ToListAsync();
            int tolerance = 0; 
            var matchingCategories = categoryList.Where(p =>
            {
                //Check Contains
                bool contains = p.Name.ToLower().Contains(search.ToLower());
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = FuzzySearchService.LongestCommonSubsequence(p.Name.ToLower(), search.ToLower(), out output) >= search.Length - tolerance; 
                                                                                                                        // if substring matches at least
                                                                                                                        // this many characters.
                return subsequenceTolerated;
            }).ToList();

            if (matchingCategories.Count == 0)
            {
                return Ok(badResponse);
            }

            var pageCount = Math.Ceiling(matchingCategories.Count() / results);
            var categories = matchingCategories
                .Skip((page - 1) * (int)results)
                .Take((int)results)
                .ToList();

            var matchingSearch = new List<string>();
            foreach (Category cat in categories)
            {
                matchingSearch.Add(cat.Name);
            }

            var response = new SearchResponse
            {
                Searches = matchingSearch,
                TotalPages = (int)pageCount,
                CurrentPage = page
            };

            return Ok(response);
        }

        /// <summary>
        /// API route GET /api/v1/projects/locations for fetching locations.
        /// valid locations include only Canadian Cities.
        /// </summary>
        /// <param name="search">Location to search for</param>
        /// <param name="page">current page</param>
        /// <param name="size">number of results per page</param>
        [HttpGet("locations/{search}/{page}/{size}")]
        public async Task<ActionResult<SearchResponse>> GetLocation(string search, int page, float size)
        {
            var cities = await _context.Locations.ToListAsync();
            int TOLERANCE = 0;
            var matchingCities = cities.Where(p =>
            {
                //Check Contains
                bool contains = p.Address.ToLower().Contains(search.ToLower());
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = FuzzySearchService.LongestCommonSubsequence(p.Address.ToLower(), search.ToLower(), out output) >= search.Length - TOLERANCE;

                return subsequenceTolerated;
            }).ToList();

            float pageResults = size;
            var pageCount = Math.Ceiling(matchingCities.Count() / pageResults);
            var cityPage = matchingCities.Skip((page - 1) * (int)pageResults).Take((int)pageResults).ToList();
            var matchingSearch = new List<string>();
            foreach (Location loc in cityPage)
            {
                matchingSearch.Add(loc.Address);
            }

            var response = new SearchResponse
            {
                Searches = matchingSearch,
                CurrentPage = page,
                TotalPages = (int)pageCount
            };
            return Ok(response);
        }

        /// <summary>
        /// API route GET /api/v1/projects/email for fetching emails.
        /// </summary>
        /// <param name="search">Category to search for</param>
        /// <param name="page">current page</param>
        /// <param name="size">number of results per page</param>
        [HttpGet("email/{search}/{page}/{size}")]
        public async Task<ActionResult<SearchResponse>> GetUser(string search, int page, float size)
        {

            SearchResponse badResponse = new SearchResponse
            {
                Searches = new List<string>(),
                TotalPages = 1,
                CurrentPage = 1
            };

            var emailsList = await _context.Users.ToListAsync();
            if (emailsList == null)
            {
                return Ok(badResponse);
            }
            const int TOLERANCE = 0;
            var matchingPeople = emailsList.Where(p =>  
            {
                //Check Contains
                bool contains = p.Email.ToLower().Contains(search.ToLower());
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = FuzzySearchService.LongestCommonSubsequence(p.Email.ToLower(), search.ToLower(), out output) >= search.Length - TOLERANCE;

                return subsequenceTolerated;
            }).ToList();

            var matchingEmails = new List<string>();
            foreach (User u in matchingPeople)
            {
                matchingEmails.Add(u.Email);
            }

            float pageResults = size;
            var pageCount = Math.Ceiling(matchingEmails.Count() / pageResults);
            var emailPage = matchingEmails.Skip((page - 1) * (int)pageResults).Take((int)pageResults).ToList();
            var response = new SearchResponse
            {
                Searches = emailPage,
                CurrentPage = page,
                TotalPages = (int)pageCount
            };
            return Ok(response);
        }

        /// <summary>
        /// API route GET /api/v1/projects/:id for fetching project profile.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProfile(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound("PROJECT PROFILE NOT FOUND");
            }

            var profileResponse = new ProjectProfileResponse{
                Title = project.Title,
                Description = project.Description,
                Location = project.Location,
                Category = project.Category,
                MaxMembers = project.MaxMembers,
            };

            foreach (User member in project.Members)
            {
                profileResponse.Title = "here";
                var userInfo = new UserInfoResponse();
                var userprofile = await _context.Profiles.FindAsync(member.Id);
                if (userprofile == null) {
                    return NotFound("MEMBER PROFILE NOT FOUND");
                }

                userInfo.FirstName = userprofile.FirstName;
                userInfo.LastName = userprofile.LastName;
                userInfo.Email = member.Email;
                profileResponse.Members.Add(userInfo);
            }

            foreach (User invitedUser in project.InvitedUsers)
            {
                var userInfo = new UserInfoResponse();
                var userprofile = await _context.Profiles.FindAsync(invitedUser.Id);
                if (userprofile == null)
                {
                    return NotFound("INVITED USER PROFILE NOT FOUND");
                }
                userInfo.FirstName = userprofile.FirstName;
                userInfo.LastName = userprofile.LastName;
                userInfo.Email = invitedUser.Email;
                profileResponse.InvitedUsers.Add(userInfo);
            }

            return Ok(profileResponse);
        }


        /// <summary>
        /// API route PUT /api/v1/profiles for updating profile.
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateProjectProfile(int id, UpdateProjectProfileRequest profile)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.OwnerId != _userManager.GetUserAsync(User).Result.Id) { return Unauthorized(); }

            var requestLocation = await _context.Locations.FirstOrDefaultAsync(x => x.Address == profile.Location);

            if (requestLocation == null)
            {
                return NotFound("Invalid Location");
            }


            var requestCategory = await _context.Categories.FirstOrDefaultAsync(p => p.Name == profile.Category);
            if (requestCategory == null)
            {
                return NotFound("Invalid Category");
            }

            project.Title = profile.Title;
            project.Description = profile.Description;
            project.Location = profile.Location;
            project.Category = profile.Category;
            project.MaxMembers = profile.MaxMembers;
            await _context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// API route PUT /api/v1/projects/{pid}/delete/{uid} for updating profile.
        /// </summary>
        [HttpPost("{pid}/delete/{uid}")]
        [Authorize]
        public async Task<ActionResult> DeleteProjectMember(int pid, int uid)
        {
            var project = await _context.Projects.FindAsync(pid);

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.OwnerId != _userManager.GetUserAsync(User).Result.Id) { return Unauthorized(); }

            foreach (var member in project.Members)
            {
                if (member.Id == uid)
                {
                    project.Members.Remove(member);
                    await _context.SaveChangesAsync();
                    return Ok();
                }

            }

            return NotFound("User not found");
        }

        /// <summary>
        /// API route PUT /api/v1/projects/{pid}/delete/{uid} for updating profile.
        /// </summary>
        [HttpPost("{pid}/invite/{uid}")]
        [Authorize]
        public async Task<ActionResult> InviteProjectMember(int pid, int uid)
        {
            var project = await _context.Projects.FindAsync(pid);

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.OwnerId != _userManager.GetUserAsync(User).Result.Id) { return Unauthorized(); }
            
            var invitedUser = _context.Users.FindAsync(uid).Result;
            if (invitedUser != null && !project.InvitedUsers.Contains(invitedUser)){
                project.InvitedUsers.Add(invitedUser);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return NotFound("User not found");
        }


    }
}