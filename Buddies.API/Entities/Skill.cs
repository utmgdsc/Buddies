using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class Skill
    {
        public Skill(string name)
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

        public int ProfileId { get; set; }
        public Profile Profile { get; set; } = null!;
    }
}