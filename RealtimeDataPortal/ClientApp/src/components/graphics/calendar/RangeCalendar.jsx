import { useState, useEffect } from 'react';
import { Select, Button, Space } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IoSync } from 'react-icons/io5';
import 'dayjs/locale/ru';

const selectList = [
    { value: "1", label: "Последние 10 минут" },
    { value: "2", label: "Последние 15 минут" },
    { value: "3", label: "Последние 30 минут" },
    { value: "4", label: "Последний час" },
    { value: "5", label: "Последние 2 часа" },
    { value: "6", label: "Последние 4 часа" },
    { value: "7", label: "Последние 8 часов" },
    { value: "8", label: "Последние 12 часов" },
    { value: "9", label: "За сутки" },
    { value: "10", label: "За период" },
];

const RangeCalendar = ({ setDate }) => {
    const [select, setSelect] = useState(null);
    const [visibleCalendarDay, setVisibleCalendarDay] = useState(false);
    const [visibleCalendarRange, setVisibleCalendarRange] = useState(false);
    const [startDayRange, setStartDayRange] = useState(new Date());
    const [startTimeRange, setStartTimeRange] = useState(new Date());
    const [endDayRange, setEndDayRange] = useState(new Date());
    const [endTimeRange, setEndTimeRange] = useState(new Date());
    const [errorDate, setErrorDate] = useState(false);
    const settingsCalendar = {
        size: 'xs',
        local:'ru',
        inputFormat: "DD.MM.YYYY",
        placeholder: 'Выберите дату'
    }

    const choiseDay = selectDate => {
        setDate({
            start: new Date(selectDate),
            end: new Date(new Date(selectDate).setDate(new Date(selectDate).getDate() + 1))
        })
    }

    const selectDay = visibleCalendarDay ? <>
        <DatePicker onChange={choiseDay} {...settingsCalendar} />
    </> : null;

    const choiseRange = () => {
        const startTime = new Date(startTimeRange);
        const endTime = new Date(endTimeRange);

        const startDate = new Date(startDayRange);
        startDate.setHours(startTime.getHours());
        startDate.setMinutes(startTime.getMinutes());

        const endDate = new Date(endDayRange);
        endDate.setHours(endTime.getHours());
        endDate.setMinutes(endTime.getMinutes());

        setErrorDate(false);

        if(startDate < endDate) {
            setDate({
                start: startDate,
                end: endDate
            })
        } else {
            setErrorDate(true);
        }
    }

    const selectRange = visibleCalendarRange ? <>
        <DatePicker value={startDayRange} onChange={setStartDayRange} {...settingsCalendar} local='ru'/>
        <Space w="xs" />
        <TimeInput value={startTimeRange} onChange={setStartTimeRange} size='xs'/>
        <Space w="xs" />

        <span> - </span>
        <Space w="xs" />

        <DatePicker value={endDayRange} onChange={setEndDayRange} {...settingsCalendar} error={errorDate}/>
        <Space w="xs" />
        <TimeInput value={endTimeRange} onChange={setEndTimeRange} size='xs' error={errorDate}/>
        <Space w="xs" />

        <Button onClick={choiseRange} compact variant='light' size='md'>
            <IoSync size={16} color='gray'/>
        </Button>
    </> : null;

    useEffect(() => {
        const endDate = new Date();
        setVisibleCalendarDay(false);
        setVisibleCalendarRange(false);

        switch (select) {
            case '1':
                setDate({
                    start: new Date(new Date().setMinutes(new Date().getMinutes() - 10)),
                    end: endDate
                });
                break;
            case '2':
                setDate({
                    start: new Date(new Date().setMinutes(new Date().getMinutes() - 15)),
                    end: endDate
                });
                break;
            case '3':
                setDate({
                    start: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
                    end: endDate
                });
                break;
            case '4':
                setDate({
                    start: new Date(new Date().setHours(new Date().getHours() - 1)),
                    end: endDate
                });
                break;
            case '5':
                setDate({
                    start: new Date(new Date().setHours(new Date().getHours() - 2)),
                    end: endDate
                });
                break;
            case '6':
                setDate({
                    start: new Date(new Date().setHours(new Date().getHours() - 4)),
                    end: endDate
                });
                break;
            case '7':
                setDate({
                    start: new Date(new Date().setHours(new Date().getHours() - 8)),
                    end: endDate
                });
                break;
            case '8':
                setDate({
                    start: new Date(new Date().setHours(new Date().getHours() - 12)),
                    end: endDate
                });
                break;
            case '9':
                setVisibleCalendarDay(true);
                break;
            case '10':
                setVisibleCalendarRange(true);
                break;
            default:
                break;
        }
        //eslint-disable-next-line
    }, [select])

    return (
        <div className='settings__calendar__choise-date'>
            <Select size='xs' data={selectList} value={select} onChange={setSelect} placeholder='Выберите время'/>
            <Space w="xs" />

            {selectDay}
            {selectRange}
        </div>
    )
}

export default RangeCalendar;