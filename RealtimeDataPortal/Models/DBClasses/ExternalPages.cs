using RealtimeDataPortal.Models.Exceptions;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class ExternalPages
    {
        public int Id { get; set; }
        public string Link { get; set; } = string.Empty;

        public Object GetLink(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            using(RDPContext rdp_base = new RDPContext())
            {
                var link = rdp_base.TreesMenu
                    .Where(tm => tm.Id == id)
                    .Join(rdp_base.ExternalPages, tm => tm.ComponentId, ep => ep.Id,
                    (tm, ep) => new
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