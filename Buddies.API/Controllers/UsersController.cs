using Microsoft.AspNetCore.Mvc;

namespace Buddies.API.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpPost("[action]")]
        public void Register()
        {
            Ok();
        }
    }
}