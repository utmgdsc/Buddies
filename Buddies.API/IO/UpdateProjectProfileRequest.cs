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

    [Required] // todo: decide on a reasonable max
    public int MaxMembers { get; init; } = default!;

}