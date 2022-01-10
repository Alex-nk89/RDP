namespace RealtimeDataPortal.Models
{
    public class AccessToComponent
    {
        public int Id { get; set; }
        public int IdComponent { get; set; }
        public int? IdChildren { get; set; }
        public string ADGroupToAccess { get; set; } = null!;
    }
}
