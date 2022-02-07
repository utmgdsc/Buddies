using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        [HttpPost]
        [Authorize]
        public ActionResult Post()
        {
            // this will be necessary for the profile user story, used to test auth for now
            return Ok();
        }
    }
}