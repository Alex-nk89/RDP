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

        public int GetMaxParameterId()
        {
            using (RDPContext rdp_base = new())
            {
                return rdp_base.Parameter.Max(p => p.ParameterId);
            }
        }
    }
}
