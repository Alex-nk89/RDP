import { useSelector, useDispatch, Tabs } from '../Index';
import { setActiveTab } from '../../../reducers/graphicsSlice';
import './tabs.sass';

const TabsHeader = () => {
    const { tabsNames, activeTab } = useSelector(state => state.graphics);
    const dispatch = useDispatch();

    const tabs = tabsNames.map((item, index) =>
        <Tabs.Tab key={index} label={item} > </Tabs.Tab>);

    const choiseTab = (numberTab) => {
        dispatch(setActiveTab(numberTab));
    }

    return (
        <div className='tabs'>
            <Tabs variant='pills' position='center' tabPadding={0} active={activeTab} onTabChange={choiseTab}>
                {tabs}
            </Tabs>
        </div>
    )
}

export default TabsHeader;
