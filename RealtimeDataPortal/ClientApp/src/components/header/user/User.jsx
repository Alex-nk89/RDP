import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Switch } from "@mantine/core";
import { IoChevronDown, IoBuild, IoSettings } from "react-icons/io5";

import { useNotification } from "../../configurator";
import { toogleConfigMode, toogleAdminMode } from '../../../actions';

const User = () => {
    const { user } = useSelector(state => state.user);
    const { configMode, adminMode } = useSelector(state => state.navbar);
    const { show } = useNotification();
    const dispatch = useDispatch();
    const [openedMenu, setOpenedMenu] = useState(false);

    const openMenu = () => setOpenedMenu(true);
    const closeMenu = () => setOpenedMenu(false);

    const changeConfigMode = () => {
        dispatch(toogleConfigMode());
        configMode ? show('success', 'Режим конфигуратора выключен') : show('success', 'Режим конфигуратора включен');
    };

    const changeAdminMode = () => {
        dispatch(toogleAdminMode());
        adminMode ? show('success', 'Режим администрирования выключен') : show('success', 'Режим администрирования включен');
    }

    const userBlock = user?.isAdministrator || user?.isConfigurator ?
        <Menu
            size="lg"
            control={
                <div className="user-name">
                    {user.name}
                    <IoChevronDown className={openedMenu ? "menu-open" : "menu-close"} />
                </div>
            }
            opened={openedMenu}
            onOpen={openMenu}
            onClose={closeMenu}>
            {user?.isAdministrator ?
                <Menu.Item icon={<IoBuild />}>
                    <label>
                        Администрирование
                        <Switch size='xs' checked={adminMode} onChange={changeAdminMode} />
                    </label>
                </Menu.Item> : null}
            {user?.isConfigurator ?
                <Menu.Item icon={<IoSettings />}>
                    <label>
                        Конфигурирование
                        <Switch size="xs" checked={configMode} onChange={changeConfigMode} />
                    </label>

                </Menu.Item> : null}
        </Menu>
        :
        <div className="user-name">
            {user.name}
        </div>

    return (
        <>{userBlock}</>
    )
}

export default User;
