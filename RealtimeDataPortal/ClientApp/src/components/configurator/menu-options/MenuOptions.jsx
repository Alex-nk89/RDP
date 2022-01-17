import { Link } from "react-router-dom";
import { IoOptionsOutline, IoPencil, IoTrashBin, IoFolder, IoReader, IoTrendingUp, IoGrid } from "react-icons/io5";
import { Menu, Divider, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";

import { useRequest } from "..";
import { useNotification } from "..";

import './menuOptions.sass';

const MenuOptions = ({ type, id, updatingNavbar }) => {
    const { request, error } = useRequest();
    const { show } = useNotification();
    const modal = useModals();
    const configButton = <div><IoOptionsOutline /></div>

    const menuAttributes = {
        control: configButton,
        size: 'lg',
        transitionDuration: 300
    }

    const deleteElement = () => {
        request(`DeleteElement?id=${id}`)
            .then(result => {
                if (Object.keys(result).length !== 0) show('success', result.message)
                else show('error', error.message)
            })
            .then(updatingNavbar())
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

    const createOptions = [
        <Menu.Label key={5}>Создать:</Menu.Label>,
        <Menu.Item key={1} icon={<IoFolder />} component={Link} to={`/Configurator/add-folder/${id}`}>
            Новая папка
        </Menu.Item>,
        <Menu.Item key={2} icon={<IoReader />} component={Link} to={`/Configurator/add-external-page/${id}`}>
            Внешняя страница
        </Menu.Item>,
        <Menu.Item key={3} icon={<IoTrendingUp />} component={Link} to={`/Configurator/add-graphic/${id}`}>
            График
        </Menu.Item>,
        <Menu.Item key={4} icon={<IoGrid />} component={Link} to={`/Configurator/add-table/${id}`}>
            Таблица реального времени
        </Menu.Item>
    ]

    const changeOptions = [
        <Menu.Item key={6} icon={<IoPencil />} component={Link} to={`/Configurator/change-${type}/${id}`}>
            Редактировать
        </Menu.Item>,
        <Menu.Item key={7} icon={<IoTrashBin />} className='remove-item' onClick={openModal}>
            Удалить
        </Menu.Item>
    ]

    const menuForFolder =
        <Menu
            {...menuAttributes}>
            {changeOptions}
            <Divider />
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
            return menuForMain;
        default:
            return menuForPage;
    }
}

export default MenuOptions;
