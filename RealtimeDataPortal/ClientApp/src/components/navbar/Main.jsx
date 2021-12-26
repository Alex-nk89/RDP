import { NavLink } from "react-router-dom";
import { IoHome } from "react-icons/io5";

const Main = () => {

    return (
        <NavLink exact to="/">
            <IoHome />
            <span>Главная</span>
        </NavLink>
    )
}

export default Main;