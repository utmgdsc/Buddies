using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities;

/// <summary>
/// Profile entity.
/// </summary>
public class Profile
{
    /// <summary>
    /// Initializes a new profile entity.
    /// </summary>
    /// <param name="firstName">First name on the profile.</param>
    /// <param name="lastName">Last name on the profile.</param>
    public Profile(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
    
    /// <summary>
    /// First name on the profile.
    /// </summary>
    public string FirstName { get; set; }
    
    /// <summary>
    /// Last name on the profile.
    /// </summary>
    public string LastName { get; set; }
    
    /// <summary>
    /// ID of the user the profile belongs to.
    /// </summary>
    [Key]
    public int UserId { get; init; }
    /// <summary>
    /// User the profile belongs to.
    /// </summary>
    public User User { get; init; } = null!; // populated by EF 
}