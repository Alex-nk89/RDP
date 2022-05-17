import {
    useEffect
    , useSelector, useDispatch
    , useParams
    , useRequest
    , ActionIcon
    , BsShareFill
    , AppPreloader, ErrorsPage, Table
} from '.';
import './customTable.sass';
import { fetchingCustomTable, fetchingCustomTableError, fetchingCustomTableEnd, initializeTables, initialTitle } from '../../reducers/customTableSlice';

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
            .then(({ customTable, title }) => {
                dispatch(initializeTables(customTable));
                dispatch(initialTitle(title));
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