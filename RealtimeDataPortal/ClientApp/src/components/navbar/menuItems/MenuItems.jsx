import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@mantine/core';

import { useRequest } from '../../../hooks/useRequest';
import Folder from './menuItem/folder/Folder';
import Page from './menuItem/page/Page';

const MenuItems = ({ isConfigModeOn }) => {
    const { request, proccess, setProccess } = useRequest();
    const [items, setItems] = useState([]);

    const menuItems = items.map(({ id, name, isFullView, type, idComponent }) =>
        type === 'folder' ?
            <Folder key={id} id={id} name={name} isFullView={isFullView} isConfigModeOn={isConfigModeOn} /> :
            <Page key={id} id={id} name={name} type={type} idComponent={idComponent} isConfigModeOn={isConfigModeOn} />);

    const menu = (proccess, menuItems) => {
        switch (proccess) {
            case 'loading':
                return <Skeleton height="2.2em" className="skeleton" />;
            case 'confirmed':
                return menuItems;
            default:
                return null;
        }
    }

    useEffect(() => {
        request(`GetMenu`, 'POST', JSON.stringify({}))
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