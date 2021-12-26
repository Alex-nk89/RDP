import React, { useState } from "react";
import { Menu, Switch } from "@mantine/core";

import { IoChevronDown } from "react-icons/io5";

const User = () => {
    const [openedMenu, setOpenedMenu] = useState(false);

    const user = 
        <div className="user-name">
            Нагайцев Александр Евгеньевич
            <IoChevronDown className={openedMenu ? "menu-open" : "menu-close" }/>
        </div>

    const openMenu = () => setOpenedMenu(true);

    const closeMenu = () => setOpenedMenu(false);

    return (
        <div className="user">
            <Menu
                size="lg"
                control={user}
                opened={openedMenu}
                onOpen={openMenu}
                onClose={closeMenu}>
                <Menu.Item>Администрирование</Menu.Item>
                <Menu.Item>Конфигуратор</Menu.Item>
                <Menu.Item>
                    <label>
                        <span>Конфигуратор страниц</span>
                        <Switch size="xs"/>
                    </label>         
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default User;