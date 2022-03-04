namespace RealtimeDataPortal.Models
{
    public class AccessProfiles
    {
        public int Id { get; set; }
        public string Function { get; set; } = null!;
        public string ADGroup { get; set; } = null!;
        public string? Description { get; set; }

        public List<AccessProfiles> GetAccessProfiles()
        {
            using (RDPContext db = new())
            {
                return db.AccessProfiles.ToList();
            }
        }

        public void EditAccessProfiles(List<AccessProfiles> accessProfiles)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.AccessProfiles.UpdateRange(accessProfiles);
                rdp_base.SaveChanges();
            }
        }

    }
}
