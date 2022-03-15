import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { BsFillHouseFill } from "react-icons/bs";

import MenuOptions from "../../../../configurator/menu-options/MenuOptions";

import './main.sass';

const Main = () => {
    const { configMode } = useSelector(state => state.navbar);
    const activeLink = useLocation().pathname === '/' ? 'active-link' : null;

    const menuConfig = configMode ? <MenuOptions type='main-folder' id={0} /> : null;

    return (
        <div className={`main-with-configurator ${activeLink}`}>
            <NavLink exact to="/">
                <BsFillHouseFill size={17} />
                <span>Главная</span>
            </NavLink>
            {menuConfig}
        </div>
    )
}

export default Main;