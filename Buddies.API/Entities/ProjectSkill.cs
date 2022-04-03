using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class ProjectSkill
    {
        public ProjectSkill(string name)
        {
            Name = name;
        }
        /// <summary>
        /// ID of the skill.
        /// </summary>
        [Key]
        public int Id { get; init; }

        /// <summary>
        /// Name of the skill.
        /// </summary>
        public string Name { get; set; }

        public int ProjectId { get; set; }
        public Profile Project { get; set; } = null!;
    }
}