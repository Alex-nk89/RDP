import {
    ActionIcon, NumberInput, Tooltip
    , BsArrowBarRight, BsArrowBarDown, BsArrowsAngleExpand, BsArrowClockwise, BsOption, BsAlt, BsChevronUp, BsChevronDown
} from '..';

export const MnemoschemeEditorPanelDimensionsAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {
    // Если установить вручную значение, например, ширины (не стрелками), 
    // фокус оставить в input'е и далее выбрать другой обект, 
    // то установленное значение будет перенесо на выбранный обьект
    // Для избежания такой особенности работы, вводиться дополнительное принудительное 
    // разрешение для изменения свойства

    const changeWidth = (width, permision = false) => {
        if (width > 0 && (elementAttributes.width !== width || permision)) {
            setElementAttributes({ ...elementAttributes, width });
            mnemoscheme?._activeObject.set({ width });
            mnemoscheme.renderAll();
        }
    };

    const increaseWidth = () => changeWidth(++elementAttributes.width, true);

    const decreaseWidth = () => changeWidth(elementAttributes.width - 1, true);

    const changeHeight = (height, permision = false) => {
        if (height > 0 && (elementAttributes.height !== height || permision)) {
            setElementAttributes({ ...elementAttributes, height });
            mnemoscheme?._activeObject.set({ height });
            mnemoscheme.renderAll();
        }
    };

    const increaseHeight = () => changeHeight(++elementAttributes.height, true);

    const decreaseHeight = () => changeHeight(elementAttributes.height - 1, true);

    const changeAngle = (angle, permision = false) => {
        if (elementAttributes.angle !== angle || permision) {
            setElementAttributes({ ...elementAttributes, angle });
            mnemoscheme?._activeObject.set({ angle });
            mnemoscheme.renderAll();
        }
    };

    const increaseAngle = () => changeAngle(++elementAttributes.angle, true);

    const decreaseAngle = () => changeAngle(elementAttributes.angle - 1, true);

    const changeRadius = (radius, permision = false) => {
        if (radius > 0 && (elementAttributes.radius !== radius || permision)) {
            setElementAttributes({ ...elementAttributes, radius });
            mnemoscheme?._activeObject.set({ radius });
            mnemoscheme.renderAll();
        }
    };

    const increaseRadius = () => changeRadius(++elementAttributes.radius, true);

    const decreaseRadius = () => changeRadius(elementAttributes.radius - 1, true);

    const changeSkewX = (skewX, permision = false) => {
        if (skewX >= 0 && (elementAttributes.skewX !== skewX || permision)) {
            setElementAttributes({ ...elementAttributes, skewX });;
            mnemoscheme?._activeObject.set({ skewX });
            mnemoscheme.renderAll();
        }
    };

    const increaseSkewX = () => changeSkewX(++elementAttributes.skewX, true);

    const decreaseSkewX = () => changeSkewX(elementAttributes.skewX - 1, true);

    const changeSkewY = (skewY, permision = false) => {
        if (skewY >= 0 && (elementAttributes.skewY !== skewY || permision)) {
            setElementAttributes({ ...elementAttributes, skewY });
            mnemoscheme?._activeObject.set({ skewY });
            mnemoscheme.renderAll();
        }
    };

    const increaseSkewY = () => changeSkewY(++elementAttributes.skewY, true);

    const decreaseSkewY = () => changeSkewY(elementAttributes.skewY - 1, true);

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