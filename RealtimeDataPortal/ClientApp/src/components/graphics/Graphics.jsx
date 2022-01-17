import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


import { useRequest } from '../../hooks/useRequest';
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from '../loader/appPreloader';
import HeaderGraphics from './header/HeaderGraphics';

import './graphics.sass';

const Graphics = () => {
    const { request, error, proccess, setProccess } = useRequest();
    const { id } = useParams();
    const [attributesGraphic, setAttributesGraphic] = useState({});

    const graphic = <>
        <HeaderGraphics attributesGraphic={attributesGraphic} />
    </>;

    useEffect(() => {
        request(`GetAttributesForGraphic?id=${id}`)
            .then(attributesGraphic => {
                setAttributesGraphic(attributesGraphic);
                setProccess('confirmed');
            });
        //eslint-disable-next-line
    }, [id]);


    switch (proccess) {
        case 'loading':
            return <AppPreloader height />;
        case 'confirmed':
            return graphic;
        case 'error':
            return <ErrorsPage {...error} />
        default:
            return null;
    }
}

export default Graphics;