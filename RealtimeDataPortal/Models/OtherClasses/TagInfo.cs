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
            using (RDPContext rdp_base = new())
            {
                var listTags = 
                    (from product in rdp_base.Products
                     join parameter in rdp_base.Parameter
                        on product.ProductId equals parameter.ProductId
                     join parameterTag in rdp_base.ParameterTag
                        on parameter.ParameterId equals parameterTag.ParameterId
                     join tag in rdp_base.Tag
                        on parameterTag.TagId equals tag.TagId
                     join parameterType in rdp_base.ParameterType
                        on parameter.ParameterTypeId equals parameterType.ParameterTypeId
                     where EF.Functions.Like(tag.TagName, $"%{name}%")
                      || EF.Functions.Like(parameter.Position, $"%{name}%")
                     select new {
                         TagId = tag.TagId,
                         TagName = tag.TagName,
                         ProductId = product.ProductId,
                         ProductName = $"{product.ProductName} ({parameter.Position})",
                         Round = parameter.Round,
                         Color = parameterType.Color
                     })
                     .AsNoTracking()
                     .Distinct()
                     .ToList();
                    
                return listTags;
            }
        }
    }
}
