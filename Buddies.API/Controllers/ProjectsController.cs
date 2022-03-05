using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Buddies.API.Services;
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

            try
            {
                var lst = project.Location.Split(',').ToList();
                var city = lst[0];
                var state = lst[1];
                String url = String.Format("https://nominatim.openstreetmap.org/search/lookup?city={0}&state={1}&country=Canada&format=json&addressdetails=1", city, state);
                var responseString = await client.GetStringAsync(url);
                if (responseString == "[]")
                {
                    return NotFound("Invalid Location");
                }
            } catch
            {
                return NotFound("Invalid Location");
            }

            var check = _context.Categories.Where(p => p.Name.Contains(project.Category));
            if (check.Count() == 0)
            {
                return NotFound("Invalid Category");
            }

            if (project.MaxMembers <= 1)
            {
                return NotFound("Invalid Member Count");
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
                var dbProfile = await _context.Users.FirstOrDefaultAsync(user => user.Email == invitation);
                if (dbProfile == null)
                {
                    return NotFound("No such user");
                }
                dbProject.InvitedUsers.Add(dbProfile);

            }

            await _context.Projects.AddAsync(dbProject);
            await _context.SaveChangesAsync();


            return Ok();
        }

        /// <summary>
        /// API route GET /api/v1/projects/locations for fetching categories.
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
            String url = "https://raw.githubusercontent.com/SyedTahaA/test/main/canadacities.csv";
            List<string> cities = new List<string>();
            var CityResponseString = await client.GetStringAsync(url);
            using (StringReader reader = new StringReader(CityResponseString))
            {
                string? line;
                while ((line = reader.ReadLine()) != null)
                {
                    var lst = line.Split(',').ToList();
                    var city = lst[1].Remove(0, 1);
                    city = city.Remove(city.Count()-1, 1);

                    var province = lst[3].Remove(0, 1);
                    province = province.Remove(province.Count() - 1, 1);
                    line = String.Format("{0}, {1}", city, province);

                    cities.Add(line);
                }
            }
            string searchitem = search.ToLower();
            cities.Remove("city_ascii, province_name");
            int TOLERANCE = 0;
            var matchingCities = cities.Where(p =>
            {
                //Check Contains
                bool contains = p.ToLower().Contains(searchitem);
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = FuzzySearchService.LongestCommonSubsequence(p.ToLower(), searchitem, out output) >= searchitem.Length - TOLERANCE;

                return subsequenceTolerated;
            }).ToList();
            float pageResults = size;
            var pageCount = Math.Ceiling(matchingCities.Count() / pageResults);
            var cityPage = matchingCities.Skip((page - 1) * (int)pageResults).Take((int)pageResults).ToList();
            var response = new SearchResponse
            {
                Searches = cityPage,
                CurrentPage = page,
                TotalPages = (int)pageCount
            };
            return Ok(response);
        }

        /// <summary>
        /// API route GET /api/v1/projects/locations for fetching emails.
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

             

    }
}