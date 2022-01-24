import { useCallback } from "react"

export const useFormateDate = () => {
    const formateDate = useCallback((date, startDate, endDate) => {
        date = new Date(date);

        const differenceInTime = ((new Date(endDate)) - (new Date(startDate)));

        let mm = date.getMinutes();
        let hh = date.getHours();
        let dd = date.getDate();
        let MM = date.getMonth() + 1;
        const yyyy = date.getFullYear();

        if (mm < 10) mm = `0${mm}`;
        if (hh < 10) hh = `0${hh}`;
        if (dd < 10) dd = `0${dd}`;
        if (MM < 10) MM = `0${MM}`;

        if (differenceInTime <= 86400000)
            return `${hh}:${mm}`;
        else if (differenceInTime > 86400000 && differenceInTime <= 2678400000)
            return `${dd}.${MM}.${yyyy}`;
        else return `${dd}.${MM}.${yyyy} ${hh}:${mm}`;
    }, []);

    return { formateDate };
}
