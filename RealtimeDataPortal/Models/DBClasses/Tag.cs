using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Tag
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public int ServerId { get; set; }

        public bool AddChangeTag (Tag tag)
        {
            try
            {
                using (RDPContext rdp_base = new())
                {
                    rdp_base.Tag.Update(tag);
                    rdp_base.SaveChanges();

                    return true;
                }
            }
            catch
            {
                throw new Exception("NotSaved");
            }
        }

        public bool DeleteTags (int[] id)
        {
            try
            {
                using (RDPContext rdp_base = new())
                {
                    List<Tag> tags = new();

                    foreach (int tag in id)
                    {
                        tags.Add(new Tag() { TagId = tag });
                    }

                    rdp_base.Tag.RemoveRange(tags);
                    rdp_base.SaveChanges();

                    return true;
                }
            }
            catch
            {
                throw new Exception("NotDeleted");
            }
        }

        //public Object GetListUnusedTags ()
        //{
        //    using RDPContext rdpBase = new();

        //    var listUnusedTags = 
        //        (from unusedTags in rdpBase)

        //    return {};
        //}
    }
}
