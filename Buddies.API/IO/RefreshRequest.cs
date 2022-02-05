using System.ComponentModel.DataAnnotations;
/// <summary>
/// A registration request.
/// </summary>
/// <param name="RefreshToken">refresh token</param>
namespace Buddies.API.IO
{
    public record RefreshRequest
    {
        [Required(ErrorMessage = "A refresh token is required.")]
        public string RefreshToken { get; init; } = default!;


    }
       
        

}
