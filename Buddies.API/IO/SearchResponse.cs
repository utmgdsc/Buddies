namespace Buddies.API.IO
{
    public class SearchResponse
    {
        public List<string> Searches { get; set; } = new List<string>();
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
    }
}
