using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class TreesMenu
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public int IdParent { get; set; }
        public string Type { get; set; } = "";
        public int IdComponent { get; set; }
        [NotMapped]
        public bool isFullView { get; set; } = false;
        [NotMapped]
        public int? IdChildren { get; set; }
        [NotMapped]
        public string? ADGroupToAccess { get; set; }


        public Object GetMenu(int idParent, List<string> groups, bool isFullView = false)
        {
            using(RDPContext rdp_base = new RDPContext())
            {
                IQueryable<TreesMenu> treesMenus = rdp_base.TreesMenu.Where(tm => tm.IdParent == idParent).Distinct();

                if (!isFullView)
                {
                    treesMenus = (from tm in treesMenus
                                  join atc in rdp_base.AccessToComponent on tm.Id equals atc.IdComponent into menuItems
                                  from menuItem in menuItems.DefaultIfEmpty()
                                  where groups.Contains(menuItem.ADGroupToAccess)
                                  select new TreesMenu()
                                  {
                                      Id = tm.Id,
                                      Name = tm.Name,
                                      IdParent = tm.IdParent,
                                      Type = tm.Type,
                                      IdComponent = tm.IdComponent,
                                      isFullView = menuItem.IdChildren == 0 ? true : false
                                  }).Distinct();
                }

                List<TreesMenu> treesMenu = treesMenus.ToList();

                // Могут быть случаи когда папке назначен полный доступ по какой-то группе и одновременно с этим 
                // вложенному элементу (например, графику) назначен доступ с такой же группой. В этом случае 
                // запрос получает задвоенную информации по папке (с признаком FullAccess равным true и false)
                if (!isFullView)
                {
                    List<TreesMenu> lists = new List<TreesMenu>(treesMenu);

                    foreach (var list in lists)
                    {
                        if (list.isFullView == false)
                        {
                            if (treesMenus.
                                Where(tm => tm.Name == list.Name && tm.IdParent == list.IdParent
                                    && tm.Type == list.Type && tm.IdComponent == list.IdComponent && tm.isFullView == true)
                                .Count() == 1)
                            {
                                treesMenu.Remove(list);
                            }
                        }
                    }
                }

                return treesMenu;
            }
        }
    }
}