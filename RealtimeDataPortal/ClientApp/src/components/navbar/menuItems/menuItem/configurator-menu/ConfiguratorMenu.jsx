import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Collapse } from '@mantine/core';
import { BsFillGearFill, BsFillFileEarmarkTextFill, BsFillTagsFill, BsChevronDown, BsPencilSquare } from 'react-icons/bs';

const ConfiguratorMenu = () => {
    const { configMode } = useSelector(state => state.navbar);
    const [openedConfigurator, setOpenedConfigurator] = useState(false);

    const changeOpenedConfigurator = () => setOpenedConfigurator(!openedConfigurator);

    const isOpenFolder = openedConfigurator ? 'folder_open' : null;

    const configurator = !configMode ? null : (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={changeOpenedConfigurator}>
                    <BsFillGearFill size={16} />
                    <span>Конфигуратор</span>
                    <BsChevronDown className={`folder ${isOpenFolder}`} />
                </p>
            </div>

            <Collapse in={openedConfigurator} transitionDuration={500}>
                <ul>
                    <li>
                        <NavLink
                            to='/Configurator/change-tag/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsFillTagsFill size={16} />
                            <span>Редактор тегов</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Configurator/change-product/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsPencilSquare size={16} />
                            <span>Редактор продуктов</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Configurator/instruction/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }} >
                            <BsFillFileEarmarkTextFill size={16} />
                            <span>Инструкция</span>
                        </NavLink>
                    </li>
                </ul>
            </Collapse>
        </div>
    );

    return (
        <>
            {configurator}
        </>
    )
}

export default ConfiguratorMenu;