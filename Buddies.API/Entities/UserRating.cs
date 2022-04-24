using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class UserRating
    {
        /// <summary>
        /// Initializes a new rating entity.
        /// </summary>
        /// <param raterId="raterId">user rating id.</param>
        /// <param beingRatedId="beingRatedId">user being rated id.</param>
        public UserRating(int raterId, int beingRatedId)
        {
            RaterId = raterId;
            BeingRatedId = beingRatedId;
        }
        /// <summary>
        /// ID of the rating object.
        /// </summary>
        [Key]
        public int Id { get; init; }

        public int RaterId { get; set; }
        public int BeingRatedId { get; set; }
    }
}