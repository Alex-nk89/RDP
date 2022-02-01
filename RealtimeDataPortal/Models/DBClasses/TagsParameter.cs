namespace RealtimeDataPortal.Models
{
    public class TagsParameter
    {
        public int TagParameterId { get; set; }
        public string TagParameterName { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;

        public List<TagsParameter> GetTagsParameter()
        {
            List<TagsParameter> tagsParameter = new();

            using (RDPContext rdp_base = new())
            {
                tagsParameter = rdp_base.TagsParameter.ToList();

                return tagsParameter;
            }
        }
    }
}
