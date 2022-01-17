using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Graphics
    {
        public int Id { get; set; }
        [NotMapped]
        public string Name { get; set; } = null!;
        public int IdProduct { get; set; }

        public Graphics GetAttributesForGraphic(int id)
        {
            using(RDPContext rdp_base = new RDPContext())
            {
                Graphics attributesForGraphic = (from trees in rdp_base.TreesMenu
                                                 join graphics in rdp_base.Graphics on trees.IdComponent equals graphics.Id into grp
                                                 from graphic in grp.DefaultIfEmpty()
                                                 //join prd 
                                                 where trees.Type == "graphic" && trees.IdComponent == id
                                                 select new Graphics() { 
                                                    Id = trees.Id,
                                                    Name = trees.Name
                                                 }).Distinct().FirstOrDefault() ?? 
                                                 throw new NotFoundException("Страница не найдена");

                    
                  return attributesForGraphic;
            }
        }
    }
}
