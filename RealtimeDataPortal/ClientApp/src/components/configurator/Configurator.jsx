import {
    useEffect, useParams, useRequest, useDispatch, useSelector, AppPreloader, ErrorsPage, Tag,
    Product, AddChangeElement, InstructionForConfigurator, AddChangeTableRT
} from './index';
import './configurator.sass';

import { fetchingComponentInfo, operationInitialize, initializeComponentInfo } from '../../actions';

const Configurator = () => {
    const { id, operation } = useParams();
    const dispatch = useDispatch();
    const { statusFetchingComponentInfo, componentInfo } = useSelector(state => state.configurator);
    const { request, error } = useRequest();

    useEffect(() => {
        dispatch(operationInitialize(operation));

        if (operation !== 'change-tag' && operation !== 'change-product') {
            dispatch(fetchingComponentInfo());

            request(`GetComponentInformation?id=${id}&operation=${operation}`)
                .then(componentInfo => dispatch(initializeComponentInfo(componentInfo)))
                .catch(() => { })
        }

        //eslint-disable-next-line
    }, [id, operation]);

    const form = function () {
        if (operation === 'change-tag') {
            return <Tag />;
        }

        if (operation === 'change-product') {
            return <Product />;
        }

        if (Object.keys(componentInfo).length > 0) {
            if (['add-table', 'change-table'].includes(operation)) {
                return <AddChangeTableRT />;
            }

            if (operation === 'instruction') {
                return <InstructionForConfigurator />;
            }

            if (['add-folder', 'change-folder', 'add-externalPage', 'change-externalPage', 'add-graphic', 'change-graphic'].includes(operation)) {
                return <AddChangeElement />;
            }

            return null;
        }

        return null;
    }();

    switch (statusFetchingComponentInfo) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'idle':
            return form;
        case 'error':
            return <ErrorsPage {...error} />;
        default:
            return null;
    }
}

export default Configurator;