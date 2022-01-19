import { Tabs } from '@mantine/core';

import './tabs.sass';

const TabsHeader = ({ tabsNames, activeTab, setActiveTab }) => {

    const tabs = tabsNames.map((item, index) =>
        <Tabs.Tab key={index} label={item} > </Tabs.Tab>)

    return (
        <div className='tabs'>
            <Tabs variant='pills' position='center' tabPadding={0} active={activeTab} onTabChange={setActiveTab}>
                {tabs}
            </Tabs>
        </div>
    )
}

export default TabsHeader;
