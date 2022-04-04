using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class NotificationResponse
    {
        [Required]
        public int NotificationId { get; set; } = default!;

        [Required]
        public string Message { get; set; } = default!;

        [Required]
        public int SenderId { get; set; } = default!;

        [Required]
        public string SenderName { get; set; } = default!;

        [Required]
        public int ProjectId { get; set; } = default!;

        [Required]
        public bool IsRead { get; set; } = default!;

        [Required]
        public string TimeCreated { get; set; } = default!;

    }
}
