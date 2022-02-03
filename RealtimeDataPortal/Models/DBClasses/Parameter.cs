using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class Parameter
    {
        public int ParameterId { get; set; }
        public int ProductId { get; set; }
        public int ParameterTypeId { get; set; }
        public string Position { get; set; } = string.Empty!;
        public int Round { get; set; }
        public bool ShowLimit { get; set; }
    }
}
