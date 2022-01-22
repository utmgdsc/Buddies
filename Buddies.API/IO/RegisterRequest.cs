using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record RegisterRequest
{
    [Required, MinLength(2)] public string FirstName { get; init; } = default!;

    [Required, MinLength(2)] public string LastName { get; init; } = default!;

    // email address validator not needed, Identity validates it
    [Required] public string Email { get; init; } = default!;
    
    // Identity also validates complexity here
    [Required] public string Password { get; init; } = default!;
}