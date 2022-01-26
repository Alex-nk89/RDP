import { useState, useEffect, useRef } from 'react';

import { AppPreloader, ErrorsPage, useRequest, Chart, TableForGraphic, useFormateDate } from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();

    const [data, setData] = useState([]);
    const widthGraphic = useRef();

    const observer = useRef(
        new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            console.log(entries[0].contentRect);
        })
    );

    useEffect(() => {
        observer.current.observe(widthGraphic.current);
    }, [widthGraphic, observer]);

    const table = isVisibleTable ? <TableForGraphic attributes={attributes} data={data} /> : null;

    const graphic =
        <div className='info-block' >
            <div className='header' ref={widthGraphic}>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <Chart attributes={attributes} data={data} isScale={isScale} />
                {table}
            </div>
        </div>

    useEffect(() => {
        if (visibleToGraphic)
            request('GetGraphic', 'POST', JSON.stringify({
                TagName: tagName,
                StartDate: date.start,
                EndDate: date.end,
                Round: round,
                WwResolution: wwResolution,
                Calendar: calendar,
                ServerConnection: serverConnection
            }))
                .then(dataGraphic => {
                    setData({
                        history: dataGraphic.history.map(item => {
                            const startDate = dataGraphic.history[0].dateTime;
                            const endDate = dataGraphic.history[dataGraphic.history.length - 1].dateTime;

                            return {
                                name: formateDate(item.dateTime, calendar, startDate, endDate),
                                value: item.value
                            }
                        }),
                        parameters: dataGraphic.parameters
                    });
                    setProccess('confirmed');
                }
                );
        //eslint-disable-next-line
    }, [date]);

    switch (proccess) {
        case 'loading':
            return <AppPreloader height='100px' />;
        case 'error':
            return <ErrorsPage {...error} height='400px' />;
        case 'confirmed':
            return graphic;
        default:
            return graphic;
    }
}

export default Graphic

/* if (Object.keys(dataGraphic).length !== 0) {
    setData(dataGraphic.history.map(item => {
        const startDate = dataGraphic.history[0].dateTime;
        const endDate = dataGraphic.history[dataGraphic.history.length - 1].dateTime;

        return {
            name: formateDate(item.dateTime, calendar, startDate, endDate),
            value: item.value
        }
    })); */