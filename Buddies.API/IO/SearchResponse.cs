using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class SearchResponse
    {
        [Required]
        public List<string> Searches { get; set; } = new List<string>();
        [Required]
        public int TotalPages { get; set; }
        [Required]
        public int CurrentPage { get; set; }
    }
}
