using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Tags
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public int TagParameterId { get; set; }
        public int ServerId { get; set; }

        public bool AddChangeTag (Tags tag)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.Tags.Update(tag);
                rdp_base.SaveChanges();

                return true;
            }
        }
    }
}
