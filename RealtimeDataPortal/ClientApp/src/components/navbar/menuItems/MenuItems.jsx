import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@mantine/core';

import { useRequest } from '../../../hooks/useRequest';
import Folder from './menuItem/folder/Folder';
import Page from './menuItem/page/Page';

const MenuItems = ({ isConfigModeOn }) => {
    const { request, proccess, setProccess } = useRequest();
    const [items, setItems] = useState([]);

    const menuItems = items.map(item =>
        item.type === 'folder' ?
            <Folder key={item.id} id={item.id} name={item.name} isFullView={item.isFullView} isConfigModeOn={isConfigModeOn}/> :
            <Page key={item.id} id={item.id} name={item.name} type={item.type} isConfigModeOn={isConfigModeOn}/>);

    const menu = (proccess, menuItems) => {
        switch (proccess) {
            case 'loading':
                return <Skeleton width={200} height={15} />;
            case 'confirmed':
                return menuItems;
            default:
                return <p>Error</p>;
        }
    }

    useEffect(() => {
        request('GetMenu?parentId=0')
            .then(menuItems => setItems(menuItems))
            .then(() => setProccess('confirmed'));
        //eslint-disable-next-line
    }, []);

    const itemsBlock = useMemo(() => {
        return menu(proccess, menuItems);
        //eslint-disable-next-line
    }, [proccess, isConfigModeOn])


    return (
        <>
            {itemsBlock}
        </>
    )
}

export default MenuItems;