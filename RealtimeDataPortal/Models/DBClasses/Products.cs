using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Products
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public int AddChangeProduct(Products product)
        {
            using (RDPContext rdp_base = new())
            {
                rdp_base.Products.Update(product);
                rdp_base.SaveChanges();

                return product.ProductId;
            }
        }

        public bool DeleteProducts(int[] productIds)
        {
            try
            {
                using (RDPContext rdp_base = new())
                {
                    List<Products> deletingProducts = new();
                    List<Parameter> deletingParameters = new();
                    List<ParameterTag> deletingParameterTags = new();

                    foreach (int productId in productIds)
                    {
                        deletingProducts.Add(new Products() { ProductId = productId });

                        deletingParameters = rdp_base.Parameter.Where(p => p.ProductId == productId).ToList();

                        int[] deletingParameterIds = deletingParameters.Select(dp => dp.ParameterId).Distinct().ToArray();

                        deletingParameterTags = rdp_base.ParameterTag
                            .Where(pt => deletingParameterIds.Contains(pt.ParameterId)).AsNoTracking().ToList();

                        rdp_base.Products.RemoveRange(deletingProducts);
                        rdp_base.Parameter.RemoveRange(deletingParameters);
                        rdp_base.ParameterTag.RemoveRange(deletingParameterTags);
                    }



                    rdp_base.SaveChanges();

                    return true;
                }
            }
            catch
            {
                throw new Exception("NotDeleted");
            }
        }
    }
}
