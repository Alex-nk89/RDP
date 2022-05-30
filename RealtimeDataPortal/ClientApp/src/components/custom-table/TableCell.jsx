import {
    useSelector, NavLink
} from '.';
import { evaluate } from 'mathjs';

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
    let cellKey;

    const convertValue = () => {
        try {
            const getValue = (str) => {
                const rowNumber = str.match(/"[0-9]:/)[0].replace(/"/, '').replace(/:/, '');
                const colNumber = str.match(/:[0-9]"/)[0].replace(/"/, '').replace(/:/, '');

                return document.querySelectorAll('table')[indexTable].querySelectorAll('tr')[rowNumber].querySelectorAll('td')[colNumber].textContent;
            }

            const formula = cell.value.replace(/"[0-9]:[0-9]"/g, getValue).replace(/=/, '');
            return evaluate(formula)?.toFixed(3);
        } catch {
            return 'Error';
        }
    };

    const cellValue = {
        tag:
            (<NavLink to={`/graphics/${cell.productId}`}>
                <span>
                    {tagsLiveValues.find(tag => tag.tagId === cell.tagId)?.value !== null
                        ? tagsLiveValues.find(tag => tag.tagId === cell.tagId)?.value?.toFixed(cell.round)
                        : '###'}
                </span>
            </NavLink>),
        link: <a href={cell.link}><span>{cell.value}</span></a>,
        formula: convertValue(),
        cell: cell.value
    };

    if (cell.tagId !== 0) cellKey = 'tag';
    else if (cell?.link) cellKey = 'link';
    else if (cell?.value.startsWith('=')) cellKey = 'formula';
    else cellKey = 'cell';

    return (
        <>
            <td style={{ ...JSON.parse(cellStyle) }} rowSpan={rowSpan} colSpan={colSpan}>{cellValue[cellKey]}</td>
        </>
    );
}