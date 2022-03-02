
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from '@mantine/core';
import { IoSettings, IoChevronDown, IoBuild } from 'react-icons/io5';

const AdministratorMenu = ({ isAdminModeOn }) => {
    const [openedAdministrator, setOpenedAdministrator] = useState(false);

    const changeOpenedAdministrator = () => setOpenedAdministrator(!openedAdministrator);

    const isOpenFolder = openedAdministrator ? 'folder_open' : null;

    const administrator = !isAdminModeOn ? null : (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={changeOpenedAdministrator}>
                    <IoSettings />
                    <span>Администрирование</span>
                    <IoChevronDown className={`folder ${isOpenFolder}`} />
                </p>
            </div>

            <Collapse in={openedAdministrator} transitionDuration={500}>
                <ul>
                    <li>
                        <NavLink
                            to='/Administrator/parameter-type'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <IoBuild />
                            <span>Типы параметров</span>
                        </NavLink>
                    </li>
                    {/* <li>
                        <NavLink
                            to='/Configurator/change-product/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <IoTicket />
                            <span>Редактор продуктов</span>
                        </NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink
                            to='/Configurator/instruction/0'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }} >
                            <IoReader />
                            <span>Инструкция</span>
                        </NavLink>
                    </li> */}
                </ul>
            </Collapse>
        </div>
    );

    return (
        <>
            {administrator}
        </>
    )
}

export default AdministratorMenu;