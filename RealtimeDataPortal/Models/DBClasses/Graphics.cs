using Microsoft.EntityFrameworkCore;
using RealtimeDataPortal.Models.OtherClasses;
using RealtimeDataPortal.Models.DBClasses;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Graphics
    {
        public int ComponentId { get; set; }
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;

        public List<Attributes> GetAttributesForGraphic(int id, CurrentUser currentUser)
        {
            // Из-за того что со страницы с графиками приходит productId, а не id компонента, требуется иной тип проверки
            // Для этого получаем все графики с таким productId и проверяем каждый из них
            //CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();
            //bool checkResult = false;

            using RDPContext rdpBase = new();

            //int[] componentsId = GetComponentIdsContainsProduct(id);

            //foreach(int componentId in componentsId)
            //{
            //    if (check.GetAccess(componentId, currentUser)) checkResult = true;
            //}

            if (!CheckAccessToProduct(id, currentUser))
                throw new Exception("NotAccessForView");

            List<Attributes> attributes =
                (from product in rdpBase.Products
                 join parameter in rdpBase.Parameter
                      on product.ProductId equals parameter.ProductId into parameters
                 from parameter in parameters.DefaultIfEmpty()
                 join parameterType in rdpBase.ParameterType
                      on parameter.ParameterTypeId equals parameterType.ParameterTypeId into parameterTypes
                 from parameterType in parameterTypes.DefaultIfEmpty()
                 join parameterTag in rdpBase.ParameterTag
                      on parameter.ParameterId equals parameterTag.ParameterId into parameterTags
                 from parameterTag in parameterTags.DefaultIfEmpty()
                 join tag in rdpBase.Tag
                      on parameterTag.TagId equals tag.TagId into tags
                 from tag in tags.DefaultIfEmpty()
                 join tagsType in rdpBase.TagsType
                      on tag.TagTypeId equals tagsType.TagTypeId into tagsTypes
                 from tagsType in tagsTypes.DefaultIfEmpty()
                 join server in rdpBase.Server
                      on tag.ServerId equals server.ServerId into servers
                 from server in servers.DefaultIfEmpty()
                 orderby tagsType.TagTypeId
                 where product.ProductId == id
                 select new Attributes()
                 {
                     ComponentId = product.ProductId,
                     Name = product.ProductName,
                     Position = parameter.Position,
                     Round = parameter.Round,
                     NameParameter = parameterType.ParameterTypeName,
                     TagId = parameterTag.TagId,
                     TagName = tag.TagName,
                     TypeName = tagsType.TypeName,
                     WwResolution = tagsType.WwResolution,
                     Calendar = tagsType.Calendar,
                     VisibleToGraphic = tagsType.VisibleToGraphic,
                     Color = parameterType.Color,
                     ServerConnection = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                         $";User Id={server.UserName};Password={server.Password}",
                     IsDateOffset = server.IsDateOffset
                 })
                                           .ToList();

            if (attributes.Count == 0) throw new Exception("PageNotFound");

            return attributes;
        }

        public Graphics GetGraphicsInfo(int componentId)
        {
            using RDPContext rdp_base = new();

            Graphics graphicsInfo =
                (from treesMenu in rdp_base.TreesMenu
                 join product in rdp_base.Products
                    on treesMenu.ComponentId equals product.ProductId into products
                 from product in products.DefaultIfEmpty()
                 join parameter in rdp_base.Parameter
                    on product.ProductId equals parameter.ProductId into parameters
                 from parameter in parameters.DefaultIfEmpty()
                 where treesMenu.ComponentId == componentId
                 select new Graphics()
                 {
                     ComponentId = treesMenu.ComponentId,
                     ProductId = product.ProductId,
                     Name = product.ProductName,
                     Position = parameter.Position
                 })
                 .First();

            return graphicsInfo;
        }

        public bool CheckAccessToProduct(int productId, CurrentUser currentUser)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();
            using RDPContext rdpBase = new();

            var graphicIdsContainsProduct =
                (from treesMenu in rdpBase.TreesMenu
                 where treesMenu.ComponentId == productId && treesMenu.Type == "graphic"
                 select treesMenu.Id)
                 .Distinct()
                 .ToArray();

            foreach (int componentId in graphicIdsContainsProduct)
            {
                if (check.GetAccess(componentId, currentUser)) return true;
            }

            var tableRTIdsContainsProduct =
                (from treesMenu in rdpBase.TreesMenu
                 join tableRT in rdpBase.rt_Tables
                    on treesMenu.ComponentId equals tableRT.TableId
                 join section in rdpBase.rt_Sections
                    on tableRT.TableId equals section.TableId
                 join sectionProduct in rdpBase.rt_SectionProduct
                    on section.SectionId equals sectionProduct.SectionId
                 where sectionProduct.ProductId == productId
                 select treesMenu.Id)
                 .Distinct()
                 .ToArray();

            foreach (int componentId in tableRTIdsContainsProduct)
            {
                if (check.GetAccess(componentId, currentUser)) return true;
            }

            var customTableIdsContainsProduct =
                (from treesMenu in rdpBase.TreesMenu
                 join customTable in rdpBase.CustomTable
                    on treesMenu.ComponentId equals customTable.ComponentId
                 join customTableRows in rdpBase.CustomTableRows
                    on customTable.CustomTableId equals customTableRows.CustomTableId
                 join customTableCells in rdpBase.CustomTableCells
                    on customTableRows.RowId equals customTableCells.RowId
                 where customTableCells.CellContain.Contains($"\"productId\":{productId}") && treesMenu.Type == "customtable"
                 select treesMenu.Id)
                 .Distinct()
                 .ToArray();

            foreach (int componentId in customTableIdsContainsProduct)
            {
                if (check.GetAccess(componentId, currentUser)) return true;
            }

            var mnemoschemeIdsContainsProduct =
                (from mnemoscheme in rdpBase.Mnemoscheme
                 join treesMenu in rdpBase.TreesMenu
                    on mnemoscheme.MnemoschemeId equals treesMenu.ComponentId
                 where mnemoscheme.MnemoschemeContain.Contains($"\"productId\":{productId}")
                 select treesMenu.Id)
                 .Distinct()
                 .ToArray();

            foreach (int componentId in mnemoschemeIdsContainsProduct)
            {
                if (check.GetAccess(componentId, currentUser)) return true;
            }

            return false;
        }
    }
}