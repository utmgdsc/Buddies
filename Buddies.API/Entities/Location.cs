using System.ComponentModel.DataAnnotations;

namespace Buddies.API.Entities
{
    public class Location
    {
        /// <summary>
        /// Project id
        /// </summary>
        [Key]
        public int LocationID { get; init; }

        /// <summary>
        /// Valid Address
        /// </summary>
        public string Address { get; set; } = null!;
    }
}
