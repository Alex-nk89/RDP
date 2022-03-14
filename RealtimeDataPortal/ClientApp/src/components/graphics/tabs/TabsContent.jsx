import {
    useState, useMemo,
    useSelector,
    HeaderGraphics, Graphic, Settings, TabsHeader
} from '../Index';

import './tabs.sass';

const TabContent = ({ index }) => {
    const { attributesGraphic, activeTab, tabsNames } = useSelector(state => state.graphics);

    const [date, setDate] = useState({
        start: null,
        end: null
    });

    const parameter = attributesGraphic.filter(item => item.typeName === tabsNames[index]);

    const graphic = useMemo(() => {
        return parameter.map(item =>
            <Graphic key={item.tagId} attributes={item} index={index} date={date} />);

        //eslint-disable-next-line
    }, [date]);

    return (
        <div className={`tab-content ${activeTab === index ? 'tab-content_visible' : null}`}>
            <div className='tab-content__header'>
                <HeaderGraphics />

                <Settings calendar={parameter[0].calendar} setDate={setDate} />
            </div>
            <TabsHeader />
            {graphic}
        </div>
    );
}

export default TabContent;