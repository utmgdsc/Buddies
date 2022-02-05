using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

/// <summary>
/// A login request.
/// </summary>
public record LoginRequest
{
    [Required(ErrorMessage = "A email is required.")]
    public string Email { get; init; } = default!;

    [Required(ErrorMessage = "A password is required.")]
    public string Password { get; init; } = default!;
}