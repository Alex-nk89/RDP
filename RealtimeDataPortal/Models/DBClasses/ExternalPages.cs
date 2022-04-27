using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models
{
    public class ExternalPages
    {
        public int Id { get; set; }
        public string Link { get; set; } = string.Empty;
    }
}