namespace RealtimeDataPortal.Models
{
    public class ParameterType
    {
        public int ParameterTypeId { get; set; }
        public string ParameterTypeName { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        public List<ParameterType> GetParameterTypes(RDPContext rdp_base)
        {
            return rdp_base.ParameterType.ToList();
        }
    }
}
