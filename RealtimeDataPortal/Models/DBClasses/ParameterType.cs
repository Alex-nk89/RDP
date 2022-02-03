namespace RealtimeDataPortal.Models
{
    public class ParameterType
    {
        public int ParameterTypeId { get; set; }
        public string ParameterTypeName { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        public List<ParameterType> GetTagsParameter()
        {
            List<ParameterType> parameterType = new();

            using (RDPContext rdp_base = new())
            {
                parameterType = rdp_base.ParameterType.ToList();

                return parameterType;
            }
        }
    }
}
