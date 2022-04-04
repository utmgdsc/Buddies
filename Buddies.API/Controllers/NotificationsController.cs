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
                    NotificationId = notification.Id,
                    Message = notification.NotificationMessage,
                    SenderId = notification.SenderId,
                    SenderName = notification.SenderName,
                    ProjectId = notification.Project.ProjectId,
                    IsRead = notification.IsRead
                }
                ); 
            }
            var pagedNotificationsResponse = new PagedNotificationsResponse
            {
                Notifications = notifications.Skip((page - 1) * (int)size).Take((int)size).ToList(),
                TotalPages = (int) Math.Ceiling(notifications.Count() / size),
                CurrentPage = page
            };
            return Ok(pagedNotificationsResponse);
        }


        [HttpPut("read/{nid}")]
        [Authorize]
        public async Task<ActionResult> ReadNotification(int nid)
        {
            var notifications = new List<NotificationResponse>();
            var currentUserId = _userManager.GetUserId(User);

            var currentUser = _context.Users
                .Include(user => user.Notifications)
                .Where(u => u.Id.ToString() == currentUserId)
                .FirstOrDefault();

            var noti = currentUser.Notifications.Find(n => n.Id == nid);
            if (noti == null)
            {
                return BadRequest("notification not found");
            }
            noti.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

