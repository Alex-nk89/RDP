import { Table } from '@mantine/core';

const TableForGraphic = ({ attributes, data }) => {
    const { calendar } = attributes;
    const countRows = calendar === 'day' ? 8 : 10;

    const thead =
        <thead>
            <tr>
                <th>Время</th><th>Значение</th>
                <th>Время</th><th>Значение</th>
                <th>Время</th><th>Значение</th>
            </tr>
        </thead>

    switch (calendar) {
        case 'range':
            return null;
        default:
            return (
                <Table striped>
                    {thead}
                </Table>
            )
    }
}

export default TableForGraphic;