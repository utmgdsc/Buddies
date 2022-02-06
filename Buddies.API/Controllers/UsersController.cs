using Buddies.API.Entities;
using Buddies.API.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Buddies.API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Components.Forms;

namespace Buddies.API.Controllers
{
    /// <summary>
    /// Controller containing all user related endpoints.
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;
        
        /// <summary>
        /// Initializes a new UsersController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        /// <param name="signInManager">SignInManager from ASP.NET Core Identity.</param>
        /// <param name="tokenService">TokenService for generating JWT tokens.</param>
        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        
        /// <summary>
        /// Endpoint for registering a new user.
        /// </summary>
        /// <param name="request">A registration request.</param>
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
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

            var user = _userManager.FindByEmailAsync(request.Email).Result;
            var claims = _signInManager.CreateUserPrincipalAsync(user).Result;
            
            await HttpContext.SignInAsync(claims, new AuthenticationProperties
            {
                ExpiresUtc = DateTimeOffset.Now.AddDays(7),
                IsPersistent = true
            });
            
            return StatusCode(StatusCodes.Status201Created);
        }


        /// <summary>
        /// Endpoint for login in a new user.
        /// </summary>
        /// /// <param name="request">A login request.</param>
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user =  _userManager.FindByEmailAsync(request.Email).Result;

            if (user == null)
            {
                return Unauthorized("Wrong email or password"); // todo: change to Model Error 
            }

            var signInResult =  _signInManager.CheckPasswordSignInAsync(user, request.Password, false).Result;

            if (!signInResult.Succeeded)
            {
                return Unauthorized("Wrong email or password!"); // todo: change to Model Error 
            }

            var claims = _signInManager.CreateUserPrincipalAsync(user).Result;

            await HttpContext.SignInAsync(claims, new AuthenticationProperties
            {
                ExpiresUtc = DateTimeOffset.Now.AddDays(7),
                IsPersistent = true // maybe add a "remember me" option in the future
            });

            return Ok();
        }

        [HttpGet("[action]")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        public ActionResult<TokenResponse> Refresh()
        {
            var userEntity = _userManager.GetUserAsync(User).Result;

            var responseBody = new TokenResponse
            {
                AccessToken = _tokenService.GenerateAccessToken(userEntity)
            };

            return responseBody;
        }
    }
}