using Buddies.API.IO;
using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class LeaderboardResponse
    {
        [Required]
        public List<UserInfoResponse> Users { get; set; } = new List<UserInfoResponse>();

        [Required]
        public int TotalPages { get; set; }
        [Required]
        public int CurrentPage { get; set; }
    }
}