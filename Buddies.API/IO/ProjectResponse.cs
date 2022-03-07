namespace Buddies.API.IO
{
    public class ProjectResponse
    {
        public string Title { get; init; } = default!;

        public int ProjectId { get; init; } = default!;
        public string Description { get; init; } = default!;

        public string Location { get; init; } = default!;

        public string Username { get; init; } = default!;

        public int BuddyScore  { get; init; } = default!;

        public int Members { get; init; } = default!;

        public string Category { get; init; } = default!;

    }
}
