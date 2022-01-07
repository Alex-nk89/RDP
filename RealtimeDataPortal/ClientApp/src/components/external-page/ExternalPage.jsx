import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useRequest } from "../../hooks/useRequest";
import ErrorsPage from "../errors-page/ErrorsPage";
import AppPreloader from "../loader/appPreloader";

import './externalPage.sass';

const ExternalPage = () => {
    const { id } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [externalPage, setExternalPage] = useState(null);

    useEffect(() => {
        request(`GetLink?id=${id}`)
            .then(externalPage => {
                if(Object.keys(externalPage) !== 0) {
                    setExternalPage(externalPage);
                    setProccess('confirmed');
                }
            });
            //eslint-disable-next-line
    }, [])

    const page = 
        <>
            <h3 className="title">{externalPage?.name}</h3>

            <div className="external-page"></div>
        </>


    switch(proccess) {
        case 'loading':
            return <AppPreloader height='95hv'/>;
        case 'confirmed':
            return page;
        case 'error':
            return <ErrorsPage {...error} nonFullHeight={true}/>;
        default:
            return null;
    }
}

export default ExternalPage;