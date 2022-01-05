import React, { useState } from "react";
import { Menu, Switch } from "@mantine/core";

import { IoChevronDown, IoBuild, IoSettings } from "react-icons/io5";

const User = ({ user, isConfigModeOn, setIsConfigModeOn }) => {
    const [openedMenu, setOpenedMenu] = useState(false);

    const openMenu = () => setOpenedMenu(true);
    const closeMenu = () => setOpenedMenu(false);
    const changeConfigMode = () => setIsConfigModeOn(!isConfigModeOn);

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
            {user?.isAdministrator ? <Menu.Item icon={<IoBuild />}>Администрирование</Menu.Item> : null}
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
