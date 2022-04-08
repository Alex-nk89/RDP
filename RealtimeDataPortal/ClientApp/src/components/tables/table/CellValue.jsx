import { useState, useSelector, Notification, Popover } from '../Index';
import '../table.sass';

const CellValue = ({ parameter, round }) => {
    const { user } = useSelector(state => state.user);
    const [openedPopover, setOpenedPopover] = useState(false);

    const togglePopover = () => setOpenedPopover(!openedPopover);
    const closePopover = () => setOpenedPopover(false);

    const cellValue = parameter?.value !== null ? Number(parameter.value.toFixed(round)) : '#';

    return (
        <td>
            <Popover
                opened={openedPopover}
                onClose={closePopover}
                target={
                    <button
                        className='info-block__table__tag-info-button'
                        onClick={togglePopover}>{cellValue}</button>
                }>

                {(user.isAdministrator || user.isConfigurator || user.isFullView) ?
                    (
                        <Notification className='info-block__table__tag-info' disallowClose>
                            <span>Тег: {parameter.tagName}</span><br />
                            <span>Сервер: {parameter.serverName}</span>
                        </Notification>
                    )
                    : null}
            </Popover>
        </td>
    )
}

export default CellValue;