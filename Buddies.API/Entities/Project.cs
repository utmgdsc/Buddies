
using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class Project
    {
        /// <summary>
        /// Initializes a new project entity.
        /// </summary>
        public Project(int id)
        {
            Members = new List<int>();
            InvitedUsers = new List<User>();
            UserId = id;
        }

        /// <summary>
        /// Project id
        /// </summary>
        [Key]
        public int ProjectId { get; init; } 

        /// <summary>
        /// Project title.
        /// </summary>
        [MaxLength(50)]
        public string Title { get; set; } = null!;

        /// <summary>
        /// Project description.
        /// </summary>
        [MaxLength(1000)]
        public string Description { get; set; } = null!;

        /// <summary>
        /// Location project owner specifies
        /// </summary>
        [MaxLength(100)]
        public string Location { get; set; } = null!;

        /// <summary>
        /// ID of the user the project belongs to (project owner).
        /// </summary>
        public int UserId { get; init; }

        /// <summary>
        /// User the project belongs to.
        /// </summary>
        public User User { get; init; } = null!; // populated by EF 

        /// <summary>
        /// Project group members
        /// </summary>
        public List<int> Members { get; set; }

        /// <summary>
        /// Users that have invited
        /// to join the project.
        /// </summary>
        public List<User> InvitedUsers { get; set; }
    }

}
