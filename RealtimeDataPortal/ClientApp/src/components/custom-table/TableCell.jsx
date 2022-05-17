import {
    useSelector
} from '.';

export const TableCell = ({ indexTable, indexRow, indexCell }) => {
    const { cellContain } = useSelector(state => state.customTable.tables[indexTable].rows[indexRow].cells[indexCell]);

    return (
        <>
            <td>{cellContain}</td>
        </>
    );
}