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
    const [scale, setScale] = useState([]);
    let [data, setData] = useState([]);
    const graphicContainer = useRef(null);
    const [widthGraphic, setWidthGraphic] = useState(800);

    const openFullScreen = () => setFullScreen(!fullScreen);

    const table = isVisibleTable && !fullScreen ? <TableForGraphic attributes={attributes} data={data} /> : null;

    const graphic =
        <div className={`info-block ${fullScreen ? 'fullscreen' : null}`}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>

                <ActionIcon onClick={openFullScreen}>
                    {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
                </ActionIcon>
            </div>

            <div id={`${tagName}`} className='graphic' ref={graphicContainer}>
                <Chart attributes={attributes} data={data} isScale={isScale} scale={scale} width={widthGraphic}/>
                {table}
            </div>
        </div>

    useEffect(() => {
        let dataTemp = [];

        if (visibleToGraphic)
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
                });
                //eslint-disable-next-line
    }, [date]);

    /* useEffect(() => {
        setWidthGraphic(graphicContainer.current.clientWidth - 150);
    }, [fullScreen]) */

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