using Buddies.API.IO;
using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class ProjectListingsResponse
    {
        [Required]
        public List<ProjectResponse> Projects { get; set; } = new List<ProjectResponse>();

        [Required]
        public int TotalPages { get; set; }
        [Required]
        public int CurrentPage { get; set; }

        public List<String> Locations { get; set; } = new List<String>();
        public List<String> Members { get; set; } = new List<String>();

        public List<String> Categories { get; set; } = new List<String>();
    }
}