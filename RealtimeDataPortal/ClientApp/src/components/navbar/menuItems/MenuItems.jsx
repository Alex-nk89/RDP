import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from '@mantine/core';

import { useRequest } from '../../../hooks/useRequest';
import { useNotification } from '../../../hooks/useNotification';
import Folder from './menuItem/folder/Folder';
import Page from './menuItem/page/Page';

const MenuItems = () => {

    const { request, proccess, setProccess } = useRequest();
    const { show } = useNotification();
    const { configMode, updateNavbar } = useSelector(state => state.navbar);
    const [items, setItems] = useState([]);

    const menuItems = items.map(({ id, name, componentId, isFullView, type }) =>
        type === 'folder' ?
            <Folder
                key={id}
                id={id}
                name={name}
                isFullView={isFullView}
            /> :
            <Page
                key={id}
                id={id}
                name={name}
                componentId={componentId}
                type={type}
            />);

    const menu = (proccess, menuItems) => {
        switch (proccess) {
            case 'loading':
                return <Skeleton height="2.7em" className="skeleton" />;
            case 'confirmed':
                return menuItems;
            default:
                return null;
        }
    }

    useEffect(() => {
        request(`GetMenu`, 'POST', JSON.stringify({}))
            .then(menuItems => {
                setItems(menuItems);
            })
            .catch(error => show('error', error))
            .finally(() => setProccess('confirmed'));
        //eslint-disable-next-line
    }, [updateNavbar]);

    const itemsBlock = useMemo(() => {
        return menu(proccess, menuItems);
        //eslint-disable-next-line
    }, [proccess, configMode, items])


    return (
        <>
            {itemsBlock}
        </>
    )
}

export default MenuItems;