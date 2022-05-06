import {
    useSelector, useDispatch
    , TextInput
} from '..';

import { inputCellContain } from '../../../../../reducers/customTableSlice';

export const NewCustomTableSettings = ({ indexTable }) => {
    const dispatch = useDispatch();
    const focusedElement = useSelector(state => state.customTable.focusedElement);
    const tables = useSelector(state => state.customTable.tables[indexTable]);

    if (indexTable !== Number(focusedElement?.indexTable)) {
        return null;
    }

    const { indexRow, indexCell } = focusedElement;
    const cell = tables.rows[indexRow][indexCell];
    

    

    const inputThisCellContain = (event) => {
        const cellContain = event.target.value;

        if (cellContain[0] !== '%') {
            dispatch(inputCellContain({ indexTable, indexRow: focusedElement.indexRow, 
                indexCell: focusedElement.indexCell, cellContain, typeCell: 'text' }));
        }
    };

    return (
        <>
            <TextInput
                label='Содержимое ячейки'
                placeholder='Введите текст, тег или формулу'
                size='xs'
                value={cell.cellContain}
                onChange={inputThisCellContain}
                data-settings // Аттрибут используется как признак того что не надо скрывать панель настроек ячейки при использовании данного элемента
            />
        </>
    );
};