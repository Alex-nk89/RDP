using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class ProductsParameters
    {
        public int ProductsParametersId { get; set; }
        public int ProductId { get; set; }
        public string NameParameter { get; set; } = string.Empty!;
        public string Position { get; set; } = string.Empty!;
        public int Round { get; set; }
        public bool ShowLimit { get; set; }
    }
}
