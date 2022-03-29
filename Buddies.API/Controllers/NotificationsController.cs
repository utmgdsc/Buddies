using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Buddies.API.IO;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {


        /// <summary>
        /// API route GET /api/v1/notifications/page/results for fetching profile.
        /// </summary>
        [HttpGet("{page}/{results}")]
        public async Task<ActionResult> GetNotis(int page, float results)
        {
            var x = new PagedNotificationsResponse
            {
                Notifications = new List<NotificationResponse>(),
                TotalPages = 1,
                CurrentPage = 1
            };
            for (int i = 0; i < results; i++)
            {
                var b = i;
                var c = "Project";
                if (i % 2 == 0)
                {
                    b = -1;
                    c = "Not Project";
                }
                x.Notifications.Add(new NotificationResponse()
                {
                    Noti_id = i,
                    Message = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    Sender_id = i,
                    Sender_name = "User",
                    Project_id = b,
                    Noti_type = c
                }
                );
            }
            return Ok(x);
        }
        }
}
