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
                treesMenu.isFullView = user.isFullView || user.isConfigurator || user.isAdministrator;

            return menuList.GetMenu(treesMenu.IdParent, user.Groups, treesMenu.isFullView);
        }

        [HttpGet("GetLink")]
        public Object GetLink (int id)
        {
            try
            {
                ExternalPages externalPages = new ExternalPages();
                var link = externalPages.GetLink(id, user);

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

        [HttpGet("GetComponentInformation")]
        public Object GetComponentInformation (int id)
        {
            try
            {
                return new TreesMenu().GetComponentInformation(id);
            }
            catch
            {
                return StatusCode(500, new { Message = "Не удалось получить данные о компоненте. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpPost("AddChangeFolder")]
        public Object AddChangeFolder(TreesMenu treesMenu)
        {
            AccessToComponent accessToComponent = new AccessToComponent();
            (int id, string Name, int idParent, string type, int idComponent, string[] adGroups, string[] adGroupsOld) = treesMenu;

            try
            {
                id = treesMenu.AddNewComponent(treesMenu);

                string[] addedAccesses =  adGroups.Except(adGroupsOld).ToArray();

                foreach(var addedAccess in addedAccesses)
                {
                    accessToComponent.AddAccessToComponent(id, 0, addedAccess);
                }

                string[] deletedAccesses = adGroupsOld.Except(adGroups).ToArray();

                foreach(var deletedAccess in deletedAccesses)
                {
                    accessToComponent.DeleteAccessToComponent(id, 0, deletedAccess);
                }

                return new { Message = "Изменения успешно внесены" };
            }
            catch(Exception ex)
            {
                string error = ex.Message;

                return StatusCode(500, new { Message = "Не удалось внести изменения. Попробуйте " +
                    "перезапустить приложение." });
            }
        }
    }
}