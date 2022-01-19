import { MonthCalendar, DayCalendar, RangeCalendar } from '../Index';

const Calendar = ({ calendar, setDate }) => {

    switch (calendar) {
        case 'month':
            return <MonthCalendar setDate={setDate} />;
        case 'day':
            return <DayCalendar setDate={setDate} />;
        case 'range':
            return <RangeCalendar setDate={setDate} />
        default:
            return null;
    }
}

export default Calendar;