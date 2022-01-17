import React from "react";
import { NavLink } from "react-router-dom";
import { IoStatsChart } from "react-icons/io5";

import Main from "./menuItems/menuItem/main/Main";
import MenuItems from "./menuItems/MenuItems";

import "../navbar/navbar.sass";

const Navbar = ({ openedNavbar, isConfigModeOn, updateNavbar, updatingNavbar }) => {

    return (
        <div className={ openedNavbar ? "side-navbar" : "side-navbar side-navbar-close" }>
            <NavLink exact to="/" className="side-navbar-header">
                <IoStatsChart />
                Realtime Data Portal
            </NavLink>
            <div className="side-navbar-items">
                <Main isConfigModeOn={isConfigModeOn} />
                <MenuItems isConfigModeOn={isConfigModeOn} updateNavbar={updateNavbar} updatingNavbar={updatingNavbar} />
            </div>
        </div>
    )
}

export default Navbar;