namespace RealtimeDataPortal.Models
{
    public class rt_Sections
    {
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty!;
        public int TableId { get; set; }

        public void AddChangeSections(List<rt_Sections> sections)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.rt_Sections.UpdateRange(sections);
                rdp_base.SaveChanges();
            }
        }
    }
}
