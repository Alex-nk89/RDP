namespace RealtimeDataPortal.Models.DBClasses
{
    public class CustomTable
    {
        public int CustomTableId { get; set; }
        public int ComponentId { get; set; }
        public string CustomTableName { get; set; } = string.Empty;
        public List<CustomTableCells> CustomTableCells { get; set; } = new();

        public List<CustomTable> GetCustomTables(int componentId)
        {
            using RDPContext rdp_base = new();

            List<CustomTable> customTables =
                (from customTable in rdp_base.CustomTable
                 join customTableCells in rdp_base.CustomTableCells
                    on customTable.CustomTableId equals customTableCells.CustomTableId
                 where customTable.ComponentId == componentId
                 group customTable by customTable.CustomTableId into g
                 select new CustomTable()
                 {
                     CustomTableId = g.First().CustomTableId,
                     ComponentId = g.First().ComponentId,
                     CustomTableName = g.First().CustomTableName,
                     CustomTableCells = g.First().CustomTableCells
                 })
                 .ToList();

            return customTables;
        }
    }
}
