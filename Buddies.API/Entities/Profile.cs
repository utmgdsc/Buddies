using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Entities;

[Owned, Table(nameof(Profile))]
public class Profile
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
}