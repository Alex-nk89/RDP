import { Space, Tooltip, Button } from "@mantine/core";
import { IoGridOutline, IoTrendingUpOutline, IoPrintOutline } from 'react-icons/io5';
import { BsTable } from 'react-icons/bs';

import { Calendar } from '../Index'

const Settings = ({ calendar, setDate, isScale, setIsScale, isVisibleTable, setIsVisibleTable }) => {
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

    const toggleScale = () => setIsScale(!isScale);
    const toggleVisibleTable = () => setIsVisibleTable(!isVisibleTable);

    return (
        <div className="settings">
            <div className='settings__calendar'>
                <Calendar calendar={calendar} setDate={setDate}/>
            </div>

            <div className='settings__additional'>
                <Space w="xs" />

                <Tooltip label='Сменить вид'>
                    <Button {...settingsOff}>
                        <IoGridOutline size={16}/>
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Масштабировать' onClick={toggleScale}>
                    <Button {...settingsScaleToggle}>
                        <IoTrendingUpOutline size={16} color={isScale ? 'white' : null}/>
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Скрыть таблицы' onClick={toggleVisibleTable}>
                    <Button {...settingsTableToggle}>
                        <BsTable size={16} color={isVisibleTable ? 'white' : null}/>
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Печать'>
                    <Button {...settingsOff}>
                        <IoPrintOutline size={16} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}

export default Settings;