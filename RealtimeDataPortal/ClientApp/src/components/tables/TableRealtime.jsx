import { useEffect, useState, useParams, useRequest, AppPreloader, ErrorsPage, SaveToExcel, TableWrapper } from './Index';
import './table.sass';

const TableRealtime = () => {
    const { id } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [tableData, setTableData] = useState([]);

    //const saveToExcel

    const tableRealtime = (
        <div className='info-block info-block__table'>
            <div className='header'>
                <h5 className='title'>{tableData[0]?.attributes.name}</h5>
                <SaveToExcel />
            </div>

            <TableWrapper data={tableData}/>
        </div>
    )

    useEffect(() => {
        request(`GetTableRealtime?id=${id}`)
        .then(tableData => {
            if(Object.keys(tableData).length !== 0) {
                setTableData(tableData);
                setProccess('confirmed');
            }
        })

        //eslint-disable-next-line
    }, [id]);

    switch(proccess) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'error':
            return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
        case 'confirmed':
            return tableRealtime;
        default:
            return null;
    }
}

export default TableRealtime;