namespace Buddies.API.IO;

public record TokenResponse
{
    public string AccessToken { get; init; } = default!;
}