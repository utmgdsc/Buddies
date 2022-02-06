using Buddies.API.Entities;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Buddies.API.Database;

namespace Buddies.API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly ApiContext _apiContext;
        private readonly JwtSecurityTokenHandler _jwtHandler;
        
        public TokenService(IConfiguration config, ApiContext apiContext)
        {
            _config = config;
            _apiContext = apiContext;
            _jwtHandler = new JwtSecurityTokenHandler();
        }

        public string GenerateAccessToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
            _apiContext.Entry(user).Reference(u => u.Profile).Load();

            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                Claims = new Dictionary<string, object>
                {
                    [ClaimTypes.NameIdentifier] = user.Id.ToString(),
                    [ClaimTypes.GivenName] = user.Profile.FirstName,
                    [ClaimTypes.Surname] = user.Profile.LastName
                },
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = credentials
            };
            
            return _jwtHandler.WriteToken(_jwtHandler.CreateToken(descriptor));
        }
    }
}
