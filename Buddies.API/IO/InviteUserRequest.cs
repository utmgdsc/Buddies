using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record InviteUserRequest
{
    [Required(ErrorMessage = "Email of invited user is required.")]
    public string UserEmail { get; init; } = default!;
}