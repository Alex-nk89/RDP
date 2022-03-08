import React, { useMemo } from "react";
import { TextInput, ActionIcon } from "@mantine/core";
import { IoSearch, IoMenu } from "react-icons/io5";

import User from "./user/User";

import "./header.sass";

const Header = ({ openedNavbar, setOpenNavbar, isConfigModeOn, setIsConfigModeOn, isAdminModeOn, setIsAdminModeOn }) => {

    const search =
        <ActionIcon>
            <IoSearch size={20} color="#6c757d" />
        </ActionIcon>

    const openNavbar = () => setOpenNavbar(!openedNavbar);

    const userBlock = useMemo(() => {
        return <User
            isConfigModeOn={isConfigModeOn}
            setIsConfigModeOn={setIsConfigModeOn}
            isAdminModeOn={isAdminModeOn}
            setIsAdminModeOn={setIsAdminModeOn}
        />;
        //eslint-disable-next-line
    }, [isConfigModeOn, isAdminModeOn]);

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
                    {userBlock}
                </div>

            </div>
        </header>
    )
}

export default Header;