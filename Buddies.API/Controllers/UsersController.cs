using Buddies.API.Entities;
using Buddies.API.IO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
        private readonly IConfiguration _config;


        /// <summary>
        /// Initializes a new UsersController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
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
            return Created("", GenerateToken(user));
        }


        /// <summary>
        /// Endpoint for login in a new user.
        /// </summary>
        /// /// <param name="request">A login request.</param>
        [HttpPost("[action]")]
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

            return Created("", GenerateToken(user));
        }


        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            Console.WriteLine(securityKey);
            Console.WriteLine(credentials);

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
/*                new Claim(ClaimTypes.GivenName, user.Profile.FirstName),
                new Claim(ClaimTypes.Surname, user.Profile.LastName),*/
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Audience"],
              claims,
              expires: DateTime.Now.AddMinutes(15),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }




    }
}