import { useState, useEffect } from 'react';
import { Select } from '@mantine/core';

const getLabelDate = (date) => {
    const labelDate = new Date(date);
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
        'Октябрь', 'Ноябрь', 'Декабрь'];

    return `${months[labelDate.getMonth()]} ${labelDate.getFullYear()}г.`
}

const getDates = () => {
    let dates = [];

    for (let i = 0; i < 12; i++) {
        const date = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);

        dates.push({
            value: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            label: getLabelDate(date)
        });
    }

    return dates;
}

const MonthCalendar = ({ setDate }) => {
    const [month, setMonth] = useState(null);
    const selectOptions = getDates();

    useEffect(() => {
        if (month) {
            setDate({
                start: new Date(new Date(month).getFullYear(), new Date(month).getMonth(), 1),
                end: new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 1)
            })
        }
        //eslint-disable-next-line
    }, [month]);

    return (
        <Select
            placeholder='Выберите месяц'
            size='xs'
            value={month}
            onChange={setMonth}
            data={selectOptions} />
    )
}

export default MonthCalendar;