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
        public UserRating(int raterId, int beingRatedId, int score)
        {
            RaterId = raterId;
            BeingRatedId = beingRatedId;
            Score = score;
            RatingCount = 1;
        }
        /// <summary>
        /// ID of the rating object.
        /// </summary>
        [Key]
        public int Id { get; init; }

        public int RaterId { get; set; }

        public int BeingRatedId { get; set; }

        public int Score { get; set; }

        /// <summary>
        /// Number of times Rater rated the BeingRated user.
        /// </summary>
        public int RatingCount { get; set; }
    }
}