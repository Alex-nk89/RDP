using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Products
    {
        public int ProductId { get; set; }
        public string NameProduct { get; set; } = string.Empty;
    }
}
