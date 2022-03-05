namespace Buddies.API.IO
{
    public class ProjectListingsRequest
    {


        public string Location { get; init; } = default!;

        public int Members { get; init; } = default!;

        public string Category { get; init; } = default!;

    }
}
