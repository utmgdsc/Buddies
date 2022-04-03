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
        [HttpGet("{page}/{size}")]
        [Authorize]
        public async Task<ActionResult> GetNotifications(int page, float size)
        {
            var notifications = new List<NotificationResponse>();
            var currentUserId = _userManager.GetUserId(User);

            var currentUser = _context.Users
                .Include(user => user.Profile)
                .Include(user => user.Notifications)
                .ThenInclude(n => n.Project)
                .Where(u => u.Id.ToString() == currentUserId)
                .FirstOrDefault();

            foreach (var notification in currentUser.Notifications)
            {

                notifications.Add(new NotificationResponse()
                {
                    Noti_id = notification.Id,
                    Message = notification.NotificationMessage,
                    Sender_id = notification.SenderId,
                    Sender_name = notification.SenderName,
                    Project_id = notification.Project.ProjectId
                }
                ); 
            }

            var pagedNotificationsResponse = new PagedNotificationsResponse
            {
                Notifications = notifications,
                TotalPages = (int) Math.Ceiling(notifications.Count() / size),
                CurrentPage = page
            };
            return Ok(pagedNotificationsResponse);
        }

    }
}

