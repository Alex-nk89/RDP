import { IoOptionsOutline, IoPencil, IoTrashBin, IoFolder, IoReader, IoTrendingUp, IoGrid } from "react-icons/io5";
import { Menu, Divider } from "@mantine/core";

import './menuOptions.sass';


const MenuOptions = ({ type }) => {
    const configButton = <div><IoOptionsOutline /></div>

    const menuAttributes = {
        control: configButton,
        size: 'lg',
        transitionDuration: 300
    }

    const menuForFolder =
        <Menu
            {...menuAttributes}>
            <Menu.Item icon={<IoPencil />}>Редактировать</Menu.Item>
            <Menu.Item icon={<IoTrashBin />} className='remove-item'>Удалить</Menu.Item>
            <Divider />
            <Menu.Label>Создать:</Menu.Label>
            <Menu.Item icon={<IoFolder />}>Новая папка</Menu.Item>
            <Menu.Item icon={<IoReader />}>Внешняя страница</Menu.Item>
            <Menu.Item icon={<IoTrendingUp />}>График</Menu.Item>
            <Menu.Item icon={<IoGrid />}>Таблица реального времени</Menu.Item>
        </Menu>

    const menuForPage =
        <Menu
            {...menuAttributes}>
            <Menu.Item icon={<IoPencil />}>Редактировать</Menu.Item>
            <Menu.Item icon={<IoTrashBin />} className='remove-item'>Удалить</Menu.Item>
        </Menu>

    switch (type) {
        case 'folder':
            return menuForFolder;
        default:
            return menuForPage;
    }
}

export default MenuOptions;
