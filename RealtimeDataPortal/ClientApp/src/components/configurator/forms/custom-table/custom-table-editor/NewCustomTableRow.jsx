import {
    useMemo , useSelector, BsInfo,//, useDispatch
    Tooltip
    //, ActionIcon, Badge
    //, BsX
} from '..';

//import { deleteRow, resetFocusedElemet, deleteColumn } from '../../../../../reducers/customTableSlice';

export const NewCustomTableRow = ({ indexTable, indexRow }) => {
    //const dispatch = useDispatch();
    const rows = useSelector(state => state.customTable.tables[indexTable].rows);
    const focusedElement = useSelector(state => state.customTable.focusedElement);


    //const deleteOneRow = () => {
    //    dispatch(resetFocusedElemet());
    //    if (rows.length > 1) {
    //        dispatch(deleteRow({ indexTable, indexRow }));
    //    }
    //};

    //const deleteOneColumn = (event) => {
    //    if (rows[indexRow].cells.length > 1) {
    //        dispatch(deleteColumn({ indexTable, indexColumn: Number(event.target.dataset.column) }));
    //    }
    //};

    const cells = useMemo(() => {
        return rows[indexRow].cells.map((cell, indexCell) => {
            const border =
                (indexTable === Number(focusedElement?.indexTable) && indexRow === Number(focusedElement?.indexRow) && indexCell === Number(focusedElement?.indexCell))
                    ? '2px solid #2d6bcf'
                    : null;

            return (
                <td
                    key={indexCell}
                    tabIndex={`${indexTable + 1}${indexRow + 1}${indexCell + 1}`}
                    data-table={indexTable}
                    data-row={indexRow}
                    data-column={indexCell}
                    style={{ ...JSON.parse(cell.cellStyle), border }}
                    colSpan={JSON.parse(cell.cellStyle).colSpan}
                    rowSpan={JSON.parse(cell.cellStyle).rowSpan}
                >
                    {cell.cellContain.length > 0 ? JSON.parse(cell.cellContain)?.value : ''}

                    <div>
                        <Tooltip label={`${indexRow}:${indexCell}`} openDelay={500}>
                            <BsInfo color='blue' />
                        </Tooltip>
                    </div>
                </td>)
        });
        //eslint-disable-next-line
    }, [rows[indexRow], rows.length, focusedElement]);

    return (
        <tr>
            {cells}
        </tr>
    );
};

//{
//    rows[indexRow].cells.length === indexCell + 1
//        ? <div className='custom-table-editor__new-table-form__table__delete-row'>
//            <ActionIcon color='red' variant='light' size='xs' onClick={deleteOneRow}>
//                <BsX size={16} />
//            </ActionIcon>
//        </div>
//        : null
//}
//
//{
//    rows.length === indexRow + 1
//        ? <div className='custom-table-editor__new-table-form__table__delete-column'>
//            <ActionIcon color='red' variant='light' size='xs' onClick={deleteOneColumn} data-column={indexCell}>
//                <BsX size={16} data-column={indexCell} />
//            </ActionIcon>
//        </div>
//        : null
//}
//
//{
//    indexRow === 0
//        ? <div className='custom-table-editor__new-table-form__table__number-column'>
//            <Badge color='blue' variant='light' size='sm' radius='sm'>
//                {indexCell}
//            </Badge>
//        </div>
//        : null
//}
//
//{
//    indexCell === 0
//        ? <div className='custom-table-editor__new-table-form__table__number-row'>
//            <Badge color='blue' variant='light' size='sm' radius='sm'>
//                {indexRow}
//            </Badge>
//        </div>
//        : null
//}