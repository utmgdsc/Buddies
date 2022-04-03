using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class NotificationResponse
    {
        [Required]
        public int Noti_id { get; set; } = default!;

        [Required]
        public string Message { get; set; } = default!;

        [Required]
        public int Sender_id { get; set; } = default!;

        [Required]
        public string Sender_name { get; set; } = default!;

        [Required]
        public int Project_id { get; set; } = default!;

    }
}
