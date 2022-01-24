import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorsPage, AppPreloader, TabContent, useRequest} from './Index';

import './graphics.sass';

const Graphics = () => {
    const { request, error, proccess, setProccess } = useRequest();
    const { id } = useParams();
    const [attributesGraphic, setAttributesGraphic] = useState({});
    const [activeTab, setActiveTab] = useState(0);

    const [isScale, setIsScale] = useState(false);
    const [isVisibleTable, setIsVisibleTable] = useState(true);

    const tabsNames = Object.keys(attributesGraphic).length === 0 ? [] :
        [...new Set(attributesGraphic.map(item => item.typeName))];

    const tabsContent = tabsNames.length > 0 ? tabsNames.map((item, index) =>
        <TabContent 
            key={index} 
            attributesGraphic={attributesGraphic} 
            tabName={item} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            index={index}
            tabsNames={tabsNames}
            isScale={isScale}
            setIsScale={setIsScale}
            isVisibleTable={isVisibleTable}
            setIsVisibleTable={setIsVisibleTable} />) : null;

    const graphic = Object.keys(attributesGraphic).length === 0 ? null : <>
        {tabsContent}
    </>;

    useEffect(() => {
        request(`GetAttributesForGraphic?id=${id}`)
            .then(attributesGraphic => {
                if (Object.keys(attributesGraphic).length !== 0) {
                    setAttributesGraphic(attributesGraphic);
                    setProccess('confirmed');
                }
            });
        //eslint-disable-next-line
    }, [id]);


    switch (proccess) {
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