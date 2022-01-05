import { useState, useEffect } from 'react';
import { IoFolder, IoChevronDown } from 'react-icons/io5';
import { Collapse } from '@mantine/core';

import { useRequest } from '../../../../../hooks/useRequest';
import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './folder.sass';
import Page from '../page/Page';

const Folder = ({ id, name, isFullView, isConfigModeOn }) => {
    const { request } = useRequest();
    const [items, setItems] = useState([]);
    const [folderState, setFolderState] = useState(false);

    const toChangeFolderState = () => setFolderState(!folderState);

    const isOpenFolder = folderState ? 'folder_open' : null

    const menuItems = items.map(item =>
        item.type === 'folder' ?
            <li key={item.id}>
                <Folder id={item.id} name={item.name} isFullView={item.isFullView} isConfigModeOn={isConfigModeOn} />
            </li> :
            <li key={item.id} >
                <Page id={item.id} name={item.name} type={item.type} isConfigModeOn={isConfigModeOn}/>
            </li>);

    const menuConfig = isConfigModeOn ? <MenuOptions type={'folder'}/> : null;

    useEffect(() => {
        request(`GetMenu?parentId=${id}`)
            .then(menuItems => setItems(menuItems));
        //eslint-disable-next-line
    }, [])

    return (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={toChangeFolderState}>
                    <IoFolder />
                    <span>{name}</span>
                    {isConfigModeOn ? null : <IoChevronDown className={`folder ${isOpenFolder}`} />}
                </p>
                {menuConfig}
            </div>

            <Collapse in={folderState} transitionDuration={500}>
                <ul>
                    {menuItems}
                </ul>
            </Collapse>
        </div>
    )
}

export default Folder;
