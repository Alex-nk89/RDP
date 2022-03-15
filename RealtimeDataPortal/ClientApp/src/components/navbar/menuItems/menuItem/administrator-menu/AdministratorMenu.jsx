
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Collapse } from '@mantine/core';
import { BsFillPersonLinesFill, BsServer, BsTagsFill, BsTools, BsChevronDown, BsScrewdriver } from 'react-icons/bs';

const AdministratorMenu = () => {
    const { adminMode } = useSelector(state => state.navbar);
    const [openedAdministrator, setOpenedAdministrator] = useState(false);

    const changeOpenedAdministrator = () => setOpenedAdministrator(!openedAdministrator);

    const isOpenFolder = openedAdministrator ? 'folder_open' : null;

    const administrator = !adminMode ? null : (
        <div className='folder'>
            <div className='folder-with-configurator'>
                <p onClick={changeOpenedAdministrator}>
                    <BsTools size={16} />
                    <span>Администрирование</span>
                    <BsChevronDown className={`folder ${isOpenFolder}`} />
                </p>
            </div>

            <Collapse in={openedAdministrator} transitionDuration={500}>
                <ul>
                    <li>
                        <NavLink
                            to='/Administrator/parameter-type'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsScrewdriver size={16} />
                            <span>Редактор типов параметра</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Administrator/servers'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsServer size={16} />
                            <span>Редактор серверов</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Administrator/type-tags'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsTagsFill size={16} />
                            <span>Редактор типов тега</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/Administrator/access-profiles'
                            className='page-with-configurator'
                            activeStyle={{ background: 'rgba(255, 255, 255, .2)' }}>
                            <BsFillPersonLinesFill size={16} />
                            <span>Редактор профилей доступа</span>
                        </NavLink>
                    </li>
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