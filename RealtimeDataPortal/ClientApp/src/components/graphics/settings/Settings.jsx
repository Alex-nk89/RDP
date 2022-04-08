import {
    useSelector, useDispatch,
    Calendar,
    Space, Tooltip, Button,
    BsGraphUp, BsPrinter, BsTable, BsGridFill
} from '../Index';
import { toggleIsScale, toggleIsVisibleTable, toggleIsDoubleView } from '../../../reducers/graphicsSlice';

const Settings = ({ calendar, setDate }) => {
    const dispatch = useDispatch();
    const { isScale, isVisibleTable, isDoubleView } = useSelector(state => state.graphics);

    const settingsOn = {
        compact: true,
        variant: 'filled',
        color: 'indigo',
        size: 'md'
    }

    const settingsOff = {
        compact: true,
        variant: 'light',
        size: 'md'
    }

    const settingsScaleToggle = isScale ? settingsOn : settingsOff;
    const settingsTableToggle = isVisibleTable ? settingsOn : settingsOff;
    const settingsDoubleViewToggle = isDoubleView ? settingsOn : settingsOff;

    const toggleScale = () => dispatch(toggleIsScale());
    const toggleVisibleTable = () => dispatch(toggleIsVisibleTable());
    const toggleDoubleView = () => dispatch(toggleIsDoubleView());

    const toPrint = () => window.print();

    return (
        <div className="settings">
            <div className='settings__calendar'>
                <Calendar calendar={calendar} setDate={setDate} />
            </div>

            <div className='settings__additional'>
                <Space w="xs" />

                <Tooltip label='Сменить вид' onClick={toggleDoubleView}>
                    <Button {...settingsDoubleViewToggle}>
                        <BsGridFill size={16} color={isDoubleView ? 'white' : null} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Масштабировать' onClick={toggleScale}>
                    <Button {...settingsScaleToggle}>
                        <BsGraphUp size={16} color={isScale ? 'white' : null} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Скрыть таблицы' onClick={toggleVisibleTable}>
                    <Button {...settingsTableToggle}>
                        <BsTable size={16} color={isVisibleTable ? 'white' : null} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Печать'>
                    <Button {...settingsOff} onClick={toPrint}>
                        <BsPrinter size={16} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}

export default Settings;