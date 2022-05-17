import {
    useSelector
    , TableCell
} from '.';

export const TableRow = ({ indexTable, indexRow }) => {
    const cells = useSelector(state => state.customTable.tables[indexTable].rows[indexRow].cells);

    const row = cells.map((cell, indexCell) =>
        <TableCell key={cell.id} indexTable={indexTable} indexRow={indexRow} indexCell={indexCell} />);

    return (
        <>
            <tr>
                {row}
            </tr>
        </>
    );
}