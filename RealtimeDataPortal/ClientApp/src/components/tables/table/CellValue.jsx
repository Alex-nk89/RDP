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

                <Notification className='info-block__table__tag-info' disallowClose>
                    <span>Тег: {parameter.tagName}</span><br/>
                    <span>Сервер: {parameter.serverName}</span>
                </Notification>
            </Popover>
        </td>
    )
}

export default CellValue;