using System.ComponentModel.DataAnnotations.Schema;

namespace RealtimeDataPortal.Models.DBClasses
{
    public class CustomTableRows
    {
        public int RowId { get; set; }
        public int CustomTableId { get; set; }
        [NotMapped]
        public List<CustomTableCells> Cells { get; set; } = new();

        public void AddCustomTableRow(CustomTableRows row, IReadOnlyCollection<CustomTableRows> oldRows)
        {
            using RDPContext rdpBase = new();

            IReadOnlyCollection<CustomTableCells> oldCells = oldRows
                .Where(c => c.RowId == row.RowId)
                .Select(c => c.Cells)
                .FirstOrDefault()
                ?? new();

            rdpBase.CustomTableRows.Update(row);
            rdpBase.SaveChanges();

            //Parallel.ForEach(row.Cells, cell => 
            //{
            //    cell.RowId = row.RowId;
            //    new CustomTableCells().AddCustomTableCell(cell);
            //});
            foreach (var cell in row.Cells)
            {
                cell.RowId = row.RowId;
                new CustomTableCells().AddCustomTableCell(cell);
            }

            if (oldCells.Count != 0)
            {
                int[] removingCellsIds = oldCells.Select(c => c.Id).Except(row.Cells.Select(c => c.Id)).ToArray();

                IEnumerable<CustomTableCells> removingCells = oldCells
                    .Where(c => removingCellsIds.Contains(c.Id))
                    .ToList();

                Parallel.ForEach(removingCells, removingCell =>
                    new CustomTableCells().RemoveCustomTableCells(new List<CustomTableCells>() { removingCell }));
            }
        }

        public void RemoveCustomTableRows(List<CustomTableRows> rows)
        {
            using RDPContext rdpBase = new RDPContext();

            rdpBase.CustomTableRows.RemoveRange(rows);
            rdpBase.SaveChanges();

            Parallel.ForEach(rows, row =>
            {
                new CustomTableCells().RemoveCustomTableCells(row.Cells);
            });
        }
    }
}
