using System.ComponentModel.DataAnnotations.Schema;
using RealtimeDataPortal.Models.OtherClasses;

namespace RealtimeDataPortal.Models.DBClasses
{
    public class CustomTable
    {
        public int CustomTableId { get; set; }
        public int ComponentId { get; set; }
        public string CustomTableName { get; set; } = string.Empty;
        [NotMapped]
        public List<CustomTableRows> Rows { get; set; } = new();

        public class CellWithTag
        {
            public string value { get; set; } = string.Empty;
            public int ProductId { get; set; }
            public string tagName { get; set; } = string.Empty;
            public int tagId { get; set; }
        }

        public IEnumerable<int> GetTagsFromCustomTable(List<CustomTable> customTables)
        {
            foreach(var customTable in customTables)
            {
                foreach(var rows in customTable.Rows)
                {
                    foreach(var cell in rows.Cells)
                    {
                        int tagId = cell.CellContain.Length != 0
                            ? (JsonSerializer.Deserialize<CellWithTag>(cell.CellContain) ?? new CellWithTag()).tagId
                            : 0;

                        yield return tagId;
                    }
                }
            }
        }

        public List<CustomTable> GetCustomTables(int componentId, CurrentUser? currentUser = null)
        {
            // Получение данных о кастомной таблице с приведением в необходимую фронту структуру

            if (currentUser is not null && !(new CheckAccess.CheckAccess().GetAccess(componentId, currentUser)))
                throw new Exception("NotAccessForView");

            using RDPContext rdp_base = new();

            List<CustomTable> customTables =
                (from customTable in rdp_base.CustomTable
                 join rows in rdp_base.CustomTableRows
                    on customTable.CustomTableId equals rows.CustomTableId
                 join cells in rdp_base.CustomTableCells
                    on rows.RowId equals cells.RowId
                 where customTable.ComponentId == componentId
                 select new
                 {
                     CustomTableId = customTable.CustomTableId,
                     ComponentId = customTable.ComponentId,
                     CustomTableName = customTable.CustomTableName,
                     RowId = rows.RowId,
                     Id = cells.Id,
                     TypeCell = cells.TypeCell,
                     CellContain = cells.CellContain,
                     Style = cells.CellStyle
                 })
                 .AsNoTracking()
                 .ToList()
                 .GroupBy(c => c.CustomTableId)                             // Разделяем полученный список на таблицы
                 .Select(c => new CustomTable()
                 {
                     CustomTableId = c.First().CustomTableId,
                     ComponentId = c.First().ComponentId,
                     CustomTableName = c.First().CustomTableName,
                     Rows =                                                 // Помещаем в таблицу список строк
                        (from rows in c.GroupBy(c => c.RowId)
                         select new CustomTableRows()
                         {
                             RowId = rows.First().RowId,
                             CustomTableId = rows.First().CustomTableId,
                             Cells =                                        // Помещаем в строку список ячеек
                                (from cells in rows
                                 where cells.RowId == rows.First().RowId
                                 select new CustomTableCells()
                                 {
                                     Id = cells.Id,
                                     RowId = cells.RowId,
                                     TypeCell = cells.TypeCell,
                                     CellContain = cells.CellContain,
                                     CellStyle = cells.Style
                                 })
                                 .ToList()
                         })
                         .ToList()
                 })
                 .ToList();

            return customTables;
        }

        public int EditCustomTables(IEnumerable<CustomTable> customTables, int componentId)
        {
            IReadOnlyCollection<CustomTable> oldCustomTables = GetCustomTables(componentId);

            // Если создается новый элемент получаем новый componentId, который задается как +1 к максимальному
            using RDPContext rdpBase = new();
            int newComponentId = componentId == 0
                ? rdpBase.CustomTable.Select(c => c.ComponentId).Count() == 0 ? 1 : rdpBase.CustomTable.Select(c => c.ComponentId).Max() + 1 //Если нет еще ни одной таблицы присваиваем 1
                : customTables.First().ComponentId;

            //Parallel.ForEach(customTables, customTable =>
            //    AddCustomTable(customTable, oldCustomTables, newComponentId));
            foreach(var customTable in customTables)
            {
                AddCustomTable(customTable, oldCustomTables, newComponentId);
            }

            if (oldCustomTables.Count != 0)
            {
                int[] removingCustomTablesIds = oldCustomTables.Select(c => c.CustomTableId).Except(customTables.Select(c => c.CustomTableId)).ToArray();

                IReadOnlyCollection<CustomTable> removingCustomTables = oldCustomTables
                    .Where(c => removingCustomTablesIds.Contains(c.CustomTableId))
                    .ToList();

                //Parallel.ForEach(removingCustomTables, removeCustomTable =>
                //    RemoveCustomTable(new List<CustomTable>() { removeCustomTable }));
                foreach(var removeCustomTable in removingCustomTables)
                {
                    RemoveCustomTable(new List<CustomTable>() { removeCustomTable });
                }
            }

            return customTables.First().ComponentId;
        }

        public void AddCustomTable(CustomTable customTable, IReadOnlyCollection<CustomTable> oldCustomTables, int componentId)
        {
            RDPContext rdpBase = new();

            IReadOnlyCollection<CustomTableRows> oldRows = oldCustomTables
                .Where(c => c.CustomTableId == customTable.CustomTableId)
                .Select(c => c.Rows)
                .FirstOrDefault()
                ?? new();

            customTable.ComponentId = componentId;

            rdpBase.CustomTable.Update(customTable);
            rdpBase.SaveChanges();

            //Parallel.ForEach(customTable.Rows, row =>
            //{
            //    row.CustomTableId = customTable.CustomTableId;
            //    new CustomTableRows().AddCustomTableRow(row, oldRows);
            //});

            foreach(var row in customTable.Rows)
            {
                row.CustomTableId = customTable.CustomTableId;
                new CustomTableRows().AddCustomTableRow(row, oldRows);
            }

            if (oldRows.Count != 0)
            {
                int[] removingRowsIds = oldRows.Select(c => c.RowId).Except(customTable.Rows.Select(c => c.RowId)).ToArray();

                IEnumerable<CustomTableRows> removingRows = oldRows
                    .Where(c => removingRowsIds.Contains(c.RowId))
                    .ToList();

                Parallel.ForEach(removingRows, removingRow =>
                    new CustomTableRows().RemoveCustomTableRows(new List<CustomTableRows>() { removingRow }));
            }
        }

        public void RemoveCustomTable(List<CustomTable> customTableForRemove)
        {
            using RDPContext rdpBase = new();

            rdpBase.CustomTable.RemoveRange(customTableForRemove);
            rdpBase.SaveChanges();

            Parallel.ForEach(customTableForRemove, removingTable =>
            {
                new CustomTableRows().RemoveCustomTableRows(removingTable.Rows);
            });
        }
    }
}