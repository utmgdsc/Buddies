
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buddies.API.Entities
{
    public class Project
    {
        /// <summary>
        /// Initializes a new project entity.
        /// </summary>
        public Project()
        {
            Members = new List<User>();
            InvitedUsers = new List<User>();
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
        /// Location project owner specifies
        /// </summary>
        public string Category { get; set; } = null!;

        /// <summary>
        /// Location project owner specifies
        /// </summary>
        public int MaxMembers { get; set; } = default!;

        /// <summary>
        /// ID of the user the project belongs to (project owner).
        /// </summary>
        public int OwnerId { get; set; }


        /// <summary>
        /// Project group members
        /// </summary>
        [InverseProperty("Projects")]
        public List<User> Members { get; set; }

        /// <summary>
        /// Users that have been invited
        /// to join the project.
        /// </summary>
        [InverseProperty("InvitedTo")]
        public List<User> InvitedUsers { get; set; }
    }

}
