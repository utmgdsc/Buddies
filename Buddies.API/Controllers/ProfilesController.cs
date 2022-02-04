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
                new() {id = 1, name = "bob", bio="bob@gmail.com",
                    aboutme="Hello, my name is bob and I'm currently a student at the university of Toronto. I am also looking to expand my network and work with new people."},
                new() {id = 2, name = "Jack", bio="jack@gmail.com",
                    aboutme="Hey, I'm jack, I want to improve my resume with some cool new projects"},
                new() {id = 3, name = "Suf", bio="suf@gmail.com",
                    aboutme="Hello my Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.dsaadsdjddsklfjklfdaskjlfdasfddfkladsfkjfsdkjldfsklajfdslkfdjskldskdfljdfskjlfdjfdfdffdfdfffffff" }
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
