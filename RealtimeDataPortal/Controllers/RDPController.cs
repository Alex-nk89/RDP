using Microsoft.AspNetCore.Mvc;
using RealtimeDataPortal.Models;
using RealtimeDataPortal.Models.Exceptions;

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

        [HttpPost("GetMenu")]
        public Object GetMenu(TreesMenu treesMenu)
        {
            TreesMenu menuList = new TreesMenu();

            if (!treesMenu.isFullView)
                treesMenu.isFullView = user.isFullView; // || user.isConfigurator || user.isAdministrator;

            return menuList.GetMenu(treesMenu.IdParent, user.Groups, treesMenu.isFullView);
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
            catch(NotFoundException ex)
            {
                return StatusCode(404, new { Message = ex.Message });
            }
            catch(ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = "Не удалось получить данные о странице. Попробуйте " +
                    "перезапустить приложение." });
            }
        }
    }
}