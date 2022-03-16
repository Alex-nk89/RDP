import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsFileEarmarkRichtextFill, BsGridFill, BsFillBarChartFill, BsDiagram3Fill } from 'react-icons/bs';

import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './page.sass';

const Page = ({ id, name, componentId, type }) => {
    const { configMode } = useSelector(state => state.navbar);
    let link;

    switch (type) {
        case 'externalPage':
            //eslint-disable-next-line
            link = <a href={`http:\\\\asodu-web\\RDP_Container\\Home?id=${id}`} target='_blank'>
                <BsFileEarmarkRichtextFill size={16} /><span>{name}</span>
            </a>
            break;
        case 'graphic':
            link = <NavLink to={`/graphics/${componentId}`}><BsFillBarChartFill size={16} /><span>{name}</span></NavLink>
            break;
        case 'table':
            link = <NavLink to={`/table/${id}`}><BsGridFill size={16} /><span>{name}</span></NavLink>
            break;
        case 'mnemoscheme':
            link = <NavLink to='/mnemoscheme'><BsDiagram3Fill size={16} /><span>{name}</span></NavLink>
            break;
        default:
            link = null
            break;
    };

    const activeLink = useLocation().pathname === link.path ? 'active-link' : null;

    const menuConfig = configMode ? <MenuOptions id={id} type={type} /> : null;

    return (
        <div className={`page-with-configurator ${activeLink}`}>
            {link}
            {menuConfig}
        </div>

    )
}

export default Page;