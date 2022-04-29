using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Buddies.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Text;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class LeaderboardController : ControllerBase
    {
        private readonly ApiContext _context;
        /// <summary>
        /// Initializes a new NotificationController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// /// <param name="context">database context from Buddies.API.Database.</param>
        public LeaderboardController(ApiContext context, UserManager<User> userManager)
        {
            _context = context;
        }

        /// <summary>
        /// API route GET /api/v1/postings/{filters}/... for fetching all projects
        /// that pass the filters.
        /// </summary>
        [HttpGet("{page}/{results}")]
        public async Task<ActionResult> GetLeaderboard(int page, float results)
        {
            var userList = await _context.Users
                .Include(u => u.Profile)
                .OrderByDescending(u => u.Profile.BuddyScore)
                .Skip((page - 1) * (int)results)
                .Take((int)results)
                .ToListAsync();

            var response = new LeaderboardResponse();

            foreach (User user in userList)
            {
                var userResponse = new UserInfoResponse()
                {
                    FirstName = user.Profile.FirstName,
                    LastName = user.Profile.LastName,
                    BuddyScore = (float) Math.Round(user.Profile.BuddyScore, 1),
                    Email = user.Email,
                    UserId = user.Id
                };
                response.Users.Add(userResponse);

            }

            var pageCount = Math.Ceiling(_context.Users.Count() / results);
            response.TotalPages = (int)pageCount;
            response.CurrentPage = page;

            return Ok(response);
        }


    }
}

