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
        /// API route GET /api/v1/postings/{filters}/... for fetching all projects
        /// that pass the filters.
        /// </summary>
        [HttpGet("postings/{location}/{members}/{category}/{page}/{results}")]
        public async Task<ActionResult> GetProjectListing(string location, int members, string category, int page, float results)
        {


            var projectList = await _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Include(project => project.Owner)
                .ThenInclude(owner => owner.Profile).ToListAsync();

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
                    var owner = project.Owner.Profile;
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
                        MaxMembers = project.MaxMembers,
                        CurrentMembers = _context.Projects.Where(p => p.ProjectId == project.ProjectId).SelectMany(p => p.Members).ToList().Count,
                        Category = project.Category,
                    };
                    response.Projects.Add(projectResponse);
                    locationList.Add("Location: " + project.Location);
                    membersList.Add("Members: " + project.MaxMembers.ToString());
                    categoryList.Add("Category: " + project.Category);
                }
            }

            var pageCount = Math.Ceiling(response.Projects.Count() / results);
            response.Projects = response.Projects
                .Skip((page - 1) * (int)results)
                .Take((int)results)
                .ToList();

            response.TotalPages = (int)pageCount;
            response.CurrentPage = page;

            response.Locations = locationList.OrderBy(p => p).Distinct().ToList();
            response.Locations.Insert(0, "Location: N/A");
            response.Members = membersList.OrderBy(p => p).Distinct().ToList();
            response.Members.Insert(0, "Members: N/A");
            response.Categories = categoryList.OrderBy(p => p).Distinct().ToList();
            response.Categories.Insert(0, "Category: N/A");

            return Ok(response);
        }

        /// <summary>
        /// API route POST /api/v1/projects for creating project.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> CreateProject(CreateProjectRequest project)
        {
            var userEntity = _userManager.GetUserAsync(User).Result;
            if (userEntity == null)
            {
                return Unauthorized();
            }

            var dbLocation = await _context.Locations.FirstOrDefaultAsync(x => x.Address == project.Location);

            if (dbLocation == null)
            {
                return NotFound("Invalid Location");
            }


            var check = await _context.Categories.FirstOrDefaultAsync(p => p.Name == project.Category);
            if (check == null)
            {
                return NotFound("Invalid Category");
            }

            Project dbProject = new Project();
            dbProject.Owner = userEntity;
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
        /// API route PUT /api/v1/projects/skills for updating project skills.
        /// </summary>
        [HttpPut("skills/{id}")]
        [Authorize]
        public async Task<ActionResult> UpdateProjectProfile(int id, UpdateProjectSkillRequest skills)
        {
            var project = _context.Projects
                .Include(project => project.Owner)
                .Include(project => project.Skills)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }

            if (project.Owner != _userManager.GetUserAsync(User).Result) { return Unauthorized("You must be the owner"); }
            var i = 0;
            for (i = 0; i < skills.Skills.Count; i++)
            {
                if (i >= project.Skills.Count)
                {
                    var newSkill = new ProjectSkill(skills.Skills[i].Name);
                    project.Skills.Add(newSkill);
                }
                else
                {
                    project.Skills[i].Name = skills.Skills[i].Name;
                }
                if (i == 2)
                {
                    i++;
                    break;
                }
            }
            var n = project.Skills.Count;
            for (var j = i; j < n; j++)
            {
                project.Skills.RemoveAt(i);
            }

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
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Include(project => project.Skills)
                .Include(project => project.Owner)
                .ThenInclude(owner => owner.Profile)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();
                
            if (project == null)
            {
                return NotFound("PROJECT PROFILE NOT FOUND");
            }
            var profileResponse = new ProjectProfileResponse{
                Title = project.Title,
                Description = project.Description,
                Location = project.Location,
                Username = project.Owner.Profile.FirstName + " " + project.Owner.Profile.LastName,
                Email = project.Owner.Email,
                Category = project.Category,
                MaxMembers = project.MaxMembers,
            };

            foreach (User member in project.Members)
            {
                var userInfo = new UserInfoResponse();
                var userprofile = await _context.Profiles.FindAsync(member.Id);
                if (userprofile == null) {
                    return NotFound("MEMBER PROFILE NOT FOUND");
                }

                userInfo.FirstName = userprofile.FirstName;
                userInfo.LastName = userprofile.LastName;
                userInfo.Email = member.Email;
                userInfo.UserId = member.Id;
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
                userInfo.UserId = invitedUser.Id;
                profileResponse.InvitedUsers.Add(userInfo);
            }

            foreach (ProjectSkill skill in project.Skills)
            {
                var skillInfo = new SkillResponse()
                {
                    Id = skill.Id,
                    Name = skill.Name,
                    Delete = false
                };
                profileResponse.Skills.Add(skillInfo);
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
            var project = _context.Projects
                .Include(project => project.Owner)
                .Include(project => project.Members)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.Owner != _userManager.GetUserAsync(User).Result) { return Unauthorized("You must be the owner"); }

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

            if (project.Members.Count > profile.MaxMembers)
            {
                return BadRequest("You must remove more members before setting this new member capacity");
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
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.Owner != _userManager.GetUserAsync(User).Result) { return Unauthorized(); }
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
        [HttpPost("{pid}/invite")]
        [Authorize]
        public async Task<ActionResult> InviteProjectMember(int pid, [FromBody] InviteUserRequest request)
        {
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            if (project.Owner != _userManager.GetUserAsync(User).Result) { return Unauthorized(); }
            var invitedUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == request.UserEmail);

            if (invitedUser != null && !project.InvitedUsers.Contains(invitedUser)){
                project.InvitedUsers.Add(invitedUser);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return NotFound("User not found");
        }

        /// <summary>
        /// API route PUT /api/v1/projects/{pid}/join/ for joining profile IF you're on the invited list.
        /// </summary>
        [HttpPost("{pid}/join/")]
        [Authorize]
        public async Task<ActionResult> JoinProject(int pid, int uid)
        {
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }

            if (project.Members.Count >= project.MaxMembers)
            {
                return BadRequest("There are no more space in this project!");
            }
            if (project.Owner == _userManager.GetUserAsync(User).Result) 
            { 
                return BadRequest("Cannot remove owner from project"); 
            }

            var currentUser = _userManager.GetUserAsync(User).Result;

            if (project.Members.Contains(currentUser))
            {
                return BadRequest("You are already a member!");
            }

            if (currentUser != null && project.InvitedUsers.Contains(currentUser))
            {
                project.Members.Add(currentUser);
                project.InvitedUsers.Remove(currentUser);
                currentUser.Projects.Add(project);
                currentUser.InvitedTo.Remove(project);
                await _context.SaveChangesAsync();
                return Ok();
            }

            return NotFound("User not found");
        }


        /// <summary>
        /// API route GET /api/v1/projects/:id for fetching project profile.
        /// </summary>
        [HttpGet("recs/{id}")]
        public async Task<ActionResult> GetRecommendations(int id)
        {
            var project = _context.Projects
                .Include(project => project.Owner)
                .Include(project => project.Skills)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();

            var user = _userManager.GetUserAsync(User).Result;
            var profile = await _context.Profiles
                .Include(profile => profile.Skills)
                .ToListAsync();
            if (project == null)
            {
                return BadRequest("No such project exists :(");
            }
            var recs = KnnService.KNearestUsers(project, profile, 5);
            return Ok(recs);
        }
}