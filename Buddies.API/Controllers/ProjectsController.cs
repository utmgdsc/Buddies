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

        /// <summary>
        /// API route GET /api/v1/projects/locations for fetching locations.
        /// </summary>
        [HttpGet("locations/{search}/{page}/{size}")]
        public async Task<ActionResult> GetLocation(string search, int page, float size)
        {

            String url = "https://raw.githubusercontent.com/SyedTahaA/test/main/canadacities.csv";
            List<string> cities = new List<string>();
            var CityResponseString = await client.GetStringAsync(url);
            using (StringReader reader = new StringReader(CityResponseString))
            {
                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    line = line.Split(',').ToList()[1];
                    line = line.Remove(0, 1);
                    line = line.Remove(line.Count()-1, 1);
                    cities.Add(line);
                }
            }
            string searchitem = search.ToLower();
            cities.Remove("city_ascii");
            int TOLERANCE = 0;
            var matchingCities = cities.Where(p =>
            {
                //Check Contains
                bool contains = p.ToLower().Contains(searchitem);
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = LongestCommonSubsequence(p, searchitem, out output) >= searchitem.Length - TOLERANCE;

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
        /// API route GET /api/v1/projects/locations for fetching locations.
        /// </summary>
        [HttpGet("email/{search}/{page}/{size}")]
        public async Task<ActionResult> GetUser(string search, int page, float size)
        {

            var emailsList = await _context.Users.ToListAsync();
            if (emailsList == null)
            {
                return NotFound();
            }
            const int TOLERANCE = 1;
            var matchingPeople = emailsList.Where(p =>  
            {
                //Check Contains
                bool contains = p.Email.Contains(search);
                if (contains) return true;

                //Check LongestCommonSubsequence
                string output = "";
                bool subsequenceTolerated = LongestCommonSubsequence(p.Email, search, out output) >= search.Length - TOLERANCE;

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
            return Ok(emailPage);
        }

        private static int MAX(int a, int b)
        {
            return a > b ? a : b;
        }

        // source: https://www.programmingalgorithms.com/algorithm/longest-common-subsequence/
        public static int LongestCommonSubsequence(string s1, string s2, out string output)
        {
            int i, j, k, t;
            int s1Len = s1.Length;
            int s2Len = s2.Length;
            int[] z = new int[(s1Len + 1) * (s2Len + 1)];
            int[,] c = new int[(s1Len + 1), (s2Len + 1)];

            for (i = 0; i <= s1Len; ++i)
                c[i, 0] = z[i * (s2Len + 1)];

            for (i = 1; i <= s1Len; ++i)
            {
                for (j = 1; j <= s2Len; ++j)
                {
                    if (s1[i - 1] == s2[j - 1])
                        c[i, j] = c[i - 1, j - 1] + 1;
                    else
                        c[i, j] = MAX(c[i - 1, j], c[i, j - 1]);
                }
            }

            t = c[s1Len, s2Len];
            char[] outputSB = new char[t];

            for (i = s1Len, j = s2Len, k = t - 1; k >= 0;)
            {
                if (s1[i - 1] == s2[j - 1])
                {
                    outputSB[k] = s1[i - 1];
                    --i;
                    --j;
                    --k;
                }
                else if (c[i, j - 1] > c[i - 1, j])
                    --j;
                else
                    --i;
            }

            output = new string(outputSB);

            return t;
        }      

    }
}