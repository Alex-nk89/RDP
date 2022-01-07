namespace RealtimeDataPortal.Models
{
    public class ExternalPages
    {
        public int Id { get; set; }
        public string Link { get; set; } = null!;

        public Object GetLink(int id)
        {
            using(RDPContext context = new RDPContext())
            {
                var link = context.ExternalPages.
                    Where(l => l.Id == id).
                    Join(context.TreesMenu, ep => ep.Id, tm => tm.IdComponent,
                    (ep, tm) => new
                    {
                        Id = tm.Id,
                        Name = tm.Name,
                        Link = ep.Link
                    }).FirstOrDefault();

                return link;
            }
        }
    }
}