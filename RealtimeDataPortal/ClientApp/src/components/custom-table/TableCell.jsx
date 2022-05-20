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
    const { colSpan, rowSpan } = JSON.parse(cellStyle);

    const cellValue = cell.tagId !== 0
        ? <NavLink to={`/graphics/${cell.productId}`}>
            <span>
                {tagsLiveValues.find(tag => tag.tagId === cell.tagId)?.value !== null
                    ? tagsLiveValues.find(tag => tag.tagId === cell.tagId)?.value?.toFixed(cell.round)
                    : '###'}
            </span>
        </NavLink>
        : cell?.link
            ? <a href={cell.link}><span>{cell.value}</span></a>
            : cell.value;

    return (
        <>
            <td style={{ ...JSON.parse(cellStyle) }} rowSpan={rowSpan} colSpan={colSpan}>{cellValue}</td>
        </>
    );
}