import { Table } from '@mantine/core';

const TableForGraphic = ({ attributes, data }) => {
    const { calendar, round } = attributes;
    const history = { ...data.history };
    let countRows;

    if (calendar === 'month') {
        countRows = 10;
    } else {
        countRows = data.history ? Math.ceil(data.history.length / 3) : 0;
    }

    let decadeFirst = 0;
    let decadeSecond = 0;
    let decadeThird = 0;
    let tableData = [];

    for (let i = 0; i < countRows; i++) {
        tableData.push([
            history[i]?.name,
            history[i]?.value,
            '',
            history[i + countRows]?.name,
            history[i + countRows]?.value,
            '',
            history[i + countRows * 2]?.name,
            history[i + countRows * 2]?.value
        ]);

        decadeFirst += isNaN(history[i]?.value) ? 0 : history[i]?.value;
        decadeSecond += isNaN(history[i + countRows]?.value) ? 0 : history[i + countRows]?.value;
        decadeThird += isNaN(history[i + countRows * 2]?.value) ? 0 : history[i + countRows * 2]?.value;
    }

    if (data.length === 31) {
        tableData.push(['', '', '', '', history[31]?.name, history[31]?.value]);
        decadeThird += data[31]?.value
    }

    const tfoot = calendar === 'month' ?
        <tfoot>
            <tr>
                <th></th><th>{decadeFirst.toFixed(round)}</th><th></th>
                <th></th><th>{decadeSecond.toFixed(round)}</th><th></th>
                <th></th><th>{decadeThird.toFixed(round)}</th>
            </tr>
        </tfoot> : null;

    const thead =
        <thead>
            <tr>
                <th>Время</th><th>Значение</th><th></th>
                <th>Время</th><th>Значение</th><th></th>
                <th>Время</th><th>Значение</th>
            </tr>
        </thead>

    const tbody =
        <tbody>
            {tableData.map((item, index) =>
                <tr key={index}>
                    {item.map((value, index) => <td key={index}>{value}</td>)}
                </tr>)}
        </tbody>

    switch (calendar) {
        case 'range':
            return null;
        default:
            return (
                <Table striped className='table-rt'>
                    {thead}
                    {tbody}
                    {tfoot}
                </Table>
            )
    }
}

export default TableForGraphic;