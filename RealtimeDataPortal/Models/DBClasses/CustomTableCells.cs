namespace RealtimeDataPortal.Models.DBClasses
{
    public class CustomTableCells
    {
        public int Id { get; set; }
        public int RowId { get; set; }
        public string TypeCell { get; set; } = string.Empty;
        public string CellContain { get; set; } = string.Empty;
        public string CellStyle { get; set; } = string.Empty;

        public void AddCustomTableCell(CustomTableCells cell)
        {
            using RDPContext rdpBase = new();

            rdpBase.CustomTableCells.Update(cell);
            rdpBase.SaveChanges();
        }

        public void RemoveCustomTableCells(List<CustomTableCells> cells)
        {
            using RDPContext rdpBase = new RDPContext();

            rdpBase.CustomTableCells.RemoveRange(cells);
            rdpBase.SaveChanges();
        }
    }
}