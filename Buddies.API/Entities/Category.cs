using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class Category
    {


        /// <summary>
        /// Initializes a new profile entity.
        /// </summary>
        /// <param name="name">Category name.</param>
        public Category(string name)
        {
            Name = name;
        }

        /// <summary>
        /// ID of the skill.
        /// </summary>
        [Key]
        public int Id { get; init; }

        /// <summary>
        /// First name on the profile.
        /// </summary>
        public string Name { get; set; }

    }
}
