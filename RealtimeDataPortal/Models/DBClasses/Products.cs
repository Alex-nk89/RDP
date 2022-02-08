using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Products
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public int AddChangeProduct(Products product)
        {
            using(RDPContext rdp_base = new())
            {
                rdp_base.Products.Update(product);
                rdp_base.SaveChanges();

                return product.ProductId;
            }
        }
    }
}
