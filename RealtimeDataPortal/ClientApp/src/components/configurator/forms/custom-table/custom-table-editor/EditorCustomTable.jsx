import {
    useState
    , ActionIcon, Group, Text
    , BsDash, BsPlus
    , NewCustomTable
} from '..';

export const EditorCustomTable = () => {
    const table = {
        id: 0
    };

    const [tables, setTables] = useState([table]);

    const addTable = () => {
        if (tables.length < 5) {
            setTables([...tables, table]);
        }
    };

    const removeTable = (index) => {
        if (tables.length > 1) {
            const indexRemovableTable = index
                ? index
                : tables.length - 1;

            tables.splice(indexRemovableTable, 1)
            setTables([...tables]);
        }
    };

    return (
        <>
            <div className='custom-table-editor'>
                <div className='custom-table-editor__count-tables info-block'>
                    <Group>
                        <Text color='gray' size='sm'>Количество таблиц на странице:  </Text>

                        <ActionIcon color='red' variant='light' onClick={removeTable}>
                            <BsDash />
                        </ActionIcon>

                        <Text color='gray' size='sm'> {tables.length} </Text>

                        <ActionIcon color='blue' variant='light' onClick={addTable}>
                            <BsPlus />
                        </ActionIcon>
                    </Group>
                </div>
            </div>

            {
                tables.map((_, index) =>
                    <NewCustomTable key={index} index={index} removeTable={removeTable} />)
            }
        </>

    );
}