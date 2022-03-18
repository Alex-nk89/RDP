using RealtimeDataPortal.Models.Exceptions;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models.DBClasses
{
    public class Mnemoscheme
    {
        public int Id { get; set; }
        public int MnemoschemeId { get; set; }
        public string MnemoschemeContain { get; set; } = string.Empty;
        [NotMapped]
        public string MnemoschemeName { get; set; } = string.Empty;

        public int EditMnemoscheme(Mnemoscheme mnemoscheme)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.Mnemoscheme.Update(mnemoscheme);
                rdp_base.SaveChanges();

                return mnemoscheme.Id;
            }
        }

        public List<Mnemoscheme> GetMnemoscheme(int id, User user)
        {
            CheckAccess.CheckAccess check = new CheckAccess.CheckAccess();

            if (!check.GetAccess(id, user))
                throw new ForbiddenException("У Вас нет доступа к странице.");

            using (RDPContext rdp_base = new())
            {
                var mnemoscheme = (from treesMenu in rdp_base.TreesMenu
                                   join mnemoschemeData in rdp_base.Mnemoscheme
                                        on treesMenu.ComponentId equals mnemoschemeData.MnemoschemeId into mnemoshemaDatas
                                   from mnemoschemeData in mnemoshemaDatas.DefaultIfEmpty()
                                   where treesMenu.Id == id
                                   select new Mnemoscheme()
                                   {
                                       Id = mnemoschemeData.Id,
                                       MnemoschemeId = mnemoschemeData.MnemoschemeId,
                                       MnemoschemeContain = mnemoschemeData.MnemoschemeContain,
                                       MnemoschemeName = treesMenu.Name
                                   })
                                   .AsNoTracking()
                                   .ToList();

                if(mnemoscheme.Count == 0) throw new NotFoundException("Страница не найдена.");

                return mnemoscheme;
            }
        }
    }

}
