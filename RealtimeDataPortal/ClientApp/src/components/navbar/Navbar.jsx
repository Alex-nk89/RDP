import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoStatsChart } from "react-icons/io5";

import Main from "./menuItems/menuItem/main/Main";
import MenuItems from "./menuItems/MenuItems";
import ConfiguratorMenu from './menuItems/menuItem/configurator-menu/ConfiguratorMenu';
import AdministratorMenu from "./menuItems/menuItem/administrator-menu/AdministratorMenu";

import "../navbar/navbar.sass";

const Navbar = () => {
    const isOpenNavbar = useSelector(state => state.navbar.isOpenNavbar);

    return (
        <div className={isOpenNavbar ? "side-navbar" : "side-navbar side-navbar-close"}>
            <NavLink exact to="/" className="side-navbar-header">
                <IoStatsChart />
                Realtime Data Portal
            </NavLink>
            <div className="side-navbar-items">
                <Main />
                <ConfiguratorMenu />
                <AdministratorMenu />
                <MenuItems />
            </div>
        </div>
    )
}

export default Navbar;