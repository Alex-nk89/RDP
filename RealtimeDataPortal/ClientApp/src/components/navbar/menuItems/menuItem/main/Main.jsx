import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { IoHome } from "react-icons/io5";

import MenuOptions from "../../../../configurator/menu-options/MenuOptions";

import './main.sass';

const Main = () => {
    const { configMode } = useSelector(state => state.navbar);
    const activeLink = useLocation().pathname === '/' ? 'active-link' : null;

    const menuConfig = configMode ? <MenuOptions type='main-folder' id={0} /> : null;

    return (
        <div className={`main-with-configurator ${activeLink}`}>
            <NavLink exact to="/">
                <IoHome size={16} />
                <span>Главная</span>
            </NavLink>
            {menuConfig}
        </div>
    )
}

export default Main;