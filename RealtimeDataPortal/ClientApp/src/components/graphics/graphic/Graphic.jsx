import { useState, useEffect, useRef } from 'react';
import { ActionIcon } from "@mantine/core";
import { IoExpand, IoContract } from 'react-icons/io5';

import { AppPreloader, ErrorsPage, useFormateDate, useRequest, Chart, TableForGraphic } from '../Index';

const Graphic = ({ attributes, date, isScale, isVisibleTable }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProccess, error } = useRequest();
    const { formateDate } = useFormateDate();
    const [fullScreen, setFullScreen] = useState(false);
    let [data, setData] = useState([]);
    const [scale, setScale] = useState([]);

    const openFullScreen = () => setFullScreen(!fullScreen);

    const graphic =
        <div className={`info-block ${fullScreen ? 'fullscreen' : null}`}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>

                <ActionIcon onClick={openFullScreen}>
                    {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
                </ActionIcon>
            </div>

            <div id={`${tagName}`} className='graphic'>
                <Chart attributes={attributes} data={data} isScale={isScale} scale={scale}/>
                <TableForGraphic attributes={attributes} data={data} />
            </div>
        </div>

    useEffect(() => {
        let dataTemp = [];

        if (visibleToGraphic)
            request('GetGraphic', 'POST', JSON.stringify({
                TagName: tagName,
                StartDate: date.start !== null ? new Date(date.start) : null,
                EndDate: date.end !== null ? new Date(date.end) : null,
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
                                name: formateDate(item.dateTime, startDate, endDate),
                                value: item.value
                            });
                        });
                        
                        setData(dataTemp);
                        setScale([dataGraphic.minEU, dataGraphic.maxEU]);
                        setProccess('confirmed');
                    }
                });
    }, [date])

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