import { useState, useEffect } from 'react';
import { BsFolderFill, BsChevronDown } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Collapse, Loader } from '@mantine/core';

import { useRequest } from '../../../../../hooks/useRequest';
import { useNotification } from '../../../../../hooks/useNotification';
import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './folder.sass';
import Page from '../page/Page';

const Folder = ({ id, name, isFullView }) => {
    const { request, proccess, setProccess } = useRequest();
    const { show } = useNotification();
    const configMode = useSelector(state => state.navbar.configMode);
    const [items, setItems] = useState([]);
    const [folderState, setFolderState] = useState(false);
    const [thereIsItem, setThereIsItem] = useState(false);

    useEffect(() => {
        if (folderState) {
            request(`GetMenu`, 'POST', JSON.stringify({
                ParentId: id,
                isFullView: isFullView,
            }))
                .then(menuItems => {
                    setItems(menuItems);
                    setThereIsItem(true);

                    if (Object.keys(menuItems).length === 0) {
                        show('warning', 'Папка пуста');
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setProccess('confirmed'));
        } else {
            setThereIsItem(false);

            // Таймаут установлен для того чтобы сначала плавно закрывался блок с вложенными элементами меню,
            // а после закрытия (как заканчивается анимация) данные в блоке уничтожались
            setTimeout(() => {
                setItems([]);
            }, 500)
        }
        //eslint-disable-next-line
    }, [folderState]);

    const toChangeFolderState = () => setFolderState(!folderState);

    const isOpenFolder = thereIsItem ? 'folder_open' : null

    const menuItems = items.map(({ id, name, isFullView, type, componentId }) =>
        type === 'folder' ?
            <li key={id}>
                <Folder id={id} name={name} isFullView={isFullView} />
            </li> :
            <li key={id} >
                <Page id={id} name={name} componentId={componentId} type={type} />
            </li>);

    const menuConfig = configMode ? <MenuOptions type={'folder'} id={id} /> : null;

    const loader = proccess === 'loading' ? <Loader size={16} sx={(theme) => ({ stroke: theme.colors.gray[0] })} /> : null;

    return (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={toChangeFolderState}>
                    <BsFolderFill size={16} />
                    <span>{name}</span>
                    {loader}
                    {configMode ? null : <BsChevronDown className={`folder ${isOpenFolder}`} />}
                </p>
                {menuConfig}
            </div>

            <Collapse in={thereIsItem} transitionDuration={500}>
                <ul>
                    {menuItems}
                </ul>
            </Collapse>
        </div>
    )
}

export default Folder;
