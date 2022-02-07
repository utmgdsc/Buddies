using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {

        private readonly ApiContext _context; //dbcontext after merging
        private readonly UserManager<User> _userManager;

        /// <summary>
        /// Initializes a new UsersController.
        /// </summary>
        /// <param name="userManager">UserManager from ASP.NET Core Identity.</param>
        public ProfilesController(ApiContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        /// <summary>
        /// API route GET /api/v1/profiles/:id for fetching profile.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProfile(int id)
        {
            var profile = await _context.Profiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }

            var profileResponse = new UserProfileResponse();
            profileResponse.FirstName = profile.FirstName;
            profileResponse.LasttName = profile.LastName;
            profileResponse.AboutMe = profile.aboutMe;
            profileResponse.Headline = profile.bio;
            profileResponse.Skills = profile.Skills;

            return Ok(profileResponse);
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> UpdateProfile(UpdateProfileRequest profile)
        {
            var dbProfile = await _context.Profiles.FindAsync(profile.id);
            if (dbProfile == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            dbProfile.FirstName = profile.name;
            dbProfile.LastName = profile.name;
            dbProfile.bio = profile.headline;
            dbProfile.aboutMe = profile.aboutme;
            dbProfile.Skills = profile.skills;
            _context.SaveChanges();
           
            return Ok();
        }


    }
}
