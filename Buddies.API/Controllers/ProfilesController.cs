using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Buddies.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        /// <summary>
        /// Test values used to test api requests. Ignore these for now
        /// </summary>
        Entities.Profile[] profiles =
            {
                new() {id = 1, name = "bob", email="bob@gmail.com", occup="Student"},
                new() {id = 2, name = "Jack", email="jack@gmail.com", occup="CS@UOFT"},
                new() {id = 3, name = "Suf", email="suf@gmail.com", occup="CEO@Amazon"}
            };

        /// <summary>
        /// API route GET /api/v1/profiles/:id for fetching profile.
        /// </summary>
        [HttpGet("{id}")]
        public ActionResult GetProfile(string id)
        {
            

            if (!profiles.Any())
            {
                return NotFound();
            }
            for (int i = 0; i < profiles.Length; i++)
            {
                var profile = profiles[i];
                if (profile.id == Int32.Parse(id))
                {
                    return Ok(profile);
                }
            }
            return NotFound();
        }

        /// <summary>
        /// API route PUT /api/v1/profiles/:id for updating profile.
        /// </summary>
        [HttpPut("{id}")]
        public ActionResult UpdateProfile(string id, [FromBody] Entities.Profile p)
        {
        

            for (int i = 0; i < profiles.Length; i++)
            {
                var profile = profiles[i];
                if (profile.id == p.id)
                {
                    profile = p;
                    return Ok(profile);
                }
            }

            return NoContent();
        }

  
    }
}
