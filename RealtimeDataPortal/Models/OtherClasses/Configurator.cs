
namespace RealtimeDataPortal.Models
{
    public class Configurator
    {
        public TreesMenu TreesMenu { get; set; } = new();
        public ExternalPages ExternalPages { get; set; } = new();
        public Graphics Graphics { get; set; } = new();


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

                if (id == 0)
                {
                    return componentInfo;
                }

                componentInfo.TreesMenu = rdp_base.TreesMenu.Where(tm => tm.Id == id).FirstOrDefault() ??
                    throw new NotFoundException("Не удалось получить информацию о компоненте.");

                string[] adGroups = rdp_base.AccessToComponent
                    .Where(atc => atc.IdComponent == id && atc.IdChildren == 0)
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
                                              select new Graphics()
                                              {
                                                  ComponentId = graphic.ComponentId,
                                                  ProductId = graphic.ProductId,
                                                  Name = product.ProductName
                                              }).FirstOrDefault() ?? new();
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
                TreesMenu removedElement = new TreesMenu() { Id = id };
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
