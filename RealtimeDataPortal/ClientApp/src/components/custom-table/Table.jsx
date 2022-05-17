import {
    useSelector
    , TableRow
} from '.';

export const Table = ({ indexTable }) => {
    const title = useSelector(state => state.customTable.tables[indexTable].customTableName);
    const rows = useSelector(state => state.customTable.tables[indexTable].rows);

    const table =
        (<table>
            <tbody>
                {
                    rows.map((row, indexRow) =>
                        <TableRow key={row.rowId} indexTable={indexTable} indexRow={indexRow} />)
                }
            </tbody>
        </table>);

    const tableHeader = title.length > 0
        ? (
            <div className='custom-table__table__header'>
                <h5 className='title'>
                    {title}
                </h5>
            </div>)
        : null;

    return (
        <div className='custom-table__table info-block'>
            {tableHeader}

            {table}
        </div>
    );
};