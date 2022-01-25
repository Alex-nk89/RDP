import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom';
import { IoReaderOutline, IoGridOutline, IoLayersOutline, IoTrendingUpOutline } from 'react-icons/io5';

import MenuOptions from '../../../../configurator/menu-options/MenuOptions';

import './page.sass';

const Page = ({ id, name, type, isConfigModeOn }) => {
    const [link, setLink] = useState({
        icon: null,
        path: ''
    });

    const activeLink = useLocation().pathname === link.path ? 'active-link' : null;

    const menuConfig = isConfigModeOn ? <MenuOptions id={id} type={type}/> : null;

    useEffect(() => {
        switch (type) {
            case 'external-page':
                setLink({
                    icon: <IoReaderOutline/>,
                    path: `/page/${id}`
                });
                break;
            case 'graphic':
                setLink({
                    icon: <IoTrendingUpOutline />,
                    path: `/graphics/${id}`
                });
                break;
            case 'table':
                setLink({
                    icon: <IoGridOutline />,
                    path: '/table'
                });
                break;
            case 'mnemoschema':
                setLink({
                    icon: <IoLayersOutline />,
                    path: '/mnemoschema'
                });
                break;
            default:
                setLink({
                    icon: null,
                    path: ''
                });
                break;
        }
        //eslint-disable-next-line
    }, [])

    return (
        <div className={`page-with-configurator ${activeLink}`}>
            <NavLink to={link.path}>
                {link.icon}
                <span>{name}</span>
            </NavLink>
            {menuConfig}
        </div>

    )
}

export default Page;