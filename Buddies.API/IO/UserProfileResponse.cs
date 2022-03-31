using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// Response for getting profile data
/// </summary>
public record UserProfileResponse
{
 
    [Required]
    public string FirstName { get; set; } = default!;

    [Required]
    public string LastName { get; set; } = default!;

    [Required]
    public int UserId { get; set; } = default!;

    [Required]
    public string Headline { get; set; } = default!;

    [Required]
    public string AboutMe { get; set; } = default!;

    [Required]
    public float BuddyScore { get; set;} = default!;

    [Required]
    public int ProjectCount { get; set; } = default!;

    [Required]
    public List<SkillResponse> Skills { get; set; } = new List<SkillResponse>();

    [Required]
    public List<ProjectResponse> Projects { get; set; } = new List<ProjectResponse>();
}