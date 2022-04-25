import { Col } from '@mantine/core';
import {
    useState, useMemo,
    useSelector,
    Grid,
    HeaderGraphics, Graphic, Settings, TabsHeader
} from '../Index';

import './tabs.sass';

const TabContent = ({ index }) => {
    const { attributesGraphic, activeTab, tabsNames, isDoubleView } = useSelector(state => state.graphics);

    const [date, setDate] = useState({
        start: null,
        end: null
    });

    const parameter = attributesGraphic.filter(item => item.typeName === tabsNames[index]);
    const calendar = parameter.find(parameter => parameter.calendar)?.calendar;

    const graphic = useMemo(() => {
        return parameter.map(item => {
            if (item.visibleToGraphic) {
                return (
                    <Col key={item.tagId} span={isDoubleView ? 6 : 12}>
                        <Graphic attributes={item} index={index} date={date} />
                    </Col>
                )
            } else return null;
        }

        );

        //eslint-disable-next-line
    }, [date, isDoubleView]);

    return (
        <div className={`tab-content ${activeTab === index ? 'tab-content_visible' : null}`}>
            <div className='tab-content__header'>
                <HeaderGraphics />

                <Settings calendar={calendar} setDate={setDate} />
            </div>
            <TabsHeader />

            <Grid justify='center'>
                {graphic}
            </Grid>
        </div>
    );
}

export default TabContent;