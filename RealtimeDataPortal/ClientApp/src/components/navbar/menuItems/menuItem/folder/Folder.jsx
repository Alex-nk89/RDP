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

    const menuItems = items.map(({ id, name, isFullView, type, idComponent }) =>
        type === 'folder' ?
            <li key={id}>
                <Folder id={id} name={name} isFullView={isFullView} isConfigModeOn={isConfigModeOn} />
            </li> :
            <li key={id} >
                <Page id={id} name={name} type={type} idComponent={idComponent} isConfigModeOn={isConfigModeOn}/>
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
