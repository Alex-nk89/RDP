import React, { useState } from "react";
import { Menu, Switch } from "@mantine/core";
import { IoChevronDown, IoBuild, IoSettings } from "react-icons/io5";

import { useNotification } from "../../configurator";

const User = ({ user, isConfigModeOn, setIsConfigModeOn, isAdminModeOn, setIsAdminModeOn }) => {
    const { show } = useNotification();
    const [openedMenu, setOpenedMenu] = useState(false);

    const openMenu = () => setOpenedMenu(true);
    const closeMenu = () => setOpenedMenu(false);

    const changeConfigMode = () => {
        setIsConfigModeOn(!isConfigModeOn);
        isConfigModeOn ? show('success', 'Режим конфигуратора выключен') : show('success', 'Режим конфигуратора включен');
    };

    const changeAdminMode = () => {
        setIsAdminModeOn(!isAdminModeOn);
        isAdminModeOn ? show('success', 'Режим администрирования выключен') : show('success', 'Режим администрирования включен');
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
                        <Switch size='xs' checked={isAdminModeOn} onChange={changeAdminMode} />
                    </label>
                </Menu.Item> : null}
            {user?.isConfigurator ?
                <Menu.Item icon={<IoSettings />}>
                    <label>
                        Конфигурирование
                        <Switch size="xs" checked={isConfigModeOn} onChange={changeConfigMode} />
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
