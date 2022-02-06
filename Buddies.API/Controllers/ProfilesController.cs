using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {

        private readonly ApiContext _context; //dbcontext after merging
        public ProfilesController(ApiContext context)
        {
            _context = context;
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
            return Ok(profile);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProfile(Profile profile)
        {
            var dbProfile = await _context.Profiles.FindAsync(profile.UserId);
            if (dbProfile == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            dbProfile.FirstName = profile.FirstName;
            dbProfile.LastName = profile.LastName;
            dbProfile.bio = profile.bio;
            dbProfile.aboutMe = profile.aboutMe;
            dbProfile.Skills = profile.Skills;
            return Ok();
        }


    }
}
