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
            try
            {
                return user;
            }
            catch
            {
                return StatusCode(401, new { Message = "Не удалось получить данные о пользователе. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpGet("GetMenu")]
        public Object GetMenu(int parentId, bool isFullView)
        {
            TreesMenu menuList = new TreesMenu();

            if (!isFullView)
                isFullView = user.isFullView; // || user.isConfigurator || user.isAdministrator;

            return menuList.GetMenu(parentId, isFullView);
        }

        [HttpGet("GetLink")]
        public Object GetLink (int id)
        {
            try
            {
                ExternalPages externalPages = new ExternalPages();
                var link = externalPages.GetLink(id);

                return link;
            }
            catch
            {
                return StatusCode(500, new { Message = "Не удалось получить данные о странице. Попробуйте " +
                    "перезапустить приложение." });
            }
        }
    }
}