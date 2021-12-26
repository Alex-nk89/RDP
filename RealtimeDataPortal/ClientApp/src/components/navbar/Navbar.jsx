import React from "react";
import { NavLink } from "react-router-dom";
import { IoStatsChart } from "react-icons/io5";

import Main from "./Main"

import "../navbar/navbar.sass";

const Navbar = ({ openedNavbar }) => {

    return (
        <div className={ openedNavbar ? "side-navbar" : "side-navbar side-navbar-close" }>
            <NavLink exact to="/" className="side-navbar-header">
                <IoStatsChart />
                Realtime Data Portal
            </NavLink>
            <div className="side-navbar-items">
                <Main />
            </div>
        </div>
    )
}

export default Navbar;