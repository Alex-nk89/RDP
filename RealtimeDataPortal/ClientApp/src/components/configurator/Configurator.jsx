import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { useRequest } from "../../hooks/useRequest";
import AppPreloader from "../loader/appPreloader";
import ErrorsPage from '../errors-page/ErrorsPage';



const Configurator = () => {
    const { id, operation } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [componentInfo, setComponentInfo] = useState({});

    useEffect(() => {
        request(`GetComponentInformation?id=${id}`)
            .then(componentInfo => {
                if(Object.keys(componentInfo).length !== 0) {
                    setComponentInfo(componentInfo);
                    setProccess('confirmed');
                    console.log(componentInfo);
                }
            })
        //eslint-disable-next-line
    }, [])

    switch (proccess) {
        case 'loading':
            return <AppPreloader height />;
        case 'confirmed':
            return <p>{operation} {id}</p>;
        case 'error':
            return <ErrorsPage {...error}/>;
        default:
            return null;
    }
}

export default Configurator;