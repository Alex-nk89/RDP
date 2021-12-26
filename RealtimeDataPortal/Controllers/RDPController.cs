using Microsoft.AspNetCore.Mvc;
using RealtimeDataPortal.Models;

namespace RealtimeDataPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RDPController : ControllerBase
    {
        static User user = new User();

        [HttpGet("GetUser")]
        public User GetUser ()
        {
            user.GetUser();
            return user;
        }
    }
}