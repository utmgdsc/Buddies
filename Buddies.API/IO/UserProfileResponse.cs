using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

public record UserProfileResponse
{
    // it's not required to annotate responses like this but but Swashbuckle can generate unideal schema without it,
    // look into NSwag in the future which can infer correctly without this annotation
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
    public List<Skills> Skills { get; set; } = default!;

    [Required]
    public int Success { get; set; } = default!;

}