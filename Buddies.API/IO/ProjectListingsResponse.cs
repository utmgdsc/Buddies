using Buddies.API.IO;

namespace Buddies.API.IO
{
    public class ProjectListingsResponse
    {
        public List<ProjectResponse> Projects { get; set; } = new List<ProjectResponse>();
    }
}
