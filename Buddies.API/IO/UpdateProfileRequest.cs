using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A profile update request.
/// </summary>
public record UpdateProfileRequest
{
  
    [Required(ErrorMessage = "")]
    public string FirstName { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string LastName { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public int UserId { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string Headline { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string AboutMe { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public List<SkillResponse> Skills { get; init; } = default!;
}