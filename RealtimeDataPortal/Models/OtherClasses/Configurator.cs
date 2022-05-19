
using RealtimeDataPortal.Models.DBClasses;
using RealtimeDataPortal.Models.OtherClasses;

namespace RealtimeDataPortal.Models
{
    public class Configurator
    {
        public TreesMenu TreesMenu { get; set; } = new();
        public ExternalPages ExternalPages { get; set; } = new();
        public Graphics Graphics { get; set; } = new();
        public rt_Tables Table { get; set; } = new();
        public List<rt_Sections> TableSections { get; set; } = new();
        public List<rt_SectionProduct> SectionProducts { get; set; } = new();
        public Mnemoscheme Mnemoscheme { get; set; } = new();
        public int maxSectionId { get; set; }
        public List<CustomTable> CustomTables { get; set; } = new();
        public string? ADGroupToAccess { get; set; }
        public string[]? ADGroups { get; set; }
        public string[]? ADGroupsOld { get; set; }



        public void Deconstruct(out int Id, out string Name, out int ParentId, out string Type, out int ComponentId,
            out string[] ADGroups, out string[] ADGroupsOld, out string? Link)
        {
            Id = this.TreesMenu.Id;
            Name = this.TreesMenu.Name;
            ParentId = this.TreesMenu.ParentId;
            Type = this.TreesMenu.Type;
            ComponentId = this.TreesMenu.ComponentId;
            ADGroups = this.ADGroups ?? new string[] { };
            ADGroupsOld = this.ADGroupsOld ?? new string[] { };
            Link = this.ExternalPages.Link ?? string.Empty;
        }

        public Configurator GetComponentInformation(int id, string operation)
        {
            using (RDPContext rdp_base = new())
            {
                // Если создается новый компонент информацию о компоненте не получаем
                if (id == 0)
                    return new Configurator();

                operation = operation.Split('-')[1];
                int? idChildren = operation == "folder" ? 0 : null;

                Configurator componentInfo = new()
                {
                    TreesMenu = new TreesMenu().GetComponentInfo(id),
                    ADGroups = new AccessToComponent().GetComponentGroups(id, idChildren)
                };

                if (operation == "externalPage")
                    componentInfo.ExternalPages = new ExternalPages().GetExternalPageInfo(componentInfo.TreesMenu.ComponentId);

                else if (operation == "graphic")
                    componentInfo.Graphics = new Graphics().GetGraphicsInfo(componentInfo.TreesMenu.ComponentId);

                else if (operation == "table")
                {
                    componentInfo.Table = new rt_Tables().GetTableInfo(componentInfo.TreesMenu.ComponentId);
                    componentInfo.TableSections = new rt_Sections().GetSectionsInfo(componentInfo.Table.TableId);

                    int[] sectionsIds = componentInfo.TableSections.Select(s => s.SectionId).Distinct().ToArray();

                    componentInfo.SectionProducts = new rt_SectionProduct().GetSectionProductsInfo(sectionsIds);
                    componentInfo.maxSectionId = rdp_base.rt_Sections.Select(s => (int?)s.SectionId).Max() ?? 0;
                }
                else if (operation == "mnemoscheme")
                    componentInfo.Mnemoscheme = new Mnemoscheme().GetMnemoschemeInfo(componentInfo.TreesMenu.ComponentId);

                else if (operation == "customtable")
                    componentInfo.CustomTables = new CustomTable().GetCustomTables(componentInfo.TreesMenu.ComponentId);

                return componentInfo;
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

        public int AddChangeNewLink(ExternalPages externalPages)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                rdp_base.ExternalPages.Update(externalPages);
                rdp_base.SaveChanges();

                return externalPages.Id;
            }
        }

        public void DeleteElement(int id)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                TreesMenu removedElement = rdp_base.TreesMenu.Where(tm => tm.Id == id).FirstOrDefault() ?? new();

                if (removedElement.Type == "folder")
                {
                    int countChildsElement = rdp_base.TreesMenu
                        .Where(tm => tm.ParentId == id)
                        .Count();

                    if (countChildsElement > 0)
                    {
                        throw new Exception("NotDeletedNoEmptyFolder");
                    }
                }

                if (removedElement.Type == "externalPage")
                {
                    ExternalPages removingExternalPage = rdp_base.ExternalPages
                        .Where(p => p.Id == removedElement.ComponentId).FirstOrDefault() ?? new();

                    if (removingExternalPage.Id != 0)
                    {
                        rdp_base.ExternalPages.Remove(removingExternalPage);
                    }
                }

                if (removedElement.Type == "table")
                {
                    rt_Tables table = rdp_base.rt_Tables
                        .Where(table => table.TableId == removedElement.ComponentId).FirstOrDefault() ?? new();

                    if (table.TableId != 0)
                    {
                        rdp_base.rt_Tables.Remove(table);
                    }

                    new rt_Sections().AddChangeSections(new(), removedElement.ComponentId, new());
                }

                if (removedElement.Type == "mnemoscheme")
                {
                    List<Mnemoscheme> mnemoscheme = rdp_base.Mnemoscheme
                        .Where(mnemoscheme => mnemoscheme.MnemoschemeId == removedElement.ComponentId)
                        .ToList();

                    if (mnemoscheme.Count() != 0)
                    {
                        rdp_base.Mnemoscheme.RemoveRange(mnemoscheme);
                    }
                }

                if(removedElement.Type == "customtable")
                {
                    List<CustomTable> removingTables = new CustomTable().GetCustomTables(removedElement.ComponentId);
                    new CustomTable().RemoveCustomTable(removingTables);
                }

                rdp_base.TreesMenu.Remove(removedElement);

                List<AccessToComponent> accessToComponent = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == id && (atc.IdChildren == 0 || atc.IdChildren == null)).Distinct().ToList();

                foreach (var access in accessToComponent)
                {
                    new AccessToComponent().DeleteAccessToComponent(id, access.IdChildren, access.ADGroupToAccess);
                }

                rdp_base.SaveChanges();
            }
        }
    }

    public class CustomTableSettings
    {
        public List<CustomTable> CustomTables { get; set; } = new();
        public int MaxCustomTableId { get; set; }
    }
}
