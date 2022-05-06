namespace RealtimeDataPortal.Models.DBClasses
{
    public class CustomTableCells
    {
        public int Id { get; set; }
        public int CustomTableId { get; set; }
        public string TypeCell {  get; set; } = string.Empty;
        public string CellContain { get; set; } = string.Empty;
        public int ColumnNumber { get; set; }
        public int RowNumber { get; set; }
        public string Style { get; set; } = string.Empty;
    }
}