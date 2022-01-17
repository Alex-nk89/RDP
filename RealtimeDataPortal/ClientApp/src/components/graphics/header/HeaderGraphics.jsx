import { Button, Tooltip, Space } from '@mantine/core';
import { IoPrintOutline, IoGridOutline, IoTrendingUpOutline } from 'react-icons/io5';
import { BsTable } from 'react-icons/bs';

import Calendar from '../calendar/calendar';

const HeaderGraphics = ({ attributesGraphic }) => {

    return (
        <div className='header-graphic'>
            <h3 className='title'>{attributesGraphic?.name}</h3>

            <div className="header-graphic__settings">
                <Calendar />

                <Space w="xs" />

                <Tooltip label='Сменить вид'>
                    <Button compact color="gray">
                        <IoGridOutline size={20} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Масштабировать'>
                    <Button compact color="gray">
                        <IoTrendingUpOutline size={20} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Скрыть таблицы'>
                    <Button compact color="gray">
                        <BsTable size={20} />
                    </Button>
                </Tooltip>

                <Space w="xs" />

                <Tooltip label='Печать'>
                    <Button compact color="gray">
                        <IoPrintOutline size={20} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}

export default HeaderGraphics;