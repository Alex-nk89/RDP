import { useCallback } from "react"

export const useFormateDate = () => {
    const formateDate = useCallback(( date, type ) => {
        let mm = date.getMinutes();
        let hh = date.getHours();
        let dd = date.getDate();
        let MM = date.getMonth();
        const yyyy = date.getYear();

        if(mm < 10) mm = `0${mm}`;
        if(hh < 10) hh = `0${hh}`;
        if(dd < 10) dd = `0${dd}`;
        if(MM < 10) MM = `0${MM}`;

        switch(type){
            case 'time':
                return `${hh}:${mm}`;
            case 'day':
                return `${dd}.${MM}.${yyyy}`;
            default:
                return `${dd}.${MM}.${yyyy} ${hh}:${mm}`;
        }
    }, []);

    return { formateDate };
}
