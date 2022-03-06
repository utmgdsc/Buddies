using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A Skill Update Response.
/// </summary>
public record UserInfoResponse
{
    [Required(ErrorMessage = "")]
    public string FirstName { get; set; } = default!;
    [Required(ErrorMessage = "")]
    public string LastName { get; set; } = default!;

    [Required(ErrorMessage = "")]
    public string Email { get; set; } = default!;

}