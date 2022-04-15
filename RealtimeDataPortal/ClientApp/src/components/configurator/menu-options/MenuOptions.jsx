import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    BsSliders, BsFillPencilFill, BsFillTrashFill, BsGridFill,
    BsDiagram3Fill, BsFillBarChartFill, BsFolderFill, BsFileEarmarkRichtextFill
} from 'react-icons/bs';
import { Menu, Divider, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";

import { useRequest } from "..";
import { useNotification } from "..";
import { updateNavbar } from "../../../actions";

import './menuOptions.sass';

const MenuOptions = ({ type, id }) => {
    const dispatch = useDispatch();
    const { request } = useRequest();
    const { show } = useNotification();
    const modal = useModals();
    const { pathname } = useLocation();

    const user = useSelector(state => state.user.user);

    const configButton = <div><BsSliders /></div>

    const menuAttributes = {
        control: configButton,
        size: 'lg',
        transitionDuration: 300
    }

    const deleteElement = () => {
        request(`DeleteElement?id=${id}`)
            .then(result => {
                show('success', result.message);
                dispatch(updateNavbar());

                // Для избежания ситуации когда пользователь просматривая, например, график удаляет его
                // и продолжает его смотреть происходит перенаправление на главную страницу
                if (pathname.includes(type)) {
                    window.location.href = '/';
                }

            })
            .catch(error => show('error', error));
    }

    const openModal = () => modal.openConfirmModal({
        title: 'Удаление компонента',
        children: (
            <Text size="sm">
                Вы уверены что хотите продолжить? Отменить удаление будет не возможно!
            </Text>
        ),
        labels: { confirm: 'Удалить', cancel: 'Отменить' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteElement()
    })

    const createOptions = user?.isConfigurator
        ? [
            <Menu.Label key={5}>Создать:</Menu.Label>,
            <Menu.Item key={1} icon={<BsFolderFill />} component={Link} to={`/Configurator/add-folder/${id}`}>
                Новая папка
            </Menu.Item>,
            <Menu.Item key={2} icon={<BsFileEarmarkRichtextFill />} component={Link} to={`/Configurator/add-externalPage/${id}`}>
                Внешняя страница
            </Menu.Item>,
            <Menu.Item key={3} icon={<BsFillBarChartFill />} component={Link} to={`/Configurator/add-graphic/${id}`}>
                График
            </Menu.Item>,
            <Menu.Item key={4} icon={<BsGridFill />} component={Link} to={`/Configurator/add-table/${id}`}>
                Таблица реального времени
            </Menu.Item>,
            <Menu.Item key={4} icon={<BsDiagram3Fill />} component={Link} to={`/Configurator/add-mnemoscheme/${id}`}>
                Мнемосхема
            </Menu.Item>
        ] : null;

    const changeOptions = user?.isConfigurator
        ? [
            <Menu.Item key={6} icon={<BsFillPencilFill />} component={Link} to={`/Configurator/change-${type}/${id}`}>
                Редактировать
            </Menu.Item>,
            <Menu.Item key={7} icon={<BsFillTrashFill />} className='remove-item' onClick={openModal}>
                Удалить
            </Menu.Item>
        ]
        :
        [
            <Menu.Item key={6} icon={<BsFillPencilFill />} component={Link} to={`/Configurator/change-${type}/${id}`}>
                Редактировать
            </Menu.Item>
        ];

    const menuForFolder =
        <Menu
            {...menuAttributes}>
            {changeOptions}
            {user?.isConfigurator ? <Divider /> : null}
            {createOptions}
        </Menu>

    const menuForMain =
        <Menu
            {...menuAttributes}>
            {createOptions}
        </Menu>

    const menuForPage =
        <Menu
            {...menuAttributes}>
            {changeOptions}
        </Menu>

    switch (type) {
        case 'folder':
            return menuForFolder;
        case 'main-folder':
            return user?.isConfigurator ? menuForMain : null;
        default:
            return menuForPage;
    }
}

export default MenuOptions;
