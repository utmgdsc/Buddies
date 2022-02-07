using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A profile update request.
/// </summary>
public record UpdateProfileRequest
{
    [Required(ErrorMessage = "")]
    public int id { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string name { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string headline { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string aboutme { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public List<Skills> skills { get; init; } = default!;
}

//{"id": 0, "name": "joe", "headline": "n/a", "aboutme": "n/a",
//"skills": [{"id": 1, "name": "Data Structures", "delete": false},
//{"id": 2, "name": "C++", "delete": false},
//{"id": 3, "name": "Python", "delete": false}]}