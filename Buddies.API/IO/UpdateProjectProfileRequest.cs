using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A profile update request.
/// </summary>
public record UpdateProjectProfileRequest
{

    [Required]
    public string Title { get; init; } = default!;

    [Required(ErrorMessage = "A location is required.")]
    public string Location { get; init; } = default!;

    [Required(ErrorMessage = "A description is required.")]
    public string Description { get; init; } = default!;

    [Required(ErrorMessage = "A category is required.")]
    public string Category { get; init; } = default!;

    [Required(ErrorMessage = "A member limit is required."),
     Range(2, 10, ErrorMessage = "Member limit must be between 2 and 10")]
    public int MaxMembers { get; init; } = default!;

}