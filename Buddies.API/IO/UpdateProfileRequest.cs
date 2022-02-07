using System.ComponentModel.DataAnnotations;
using Buddies.API.Entities;

namespace Buddies.API.IO;

/// <summary>
/// A profile update request.
/// </summary>
public record UpdateProfileRequest
{
  
    [Required(ErrorMessage = "")]
    public string FirstName { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string LastName { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public int UserId { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string Headline { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public string AboutMe { get; init; } = default!;

    [Required(ErrorMessage = "")]
    public List<Skills> Skills { get; init; } = default!;
}

//{"id": 0, "name": "joe", "headline": "n/a", "aboutme": "n/a",
//"skills": [{"id": 1, "name": "Data Structures", "delete": false},
//{"id": 2, "name": "C++", "delete": false},
//{"id": 3, "name": "Python", "delete": false}]}