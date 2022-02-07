using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

/// <summary>
/// A registration request.
/// </summary>
public record RegisterRequest
{
    [Required(ErrorMessage = "A first name is required."), MinLength(2, ErrorMessage = "Names must be at least 2 characters long.")] 
    public string FirstName { get; init; } = default!;
    
    [Required(ErrorMessage = "A last name is required."), MinLength(2, ErrorMessage = "Names must be at least 2 characters long.")]
    public string LastName { get; init; } = default!;

    [Required(ErrorMessage = "A email is required.")]
    public string Email { get; init; } = default!;

    [Required(ErrorMessage = "A password is required.")]
    public string Password { get; init; } = default!;
}