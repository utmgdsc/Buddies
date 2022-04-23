using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO;

public record RateBuddiesRequest
{

    [Required(ErrorMessage = "A dictionary of buddie scores, indexed by user ids is required"),
     MinLength(1, ErrorMessage = "A project must have at least 1 member.")]
    public Dictionary<int, int> BuddyScores { get; init; } = default!;

}