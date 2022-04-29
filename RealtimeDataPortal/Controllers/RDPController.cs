global using Microsoft.EntityFrameworkCore;
global using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealtimeDataPortal.Exceptions;
using RealtimeDataPortal.Models;
using RealtimeDataPortal.Models.DBClasses;
using RealtimeDataPortal.Models.OtherClasses;

namespace RealtimeDataPortal.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RDPController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RDPController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool CheckRoleUser (string role)
        {
            try
            {
                CurrentUser currentUser = JsonSerializer
                    .Deserialize<CurrentUser>(_httpContextAccessor.HttpContext?.Session.GetString("currentUser") ?? throw new Exception("NoGetUser"))
                    ?? new CurrentUser().GetCurrentUser();

                Dictionary<string, bool> roles = new Dictionary<string, bool>()
                {
                    { "IsFullView", currentUser.IsFullView },
                    { "IsConfigurator", currentUser.IsConfigurator },
                    { "IsAdministrator", currentUser.IsAdministrator },
                    { "IsConfiguratorRead", currentUser.IsConfiguratorRead }
                };

                return roles[role];
            }
            catch
            {
                return false;
            }
        }

        [Route("GetUser")]
        public Object GetUser()
        {
            try
            {
                new CurrentUser().GetCurrentUser();

                CurrentUser? currentUser = JsonSerializer.Deserialize<CurrentUser>(
                    _httpContextAccessor.HttpContext?.Session.GetString("currentUser") 
                    ?? throw new Exception("NoGetUser"));
                
                return currentUser;
            }
            catch(Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetMenu")]
        public Object GetMenu(TreesMenu treesMenu)
        {
            try
            {
                CurrentUser currentUser = JsonSerializer
                    .Deserialize<CurrentUser>(_httpContextAccessor.HttpContext?.Session.GetString("currentUser") ?? throw new Exception("NoGetUser")) 
                    ?? new CurrentUser().GetCurrentUser();

                if (!treesMenu.isFullView)
                {
                    treesMenu.isFullView = 
                        CheckRoleUser("IsFullView") || CheckRoleUser("IsConfigurator") 
                        || CheckRoleUser("IsAdministrator") || CheckRoleUser("IsConfiguratorRead");
                }

                return new TreesMenu().GetMenu(treesMenu.ParentId, currentUser.ADGroups, treesMenu.isFullView);
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetComponentInformation")]
        public Object GetComponentInformation(int id, string operation)
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                return new Configurator().GetComponentInformation(id, operation);
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("AddChangeElement")]
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
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

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

                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteElement")]
        public Object DeleteElement(int id)
        {
            // Удаление элементов таких как графики, таблицы РВ и тд.
            // Каждый элемент удаляется из дерева меню, удаляются доступы
            // Для каждого типа удаляются данные из зависимых таблиц

            try
            {
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                new Configurator().DeleteElement(id);

                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetTags")]
        public Object GetTags(string name, bool forMnemoscheme = false)
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                if (forMnemoscheme)
                    return new TagInfo().GetListTagsForMnemoscheme(name);

                return new TagInfo().GetTags(name);
            }
            catch(Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetAttributesForTag")]
        public Object GetAtrributesForTag()
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                return new
                {
                    Types = new TagsType().GetListTypesTag(null),
                    Servers = new Server().GetListServers(null)
                };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("AddChangeTag")]
        public Object AddChangeTag(Tag tag)
        {
            try
            {
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                return new { success = new Tag().AddChangeTag(tag) };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteTags")]
        public Object DeleteTags(int[] id)
        {
            try
            {
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                new Tag().DeleteTags(id);
                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetAttributesForProducts")]
        public Object GetAttributesForProducts()
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

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
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("AddChangeProduct")]
        public Object AddChangeProduct(List<QueryProduct> queryProduct)
        {
            try
            {
                if(!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                return new { success = new QueryProduct().AddChangeProduct(queryProduct) };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetListProducts")]
        public Object GetListProducts(string name)
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                return new QueryProduct().GetListProducts(name);
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetListProductsForDelete")]
        public Object GetListProductsForDelete(string name)
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                var listProducts = new QueryProduct().GetListProducts(name).GroupBy(p => p.ProductId);

                var listProductsUniq =
                    (from products in listProducts
                     select new
                     {
                         products.First().ProductId,
                         products.First().ProductName,
                         products.First().Position
                     }).ToList();

                return listProductsUniq;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteProducts")]
        public Object DeleteProducts(int[] id)
        {
            try
            {
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                new Products().DeleteProducts(id);
                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetAttributesForGraphic")]
        public Object GetAttributesForGraphic(int id)
        {
            try
            {
                CurrentUser currentUser = JsonSerializer
                    .Deserialize<CurrentUser>(_httpContextAccessor.HttpContext?.Session.GetString("currentUser") ?? throw new Exception("NoGetUser"))
                    ?? new CurrentUser().GetCurrentUser();

                List<Attributes> attributesGraphic = new Graphics().GetAttributesForGraphic(id, currentUser);

                return attributesGraphic;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetGraphic")]
        public Object GetGraphic(Query query)
        {
            try
            {
                var dataGraphics = new Query().GetGraphic(query);

                return dataGraphics;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetTableRealtime")]
        public Object GetTableRealtime(int id)
        {
            try
            {
                CurrentUser currentUser = JsonSerializer
                    .Deserialize<CurrentUser>(_httpContextAccessor.HttpContext?.Session.GetString("currentUser") ?? throw new Exception("NoGetUser"))
                    ?? new CurrentUser().GetCurrentUser();

                var tableRealtime = new rt_Tables().GetTableRealtime(id, currentUser);

                return tableRealtime;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetMnemoschemeImage")]
        public Object GetMnemoschemeImage(int id)
        {
            try
            {
                CurrentUser currentUser = JsonSerializer
                    .Deserialize<CurrentUser>(_httpContextAccessor.HttpContext?.Session.GetString("currentUser") ?? throw new Exception("NoGetUser"))
                    ?? new CurrentUser().GetCurrentUser();

                var mnemoscheme = new Mnemoscheme().GetMnemoschemeImage(id, currentUser);
                return mnemoscheme;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetMnemoschemeTagsValues")]
        public Object GetMnemoschemeTagsValues(int[] tagsId)
        {
            try
            {
                var listTags = new Mnemoscheme().GetMnemoschemeTagsValues(tagsId);
                return listTags;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetListParameterTypes")]
        public Object GetListParameterTypes(string name)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                return new ParameterType().GetListParameterTypes(name);
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("EditParameterType")]
        public Object EditParameterType(ParameterType parameter)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new ParameterType().EditParameterType(parameter);
                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteParameterTypes")]
        public Object DeleteParameterTypes(int[] ids)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new ParameterType().DeleteParameterTypes(ids);

                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetListServers")]
        public Object GetListServers(string name)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                var listServers = new Server().GetListServers(name);
                return listServers;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("EditServer")]
        public Object EditServer(Server server)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new Server().EditServer(server);
                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteServers")]
        public Object DeleteServers(int[] ids)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new Server().DeleteServers(ids);

                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetListTypesTag")]
        public Object GetListTypesTag(string name)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                var listTypesTag = new TagsType().GetListTypesTag(name);
                return listTypesTag;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("EditTypeTag")]
        public Object EditTypeTag(TagsType tagType)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new TagsType().EditTypeTag(tagType);
                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("DeleteTypesTag")]
        public Object DeleteTypesTag(int[] ids)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new TagsType().DeleteTypeTag(ids);
                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetAccessProfiles")]
        public Object GetAccessProfiles()
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                var accessProfiles = new AccessProfiles().GetAccessProfiles();
                return accessProfiles;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("EditAccessProfiles")]
        public Object EditAccessProfiles(List<AccessProfiles> accessProfiles)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new AccessProfiles().EditAccessProfiles(accessProfiles);
                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("SaveMnemoschemeTemplates")]
        public Object SaveMnemoschemeTemplates(MnemoschemeTemplates template)
        {
            try
            {
                if (!CheckRoleUser("IsAdministrator"))
                    throw new Exception("NotAccess");

                new MnemoschemeTemplates().SaveMnemoschemeTemplate(template);
                return new { new Messages().GetMessage("Saved").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("GetMnemoschemeTemplates")]
        public Object GetMnemoschemeTemplates(int id)
        {
            try
            {
                if (!(CheckRoleUser("IsConfigurator") || CheckRoleUser("IsConfiguratorRead")))
                    throw new Exception("NotAccess");

                List<MnemoschemeTemplates> templates = new MnemoschemeTemplates().GetTemplates(id);
                return templates;
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }

        [Route("RemoveMnemoschemeTemplates")]
        public Object RemoveMnemoschemeTemplates(int id)
        {
            try
            {
                if (!CheckRoleUser("IsConfigurator"))
                    throw new Exception("NotAccess");

                new MnemoschemeTemplates().DeleteMnemoschemeTemplate(id);

                return new { new Messages().GetMessage("Deleted").Message };
            }
            catch (Exception ex)
            {
                Messages error = new Messages().GetMessage(ex.Message);
                return StatusCode(error.StatusCode, new { error.Message });
            }
        }
    }
}