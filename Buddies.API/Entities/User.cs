using Microsoft.AspNetCore.Identity;

namespace Buddies.API.Entities;

/// <summary>
/// User within ASP.NET Core Identity.
/// </summary>
public class User : IdentityUser<int>
{
    /// <summary>
    /// Initializes a new user.
    /// </summary>
    /// <param name="email">Email address of the user.</param>
    public User(string email)
    {
        Email = email;
    }
    
    public sealed override string Email
    {
        get => base.Email;
        set
        {
            base.Email = value;
            // we are using email in place of username but Identity requires this
            // field be populated regardless
            base.UserName = value;
        }
    }
    
    /// <summary>
    /// Profile of the user.
    /// </summary>
    public Profile Profile { get; init; } = null!; // populated by EF
}