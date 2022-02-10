import {
    useState, useEffect, useParams, useRequest, AppPreloader, ErrorsPage, Tag,
    Product, AddChangeElement, InstructionForConfigurator
} from './index';
import './configurator.sass';

const Configurator = ({ updatingNavbar }) => {
    const { id, operation } = useParams();
    const { request, proccess, setProccess, error } = useRequest();
    const [componentInfo, setComponentInfo] = useState({});

    useEffect(() => {

        if (operation !== 'change-tag' && operation !== 'change-product') {
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
    }, [id, operation]);

    function form(componentInfo) {

        switch (operation) {
            case 'change-tag':
                return <Tag />;
            case 'change-product':
                return <Product />;
            case 'instruction':
                return <InstructionForConfigurator />
            default:
                if(Object.keys(componentInfo).length > 0) {
                    return <AddChangeElement operation={operation} componentInfo={componentInfo} updatingNavbar={updatingNavbar} />;
                } else {
                    return null;
                }
                
        }
    }

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