import {
    useEffect, useMemo
    , useSelector, useDispatch
    , ActionIcon, Button, Group, Text
    , BsDash, BsPlus
    , NewCustomTable
} from '..';

import { addTable, removeTable, getFocusedElement, resetFocusedElemet } from '../../../../../reducers/customTableSlice';

export const EditorCustomTable = ({ submitForm, form }) => {
    const tables = useSelector(state => state.customTable.tables);
    const dispatch = useDispatch();

    const addNewTable = () => {
        if (tables.length < 5) {
            dispatch(addTable());
        }
    };

    const removeOneTable = (index) => {
        if (tables.length > 1) {
            const indexRemovableTable = !isNaN(index)
                ? index
                : tables.length - 1;

            dispatch(removeTable(indexRemovableTable));
        }
    };

    const focusOnCell = (event) => {
        const dataset = event.target.dataset
        if (dataset?.table) {
            dispatch(getFocusedElement({ indexTable: dataset.table, indexRow: dataset.row, indexCell: dataset.column }));
        }
        else {
            if (!document.activeElement.getAttribute('data-settings')) {
                dispatch(resetFocusedElemet());
            }
        }
    };

    const saveCustomTable = () => {
        submitForm({ ...form.values })
    };

    useEffect(() => {
        document.addEventListener('click', focusOnCell);

        return () => document.removeEventListener('click', focusOnCell);
        //eslint-disable-next-line
    }, []);

    const countTables = useMemo(() => {
        return (
            <Group>
                <Text color='gray' size='sm'>Количество таблиц на странице:  </Text>

                <ActionIcon color='red' variant='light' onClick={removeOneTable}>
                    <BsDash />
                </ActionIcon>

                <Text color='gray' size='sm'> {tables.length} </Text>

                <ActionIcon color='blue' variant='light' onClick={addNewTable}>
                    <BsPlus />
                </ActionIcon>
            </Group>
        );
        //eslint-disable-next-line
    }, [tables.length]);

    return (
        <>
            <div className='custom-table-editor'>
                <div className='custom-table-editor__count-tables info-block'>
                    {countTables}

                    <Button size='xs' variant='light' onClick={saveCustomTable}>Сохранить</Button>
                </div>
            </div>

            {
                tables.map((_, indexTable) =>
                    <NewCustomTable key={indexTable} indexTable={indexTable} />)
            }
        </>

    );
}