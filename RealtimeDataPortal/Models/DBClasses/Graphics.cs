using Microsoft.EntityFrameworkCore;
using RealtimeDataPortal.Models.Exceptions;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Graphics
    {
        public int ComponentId { get; set; }
        public int ProductId { get; set; }
        [NotMapped]
        public string Name { get; set; } = string.Empty;

        public List<Attributes> GetAttributesForGraphic(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            using (RDPContext rdp_base = new RDPContext())
            {
                List<Attributes> attributes = (from product in rdp_base.Products
                                               join parameter in rdp_base.Parameter 
                                                    on product.ProductId equals parameter.ProductId into parameters
                                               from parameter in parameters.DefaultIfEmpty()
                                               join parameterType in rdp_base.ParameterType
                                                    on parameter.ParameterTypeId equals parameterType.ParameterTypeId into parameterTypes
                                               from parameterType in parameterTypes.DefaultIfEmpty()
                                               join parameterTag in rdp_base.ParameterTag
                                                    on parameter.ParameterId equals parameterTag.ParameterId into parameterTags
                                               from parameterTag in parameterTags.DefaultIfEmpty()
                                               join tag in rdp_base.Tag
                                                    on parameterTag.TagId equals tag.TagId into tags
                                               from tag in tags.DefaultIfEmpty()
                                               join tagsType in rdp_base.TagsType
                                                    on tag.TagTypeId equals tagsType.TagTypeId into tagsTypes
                                               from tagsType in tagsTypes.DefaultIfEmpty()
                                               join server in rdp_base.Server
                                                    on tag.ServerId equals server.ServerId into servers
                                               from server in servers.DefaultIfEmpty()
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
                                                       $";User Id={server.UserName};Password={server.Password}"
                                               }).ToList();




                    //from trees in rdp_base.TreesMenu
                    //join graphics in rdp_base.Graphics on trees.ComponentId equals graphics.ComponentId into grp
                    //from graphic in grp.DefaultIfEmpty()
                    //join prd in rdp_base.Products on trees.ComponentId equals prd.ProductId into products
                    //from product in products.DefaultIfEmpty()
                    //join param in rdp_base.Parameter on product.ProductId equals param.ProductId into parameters
                    //from parameter in parameters.DefaultIfEmpty()
                    //join ptype in rdp_base.ParameterType on parameter.ParameterTypeId equals ptype.ParameterTypeId into parameterTypes
                    //from parameterType in parameterTypes.DefaultIfEmpty()
                    //join pt in rdp_base.ParameterTag on parameter.ParameterId equals pt.ParameterId into parameterTags
                    //from parameterTag in parameterTags.DefaultIfEmpty()
                    //join tg in rdp_base.Tag on parameterTag.TagId equals tg.TagId into tags
                    //from tag in tags.DefaultIfEmpty()
                    //join tt in rdp_base.TagsType on tag.TagTypeId equals tt.TagTypeId into tagsType
                    //from tagType in tagsType.DefaultIfEmpty()
                    //join srvr in rdp_base.Server on tag.ServerId equals srvr.ServerId into servers
                    //from server in servers.DefaultIfEmpty()

                                               //where trees.Type == "graphic" && product.ProductId == id
                                               //select new Attributes()
                                               //{
                                               //    ComponentId = trees.ComponentId,
                                               //    Name = trees.Name,
                                               //    Position = parameter.Position,
                                               //    Round = parameter.Round,
                                               //    NameParameter = parameterType.ParameterTypeName,
                                               //    TagId = parameterTag.TagId,
                                               //    TagName = tag.TagName,
                                               //    TypeName = tagType.TypeName,
                                               //    WwResolution = tagType.WwResolution,
                                               //    Calendar = tagType.Calendar,
                                               //    VisibleToGraphic = tagType.VisibleToGraphic,
                                               //    Color = parameterType.Color,
                                               //    ServerConnection = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                                               //        $";User Id={server.UserName};Password={server.Password}"
                                               //}).ToList();

                if (attributes.Count == 0) throw new NotFoundException("Страница не найдена.");

                return attributes;
            }
        }
    }
}