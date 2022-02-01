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
                    <IoChevronDown  className={`folder ${isOpenFolder}`} />
                </p>
            </div>

            <Collapse in={openedConfigurator} transitionDuration={500}>
                <ul>
                    <li>
                        <div>
                            <NavLink to='/Configurator/change-tag/0' activeClassName='page-with-configurator activeLink'>
                                <IoCodeWorkingOutline />
                                <span>Редактор тегов</span>
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <div>
                            <NavLink to='/' activeClassName='page-with-configurator activeLink'>
                                <IoTicket />
                                <span>Редактор продуктов</span>
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <div>
                            <NavLink to='/' activeClassName='page-with-configurator activeLink'>
                                <IoReader />
                                <span>Инструкция</span>
                            </NavLink>
                        </div>
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