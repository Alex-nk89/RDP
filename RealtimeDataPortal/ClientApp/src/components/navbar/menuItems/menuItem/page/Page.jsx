import { NavLink, useLocation } from 'react-router-dom';
import { IoReaderOutline, IoGridOutline, IoLayersOutline, IoTrendingUpOutline } from 'react-icons/io5';

import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './page.sass';

const Page = ({ id, name, type, isConfigModeOn, updatingNavbar }) => {
    let link;

    switch (type) {
        case 'externalPage':
            //eslint-disable-next-line
            link = <a href={`http:\\\\asodu-web\\RDP_Container\\Home?id=${id}`} target='_blank'>
                <IoReaderOutline /><span>{name}</span>
            </a>
            break;
        case 'graphic':
            link = <NavLink to={`/graphics/${id}`}><IoTrendingUpOutline /><span>{name}</span></NavLink>
            break;
        case 'table':
            link = <NavLink to={`/table/${id}`}><IoGridOutline /><span>{name}</span></NavLink>
            break;
        case 'mnemoschema':
            link = <NavLink to='/mnemoschema'><IoLayersOutline /><span>{name}</span></NavLink>
            break;
        default:
            link = null
            break;
    };

    const activeLink = useLocation().pathname === link.path ? 'active-link' : null;

    const menuConfig = isConfigModeOn ? <MenuOptions id={id} type={type} updatingNavbar={updatingNavbar} /> : null;

    return (
        <div className={`page-with-configurator ${activeLink}`}>
            {link}
            {menuConfig}
        </div>

    )
}

export default Page;