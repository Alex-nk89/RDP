import { useState, useEffect } from 'react';
import { useResizeObserver } from '@mantine/hooks';

import { AppPreloader, ErrorsPage, useRequest, Chart, TableForGraphic, useFormateDate } from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();

    const [data, setData] = useState([]);
    const [widthGraphic, widthGraphicWrapper] = useResizeObserver();

    const table = isVisibleTable ? <TableForGraphic attributes={attributes} data={data} /> : null;

    const graphic =
        <div className='info-block' ref={widthGraphic} >
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <Chart attributes={attributes} data={data} isScale={isScale} width={widthGraphicWrapper.width - 60} />
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
                })
                .catch(error => { });
        /* setData({
            history: [
                { name: '1', value: 4 }, { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 5 },
                { name: '5', value: 7 }, { name: '6', value: 2 }, { name: '7', value: 1 }, { name: '8', value: 4 },
            ],
            parameters: { unit: 'кг', scaleMinEU: -20, scaleMaxEU: 20 }
        }) */

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