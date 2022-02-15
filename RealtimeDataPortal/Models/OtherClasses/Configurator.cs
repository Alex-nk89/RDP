
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
        public int maxSectionId { get; set; }


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
            using (RDPContext rdp_base = new RDPContext())
            {
                Configurator componentInfo = new();
                int? idChildren = operation.Contains("folder") ? 0 : null;

                if (id == 0)
                {
                    return componentInfo;
                }

                componentInfo.TreesMenu = rdp_base.TreesMenu.Where(tm => tm.Id == id).FirstOrDefault() ??
                    throw new NotFoundException("Не удалось получить информацию о компоненте.");

                string[] adGroups = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == id && atc.IdChildren == idChildren)
                    .Select(tm => tm.ADGroupToAccess).ToArray();

                componentInfo.ADGroups = adGroups;

                if (operation.Contains("externalPage"))
                    componentInfo.ExternalPages = rdp_base.ExternalPages
                        .Where(ep => ep.Id == componentInfo.TreesMenu.ComponentId).FirstOrDefault() ?? new();
                else if (operation.Contains("graphic"))
                {
                    componentInfo.Graphics = (from graphic in rdp_base.Graphics
                                              join product in rdp_base.Products
                                                on graphic.ProductId equals product.ProductId into products
                                              from product in products.DefaultIfEmpty()
                                              where graphic.ComponentId == componentInfo.TreesMenu.ComponentId
                                              select new Graphics()
                                              {
                                                  ComponentId = graphic.ComponentId,
                                                  ProductId = graphic.ProductId,
                                                  Name = product.ProductName
                                              }).FirstOrDefault() ?? new();
                }
                else if(operation.Contains("table"))
                {
                    componentInfo.Table = rdp_base.rt_Tables.Where(t => t.TableId == componentInfo.TreesMenu.ComponentId).FirstOrDefault() ?? new();
                    componentInfo.TableSections = rdp_base.rt_Sections.Where(s => s.TableId == componentInfo.Table.TableId).ToList();

                    int[] sectionsIds = componentInfo.TableSections.Select(s => s.SectionId).Distinct().ToArray();

                    componentInfo.SectionProducts = (from sectionProducts in rdp_base.rt_SectionProduct
                                                     join product in rdp_base.Products
                                                        on sectionProducts.ProductId equals product.ProductId into products
                                                     from product in products.DefaultIfEmpty()
                                                     where sectionsIds.Contains(sectionProducts.SectionId)
                                                     select new rt_SectionProduct()
                                                     {
                                                         Id = sectionProducts.Id,
                                                         SectionId = sectionProducts.SectionId,
                                                         ProductId = sectionProducts.ProductId,
                                                         ProductName = product.ProductName,
                                                     }).ToList();

                    componentInfo.maxSectionId = rdp_base.rt_Sections.Select(s => s.SectionId).Max();
                }

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

        public int AddChangeGraphic(Graphics graphic)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                rdp_base.Graphics.Update(graphic);
                rdp_base.SaveChanges();

                return graphic.ComponentId;
            }
        }

        public void DeleteElement(int id)
        {
            using (RDPContext rdp_base = new RDPContext())
            {
                TreesMenu removedElement = rdp_base.TreesMenu.Where(tm => tm.Id == id).FirstOrDefault() ?? new();

                if(removedElement.Type == "externalPage")
                {
                    ExternalPages removingExternalPage = rdp_base.ExternalPages
                        .Where(p => p.Id == removedElement.ComponentId).FirstOrDefault() ?? new();

                    if(removingExternalPage.Id != 0)
                    {
                        rdp_base.ExternalPages.Remove(removingExternalPage);
                    }
                }

                if(removedElement.Type == "graphic")
                {
                    Graphics graphic = rdp_base.Graphics
                        .Where(g => g.ComponentId == removedElement.ComponentId).FirstOrDefault() ?? new();

                    if(graphic.ComponentId != 0)
                    {
                        rdp_base.Graphics.Remove(graphic);
                    }
                }

                if(removedElement.Type == "table")
                {
                    new rt_Sections().AddChangeSections(new(), removedElement.ComponentId, new());
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
}
