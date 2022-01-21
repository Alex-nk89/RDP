import { useState, useEffect } from 'react';
import { ActionIcon } from "@mantine/core";
import { IoExpand, IoContract } from 'react-icons/io5';

import { useRequest } from '../Index';
import { AppPreloader, ErrorsPage } from '../Index';

const Graphic = ({ attributes, date }) => {
    const { round, nameParameter, calendar, serverConnection, tagName, wwResolution } = { ...attributes };
    const { request, proccess, setProcces, error } = useRequest();
    const [fullScreen, setFullScreen] = useState(false);

    const openFullScreen = () => setFullScreen(!fullScreen);

    const graphic =
        <div className={`info-block ${fullScreen ? 'fullscreen' : null}`}>
            <div className='header'>
                <h5 className='title'>{nameParameter}</h5>

                <ActionIcon onClick={openFullScreen}>
                    {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
                </ActionIcon>
            </div>

            <div className='graphic'>
                213
            </div>
        </div>

    useEffect(() => {
        request('GetGraphic', 'POST', JSON.stringify({
            TagName: tagName,
            StartDate: date.start !== null ? new Date(date.start) : null,
            EndDate: date.end !== null ? new Date(date.end) : null,
            Round: round,
            WwResolution: wwResolution,
            Calendar: calendar,
            ServerConnection: serverConnection
        }))
        .then(dataGraphic => console.log(dataGraphic));
    }, [])

    switch (proccess) {
        case 'loading':
            return <AppPreloader height='100px' />;
        case 'error':
            return <ErrorsPage {...error} height='400px'/>;
        case 'confirmed':
            return graphic;
        default:
            return graphic;
    }
}

export default Graphic