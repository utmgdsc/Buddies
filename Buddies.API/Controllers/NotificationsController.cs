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
    public class NotificationsController : ControllerBase
    {
        private readonly ApiContext _context;
        private readonly UserManager<User> _userManager;

        /// <summary>
        /// Initializes a new NotificationController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// /// <param name="context">database context from Buddies.API.Database.</param>
        public NotificationsController(ApiContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        /// <summary>
        /// API route GET /api/v1/notifications/page/results for fetching profile.
        /// </summary>
        [HttpGet("{page}/{results}")]
        public async Task<ActionResult> GetNotis(int page, float results)
        {
            var pagedNotificationsResponse = new PagedNotificationsResponse
            {
                Notifications = new List<NotificationResponse>(),
                TotalPages = 1,
                CurrentPage = 1
            };
            var currentUser = _userManager.GetUserAsync(User).Result;

            foreach (var notification in currentUser.Notifications)
            {

                pagedNotificationsResponse.Notifications.Add(new NotificationResponse()
                {
                    Noti_id = notification.Id,
                    Message = notification.NotificationMessage,
                    Sender_id = notification.Sender.Id,
                    Sender_name = notification.Sender.Profile.FirstName,
                    Project_id = notification.Project.ProjectId
                }
                );
            }
            return Ok(pagedNotificationsResponse);
        }

    }
}

