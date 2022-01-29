using Buddies.API.Entities;
using Buddies.API.IO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public ActionResult Register([FromBody] RegisterRequest request)
        {
            var userData = new User(request.Email)
            {
                Profile = new Profile(request.FirstName, request.LastName)
            };

            var newUser = _userManager.CreateAsync(userData, request.Password).Result;
            if (!newUser.Succeeded)
            {
                foreach (var error in newUser.Errors)
                {
                    if (error.Code.Contains(nameof(request.Email)))
                    {
                        ModelState.AddModelError(nameof(request.Email), error.Description);
                        
                    } else if (error.Code.Contains(nameof(request.Password)))
                    {
                        ModelState.AddModelError(nameof(request.Password), error.Description);  
                    }
                }
                return ValidationProblem(ModelState);
            }
            
            // todo: for login upon successful registration, send access token here (and it change to Created/201)
            return Ok();
        }
    }
}