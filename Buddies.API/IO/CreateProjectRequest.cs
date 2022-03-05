using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record CreateProjectRequest
{
    [Required(ErrorMessage = "A title is required."), 
     MaxLength(50, ErrorMessage = "Title must be less than or equal to 50 characters.")]
    public string Title { get; init; } = default!;

    [Required(ErrorMessage = "A location is required.")]
    public string Location { get; init; } = default!;
    
    [Required(ErrorMessage = "A list of invited users is required."), 
     MinLength(1, ErrorMessage = "A project must have at least 1 member.")]
    public IList<string> InvitedUsers { get; init; } = default!;

    [Required(ErrorMessage = "A description is required."), 
     MaxLength(1000, ErrorMessage = "Description must be less than or equal to 1000 characters.")]
    public string Description { get; init; } = default!;

    [Required(ErrorMessage = "A category is required.")]
    public string Category { get; init; } = default!;

    [Required(ErrorMessage = "A member limit is required."), 
     Range(1, int.MaxValue, ErrorMessage = "Member limit must be greater than or equal to 1.")] // todo: decide on a reasonable max
    public int MaxMembers { get; init; } = default!;
}