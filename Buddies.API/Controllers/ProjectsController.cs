using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Buddies.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.ML;
using Buddies.API.DataModels;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly UserManager<User> _userManager;
        private readonly PredictionEnginePool<BuddyRating, BuddyRatingPrediction> _predictionEnginePool;

        /// <summary>
        /// Initializes a new ProjectController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// /// <param name="context">database context from Buddies.API.Database.</param>
        public ProjectsController(ApiContext context, UserManager<User> userManager, PredictionEnginePool<BuddyRating, BuddyRatingPrediction> predictionEnginePool)
        {
            _context = context;
            _userManager = userManager;
            _predictionEnginePool = predictionEnginePool;

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
                        BuddyScore = owner.BuddyScore,
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
            var currentUserId = _userManager.GetUserId(User);

            var userEntity = _context.Users
                .Include(user => user.Profile)
                .Where(u => u.Id.ToString() == currentUserId)
                .FirstOrDefault();

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
                    var invitedUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == invitation);
                    if (invitedUser == null)
                    {
                        return NotFound("No such user");
                    }
                    dbProject.InvitedUsers.Add(invitedUser);

                    var inviteRequest = new Notification(userEntity.Profile.FirstName + " invited you to join " + project.Title);
                    inviteRequest.SenderId = userEntity.Id;
                    inviteRequest.SenderName = userEntity.Profile.FirstName + " " + userEntity.Profile.LastName;
                    inviteRequest.Recipient = invitedUser;
                    inviteRequest.Project = dbProject;
                    await _context.Notifications.AddAsync(inviteRequest);

                    invitedUser.Notifications.Add(inviteRequest);



                }
            }

            await _context.Projects.AddAsync(dbProject);
            await _context.SaveChangesAsync();


            return StatusCode(StatusCodes.Status201Created, dbProject.ProjectId);
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
        public async Task<ActionResult<ProjectProfileResponse>> GetProfile(int id)
        {
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Include(project => project.Skills)
                .Include(project => project.MembersYetToRate)
                .Include(project => project.Owner)
                .ThenInclude(owner => owner.Profile)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROJECT PROFILE NOT FOUND");
            }
            var profileResponse = new ProjectProfileResponse {
                Title = project.Title,
                Description = project.Description,
                Location = project.Location,
                Username = project.Owner.Profile.FirstName + " " + project.Owner.Profile.LastName,
                Email = project.Owner.Email,
                Category = project.Category,
                MaxMembers = project.MaxMembers,
                IsFinished = project.IsFinished
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
            
            foreach (User invitedUser in project.MembersYetToRate)
            {
                var userInfo = new UserInfoResponse();
                var userprofile = await _context.Profiles.FindAsync(invitedUser.Id);
                if (userprofile == null)
                {
                    return NotFound("USER PROFILE NOT FOUND");
                }
                userInfo.FirstName = userprofile.FirstName;
                userInfo.LastName = userprofile.LastName;
                userInfo.Email = invitedUser.Email;
                userInfo.UserId = invitedUser.Id;
                profileResponse.MembersYetToRate.Add(userInfo);
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
            var currentUserId = _userManager.GetUserId(User);

            var currentUser = _context.Users
                .Include(user => user.Profile)
                .Where(u => u.Id.ToString() == currentUserId)
                .FirstOrDefault();

            if (project.Owner != currentUser) { return Unauthorized(); }

            var invitedUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == request.UserEmail);


            if (invitedUser != null && !project.InvitedUsers.Contains(invitedUser)) {
                project.InvitedUsers.Add(invitedUser);

                var inviteRequest = new Notification(currentUser.Profile.FirstName + " invited you to join " + project.Title);
                inviteRequest.SenderId = currentUser.Id;
                inviteRequest.SenderName = currentUser.Profile.FirstName + " " + currentUser.Profile.LastName;
                inviteRequest.Recipient = invitedUser;
                inviteRequest.Project = project;
                await _context.Notifications.AddAsync(inviteRequest);

                invitedUser.Notifications.Add(inviteRequest);

                await _context.SaveChangesAsync();
                return Ok();
            }



            return NotFound("User not found");
        }

        /// <summary>
        /// API route PUT /api/v1/projects/{pid}/join/ for sending the project own
        /// </summary>
        [HttpPost("{pid}/joinrequest/")]
        [Authorize]
        public async Task<ActionResult> JoinProjectRequest(int pid)
        {
            var project = _context.Projects
                .Include(project => project.Members)
                .Include(project => project.InvitedUsers)
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("Project not found");
            }

            if (project.Members.Count >= project.MaxMembers)
            {
                return BadRequest("There are no more space in this project!");
            }

            var currentUserId = _userManager.GetUserId(User);

            var currentUser = _context.Users
                .Include(user => user.Profile)
                .Where(u => u.Id.ToString() == currentUserId)
                .FirstOrDefault();

            if (project.Members.Contains(currentUser))
            {
                return BadRequest("You are already a member!");
            }

            if (project.InvitedUsers.Contains(currentUser))
            {
                return BadRequest("You are already invited!");
            }

            var joinRequest = new Notification(currentUser.Profile.FirstName + " requested to join " + project.Title);
            joinRequest.SenderId = currentUser.Id;
            joinRequest.SenderName = currentUser.Profile.FirstName + " " + currentUser.Profile.LastName;
            joinRequest.Recipient = project.Owner;
            joinRequest.Project = project;
            await _context.Notifications.AddAsync(joinRequest);

            project.Owner.Notifications.Add(joinRequest);
            await _context.SaveChangesAsync();

            return Ok("join request added");
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
        /// API route PUT /api/v1/projects/{pid}/terminate/ for terminating a project.
        /// </summary>
        [HttpPost("{pid}/terminate/")]
        [Authorize]
        public async Task<ActionResult> TermintateProject(int pid)
        {
            var project = _context.Projects
                .Include(project => project.Members)
                .ThenInclude(member => member.Profile)
                .Include(project => project.Members)
                .ThenInclude(member => member.Notifications)
                .Include(project => project.Owner)
                .ThenInclude(owner => owner.Profile)
                
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }

            if (project.IsFinished)
            {
                return BadRequest("Project already terminated");
            }
            var currentUser = _userManager.GetUserAsync(User).Result;
            if (project.Owner != currentUser) { return Unauthorized(); }
            
            project.IsFinished = true;
            project.MembersYetToRate = project.Members;
            foreach (var member in project.Members)
            {
                member.Profile.ProjectCount += 1;
                var terminateNotification = new Notification(project.Title + " has terminated! Make sure to go rate your teammates!");
                terminateNotification.SenderId = currentUser.Id;
                terminateNotification.SenderName = currentUser.Profile.FirstName + " " + currentUser.Profile.LastName;
                terminateNotification.Recipient = member;
                terminateNotification.Project = project;
                await _context.Notifications.AddAsync(terminateNotification);

                member.Notifications.Add(terminateNotification);
                await _context.SaveChangesAsync();


            }
            await _context.SaveChangesAsync();
            return Ok();
        }


        /// <summary>
        /// API route PUT /api/v1/projects/{pid}/ratebuddies/ for joining profile IF you're on the invited list.
        /// </summary>
        [HttpPost("{pid}/ratebuddies/")]
        [Authorize]
        public async Task<ActionResult> RateBuddies(int pid, RateBuddiesRequest request)
        {
            var project = _context.Projects
                .Include(project => project.MembersYetToRate)
                .ThenInclude(member => member.Profile)
                .Where(project => project.ProjectId == pid)
                .FirstOrDefault();

            if (project == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }

            var currentUser = _userManager.GetUserAsync(User).Result;

            if (!project.MembersYetToRate.Contains(currentUser))
            {
                return BadRequest("You have already rated this project or are not a part of this project");
            }

            foreach (var member in project.MembersYetToRate)
            {
                if (member == currentUser)
                {
                    continue;
                }

                if (request.BuddyScores.TryGetValue(member.Id, out int score))
                {
                    
                    var rating = await _context.Ratings
                        .Where(s => s.RaterId == currentUser.Id && s.BeingRatedId == member.Id)
                        .FirstOrDefaultAsync();
                    if (rating == null)
                    {
                        var newRating = new UserRating(currentUser.Id, member.Id, score);
                        await _context.Ratings.AddAsync(newRating);
                    } else
                    {
                        rating.Score = ((rating.Score*rating.RatingCount) + score) / (rating.RatingCount+1);
                        rating.RatingCount++;
                    }
                    var n = member.Profile.ProjectCount;
                    member.Profile.BuddyScore = (score + (member.Profile.BuddyScore * (n - 1))) / n;
                }
                else
                {
                    return BadRequest("Member: " + member.Profile.FirstName + " " + member.Profile.LastName +
                        " is not included in this project rating");
                }
            }

            project.MembersYetToRate.Remove(currentUser);
            await _context.SaveChangesAsync();

            return Ok();
        }


        /// <summary>
        /// API route GET /api/v1/projects/:id for 
        /// fetching project recommendations.
        /// </summary>
        [HttpGet("recs/{id}/{k}")]
        public async Task<ActionResult> GetRecommendations(int id, int k)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var project = _context.Projects
                .Include(project => project.Owner)
                .Include(project => project.Skills)
                .Include(project => project.Members)
                .Where(project => project.ProjectId == id)
                .FirstOrDefault();
            if (project == null)
            {
                return NotFound("Project not found");
            }

            var profile = await _context.Profiles
                .Include(profile => profile.Skills)
                .Include(profile => profile.User)
                .Where(profile => !project.Members.Contains(profile.User))
                .ToListAsync();
            

            var recs = KnnService.KNearestUsers(project, profile, k, _predictionEnginePool);
            var ret = new List<RecommendationResponse>();
            foreach (var rec in recs)
            {

                var userSkills = await _context.Skills.Where(s => s.ProfileId == rec.Item1.UserId).ToListAsync();
                var currUser = _userManager.FindByIdAsync(rec.Item1.UserId.ToString()).Result;
                var profResponse = new RecommendationResponse()
                {
                    Email = currUser.Email,
                    UserId = rec.Item1.UserId,
                    BuddyScore = 0,
                    Skills = new List<SkillResponse>(),
                    Match = String.Format("{0:P2}.", rec.Item2)
                };
           
                foreach (var skill in userSkills)
                {
                    var newSkill = new SkillResponse();
                    newSkill.Id = skill.Id;
                    newSkill.Name = skill.Name;
                    newSkill.Delete = false;
                    profResponse.Skills.Add(newSkill);
                }
                ret.Add(profResponse);
            }
            return Ok(ret);
        }

        /// <summary>
        /// API route GET /api/v1/ratings/
        /// fetching all user ratings.
        /// </summary>
        [HttpGet("ratings")]
        public async Task<ActionResult> GetRatings()
        {
            var ratings = await _context.Ratings.ToListAsync();

            var ret = new List<RatingsResponse>();
            foreach (var rating in ratings)
            {
                var ratingResponse = new RatingsResponse()
                {
                    RaterId = rating.RaterId,
                    BeingRatedId = rating.BeingRatedId,
                    Score = rating.Score
                };
                ret.Add(ratingResponse);
            }

            return Ok(ret);
        }
    }
} 
