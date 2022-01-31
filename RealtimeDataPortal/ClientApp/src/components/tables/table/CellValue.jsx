import { useState, Notification, Popover } from '../Index';
import '../table.sass';

const CellValue = ({ parameter, round }) => {
    const [openedPopover, setOpenedPopover] = useState(false);

    const togglePopover = () => setOpenedPopover(!openedPopover);
    const closePopover = () => setOpenedPopover(false);

    return (
        <td>
            <Popover
                opened={openedPopover}
                onClose={closePopover}
                target={
                    <button
                        className='info-block__table__tag-info-button'
                        onClick={togglePopover}>{parameter.value.toFixed(round).replace(/\./i, ",") ?? '#'}</button>
                }>
<<<<<<< HEAD
                <Notification className='info-block__table__tag-info' classNames={{ body: 'info-block__table__tag-info' }} disallowClose>
                    <span>Тег: {parameter.attributes.tagName}</span><br />
                    <span>Сервер: {parameter.attributes.serverName}</span>
=======
                <Notification className='info-block__table__tag-info' disallowClose>
                    <span>Тег: {parameter.tagName}</span><br/>
                    <span>Сервер: {parameter.serverName}</span>
>>>>>>> fc12cdd7ae6d2c9c3070a62d6da82877f77136c1
                </Notification>
            </Popover>
        </td>
    )
}

export default CellValue;