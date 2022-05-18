import {
    useEffect
    , useSelector, useDispatch
    , useParams
    , useRequest
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
    const dispatch = useDispatch();
    const { statusFetcing, title, tables } = useSelector(state => state.customTable);
    const { id } = useParams();

    const customTables = tables.map((table, indexTable) =>
        <Table key={table.customTableId} indexTable={indexTable} />)

    useEffect(() => {
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
            })
            .then(() => dispatch(fetchingCustomTableEnd()))
            .catch(() => dispatch(fetchingCustomTableError()));
        //eslint-disable-next-line
    }, [id]);

    if (statusFetcing === 'loading') {
        return <AppPreloader height='calc(100vh - 116px)' />
    }

    if (statusFetcing === 'error') {
        return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
    }

    return (
        <div className='custom-table'>
            <div className='custom-table__header'>
                <h3 className=''>{title}</h3>

                <ActionIcon>
                    <BsShareFill size={18} />
                </ActionIcon>
            </div>

            {customTables}
        </div>
    );
};