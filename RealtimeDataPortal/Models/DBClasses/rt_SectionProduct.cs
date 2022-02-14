using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class rt_SectionProduct
    {
        public int Id { get; set; }
        public int SectionId { get; set; }
        public int ProductId { get; set; }
        [NotMapped]
        public string ProductName { get; set; } = String.Empty;

        public void AddChangeSectionProducts(List<rt_SectionProduct> sectionProducts)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.rt_SectionProduct.UpdateRange(sectionProducts);
                rdp_base.SaveChanges();
            }
        }
    }
}
