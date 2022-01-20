
namespace RealtimeDataPortal.Models
{
    public class AttributesGraphics
    {
        public int ComponentId { get; set; }
        public string Name { get; set; } = null!;
        public int ProductId { get; set; }
        public string Position { get; set; } = string.Empty!;
        public int Round { get; set; }
        public bool ShowLimit { get; set; } = false;
        public int ProductsParameterId { get; set; }
        public string NameParameter { get; set; } = string.Empty!;
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty!;
        public int TagTypeId { get; set; }
        public string Type { get; set; } = string.Empty!;
        public string TypeShortName { get; set; } = string.Empty!;
        public string TypeName { get; set; } = string.Empty!;
        public int? WwResolution { get; set; }
        public string? Calendar { get; set; }
        public bool VisibleToGraphic { get; set; } = false;
        public int TagParameterId { get; set; }
        public string TagParameterName { get; set; } = string.Empty!;
        public string Label { get; set; } = string.Empty!;
        public string Color { get; set; } = string.Empty!;
        public string ServerConnection { get; set; } = string.Empty!;
        //public int ServerId { get; set; }
        //public string ServerName { get; set; } = string.Empty!;
        //public string Database { get; set; } = string.Empty!;
        //public string UserName { get; set; } = string.Empty!;
        //public string Password { get; set; } = string.Empty!;
    }
}
