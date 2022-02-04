using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

/// <summary>
/// A registration request.
/// </summary>
/// <param name="FirstName">First name of user.</param>
/// <param name="LastName">Last name of user.</param>
/// <param name="Email">Email of user.</param>
/// <param name="Password">Password of user.</param>
public record LoginRequest(
    [Required(ErrorMessage = "A email is required.")]
    string Email,
    [Required(ErrorMessage = "A password is required.")]
    string Password
);