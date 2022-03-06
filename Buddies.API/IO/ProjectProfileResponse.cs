using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class ProjectProfileResponse
    {
        [Required]
        public string Title { get; set;} = default!;

        [Required(ErrorMessage = "A location is required.")]
        public string Location { get; set;} = default!;

        [Required(ErrorMessage = "A description is required."),
         MaxLength(1000, ErrorMessage = "Description must be less than or equal to 1000 characters.")]
        public string Description { get; set; } = default!;

        [Required(ErrorMessage = "A category is required.")]
        public string Category { get; set; } = default!;

        [Required(ErrorMessage = "A member limit is required."),
         Range(2, int.MaxValue, ErrorMessage = "Member limit must be greater than or equal to 2.")] // todo: decide on a reasonable max
        public int MaxMembers { get; set; } = default!;

        [Required]
        public List<UserInfoResponse> InvitedUsers { get; set; } = new List<UserInfoResponse>();

        [Required]
        public List<UserInfoResponse> Members { get; set; } = new List<UserInfoResponse>();


    }
}
