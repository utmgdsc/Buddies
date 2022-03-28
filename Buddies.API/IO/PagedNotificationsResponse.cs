using Buddies.API.IO;
using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class PagedNotificationsResponse
    {
        [Required]
        public List<NotificationResponse> Projects { get; set; } = new List<NotificationResponse>();

        [Required]
        public int TotalPages { get; set; }
        [Required]
        public int CurrentPage { get; set; }
    }
}