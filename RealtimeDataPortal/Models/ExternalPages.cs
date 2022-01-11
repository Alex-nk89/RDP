using RealtimeDataPortal.Models.Exceptions;

namespace RealtimeDataPortal.Models
{
    public class ExternalPages
    {
        public int Id { get; set; }
        public string Link { get; set; } = null!;

        public Object GetLink(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

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

                if (link == null) throw new NotFoundException("Страница не найдена.");

                return link;
            }
        }
    }
}