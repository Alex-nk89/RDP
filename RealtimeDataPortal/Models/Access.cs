namespace RealtimeDataPortal.Models
{
    public class Access
    {
        public int Id { get; set; }
        public string Function { get; set; }
        public string ADGroup { get; set; }
        public string? Description { get; set; }

        public List<Access> GetAccess ()
        {
            using(RDPContext db = new RDPContext())
            {
                return db.Access.ToList();
            }
        }

    }
}
