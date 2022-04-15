using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class TreesMenu
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public int ParentId { get; set; }
        public string Type { get; set; } = "";
        public int ComponentId { get; set; }


        [NotMapped]
        public bool isFullView { get; set; } = false;
        [NotMapped]
        public int? ChildrenId { get; set; }
        [NotMapped]
        public string? ADGroupToAccess { get; set; }
        [NotMapped]
        public string[]? ADGroups { get; set; }
        [NotMapped]
        public string[]? ADGroupsOld { get; set; }
        [NotMapped]
        public ExternalPages? ExternalPages { get; set; }

        public void Deconstruct(out int Id, out string Name, out int ParentId, out string Type, out int ComponentId,
            out string[] ADGroups, out string[] ADGroupsOld, out string? Link)
        {
            Id = this.Id;
            Name = this.Name;
            ParentId = this.ParentId;
            Type = this.Type;
            ComponentId = this.ComponentId;
            ADGroups = this.ADGroups ?? new string[] { };
            ADGroupsOld = this.ADGroupsOld ?? new string[] { };
            Link = this.ExternalPages.Link ?? string.Empty;
        }


        public Object GetMenu(int parentId, List<string> groups, bool isFullView = false)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                IQueryable<TreesMenu> treesMenus = rdp_base.TreesMenu
                    .Where(tm => tm.ParentId == parentId)
                    .Select(tm => new TreesMenu() {
                        Id = tm.Id,
                        Name = tm.Name,
                        ParentId = tm.ParentId,
                        Type = tm.Type,
                        ComponentId= tm.ComponentId,
                        isFullView = true
                    })
                    .Distinct();

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
                                      ParentId = tm.ParentId,
                                      Type = tm.Type,
                                      ComponentId = tm.ComponentId,
                                      isFullView = menuItem.IdChildren == 0 ? true : false
                                  })
                                  .Distinct();
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
                                Where(tm => tm.Name == list.Name && tm.ParentId == list.ParentId
                                    && tm.Type == list.Type && tm.ComponentId == list.ComponentId && tm.isFullView == true)
                                .Count() == 1)
                            {
                                treesMenu.Remove(list);
                            }
                        }
                    }
                }

                return treesMenu.OrderBy(tm => tm.Name);
            }
        }

        public TreesMenu GetComponentInformation(int id, string operation)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                TreesMenu treesMenus = rdp_base.TreesMenu.Where(tm => tm.Id == id).FirstOrDefault() ?? new TreesMenu();

                string[] adGroups = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == id && atc.IdChildren == 0)
                    .Select(tm => tm.ADGroupToAccess).ToArray();

                treesMenus.ADGroups = adGroups;

                if (operation.Contains("external-page"))
                    treesMenus.ExternalPages = rdp_base.ExternalPages.Where(ep => ep.Id == treesMenus.ComponentId).FirstOrDefault();

                return treesMenus;
            }
        }

        public int AddNewComponent(TreesMenu treesMenu)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                rdp_base.TreesMenu.Update(treesMenu);
                rdp_base.SaveChanges();

                return treesMenu.Id;
            }
        }

        public void DeleteElement(int id)
        {
            using(RDPContext rdp_base = new RDPContext())
            {
                TreesMenu removedElement = new TreesMenu() { Id = id };
                rdp_base.TreesMenu.Remove(removedElement);

                List<AccessToComponent> accessToComponent = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == id && (atc.IdChildren == 0 || atc.IdChildren == null)).Distinct().ToList();

                foreach(var access in accessToComponent)
                {
                    new AccessToComponent().DeleteAccessToComponent(id, access.IdChildren, access.ADGroupToAccess);
                }

                rdp_base.SaveChanges();
            }
        }
    }
}