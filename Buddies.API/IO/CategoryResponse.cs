using Buddies.API.Entities;

namespace Buddies.API.IO
{
    public class CategoryResponse
    {
        public List<Category> Categories { get; set; } = new List<Category>();
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; } 
    }
}
