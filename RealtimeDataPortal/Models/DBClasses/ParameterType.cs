namespace RealtimeDataPortal.Models
{
    public class ParameterType
    {
        public int ParameterTypeId { get; set; }
        public string ParameterTypeName { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        public List<ParameterType> GetParameterTypes()
        {
            List<ParameterType> parameterTypes = new();

            using (RDPContext rdp_base = new())
            {
                parameterTypes = rdp_base.ParameterType.ToList();

                return parameterTypes;
            }
        }
    }
}
