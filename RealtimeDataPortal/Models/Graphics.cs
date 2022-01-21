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

        public List<AttributesGraphics> GetAttributesForGraphic(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            using (RDPContext rdp_base = new RDPContext())
            {
                List<AttributesGraphics> attributes = (from trees in rdp_base.TreesMenu
                    join graphics in rdp_base.Graphics on trees.ComponentId equals graphics.ComponentId into grp
                    from graphic in grp.DefaultIfEmpty()
                    join prd in rdp_base.Products on graphic.ProductId equals prd.ProductId into products
                    from product in products.DefaultIfEmpty()
                    join prprm in rdp_base.ProductsParameters on product.ProductId equals prprm.ProductId into productPrm
                    from productParameter in productPrm.DefaultIfEmpty()
                    join ppg in rdp_base.ProductParameterGroups on productParameter.ProductsParametersId equals ppg.ProductParameterId into parameterGroups
                    from parameterGroup in parameterGroups.DefaultIfEmpty()
                    join tgs in rdp_base.Tags on parameterGroup.TagId equals tgs.TagId into tags
                    from tag in tags.DefaultIfEmpty()
                    join tt in rdp_base.TagsType on tag.TagTypeId equals tt.TagTypeId into tagsType
                    from tagType in tagsType.DefaultIfEmpty()
                    join srvr in rdp_base.Server on tag.ServerId equals srvr.ServerId into servers
                    from server in servers.DefaultIfEmpty()
                    where trees.Type == "graphic" && trees.ComponentId == id
                    select new AttributesGraphics()
                    {
                        ComponentId = trees.ComponentId,
                        Name = trees.Name,
                        Position = product.Position,
                        Round = product.Round,
                        NameParameter = productParameter.NameParameter,
                        TagId = parameterGroup.TagId,
                        TagName = tag.TagName,
                        TypeName = tagType.TypeName,
                        WwResolution = tagType.WwResolution,
                        Calendar = tagType.Calendar,
                        VisibleToGraphic = tagType.VisibleToGraphic,
                        ServerConnection = $"Provider=SQLOLEDB;Server={server.ServerName};Database={server.Database};" +
                            $";User Id={server.UserName};Password={server.Password}"
                    }).ToList();

                if (attributes.Count == 0) throw new NotFoundException("Страница не найдена.");

                return attributes;
            }
        }
    }
}