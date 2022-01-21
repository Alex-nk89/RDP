import { useState, useEffect } from 'react';
import { ActionIcon } from "@mantine/core";
import { IoExpand, IoContract } from 'react-icons/io5';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

import { AppPreloader, ErrorsPage, useFormateDate, useRequest } from '../Index';

const Graphic = ({ attributes, date }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution, visibleToGraphic,
        position } = { ...attributes };
    const { request, proccess, setProcces, error } = useRequest();
    const { formateDate } = useFormateDate();
    const [fullScreen, setFullScreen] = useState(false);
    const [history, setHistory] = useState([]);

    const openFullScreen = () => setFullScreen(!fullScreen);

    const graphic =
        <div className={`info-block ${fullScreen ? 'fullscreen' : null}`}>
            <div className='header'>
                <h5 className='title'>{nameParameter}, поз. {position}</h5>

                <ActionIcon onClick={openFullScreen}>
                    {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
                </ActionIcon>
            </div>

            <div className='graphic'>
                <ResponsiveContainer>
                    <LineChart data={history}>
                        <Line type='linear' dataKey='value' strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

    useEffect(() => {
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
                        Object.keys(dataGraphic.history).forEach(item => {
                            history.push({
                                name: formateDate(item.datetime, attributes[0].calendar),
                                value: item.value,
                                unit: dataGraphic.parameters.unit
                            });
                        });

                        setProcces('confirmed');
                    }
                });
    }, [])

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