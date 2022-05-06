using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class ExternalPages
    {
        public int Id { get; set; }
        public string Link { get; set; } = string.Empty;

        public ExternalPages GetExternalPageInfo(int componentId)
        {
            using RDPContext rdp_base = new();

            ExternalPages externalPageInfo =
                (from externalPage in rdp_base.ExternalPages
                 where externalPage.Id == componentId
                 select externalPage)
                 .First();

            return externalPageInfo;
        }
    }
}