namespace RealtimeDataPortal.Models
{
    public class TagsType
    {
        public int TagTypeId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string TypeShortName { get; set; } = string.Empty;
        public string TypeName { get; set; } = string.Empty;
        public int? WwResolution { get; set; }
        public string? Calendar { get; set; }
        public bool VisibleToGraphic { get; set; } = false;
    }
}
