import React, { useState } from "react";
import { Menu } from "@mantine/core";

import { IoChevronDown, IoBuild, IoSettings } from "react-icons/io5";

const User = ({ user }) => {
    const [openedMenu, setOpenedMenu] = useState(false);
    console.log(user)

    const openMenu = () => setOpenedMenu(true);
    const closeMenu = () => setOpenedMenu(false);

    const userBlock = user?.administrator || user?.configurator ?
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
            { user?.administrator ? <Menu.Item icon={<IoBuild />}>Администрирование</Menu.Item> : null}
            { user?.configurator ? <Menu.Item icon={<IoSettings />}>Конфигурирование</Menu.Item> : null}
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

{/*  */ }
