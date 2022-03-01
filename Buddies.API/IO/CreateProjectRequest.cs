using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record CreateProjectRequest
{
    [Required(ErrorMessage = "A title is required."), 
     MaxLength(50, ErrorMessage = "Title must be less than or equal to 50 characters.")]
    public string Title { get; init; } = default!;

    [Required(ErrorMessage = "A location is required.")]
    public string Location { get; init; } = default!;
    
    public IList<int> InvitedUsers { get; init; } = default!;

    [Required(ErrorMessage = "A description is required."), 
     MaxLength(1000, ErrorMessage = "Description must be less than or equal to 1000 characters.")]
    public string Description { get; init; } = default!;
}