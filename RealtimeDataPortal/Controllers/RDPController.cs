global using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using RealtimeDataPortal.Exceptions;
using RealtimeDataPortal.Models;
using RealtimeDataPortal.Models.DBClasses;
using RealtimeDataPortal.Models.Exceptions;
using RealtimeDataPortal.Models.OtherClasses;

namespace RealtimeDataPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RDPController : ControllerBase
    {
        static readonly ListMessagesError listMessagesError = new();

        private readonly IHttpContextAccessor _httpContextAccessor;

        public RDPController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        
        static User user;

        [HttpGet("GetUser")]
        public Object GetUser()
        {
            try
            {
                string? userName = _httpContextAccessor.HttpContext.User.Identity.Name;
                user = new User("NagaytsevAE");
                return user;
            }
            catch
            {
                return StatusCode(401, new
                {
                    Message = "Не удалось получить данные о пользователе. Попробуйте " +
                    "перезапустить приложение."
                });
            }
        }

        [HttpPost("GetMenu")]
        public Object GetMenu(TreesMenu treesMenu)
        {
            try
            {
                TreesMenu menuList = new TreesMenu();

                if (!treesMenu.isFullView)
                    treesMenu.isFullView = user.IsFullView || user.IsConfigurator || user.IsAdministrator;

                return menuList.GetMenu(treesMenu.ParentId, user.Groups, treesMenu.isFullView);
            }
            catch
            {
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }

        }

        [HttpGet("GetLink")]
        public Object GetLink(int id)
        {
            try
            {
                ExternalPages externalPages = new ExternalPages();
                var link = externalPages.GetLink(id, user);

                return link;
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
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }
        }

        [HttpGet("GetComponentInformation")]
        public Object GetComponentInformation(int id, string operation)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

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
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }
        }

        [HttpPost("AddChangeElement")]
        public Object AddChangeElement(Configurator configurator)
        {
            // Добавлениие/редактирование элементов таких как графики, таблицы РВ, папки и т.д.
            // Для всех элементов происходит добавление из дерева, добавление доступов
            // Для каждого типа элемента происходит добавление данныз в зависимые таблицы

            AccessToComponent accessToComponent = new();

            (int id, _, _, string type, _, string[] adGroups, string[] adGroupsOld, _) = configurator;
            int? idChildren = type == "folder" ? 0 : null;

            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                if (type == "externalPage")
                {
                    configurator.TreesMenu.ComponentId = configurator.AddChangeNewLink(configurator.ExternalPages);
                }
                else if (type == "graphic")
                {
                    configurator.TreesMenu.ComponentId = configurator.Graphics.ProductId;
                }
                else if (type == "table")
                {
                    configurator.TreesMenu.ComponentId = new rt_Tables().AddChangeRTTable(configurator.Table);
                    new rt_Sections().AddChangeSections(configurator.TableSections, configurator.Table.TableId, configurator.SectionProducts);
                }
                else if (type == "mnemoscheme")
                {
                    configurator.TreesMenu.ComponentId = new Mnemoscheme().EditMnemoscheme(configurator.Mnemoscheme);
                }

                id = configurator.AddNewComponent(configurator.TreesMenu);

                string[] addedAccesses = adGroups.Except(adGroupsOld).ToArray();

                foreach (var addedAccess in addedAccesses)
                {
                    accessToComponent.AddAccessToComponent(id, idChildren, addedAccess);
                }

                string[] deletedAccesses = adGroupsOld.Except(adGroups).ToArray();

                foreach (var deletedAccess in deletedAccesses)
                {
                    accessToComponent.DeleteAccessToComponent(id, idChildren, deletedAccess);
                }

                return new { Message = listMessagesError.Saved };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                string error = ex.Message;

                return StatusCode(500, new
                {
                    Message = listMessagesError.NotSaved
                });
            }
        }

        [HttpGet("DeleteElement")]
        public Object DeleteElement(int id)
        {
            // Удаление элементов таких как графики, таблицы РВ и тд.
            // Каждый элемент удаляется из дерева меню, удаляются доступы
            // Для каждого типа удаляются данные из зависимых таблиц

            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new Configurator().DeleteElement(id);

                return new { Message = listMessagesError.Deleted };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotDeleted
                });
            }
        }

        [HttpGet("GetTags")]
        public Object GetTags(string name)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new TagInfo().GetTags(name);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpGet("GetAttributesForTag")]
        public Object GetAtrributesForTag()
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new
                {
                    Types = new TagsType().GetListTypesTag(null),
                    Servers = new Server().GetListServers(null)
                };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("AddChangeTag")]
        public Object AddChangeTag(Tag tag)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new { success = new Tag().AddChangeTag(tag) };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotSaved });
            }
        }

        [HttpPost("DeleteTags")]
        public Object DeleteTags(int[] id)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new Tag().DeleteTags(id);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

        [HttpGet("GetAttributesForProducts")]
        public Object GetAttributesForProducts()
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                using (RDPContext rdp_base = new())
                {
                    List<ParameterType> parameterTypes = new ParameterType().GetListParameterTypes(null);
                    int maxParameterId = new Parameter().GetMaxParameterId(rdp_base);
                    int maxParameterTagId = new ParameterTag().GetMaxParameterTagId(rdp_base);

                    return new
                    {
                        parameterTypes,
                        maxParameterId,
                        maxParameterTagId
                    };
                }
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("AddChangeProduct")]
        public Object AddChangeProduct(List<QueryProduct> queryProduct)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new { success = new QueryProduct().AddChangeProduct(queryProduct) };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotSaved });
            }
        }

        [HttpGet("GetListProducts")]
        public Object GetListProducts(string name)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new QueryProduct().GetListProducts(name);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpGet("GetListProductsForDelete")]
        public Object GetListProductsForDelete(string name)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new Products().GetListProducts(name).ToList();
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("DeleteProducts")]
        public Object DeleteProducts(int[] id)
        {
            try
            {
                if (!user.IsConfigurator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new { success = new Products().DeleteProducts(id) };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
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
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }
        }

        [HttpPost("GetGraphic")]
        public Object GetGraphic(Query query)
        {
            try
            {
                var dataGraphics = new Query().GetGraphic(query, user);

                return dataGraphics;
            }
            catch
            {
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
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
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }
        }

        [HttpGet("GetMnemoscheme")]
        public Object GetMnemoscheme (int id)
        {
            try
            {
                var mnemoscheme = new Mnemoscheme().GetMnemoscheme(id, user);
                return mnemoscheme;
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
                return StatusCode(500, new
                {
                    Message = listMessagesError.NotGetData
                });
            }
        }

        [HttpGet("GetListParameterTypes")]
        public Object GetListParameterTypes(string name)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                return new ParameterType().GetListParameterTypes(name);
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("EditParameterType")]
        public Object EditParameterType(ParameterType parameter)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new ParameterType().EditParameterType(parameter);
                return new { Success = listMessagesError.Saved };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { Message = ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotSaved });
            }
        }

        [HttpPost("DeleteParameterTypes")]
        public Object DeleteParameterTypes(int[] ids)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new ParameterType().DeleteParameterTypes(ids);

                return new { Success = listMessagesError.Deleted };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

        [HttpGet("GetListServers")]
        public Object GetListServers(string name)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                var listServers = new Server().GetListServers(name);
                return listServers;
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("EditServer")]
        public Object EditServer(Server server)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);
                    
                new Server().EditServer(server);
                return new { Success = listMessagesError.Saved };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotSaved });
            }
        }

        [HttpPost("DeleteServers")]
        public Object DeleteServers(int[] ids)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new Server().DeleteServers(ids);

                return new { Success = listMessagesError.Deleted };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

        [HttpGet("GetListTypesTag")]
        public Object GetListTypesTag(string name)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                var listTypesTag = new TagsType().GetListTypesTag(name);
                return listTypesTag;
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotGetData });
            }
        }

        [HttpPost("EditTypeTag")]
        public Object EditTypeTag(TagsType tagType)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new Exception(listMessagesError.NotAccess);

                new TagsType().EditTypeTag(tagType);
                return new { Success = listMessagesError.Saved };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotSaved });
            }
        }

        [HttpPost("DeleteTypesTag")]
        public Object DeleteTypesTag(int[] ids)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new TagsType().DeleteTypeTag(ids);
                return new { Success = listMessagesError.Deleted };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

        [HttpGet("GetAccessProfiles")]
        public Object GetAccessProfiles()
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                var accessProfiles = new AccessProfiles().GetAccessProfiles();
                return accessProfiles;
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

        [HttpPost("EditAccessProfiles")]
        public Object EditAccessProfiles(List<AccessProfiles> accessProfiles)
        {
            try
            {
                if (!user.IsAdministrator)
                    throw new ForbiddenException(listMessagesError.NotAccess);

                new AccessProfiles().EditAccessProfiles(accessProfiles);
                return new { Success = listMessagesError.Saved };
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(403, new { ex.Message });
            }
            catch
            {
                return StatusCode(500, new { Message = listMessagesError.NotDeleted });
            }
        }

    }
}