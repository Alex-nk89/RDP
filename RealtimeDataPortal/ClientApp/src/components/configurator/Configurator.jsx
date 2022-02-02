import { useState, useEffect, useParams, useRequest, AppPreloader, ErrorsPage, AddChangeFolder, AddChangeExternalPage, Tag } from './index';
import './configurator.sass';

const Configurator = ({ updatingNavbar }) => {
    const { id, operation } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [componentInfo, setComponentInfo] = useState({});

    function form(componentInfo) {
        switch (operation) {
            case 'add-folder':
                return <AddChangeFolder componentInfo={componentInfo} type="add" updatingNavbar={updatingNavbar} />;
            case 'change-folder':
                return <AddChangeFolder componentInfo={componentInfo} type="change" updatingNavbar={updatingNavbar} />;
            case 'add-external-page':
                return <AddChangeExternalPage componentInfo={componentInfo} type="add" updatingNavbar={updatingNavbar} />;
            case 'change-external-page':
                return <AddChangeExternalPage componentInfo={componentInfo} type="change" updatingNavbar={updatingNavbar} />;
            case 'change-tag':
                return <Tag />;
            default:
                return null;
        }
    }

    useEffect(() => {
        if (operation !== 'change-tag') {
            request(`GetComponentInformation?id=${id}&operation=${operation}`)
                .then(componentInfo => {
                    if (Object.keys(componentInfo).length !== 0) {
                        setComponentInfo(componentInfo);
                        setProccess('confirmed');
                    }
                });
        } else {
            setProccess('confirmed');
        }
        //eslint-disable-next-line
    }, [id, operation])

    switch (proccess) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'confirmed':
            return form(componentInfo);
        case 'error':
            return <ErrorsPage {...error} />;
        default:
            return null;
    }
}

export default Configurator;