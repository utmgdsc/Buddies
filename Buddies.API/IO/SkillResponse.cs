using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A Skill Update Response.
/// </summary>
public record SkillResponse
{

    [Required(ErrorMessage = "")]
    public string Name { get; set; } = default!;

    [Required(ErrorMessage = "")]
    public bool Delete { get; set; } = default!;

}
