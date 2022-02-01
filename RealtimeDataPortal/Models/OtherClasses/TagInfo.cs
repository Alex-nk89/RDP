using Microsoft.EntityFrameworkCore;

namespace RealtimeDataPortal.Models.OtherClasses
{
    public class TagInfo
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public int TagParameterId { get; set; }
        public int ServerId { get; set; }
        public string ServerName { get; set; } = String.Empty;

        public List<TagInfo> GetTags(string name)
        {
            using (RDPContext rdp_base = new())
            {
                List<TagInfo> tags = (from tag in rdp_base.Tags
                    join srv in rdp_base.Server on tag.ServerId equals srv.ServerId into servers
                    from server in servers.DefaultIfEmpty()
                    join ppg in rdp_base.ProductParameterGroups on tag.TagId equals ppg.TagId into productParameterGroups
                    from productParameterGroup in productParameterGroups.DefaultIfEmpty()
                    join pp in rdp_base.ProductsParameters on productParameterGroup.ProductParameterId equals pp.ProductsParametersId into productParameters
                    from productParameter in productParameters.DefaultIfEmpty()
                    where EF.Functions.Like(tag.TagName, $"%{name}%") || EF.Functions.Like(productParameter.Position, $"%{name}%")
                    select new TagInfo()
                    {
                        TagId = tag.TagId,
                        TagName = tag.TagName,
                        TagTypeId = tag.TagTypeId,
                        TagParameterId = tag.TagParameterId,
                        ServerId = server.ServerId,
                        ServerName = server.ServerName
                    }).Distinct().AsNoTracking().ToList();

                return tags;
            }
        }
    }
}
