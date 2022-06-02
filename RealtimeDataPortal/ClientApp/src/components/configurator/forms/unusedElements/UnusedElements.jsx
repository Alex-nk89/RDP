import {
    useState, useEffect, useRequest
    , Tabs
    , AppPreloader
} from '../..';
import './unusedElements.sass';

export const UnusedElements = () => {
    const { request } = useRequest();

    const [activeTab, setActiveTab] = useState(0);
    const [fetching, setFetching] = useState(false);
    const [listElements, setListElements] = useState([]);

    


    const listElementsView = (
        <div className='info-block'>
            132
        </div>
    );

    useEffect(() => {
        setFetching(true);

        request()
    }, [activeTab]);

    if(fetching) {
        return <AppPreloader height='calc(100vh - 116px)' />;
    }

    return (
        <div className='unused-elements'>
            <Tabs active={activeTab} onTabChange={setActiveTab} variant='pills' orientation='vertical'>
                <Tabs.Tab label='Теги'>
                    {listElementsView}
                </Tabs.Tab>

                <Tabs.Tab label='Продукты'>
                    {listElementsView}
                </Tabs.Tab>
            </Tabs>
        </div>
    );
};