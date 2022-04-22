namespace RealtimeDataPortal.Models.OtherClasses
{
    public class Query_rtTable
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool PositionVisible { get; set; } = false;
        public bool UnitVisible { get; set; } = false;
        public bool ScaleVisible { get; set; } = false;
        public bool LimitVisible { get; set; } = false;
        public int SectionId { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int ProductsParameterId { get; set; }
        public string NameParameter { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int Round { get; set; }
        public string TagName { get; set; } = string.Empty;
        public double? Value { get; set; }
        public string? Unit { get; set; } = string.Empty;
        public string? Scale { get; set; } = string.Empty;
        public string? Limits { get; set; } = string.Empty;
        public string TypeShortName { get; set; } = string.Empty;
        public int TagTypeId { get; set; }
        public string ServerName { get; set; } = string.Empty;
        public string ServerConnection { get; set; } = string.Empty;
    }
}
