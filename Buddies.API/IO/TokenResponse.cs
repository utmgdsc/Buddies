using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record TokenResponse
{
    // it's not required to annotate responses like this but but Swashbuckle can generate unideal schema without it,
    // look into NSwag in the future which can infer correctly without this annotation
    [Required]
    public string AccessToken { get; init; } = default!;
}