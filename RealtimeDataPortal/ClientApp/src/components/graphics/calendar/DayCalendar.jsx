import { useState, useEffect } from 'react';
import 'dayjs/locale/ru';
import { DatePicker } from '@mantine/dates';

const DayCalendar = ({ setDate }) => {
    const [day, setDay] = useState(null);
    const settingsCalendar = {
        size: 'xs',
        local:'ru',
        inputFormat: "DD.MM.YYYY"
    }

    useEffect(() => {
        if(day) {
            const date = new Date(day);

            setDate({
                start: new Date(day),
                end: new Date(date.setDate(new Date(day).getDate() + 1))
            })
        }
        //eslint-disable-next-line
    }, [day])

    return (
        <DatePicker 
            placeholder='Выберите день'
            {...settingsCalendar}
            value={day}
            onChange={setDay}/>
    )
}

export default DayCalendar;