import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsFileEarmarkRichtextFill, BsGridFill, BsFillBarChartFill, BsDiagram3Fill } from 'react-icons/bs';
import { Tooltip } from '@mantine/core';

import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './page.sass';

const Page = ({ id, name, componentId, type }) => {
    const { configMode } = useSelector(state => state.navbar);
    let link;

    const modifiedName = name.length > 23
        ? name.slice(0, 20) + ' ...'
        : name;

    const delay = 500;

    switch (type) {
        case 'externalPage':
            //eslint-disable-next-line
            link =
                <Tooltip openDelay={delay} label={name} placement='start'>
                    <a href={`http:\\\\asodu-web\\RDP_Container\\Home?id=${id}`} target='_blank' rel='noreferrer'>
                        <BsFileEarmarkRichtextFill size={14} />
                        <span>{modifiedName}</span>
                    </a>
                </Tooltip>
            break;
        case 'graphic':
            link =
                <Tooltip openDelay={delay} label={name} placement='start'>
                    <NavLink to={`/graphics/${componentId}`}>
                        <BsFillBarChartFill size={14} />
                        <span>{modifiedName}</span>
                    </NavLink>
                </Tooltip>
            break;
        case 'table':
            link =
                <Tooltip openDelay={delay} label={name} placement='start'>
                    <NavLink to={`/table/${id}`}>
                        <BsGridFill size={14} />
                        <span>{name}</span>
                    </NavLink>
                </Tooltip>
            break;
        case 'mnemoscheme':
            link =
                <Tooltip openDelay={delay} label={name} placement='start'>
                    <NavLink to={`/mnemoscheme/${id}`}>
                        <BsDiagram3Fill size={14} />
                        <span>{name}</span>
                    </NavLink>
                </Tooltip>
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