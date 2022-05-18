import {
    useSelector, NavLink
} from '.';

export const TableCell = ({ indexTable, indexRow, indexCell }) => {
    const { cellContain, cellStyle } = useSelector(state => state.customTable.tables[indexTable].rows[indexRow].cells[indexCell]);
    const tagsLiveValues = useSelector(state => state.customTable.tagsLiveValues);

    if (cellContain.length === 0) {
        return (
            <>
                <td></td>
            </>
        )
    }

    const cell = JSON.parse(cellContain);

    const cellValue = cell.tagId !== 0
        ? <NavLink to={`/graphics/${cell.productId}`}>
            <span>{tagsLiveValues.find(tag => tag.tagId === cell.tagId)?.value.toFixed(cell.round)}</span> 
        </NavLink>
        : cell.value;

    return (
        <>
            <td style={{...JSON.parse(cellStyle)}} >{cellValue}</td>
        </>
    );
}