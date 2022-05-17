using Microsoft.EntityFrameworkCore;

namespace RealtimeDataPortal.Models.OtherClasses
{
    public class TagInfo
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public int ServerId { get; set; }
        public string ServerName { get; set; } = String.Empty;

        public class FindedTag
        {
            public int TagId { get; set; }
            public string TagName { get; set; } = string.Empty;
            public int ProductId { get; set; }
            public string ProductName { get; set; } = string.Empty;
            public string Position { get; set; } = string.Empty;
            public int Round { get; set; }
            public string Color { get; set; } = string.Empty;

        }

        public List<TagInfo> GetTags(string name)
        {
            using (RDPContext rdp_base = new())
            {
                List<TagInfo> tags =
                    (from tag in rdp_base.Tag
                     join server in rdp_base.Server
                        on tag.ServerId equals server.ServerId into servers
                     from server in servers.DefaultIfEmpty()
                     join parameterTag in rdp_base.ParameterTag
                        on tag.TagId equals parameterTag.TagId into parameterTags
                     from parameterTag in parameterTags.DefaultIfEmpty()
                     join parameter in rdp_base.Parameter
                        on parameterTag.ParameterId equals parameter.ParameterId into parameters
                     from parameter in parameters.DefaultIfEmpty()
                     where EF.Functions.Like(tag.TagName, $"%{name}%")
                     || EF.Functions.Like(parameter.Position, $"%{name}%")
                     select new TagInfo()
                     {
                         TagId = tag.TagId,
                         TagName = tag.TagName,
                         TagTypeId = tag.TagTypeId,
                         ServerId = server.ServerId,
                         ServerName = server.ServerName
                     })
                     .Distinct()
                     .Take(50)
                     .AsNoTracking()
                     .ToList();

                return tags;
            }
        }

        public Object GetListTagsForMnemoscheme(string name)
        {
            using RDPContext rdpBase = new();

            IQueryable<FindedTag> listFindedTags =
                (from product in rdpBase.Products
                 join parameter in rdpBase.Parameter
                    on product.ProductId equals parameter.ProductId
                 join parameterTag in rdpBase.ParameterTag
                    on parameter.ParameterId equals parameterTag.ParameterId
                 join tag in rdpBase.Tag
                    on parameterTag.TagId equals tag.TagId
                 join parameterType in rdpBase.ParameterType
                    on parameter.ParameterTypeId equals parameterType.ParameterTypeId
                 select new FindedTag()
                 {
                     TagId = tag.TagId,
                     TagName = tag.TagName,
                     ProductId = product.ProductId,
                     ProductName = product.ProductName,
                     Position = parameter.Position,
                     Round = parameter.Round,
                     Color = parameterType.Color
                 });

            var listFindedTagsByTagName = listFindedTags
                .Where(t => t.TagName.Contains(name))
                .AsNoTracking()
                .ToList();

            var listFindedTagsByPosition = listFindedTags
                .Where(t => t.Position.Contains(name))
                .AsNoTracking()
                .ToList();

            return listFindedTagsByTagName
                        .Union(listFindedTagsByPosition)
                        .Distinct()
                        .OrderBy(t => t.ProductName)
                        .ToList();
        }
    }
}
