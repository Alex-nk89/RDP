import {
    ActionIcon, NumberInput, Tooltip
    , BsArrowBarRight, BsArrowBarDown, BsArrowsAngleExpand, BsArrowClockwise, BsOption, BsAlt, BsChevronUp, BsChevronDown
} from '..';

export const MnemoschemeEditorPanelDimensionsAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {

    const changeWidth = (width) => {
        if (width > 0) {
            setElementAttributes({ ...elementAttributes, width });
            mnemoscheme?._activeObject.set({ width });
            mnemoscheme.renderAll();
        }
    };

    const increaseWidth = () => changeWidth(++elementAttributes.width);

    const decreaseWidth = () => changeWidth(--elementAttributes.width);

    const changeHeight = (height) => {
        if (height > 0) {
            setElementAttributes({ ...elementAttributes, height });
            mnemoscheme?._activeObject.set({ height });
            mnemoscheme.renderAll();
        }
    };

    const increaseHeight = () => changeHeight(++elementAttributes.height);

    const decreaseHeight = () => changeHeight(--elementAttributes.height);

    const changeAngle = (angle) => {
        setElementAttributes({ ...elementAttributes, angle });
        mnemoscheme?._activeObject.set({ angle });
        mnemoscheme.renderAll();
    };

    const increaseAngle = () => changeAngle(++elementAttributes.angle);

    const decreaseAngle = () => changeAngle(--elementAttributes.angle);

    const changeRadius = (radius) => {
        if (radius > 0) {
            setElementAttributes({ ...elementAttributes, radius });
            mnemoscheme?._activeObject.set({ radius });
            mnemoscheme.renderAll();
        }
    };

    const increaseRadius = () => changeRadius(++elementAttributes.radius);

    const decreaseRadius = () => changeRadius(--elementAttributes.radius);

    const changeSkewX = (skewX) => {
        setElementAttributes({ ...elementAttributes, skewX });;
        mnemoscheme?._activeObject.set({ skewX });
        mnemoscheme.renderAll();
    };

    const increaseSkewX = () => changeSkewX(++elementAttributes.skewX);

    const decreaseSkewX = () => changeSkewX(--elementAttributes.skewX);

    const changeSkewY = (skewY) => {
        setElementAttributes({ ...elementAttributes, skewY });
        mnemoscheme?._activeObject.set({ skewY });
        mnemoscheme.renderAll();
    };

    const increaseSkewY = () => changeSkewY(++elementAttributes.skewY);

    const decreaseSkewY = () => changeSkewY(--elementAttributes.skewY);

    const selectWidth = ['rect', 'line'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить ширину' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    min='0' max='1920'
                    icon={<BsArrowBarRight size={18} color='#5c5c5c' />}
                    value={elementAttributes.width}
                    onChange={changeWidth}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseWidth}>
                                <BsChevronUp size={10} />
                            </ActionIcon>

                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseWidth}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>)
        : null;

    const selectHeight = ['rect', 'line'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить высоту' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    min='0' max='675'
                    icon={<BsArrowBarDown size={18} color='#5c5c5c' />}
                    value={elementAttributes.height}
                    onChange={changeHeight}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseHeight}>
                                <BsChevronUp size={10} />
                            </ActionIcon>

                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseHeight}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>)
        : null;

    const selectRadius = ['circle'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить радиус' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    min='1'
                    icon={<BsArrowsAngleExpand size={14} color='#5c5c5c' />}
                    value={elementAttributes.radius}
                    onChange={changeRadius}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseRadius}>
                                <BsChevronUp size={10} />
                            </ActionIcon>

                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseRadius}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>)
        : null;

    const selectAngle = ['rect', 'line', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Поворот' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    icon={<BsArrowClockwise size={18} color='#5c5c5c' />}
                    value={mnemoscheme?._activeObject.angle}
                    onChange={changeAngle}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseAngle}>
                                <BsChevronUp size={10} />
                            </ActionIcon>

                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseAngle}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>)
        : null;

    const selectSkewX = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Наклон по оси X' openDelay={1000}>
            <NumberInput
                size='xs'
                type='number'
                icon={<BsOption size={18} color='#5c5c5c' />}
                value={elementAttributes.skewX}
                onChange={changeSkewX}
                rightSection={(
                    <div>
                        <ActionIcon size={13} variant='light' data-settings onClick={increaseSkewX}>
                            <BsChevronUp size={10} />
                        </ActionIcon>

                        <ActionIcon size={13} variant='light' data-settings onClick={decreaseSkewX}>
                            <BsChevronDown size={10} />
                        </ActionIcon>
                    </div>
                )}
            />
        </Tooltip>
    ) : null;

    const selectSkewY = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Наклон по оси Y' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    icon={<BsAlt size={18} color='#5c5c5c' />}
                    value={elementAttributes.skewY}
                    onChange={changeSkewY}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseSkewY}>
                                <BsChevronUp size={10} />
                            </ActionIcon>
    
                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseSkewY}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>
        )
        : null;

    return (
        <>
            {selectWidth}
            {selectHeight}
            {selectRadius}
            {selectAngle}
            {selectSkewX}
            {selectSkewY}
        </>
    )
}