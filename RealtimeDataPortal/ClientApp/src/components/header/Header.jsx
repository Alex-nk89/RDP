import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, ActionIcon } from "@mantine/core";
import { IoSearch, IoMenu } from "react-icons/io5";

import User from "./user/User";
import { toogleNavbarState } from "../../actions";

import "./header.sass";

const Header = () => {
    const { configMode, adminMode } = useSelector(state => state.navbar);
    const dispatch = useDispatch();

    const search =
        <ActionIcon>
            <IoSearch size={20} color="#6c757d" />
        </ActionIcon>

    const openNavbar = () => dispatch(toogleNavbarState());

    const userBlock = useMemo(() => {
        return <User />;
        //eslint-disable-next-line
    }, [configMode, adminMode]);

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