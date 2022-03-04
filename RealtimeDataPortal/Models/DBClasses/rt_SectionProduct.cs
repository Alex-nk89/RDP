using Microsoft.EntityFrameworkCore;
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

        public void AddChangeSectionProducts(int sectionId, List<rt_SectionProduct> sectionProducts,
            List<rt_SectionProduct> initialSectionProducts)
        {
            using (RDPContext rdp_base = new())
            {
                int[] initialSectionProductsIds = initialSectionProducts
                    .Where(product => product.SectionId == sectionId)
                    .Select(product => product.Id).ToArray();
                int[] sectionProductsIds = sectionProducts.Select(product => product.Id).ToArray();
                int[] deletingSectionProductsIds = initialSectionProductsIds.Except(sectionProductsIds).ToArray();

                var deletingSectionProducts = initialSectionProducts
                    .Where(product => deletingSectionProductsIds.Contains(product.Id)).ToList();

                foreach (var product in sectionProducts)
                {
                    product.SectionId = sectionId;

                    if (!initialSectionProducts
                        .Where(product => product.SectionId == sectionId)
                        .Select(product => product.Id)
                        .Contains(product.Id))
                    {
                        product.Id = 0;
                    }

                    rdp_base.rt_SectionProduct.Update(product);
                }

                foreach (var product in deletingSectionProducts)
                {
                    rdp_base.rt_SectionProduct.Remove(product);
                }

                rdp_base.SaveChanges();
            }
        }

        public void RemoveSectionProducts(List<rt_SectionProduct> sectionProducts)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.rt_SectionProduct.RemoveRange(sectionProducts);
                rdp_base.SaveChanges();
            }
        }
    }
}
