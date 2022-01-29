using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities;

public class Profile
{
    public Profile(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }
    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    [Key]
    public int UserId { get; init; }
    public User User { get; init; } = null!; // populated by EF 
}