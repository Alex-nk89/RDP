namespace RealtimeDataPortal.Models
{
    public class Tags
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public int TagParameterId { get; set; }
        public int ServerId { get; set; }
    }
}
