import {
    ActionIcon, Input, NumberInput, Tooltip,
    BsBorderWidth, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsChevronUp, BsChevronDown
} from '..';

export const MnemoschemeEditorPanelStrokeAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {
    const changeStrokeWidth = (strokeWidth) => {
        if (strokeWidth >= 0) {
            setElementAttributes({ ...elementAttributes, strokeWidth });
            mnemoscheme?._activeObject.set({ strokeWidth });
            mnemoscheme.renderAll();
        }
    };

    const increaseStrokeWidth = () => changeStrokeWidth(++elementAttributes.strokeWidth);

    const decreaseStrokeWidth = () => changeStrokeWidth(--elementAttributes.strokeWidth);

    const changeRX = (rx) => {
        if (rx >= 0) {
            setElementAttributes({ ...elementAttributes, rx });
            mnemoscheme?._activeObject.set({ rx });
            mnemoscheme.renderAll();
        }
    };

    const increaseRX = () => changeRX(++elementAttributes.rx);

    const decreaseRX = () => changeRX(--elementAttributes.rx);

    const changeRY = (ry) => {
        if (ry >= 0) {
            setElementAttributes({ ...elementAttributes, ry });
            mnemoscheme?._activeObject.set({ ry });
            mnemoscheme.renderAll();
        }
    };

    const increaseRY = () => changeRY(++elementAttributes.ry);

    const decreaseRY = () => changeRY(--elementAttributes.ry);

    const changeStrokeDashArray = (event) => {
        setElementAttributes({ ...elementAttributes, strokeDashArray: event.target.value });
        mnemoscheme?._activeObject.set({ strokeDashArray: event.target.value.split(' ') });
        mnemoscheme.renderAll();
    };

    const selectStrokeWidth = ['rect', 'line', 'circle', 'triangle', 'path'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить ширину обводки' openDelay={1000}>
            <NumberInput
                size='xs'
                type='number'
                icon={<BsBorderWidth size={18} color='#5c5c5c' />}
                value={elementAttributes.strokeWidth}
                onChange={changeStrokeWidth}
                rightSection={(
                    <div>
                        <ActionIcon size={13} variant='light' data-settings onClick={increaseStrokeWidth}>
                            <BsChevronUp size={10} />
                        </ActionIcon>

                        <ActionIcon size={13} variant='light' data-settings onClick={decreaseStrokeWidth}>
                            <BsChevronDown size={10} />
                        </ActionIcon>
                    </div>
                )}
            />
        </Tooltip>
    ) : null;

    const selectRXElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси X' openDelay={1000}>
            <NumberInput
                size='xs'
                type='number'
                icon={<BsArrow90DegRight size={18} color='#5c5c5c' />}
                value={elementAttributes.rx}
                onChange={changeRX}
                rightSection={(
                    <div>
                        <ActionIcon size={13} variant='light' data-settings onClick={increaseRX}>
                            <BsChevronUp size={10} />
                        </ActionIcon>

                        <ActionIcon size={13} variant='light' data-settings onClick={decreaseRX}>
                            <BsChevronDown size={10} />
                        </ActionIcon>
                    </div>
                )}
            />
        </Tooltip>
    ) : null;

    const selectRYElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси Y' openDelay={1000}>
            <NumberInput
                size='xs'
                type='number'
                icon={<BsArrow90DegUp size={18} color='#5c5c5c' />}
                value={elementAttributes.ry}
                onChange={changeRY}
                rightSection={(
                    <div>
                        <ActionIcon size={13} variant='light' data-settings onClick={increaseRY}>
                            <BsChevronUp size={10} />
                        </ActionIcon>

                        <ActionIcon size={13} variant='light' data-settings onClick={decreaseRY}>
                            <BsChevronDown size={10} />
                        </ActionIcon>
                    </div>
                )}
            />
        </Tooltip>
    ) : null;

    const selectStrokeDashArray = ['rect', 'line', 'circle', 'triangle', 'path'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Обводка пунктирной линией' openDelay={1000}>
            <Input
                size='xs'
                icon={<BsBorderStyle size={18} color='#5c5c5c' />}
                style={{ maxWidth: '100px'}}
                value={elementAttributes.strokeDashArray}
                onChange={changeStrokeDashArray}
            />
        </Tooltip>
    ) : null;

    return (
        <>
            {selectStrokeWidth}
            {selectStrokeDashArray}
            {selectRXElement}
            {selectRYElement}
        </>
    );
}