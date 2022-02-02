import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from '@mantine/core';
import { IoSettings, IoChevronDown, IoCodeWorkingOutline, IoTicket, IoReader } from 'react-icons/io5';

const ConfiguratorMenu = ({ isConfigModeOn }) => {
    const [openedConfigurator, setOpenedConfigurator] = useState(false);

    const changeOpenedConfigurator = () => setOpenedConfigurator(!openedConfigurator);

    const isOpenFolder = openedConfigurator ? 'folder_open' : null;

    const configurator = !isConfigModeOn ? null : (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={changeOpenedConfigurator}>
                    <IoSettings />
                    <span>Конфигуратор</span>
                    <IoChevronDown className={`folder ${isOpenFolder}`} />
                </p>
            </div>

            <Collapse in={openedConfigurator} transitionDuration={500}>
                <ul>
                    <li>
                        <NavLink
                            to='/Configurator/change-tag/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <IoCodeWorkingOutline />
                            <span>Редактор тегов</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Configurator/change-product/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <IoTicket />
                            <span>Редактор продуктов</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Configurator/instruction/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }} >
                            <IoReader />
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