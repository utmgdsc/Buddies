
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
            Skills = new List<ProjectSkill>();
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
        /// Type of project
        /// </summary>
        public string Category { get; set; } = null!;

        /// <summary>
        /// Required Skills
        /// </summary>
        public List<ProjectSkill> Skills { get; set; }

        /// <summary>
        /// Group capacity
        /// </summary>
        public int MaxMembers { get; set; } = default!;

        /// <summary>
        /// ID of the user the project belongs to (project owner).
        /// </summary>
        public virtual User Owner { get; set; }


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

        public bool IsFinished { get; set; } = false;

        /// <summary>
        /// Users that have yet to rate team members when the project has terminated
        /// </summary>
        public List<User> MembersYetToRate { get; set; }

        /// <summary>
        /// If the notification has been read
        /// </summary>
        public DateTime TimeCreated { get; set; } = DateTime.Now;

    }

}
