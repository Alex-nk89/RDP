using RealtimeDataPortal.Models;

namespace RealtimeDataPortal.CheckAccess
{
    public class CheckAccess
    {
        public bool GetAccess(int id, User user, string? type = null)
        {
            // Проверка доступа к странице.
            // 1. Проверка у пользователя ролей полного просмотра (isFullView), конфигуратора (isConfigurator), 
            // администратора (isAdministrator).
            // 2. Получаем список всех возможных доступных страниц для пользователя (вместе с путями к ним)
            // из таблицы AccessToComponent. Получаем весь список чтобы сократить количество обращений к базе
            // данных до одного.
            // 3. Страницы проверяем отдельным методом, графики для продуктов (переход по ссылкам, например,
            // с таблиц реального времени) другим
            // 4. Проверяем дан ли доступ непосредственно само странице
            // 5. Далее рекурсивно проверяем родителей страницы
            //

            if (user.isFullView || user.isConfigurator || user.isAdministrator)
                return true;

            List<TreesMenu> treesMenuWithAccesses = new List<TreesMenu>();

            using (RDPContext rdp_base = new RDPContext())
            {
                treesMenuWithAccesses = (from tm in rdp_base.TreesMenu
                                         join atc in rdp_base.AccessToComponent on tm.Id equals atc.IdComponent into accesses
                                         from access in accesses.DefaultIfEmpty()
                                         where user.Groups.Contains(access.ADGroupToAccess)
                                         select new TreesMenu()
                                         {
                                             Id = tm.Id,
                                             ChildrenId = access.IdChildren
                                         }).ToList();
            }

            if (type is null)
                return CheckAccessToPage(user, treesMenuWithAccesses, id);

            return false;
        }

        private bool CheckAccessToPage(User user, List<TreesMenu> treesMenuWithAccesses, int id, int? idChildren = null)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                List<TreesMenu> treesMenu = treesMenuWithAccesses
                .Where(tm => tm.Id == id && tm.ChildrenId == idChildren).ToList();

                if (treesMenu.Count() >= 1)
                    return true;

                //int[] idParents = rdp_base.TreesMenu.Where(tm => tm.Id == id).Select(tm => tm.ParentId)
                //    .Distinct().ToArray();

                //List<TreesMenu> parents = treesMenuWithAccesses.Where(tm => idParents.Contains(tm.Id)).ToList();
                List<TreesMenu> parents = (from tm in rdp_base.TreesMenu
                                           join atc in rdp_base.AccessToComponent on tm.Id equals atc.IdComponent into accesses
                                           from access in accesses.DefaultIfEmpty()
                                           where rdp_base.TreesMenu.Where(tm => tm.Id == id).Select(tm => tm.ParentId).Distinct().ToArray().Contains(tm.Id)
                                           select new TreesMenu()
                                           {
                                               Id = tm.Id,
                                               ChildrenId = access.IdChildren
                                           }).ToList();

                foreach (var item in parents)
                {
                    if (CheckAccessToPage(user, treesMenuWithAccesses, item.Id, item.ChildrenId))
                        return true;
                }

                return false;
            }
        }
    }
}
