using System.ComponentModel.DataAnnotations;

namespace Buddies.API.IO
{
    public class UpdateProjectSkillRequest
    {
        [Required(ErrorMessage = "Skills are required.")]
        public List<SkillResponse> Skills { get; init; } = default!;
    }
}
