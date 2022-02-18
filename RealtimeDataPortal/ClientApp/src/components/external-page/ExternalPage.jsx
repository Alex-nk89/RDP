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
                setExternalPage(externalPage);
                setProccess('confirmed');
            })
            .catch(() => { });
        //eslint-disable-next-line
    }, [id])

    const page =
        <>
            <h3 className="title">{externalPage?.name}</h3>

            <div className="info-block external-page">
                <iframe title={externalPage?.link} src={externalPage?.link} width='100%' height='100%' seamless></iframe>
            </div>
        </>


    switch (proccess) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 122px)' />;
        case 'confirmed':
            return page;
        case 'error':
            return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
        default:
            return null;
    }
}

export default ExternalPage;