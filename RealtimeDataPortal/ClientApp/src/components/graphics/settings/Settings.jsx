import { Space, Tooltip, Button } from "@mantine/core";
import { IoGridOutline, IoTrendingUpOutline, IoPrintOutline } from 'react-icons/io5';
import { BsTable } from 'react-icons/bs';

import { Calendar } from '../Index'

const Settings = ({ calendar, setDate }) => {
    const settingsToggle = {
        compact: true,
        variant: 'light',
        size: 'md'
    }

    const settingsIcon = {
        size: 16,
        color: 'gray'
    }

    return (
        <div className="settings">
            <div className='settings__calendar'>
                <Calendar calendar={calendar} setDate={setDate}/>
            </div>

            <div className='settings__additional'>
                <Space w="xs" />

                <Tooltip label='Сменить вид'>
                    <Button {...settingsToggle} variant="filled" color='indigo'>
                        <IoGridOutline {...settingsIcon} color='white'/>
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Масштабировать'>
                    <Button {...settingsToggle}>
                        <IoTrendingUpOutline {...settingsIcon} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Скрыть таблицы'>
                    <Button {...settingsToggle}>
                        <BsTable {...settingsIcon} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Печать'>
                    <Button {...settingsToggle}>
                        <IoPrintOutline {...settingsIcon} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}

export default Settings;