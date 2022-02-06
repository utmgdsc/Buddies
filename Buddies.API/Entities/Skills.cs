using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class Skills
    {

        public Skills(string name)
        {
            Name = name;
            Delete = false;
        }
        /// <summary>
        /// ID of the skill
        /// </summary>
        [Key]
        public int Id { get; init; }

        /// <summary>
        /// Skill name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Whether skill belongs to user or not
        /// </summary>
        public bool Delete { get; set; }

    }

}
