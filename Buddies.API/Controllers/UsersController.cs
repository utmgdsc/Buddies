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

            User user = _userManager.FindByEmailAsync(request.Email).Result;
           
            setTokenCookie(_tokenService.GenerateRefreshToken(user)); // append cookie with refresh token to the http response
            return Created("", _tokenService.GenerateAccessToken(user));
        }


        /// <summary>
        /// Endpoint for login in a new user.
        /// </summary>
        /// /// <param name="request">A login request.</param>
        [HttpPost("[action]")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public ActionResult Login([FromBody] LoginRequest request)
        {
            User user =  _userManager.FindByEmailAsync(request.Email).Result;

            if (user == null)
            {
                return Unauthorized("Wrong email or password"); // todo: change to Model Error 
            }

            var signInResult =  _signInManager.CheckPasswordSignInAsync(user, request.Password, false).Result;

            if (!signInResult.Succeeded)
            {
                return Unauthorized("Wrong email or password!"); // todo: change to Model Error 
            }

            setTokenCookie(_tokenService.GenerateRefreshToken(user)); // append cookie with refresh token to the http response
            return Created("", _tokenService.GenerateAccessToken(user));

        }

        [HttpPost("[action]")]
        public ActionResult Refresh(RefreshRequest request)
        {
            if (request is null)
            {
                return BadRequest("Invalid client request1");
            }

            // find user by request token, then send back a new access cookie. 
            ClaimsPrincipal principal = _tokenService.GetPrincipalFromExpiredToken(request.RefreshToken);
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            User user = _userManager.FindByIdAsync(userId).Result;
            
            if (user == null)
            {
                return BadRequest("Invalid Token");
            }
            
            var newAccessToken = _tokenService.GenerateAccessToken(user);
            return Ok(newAccessToken);
        }

        // append cookie with refresh token to the http response
        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("BuddiesRefreshToken", token, cookieOptions);

        }

    }
}