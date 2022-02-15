import { NavLink, useLocation } from 'react-router-dom';
import { IoReaderOutline, IoGridOutline, IoLayersOutline, IoTrendingUpOutline } from 'react-icons/io5';

import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './page.sass';

const Page = ({ id, name, type, isConfigModeOn, updatingNavbar }) => {
    let link;

    switch (type) {
        case 'externalPage':
            link = { icon: <IoReaderOutline />, path: `/page/${id}`, target: '_blank' };
            break;
        case 'graphic':
            link = { icon: <IoTrendingUpOutline />, path: `/graphics/${id}`, target: '_self' };
            break;
        case 'table':
            link = { icon: <IoGridOutline />, path: `/table/${id}`, target: '_self' };
            break;
        case 'mnemoschema':
            link = { icon: <IoLayersOutline />, path: '/mnemoschema', target: '_self' };
            break;
        default:
            link = { icon: null, path: '' };
            break;
    };

    const activeLink = useLocation().pathname === link.path ? 'active-link' : null;

    const menuConfig = isConfigModeOn ? <MenuOptions id={id} type={type} updatingNavbar={updatingNavbar} /> : null;

    return (
        <div className={`page-with-configurator ${activeLink}`}>
            <NavLink to={link.path} target={link.target}>
                {link.icon}
                <span>{name}</span>
            </NavLink>
            {menuConfig}
        </div>

    )
}

export default Page;