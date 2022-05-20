import {
    useState, useEffect
    , useSelector, useDispatch
    , useParams
    , useRequest, useFormateDate
    , ActionIcon
    , BsShareFill
    , AppPreloader, ErrorsPage, Table
} from '.';

import {
    fetchingCustomTable, fetchingCustomTableError, fetchingCustomTableEnd, initializeTables, initialTitle, initialTagsIds, initialTagsLiveValues
} from '../../reducers/customTableSlice';

import './customTable.sass';

export const CustomTable = () => {
    const { request, error } = useRequest();
    const { formateDate } = useFormateDate();
    const dispatch = useDispatch();
    const { statusFetcing, title, tables } = useSelector(state => state.customTable);
    const { id } = useParams();
    const [updateTable, setUpdateTable] = useState(0);
    const [updateDate, setUpdateDate] = useState();

    const customTables = tables.map((table, indexTable) =>
        <Table key={table.customTableId} indexTable={indexTable} />)

    useEffect(() => {
        const updateTable = setTimeout(() => {
            setUpdateTable(updateTable + 1);
        }, 57000);

        dispatch(fetchingCustomTable());

        request(`GetCustomTable?id=${id}`)
            .then(({ customTable, title, listTagsIds }) => {
                dispatch(initializeTables(customTable));
                dispatch(initialTitle(title));
                dispatch(initialTagsIds(listTagsIds));

                return listTagsIds;
            })
            .then((listTagsIds) => {
                request('GetLiveValueTags', 'POST', JSON.stringify(listTagsIds))
                    .then(data => {
                        dispatch(initialTagsLiveValues(data));
                    })
                    .then(() => setUpdateDate(formateDate(new Date())));
            })
            .then(() => dispatch(fetchingCustomTableEnd()))
            .catch(() => dispatch(fetchingCustomTableError()));

        return () => clearTimeout(updateTable);
        //eslint-disable-next-line
    }, [id, updateTable]);

    if (statusFetcing === 'loading' && updateTable < 2) {
        return <AppPreloader height='calc(100vh - 116px)' />
    }

    if (statusFetcing === 'error') {
        return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
    }

    return (
        <div className='custom-table'>
            <div className='custom-table__header'>
                <div>
                    <h3 className=''>{title}</h3>

                    <ActionIcon>
                        <BsShareFill size={18} />
                    </ActionIcon>
                </div>

                <div>
                    Данные получены: {updateDate}
                </div>
            </div>

            {customTables}
        </div>
    );
};