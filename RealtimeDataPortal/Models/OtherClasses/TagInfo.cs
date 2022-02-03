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
                List<TagInfo> tags = (from tag in rdp_base.Tag
                    join srv in rdp_base.Server on tag.ServerId equals srv.ServerId into servers
                    from server in servers.DefaultIfEmpty()
                    join pt in rdp_base.ParameterTag on tag.TagId equals pt.TagId into parameterTags
                    from parameterTag in parameterTags.DefaultIfEmpty()
                    join param in rdp_base.Parameter on parameterTag.ParameterId equals param.ParameterId into parameters
                    from parameter in parameters.DefaultIfEmpty()
                    where EF.Functions.Like(tag.TagName, $"%{name}%") || EF.Functions.Like(parameter.Position, $"%{name}%")
                    select new TagInfo()
                    {
                        TagId = tag.TagId,
                        TagName = tag.TagName,
                        TagTypeId = tag.TagTypeId,
                        ServerId = server.ServerId,
                        ServerName = server.ServerName
                    }).Distinct().Take(50).AsNoTracking().ToList();

                return tags;
            }
        }
    }
}
