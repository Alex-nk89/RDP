namespace RealtimeDataPortal.Models
{
    public class ParameterTag
    {
        public int ParameterTagId { get; set; }
        public int ParameterId { get; set; }
        public int TagId { get; set; }

        public void AddParameterTag(ParameterTag parameterTag)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.ParameterTag.Update(parameterTag);
                rdp_base.SaveChanges();
            }
        }

        public void RemoveParameterTag(List<ParameterTag> parameterTags)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.ParameterTag.RemoveRange(parameterTags);
                rdp_base.SaveChanges();
            }
        }

        public int GetMaxParameterTagId(RDPContext rdp_base)
        {
            return rdp_base.ParameterTag.Max(pt => pt.ParameterTagId);
        }
    }
}
