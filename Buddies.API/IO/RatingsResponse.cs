using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class RatingsResponse
    {
        [Required]
        public int RaterId { get; set; } = default!;

        [Required]
        public int BeingRatedId { get; set; } = default!;

        [Required]
        public float Score { get; set; } = default!;
    }
}
