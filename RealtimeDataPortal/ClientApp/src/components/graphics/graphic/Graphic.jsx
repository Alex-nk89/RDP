import { useState, useEffect } from 'react';
import { useResizeObserver } from '@mantine/hooks';

import { AppPreloader, ErrorsPage, useRequest, Chart, TableForGraphic, useFormateDate } from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    console.log('render');
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();

    const [data, setData] = useState([]);
    //const [graphicRef, widthGraphic] = useResizeObserver();
    //const [width, setWidth] = useState(700);

    //const table = (isVisibleTable && proccess === 'confirmed' && calendar !== 'range') ?
    //    <TableForGraphic attributes={attributes} data={data} /> : null;

    useEffect(() => {
        //setWidth(graphicRef.current.offsetWidth);

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
                    /* setData({
                        history: dataGraphic.history.map(item => {
                            const startDate = dataGraphic.history[0].dateTime;
                            const endDate = dataGraphic.history[dataGraphic.history.length - 1].dateTime;

                            return {
                                name: formateDate(item.dateTime, calendar, startDate, endDate),
                                value: item.value
                            }
                        }),
                        parameters: dataGraphic.parameters
                    }); */
                    setProccess('confirmed');
                })
                .catch(error => { });
        //setData({
        //    history: [
        //        { name: '1', value: 4 }, { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 5 },
        //        { name: '5', value: 7 }, { name: '6', value: 2 }, { name: '7', value: 1 }, { name: '8', value: 4 },
        //    ],
        //    parameters: { unit: 'кг', scaleMinEU: -20, scaleMaxEU: 20 }
        //})

        //eslint-disable-next-line
    }, [date]);

    /* useEffect(() => {
        setWidth(Math.floor(widthGraphic.width / 100) * 100);
    }, [widthGraphic.width]); */

    /* return (
        <div className='info-block' ref={graphicRef}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <Chart attributes={attributes} data={data} isScale={isScale} width={width - 60} />
                {table}
            </div>
        </div>
    ); */
    switch(proccess){
        case 'loading':
            return <AppPreloader />;
        default:
            return null;
    }
}

export default Graphic