using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Products
    {
        public int ProductId { get; set; }
        public string Position { get; set; } = string.Empty;
        public int Round { get; set; }
        public bool ShowLimit { get; set; }
    }
}
