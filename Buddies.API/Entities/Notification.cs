using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buddies.API.Entities
{
    public class Notification
    {

        public Notification()
        {
            NotificationMessage = "empty notification";
        }

        public Notification(string message)
        {
            NotificationMessage = message;
        }
        /// <summary>
        /// ID of the notification.
        /// </summary>
        [Key]
        public int Id { get; init; }

        /// <summary>
        /// Message of Notification
        /// </summary>
        public string NotificationMessage { get; set; }

        /// <summary>
        /// User who sent the notification
        /// </summary>
        public int SenderId { get; set; }

        /// <summary>
        /// User who sent the notification
        /// </summary>
        public string SenderName { get; set; } = null!;

        /// <summary>
        /// User who will receive the notification
        /// </summary>
        [InverseProperty("Notifications")]
        public User Recipient { get; set; } = null!;

        /// <summary>
        /// Project of the notication
        /// </summary>
        public Project Project { get; set; } = null!;


    }
}