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
        Projects = new List<Project>();
        InvitedTo = new List<Project>();
        Notifications = new List<Notification>();
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

    /// <summary>
    /// Projects User is member of 
    /// </summary>
    public List<Project> Projects { get; set; }

    /// <summary>
    /// Projects User is invited to
    /// </summary>
    public List<Project> InvitedTo { get; set; }

    /// <summary>
    /// Projects User is invited to
    /// </summary>
    public List<Notification> Notifications { get; set; }
}