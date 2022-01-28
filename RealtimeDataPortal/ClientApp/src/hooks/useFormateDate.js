import { useCallback } from "react"

export const useFormateDate = () => {
    const formateDate = useCallback((date, calendar, startDate, endDate) => {
        date = new Date(date);

        const differenceInTime = calendar === 'range' ? ((new Date(endDate)) - (new Date(startDate))) : 0;

        let ss = date.getSeconds();
        let mm = date.getMinutes();
        let hh = date.getHours();
        let dd = date.getDate();
        let MM = date.getMonth() + 1;
        const yyyy = date.getFullYear();

        if (ss < 10) ss = `0${ss}`;
        if (mm < 10) mm = `0${mm}`;
        if (hh < 10) hh = `0${hh}`;
        if (dd < 10) dd = `0${dd}`;
        if (MM < 10) MM = `0${MM}`;

        switch (calendar) {
            case 'range':
                if (differenceInTime <= 86400000)
                    return `${hh}:${mm}`;
                else
                    return `${dd}.${MM}.${yyyy} ${hh}:${mm}`;
            case 'day':
                return `${hh}:00`;
            case 'month':
                return `${dd}.${MM}.${yyyy}`;
            default:
                return `${dd}.${MM}.${yyyy} ${hh}:${mm}:${ss}`;
        }
    }, []);

    return { formateDate };
}
