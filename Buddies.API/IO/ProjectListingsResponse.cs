using Buddies.API.IO;

namespace Buddies.API.IO
{
    public class ProjectListingsResponse
    {
        public List<ProjectResponse> Projects { get; set; } = new List<ProjectResponse>();
        public List<String> Locations { get; set; } = new List<String>();
        public List<String> Members { get; set; } = new List<String>();

        public List<String> Categories { get; set; } = new List<String>();
    }
}