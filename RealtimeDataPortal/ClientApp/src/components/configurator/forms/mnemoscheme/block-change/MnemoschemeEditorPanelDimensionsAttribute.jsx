import {
    NumberInput, Tooltip,
    BsArrowBarRight, BsArrowBarDown, BsArrowsAngleExpand, BsArrowClockwise, BsOption, BsAlt
} from '..';

export const MnemoschemeEditorPanelDimensionsAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {

    const changeWidth = (width) => {
        if (width > 0) {
            setElementAttributes({ ...elementAttributes, width });
            mnemoscheme?._activeObject.set({ width });
            mnemoscheme.renderAll();
        }
    };

    const changeHeight = (height) => {
        if (height > 0) {
            setElementAttributes({ ...elementAttributes, height });
            mnemoscheme?._activeObject.set({ height });
            mnemoscheme.renderAll();
        }
    };

    const changeAngle = (angle) => {
        setElementAttributes({ ...elementAttributes, angle });
        mnemoscheme?._activeObject.set({ angle });
        mnemoscheme.renderAll();
    };

    const changeRadius = (radius) => {
        if (radius > 0) {
            setElementAttributes({ ...elementAttributes, radius });
            mnemoscheme?._activeObject.set({ radius });
            mnemoscheme.renderAll();
        }
    };

    const changeSkewX = (skewX) => {
        setElementAttributes({ ...elementAttributes, skewX });;
        mnemoscheme?._activeObject.set({ skewX });
        mnemoscheme.renderAll();
    };

    const changeSkewY = (skewY) => {
        setElementAttributes({ ...elementAttributes, skewY });
        mnemoscheme?._activeObject.set({ skewY });
        mnemoscheme.renderAll();
    };

    const selectWidth = ['rect', 'line'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить ширину'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    min='0' max='1200'
                    icon={<BsArrowBarRight size={18} color='#5c5c5c' />}
                    value={elementAttributes.width}
                    onChange={changeWidth}
                />
            </Tooltip>)
        : null;

    const selectHeight = ['rect', 'line'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить высоту'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    min='0' max='675'
                    icon={<BsArrowBarDown size={18} color='#5c5c5c' />}
                    value={elementAttributes.height}
                    onChange={changeHeight}
                />
            </Tooltip>)
        : null;

    const selectRadius = ['circle'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить радиус'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    min='1'
                    icon={<BsArrowsAngleExpand size={18} color='#5c5c5c' />}
                    value={elementAttributes.radius}
                    onChange={changeRadius}
                />
            </Tooltip>)
        : null;

    const selectAngle = ['rect', 'line', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Поворот'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    icon={<BsArrowClockwise size={18} color='#5c5c5c' />}
                    value={elementAttributes.angle}
                    onChange={changeAngle}
                />
            </Tooltip>)
        : null;

    const selectSkewX = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Наклон по оси X'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsOption size={18} color='#5c5c5c' />}
                value={elementAttributes.skewX}
                onChange={changeSkewX}
            />
        </Tooltip>
    ) : null;

    const selectSkewY = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Наклон по оси Y'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    icon={<BsAlt size={18} color='#5c5c5c' />}
                    value={elementAttributes.skewY}
                    onChange={changeSkewY}
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