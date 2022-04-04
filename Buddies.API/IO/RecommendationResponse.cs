using System.ComponentModel.DataAnnotations;
namespace Buddies.API.IO
{
    public class RecommendationResponse
    {
        [Required]
        public string Email { get; set; } = default!;

        [Required]
        public int UserId { get; set; } = default!;

        [Required]
        public int BuddyScore { get; set; } = default!;

        [Required]
        public List<SkillResponse> Skills { get; set; } = new List<SkillResponse>();

        [Required]
        public string Match { get; set; } = default!;

    }
}
