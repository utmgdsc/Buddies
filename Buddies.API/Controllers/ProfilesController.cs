using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Buddies.API.Entities;
using Buddies.API.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Buddies.API.IO;
using Microsoft.EntityFrameworkCore;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {

        private readonly ApiContext _context;
        private readonly UserManager<User> _userManager;

        /// <summary>
        /// Initializes a new ProfileController.
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
            var userSkills = await _context.Skills.Where(s => s.ProfileId == profile.UserId).ToListAsync();

            var profileResponse = new UserProfileResponse();
            profileResponse.FirstName = profile.FirstName;
            profileResponse.LastName = profile.LastName;
            profileResponse.UserId = profile.UserId;
            profileResponse.AboutMe = profile.AboutMe;
            profileResponse.Headline = profile.Headline;

            foreach (Skill s in userSkills)
            {
                var skill = new SkillResponse();
                skill.Id = s.Id;
                skill.Name = s.Name;
                skill.Delete = false;
                profileResponse.Skills.Add(skill);
            }


            var userEntity = _userManager.GetUserAsync(User).Result;
            if (userEntity == null || userEntity.Id != id)
            {
                profileResponse.Success = 0;
            }
            profileResponse.Success = 1;

            return Ok(profileResponse);
        }

        /// <summary>
        /// API route PUT /api/v1/profiles for updating profile.
        /// </summary>
        [HttpPut]
        public async Task<ActionResult> UpdateProfile(UpdateProfileRequest profile)
        {
            var dbProfile = await _context.Profiles.FindAsync(profile.UserId);
            var userSkills = await _context.Skills.Where(s => s.ProfileId == profile.UserId).ToListAsync();
           
            if (dbProfile == null)
            {
                return NotFound("PROFILE NOT FOUND");
            }
            dbProfile.FirstName = profile.FirstName;
            dbProfile.LastName = profile.LastName;
            dbProfile.Headline = profile.Headline;
            dbProfile.AboutMe = profile.AboutMe;

            foreach (Skill s in userSkills)
            {
                _context.Skills.Remove(s);

            }
            foreach (SkillResponse skill in profile.Skills)
            {
                var newskill = new Skill(skill.Name);
                newskill.ProfileId = profile.UserId;
                _context.Skills.Add(newskill);
            }

            _context.SaveChanges();

            return Ok();
        }


    }
}