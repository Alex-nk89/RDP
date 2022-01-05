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
        public Object GetUser()
        {
            return user;
        }

        [HttpGet("GetMenu")]
        public Object GetMenu(int parentId, bool isFullView)
        {
            TreesMenu menuList = new TreesMenu();

            if (!isFullView)
                isFullView = user.isFullView; // || user.isConfigurator || user.isAdministrator;

            return menuList.GetMenu(parentId, isFullView);
        }
        
    }
}