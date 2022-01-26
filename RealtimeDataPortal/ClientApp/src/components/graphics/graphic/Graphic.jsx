import { useState, useEffect, useRef } from 'react';
import { ActionIcon } from "@mantine/core";
import { IoExpand, IoContract } from 'react-icons/io5';

import { AppPreloader, ErrorsPage, useFormateDate, useRequest, Chart, TableForGraphic } from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();
    const [data, setData] = useState([]);
    const [sizeGraphic, setSizeGraphic] = useState({});
    const graphicContainer = useRef();

    const observer = useRef(
        new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setSizeGraphic({
                width: width - 70,
                height: height
            })
        })
    );

    useEffect(() => {
        observer.current.observe(graphicContainer.current);
    }, [graphicContainer, observer]);

    const table = isVisibleTable ? <TableForGraphic attributes={attributes} data={data} /> : null;

    const graphic =
        <div className='info-block'  ref={graphicContainer}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <Chart attributes={attributes} data={data} isScale={isScale} size={sizeGraphic}/>
                {table}
            </div>
        </div>

    useEffect(() => {
        let dataTemp = [];

        /* if (visibleToGraphic)
            request('GetGraphic', 'POST', JSON.stringify({
                TagName: tagName,
                StartDate: date.start,// !== null ? new Date(date.start) : null,
                EndDate: date.end,// !== null ? new Date(date.end) : null,
                Round: round,
                WwResolution: wwResolution,
                Calendar: calendar,
                ServerConnection: serverConnection
            }))
                .then(dataGraphic => {
                    if (Object.keys(dataGraphic).length !== 0) {
                        dataGraphic.history.forEach(item => {
                            const startDate = dataGraphic.history[0].dateTime;
                            const endDate = dataGraphic.history[dataGraphic.history.length - 1].dateTime;
                            
                            dataTemp.push({
                                name: formateDate(item.dateTime, calendar, startDate, endDate),
                                value: item.value
                            });
                        });
                        
                        setData(dataTemp);
                        setScale([dataGraphic.parameters.scaleMinEU, dataGraphic.parameters.scaleMaxEU]);
                        setProccess('confirmed');
                    }
                }); */

        setData([{ name: '01.01.2022', value: 4 }, { name: '02.01.2022', value: 6 }, { name: '03.01.2022', value: 1 },
            { name: '04.01.2022', value: 3 }, { name: '05.01.2022', value: 4 }, { name: '06.01.2022', value: 3 },
            { name: '07.01.2022', value: 6 }, { name: '08.01.2022', value: 9 }, { name: '09.01.2022', value: 5 }]);
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