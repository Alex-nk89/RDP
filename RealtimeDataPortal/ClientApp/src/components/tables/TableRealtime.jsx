import { useEffect, useState, useParams, useRequest, AppPreloader, ErrorsPage, SaveToExcel, TableWrapper } from './Index';
import './table.sass';

const TableRealtime = () => {
    const { id } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [tableData, setTableData] = useState([]);
    const [updateTable, setUpdateTable] = useState(0);

    const tableRealtime = (
        <div className='info-block info-block__table'>
            <div className='header'>
                <h5 className='title'>{tableData[0]?.name}</h5>
                <SaveToExcel />
            </div>

            <TableWrapper data={tableData} />
        </div>
    )

    useEffect(() => {
        const updateTable = setTimeout(() => {
            setUpdateTable(updateTable + 1);
        }, 57000);

        request(`GetTableRealtime?id=${id}`)
            .then(tableData => {
                setTableData(tableData);
                setProccess('confirmed');
            })
            .catch(error => { });

        return () => clearTimeout(updateTable);
        //eslint-disable-next-line
    }, [id, updateTable]);

    switch (proccess) {
        case 'loading':
            return updateTable === 0 ? <AppPreloader height='calc(100vh - 116px)' /> : tableRealtime;
        case 'error':
            return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
        case 'confirmed':
            return tableRealtime;
        default:
            return null;
    }
}

export default TableRealtime;