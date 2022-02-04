using Microsoft.AspNetCore.Mvc;
using RealtimeDataPortal.Models;
using RealtimeDataPortal.Models.Exceptions;
using RealtimeDataPortal.Models.OtherClasses;

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

            return menuList.GetMenu(treesMenu.ParentId, user.Groups, treesMenu.isFullView);
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
        public Object GetComponentInformation (int id, string operation)
        {
            try
            {
                if (!user.isConfigurator)
                    throw new ForbiddenException("Нет доступа к конфигуратору");

                return new Configurator().GetComponentInformation(id, operation);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch (NotFoundException ex)
            {
                return StatusCode(404, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = "Не удалось получить данные о компоненте. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpPost("AddChangeElement")]
        public Object AddChangeElement(Configurator configurator)
        {
            AccessToComponent accessToComponent = new();

            (int id, _, _, string type, _, string[] adGroups, string[] adGroupsOld, _) = configurator;

            try
            {
                if (type == "external-page")
                    configurator.TreesMenu.ComponentId = configurator.AddChangeNewLink(configurator.ExternalPages);

                id = configurator.AddNewComponent(configurator.TreesMenu);

                string[] addedAccesses = adGroups.Except(adGroupsOld).ToArray();

                foreach (var addedAccess in addedAccesses)
                {
                    accessToComponent.AddAccessToComponent(id, 0, addedAccess);
                }

                string[] deletedAccesses = adGroupsOld.Except(adGroups).ToArray();

                foreach (var deletedAccess in deletedAccesses)
                {
                    accessToComponent.DeleteAccessToComponent(id, 0, deletedAccess);
                }

                return new { Message = "Изменения успешно внесены" };
            }
            catch (Exception ex)
            {
                string error = ex.Message;

                return StatusCode(500, new { Message = "Не удалось внести изменения. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpGet("DeleteElement")]
        public Object DeleteElement(int id)
        {
            try
            {
                if (!user.isConfigurator)
                    throw new ForbiddenException("Нет доступа к конфигуратору. Изменения не были внесены");
        
                new Configurator().DeleteElement(id);
        
                return new { Message = "Компонент удален" };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = "При удалении произошла ошибка. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpGet("GetTags")]
        public Object GetTags(string name)
        {
            try
            {
                return new TagInfo().GetTags(name);
            }
            catch
            {
                return StatusCode(500, new { Message = "При попытке получить данные с сервера произошла ошибка." });
            }
        }

        [HttpGet("GetAttributesForTag")]
        public Object GetAtrributesForTag()
        {
            try
            {
                return new
                {
                    Types = new TagsType().GetTagsTypes(),
                    Servers = new Server().GetServers()
                };
            }
            catch
            {
                return StatusCode(500, new { Message = "При попытке получить данные с сервера произошла ошибка." });
            }
        }

        [HttpPost("AddChangeTag")]
        public Object AddChangeTag(Tag tag)
        {
            try
            {
                return new Tag().AddChangeTag(tag);
            }
            catch
            {
                return StatusCode(500, new { Message = "При сохранении данных произошла ошибка." });
            }
        }

        [HttpPost("DeleteTags")]
        public Object DeleteTags (int[] id)
        {
            try
            {
                return new Tag().DeleteTags(id);
            }
            catch
            {
                return StatusCode(500, new { Message = "При удалении данных произошла ошибка." });
            }
        }

        [HttpGet("GetParameterTypes")]
        public Object GetParameterTypes()
        {
            try
            {
                return new ParameterType().GetParameterTypes();
            }
            catch
            {
                return StatusCode(500, new { Message = "При удалении данных произошла ошибка." });
            }
        }

        [HttpPost("AddChangeProduct")]
        public Object AddChangeProduct (List<QueryProduct> queryProduct)
        {
            try
            {
                return new QueryProduct().AddChangeProduct(queryProduct);
            }
            catch
            {
                return StatusCode(500, new { Message = "При сохранении данных произошла ошибка." });
            }
        }

        [HttpGet("GetAttributesForGraphic")]
        public Object GetAttributesForGraphic(int id)
        {
            try
            {
                List<Attributes> attributesGraphic = new Graphics().GetAttributesForGraphic(id, user);

                return attributesGraphic;
            }
            catch(NotFoundException ex)
            {
                return StatusCode(404, new { Message = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = "При загрузке данных произошла ошибка. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpPost("GetGraphic")]
        public Object GetGraphic (Query query)
        {
            try
            {
                var dataGraphics = new Query().GetGraphic(query, user);

                return dataGraphics;
            }
            catch
            {
                return StatusCode(500, new { Message = "При загрузке данных произошла ошибка. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

        [HttpGet("GetTableRealtime")]
        public Object GetTableRealtime(int id)
        {
            try
            {
                var tableRealtime = new rt_Tables().GetTableRealtime(id, user);

                return tableRealtime;
            }
            catch (NotFoundException ex)
            {
                return StatusCode(404, new { Message = ex.Message });
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = "При загрузке данных произошла ошибка. Попробуйте " +
                    "перезапустить приложение." });
            }
        }

    }
}