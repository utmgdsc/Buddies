using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record RegisterRequest(
    [Required(ErrorMessage = "A first name is required."), MinLength(2, ErrorMessage = "Names must be at least 2 characters long.")] 
    string FirstName,
    [Required(ErrorMessage = "A last name is required."), MinLength(2, ErrorMessage = "Names must be at least 2 characters long.")]
    string LastName,
    [Required(ErrorMessage = "A email is required.")]
    string Email,
    [Required(ErrorMessage = "A password is required.")]
    string Password
);