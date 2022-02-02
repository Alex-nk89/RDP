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

        public bool DeleteTags (int[] id)
        {
            using(RDPContext rdp_base = new())
            {
                List<Tags> tags = new();

                foreach(int tag in id)
                {
                    tags.Add(new Tags() { TagId = tag });
                }

                rdp_base.Tags.RemoveRange(tags);
                rdp_base.SaveChanges();

                return true;
            }
        }
    }
}
