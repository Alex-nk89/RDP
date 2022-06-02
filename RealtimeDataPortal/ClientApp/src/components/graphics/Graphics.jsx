import {
    useEffect,
    useParams,
    useSelector, useDispatch,
    ErrorsPage, AppPreloader, TabContent,
    useRequest
} from './Index';

import { initialStateGraphics, getAttributesForGraphic, fetchedAttributesGraphicError } from '../../reducers/graphicsSlice';
import './graphics.sass';

const Graphics = () => {
    const { request, error } = useRequest();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { statusFetchingGraphic, attributesGraphic, tabsNames } = useSelector(state => state.graphics);

    const tabsContent = tabsNames.length > 0 ? tabsNames.map((item, index) =>
        <TabContent key={index} index={index} />) : null;

    const graphic = Object.keys(attributesGraphic).length === 0 ? null : <>
        {tabsContent}
    </>;

    useEffect(() => {
        dispatch(initialStateGraphics());

        request(`GetAttributesForGraphic?id=${id}`)
            .then(attributesGraphic => dispatch(getAttributesForGraphic(attributesGraphic)))
            .catch(() => dispatch(fetchedAttributesGraphicError()));
        //eslint-disable-next-line
    }, [id]);

    switch (statusFetchingGraphic) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'confirmed':
            return graphic;
        case 'error':
            return <ErrorsPage {...error} height='calc(100vh - 116px)' />
        default:
            return null;
    }
}

export default Graphics;