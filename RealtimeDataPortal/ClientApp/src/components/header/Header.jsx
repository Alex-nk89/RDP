import React from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import { IoSearch, IoMenu } from "react-icons/io5";

import User from "./User";

import "./header.sass";

const Header = ({ user, proccess, openedNavbar, setOpenNavbar }) => {

    const search =
        <ActionIcon>
            <IoSearch size={20} color="#6c757d" />
        </ActionIcon>

    const openNavbar = () => setOpenNavbar(!openedNavbar);

    return (
        <header>
            <div className="header">
                <div className="menu-btn" onClick={openNavbar} >
                    <IoMenu size={30} />
                </div>
                <div className="search">
                    <TextInput
                        placeholder="Поиск страниц..."
                        rightSection={search}
                        className="search-field" />
                </div>
                <div className="user">
                    <User user={user} />
                </div>

            </div>
        </header>
    )
}

export default Header;