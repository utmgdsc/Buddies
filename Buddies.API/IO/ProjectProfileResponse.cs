using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class ProjectProfileResponse
    {
        [Required]
        public string Title { get; set;} = default!;

        [Required(ErrorMessage = "A description is required.")]
        public string Description { get; set; } = default!;

        [Required(ErrorMessage = "A location is required.")]
        public string Location { get; set;} = default!;

        [Required(ErrorMessage = "A username is required.")]
        public string Username { get; init; } = default!;

        [Required(ErrorMessage = "An email is required.")]
        public string Email { get; init; } = default!;

        [Required(ErrorMessage = "A category is required.")]
        public string Category { get; set; } = default!;

        [Required] // todo: decide on a reasonable max
        public int MaxMembers { get; set; } = default!;

        [Required]
        public List<UserInfoResponse> InvitedUsers { get; set; } = new List<UserInfoResponse>();

        [Required]
        public List<UserInfoResponse> Members { get; set; } = new List<UserInfoResponse>();


    }
}
