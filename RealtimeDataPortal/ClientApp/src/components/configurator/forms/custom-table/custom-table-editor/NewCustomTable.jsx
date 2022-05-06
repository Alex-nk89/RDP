import {
    useMemo
    , useSelector, useDispatch
    , ActionIcon, Group, Text, TextInput
    , BsX, BsDash, BsPlus
    , NewCustomTableRow, NewCustomTableSettings
} from '..';

import { removeTable, inputName, addRow, deleteRow, addColumn, deleteColumn } from '../../../../../reducers/customTableSlice';

export const NewCustomTable = ({ indexTable }) => {

    const dispatch = useDispatch();
    const tables = useSelector(state => state.customTable.tables);
    const focusedElement = useSelector(state => state.customTable.focusedElement);

    const settingsTableStyle = {
        maxHeight: focusedElement && indexTable === Number(focusedElement?.indexTable) ? '300px' : '0px'
    };

    const removeThisTable = () => {
        if (tables.length > 1) {
            dispatch(removeTable(indexTable))
        }
    };

    const inputNameThisTable = (event) => {
        dispatch(inputName({ value: event.target.value, indexTable }));
    };

    const addRowThisTable = () => dispatch(addRow(indexTable));

    const removeRowThisTable = () => {
        const lengthRow = tables[indexTable].rows.length;
        if (lengthRow > 1) {
            dispatch(deleteRow({ indexTable, indexRow: lengthRow - 1 }));
        }
    };

    const addColumnThisTable = () => dispatch(addColumn(indexTable));

    const removeColumnThisTable = () => {
        const lengthColumn = tables[indexTable].rows[0].length;
        if (lengthColumn > 1) {
            dispatch(deleteColumn({ indexTable, indexColumn: lengthColumn - 1 }));
        }
    }

    const thisTable = useMemo(() => (
        <div className='info-block custom-table-editor__new-table-form' >
            <div className='custom-table-editor__new-table-form__delete-button'>
                <ActionIcon onClick={removeThisTable}>
                    <BsX size={16} />
                </ActionIcon>
            </div>

            <div className='custom-table-editor__new-table-form__header'>
                <div className='custom-table-editor__new-table-form__header__title'>
                    <TextInput
                        label='Наименование'
                        placeholder='Введите наименование таблицы'
                        value={tables[indexTable].name}
                        onChange={inputNameThisTable}
                    />
                </div>

                <div className='custom-table-editor__new-table-form__header__count-rows-columns'>
                    <Group>
                        <Text color='gray' size='sm'>Количество строк:  </Text>

                        <ActionIcon color='red' variant='light' onClick={removeRowThisTable}>
                            <BsDash />
                        </ActionIcon>

                        <Text color='gray' size='sm'> {tables[indexTable].rows.length} </Text>

                        <ActionIcon color='blue' variant='light' onClick={addRowThisTable}>
                            <BsPlus />
                        </ActionIcon>
                    </Group>
                </div>

                <div className='custom-table-editor__new-table-form__header__count-rows-columns'>
                    <Group>
                        <Text color='gray' size='sm'>Количество столбцов:  </Text>

                        <ActionIcon color='red' variant='light' onClick={removeColumnThisTable}>
                            <BsDash />
                        </ActionIcon>

                        <Text color='gray' size='sm'> {tables[indexTable].rows[0].length} </Text>

                        <ActionIcon color='blue' variant='light' onClick={addColumnThisTable}>
                            <BsPlus />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            <div className='custom-table-editor__new-table-form__table-settings' style={settingsTableStyle}>
                <NewCustomTableSettings indexTable={indexTable} />
            </div>

            <div className='custom-table-editor__new-table-form__table'>
                <table>
                    <tbody>
                        {
                            tables[indexTable].rows.map((_, indexRow) => <NewCustomTableRow key={indexRow} indexTable={indexTable} indexRow={indexRow} />)
                        }
                    </tbody>
                </table>
            </div>
        </div>
        //eslint-disable-next-line
    ), [tables[indexTable], tables.length, focusedElement]);

    return (
        <>
            {thisTable}
        </>

    );
};