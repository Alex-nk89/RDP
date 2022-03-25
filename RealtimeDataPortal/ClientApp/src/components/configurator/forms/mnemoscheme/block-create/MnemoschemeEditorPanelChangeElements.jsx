import {
    useState, useEffect,
    ActionIcon, ColorInput, Input, NumberInput, Tooltip,
    BsBorderWidth, BsFillSquareFill, BsSquare, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsArrowBarRight,
    BsArrowBarDown, BsTrash, BsGripVertical, BsOption, BsAlt, BsArrowClockwise, BsArrowsAngleExpand
} from '..';

export const MnemoschemeEditorPanelChangeElements = ({ mnemoscheme }) => {
    const [width, setWidth] = useState(50);
    const [height, setHeight] = useState(50);
    const [radius, setRadius] = useState(20);
    const [colorElement, setColorElement] = useState('#000000');
    const [colorStrokeElement, setColorStrokeElement] = useState('#000000');
    const [strokeWidthElement, setStrokeWidthElement] = useState(1);
    const [rxElement, setRXElement] = useState(0);
    const [ryElement, setRYElement] = useState(0);
    const [strokeDashArray, setStrokeDashArray] = useState('');
    const [skewX, setSkewX] = useState(0);
    const [skewY, setSkewY] = useState(0);
    const [angle, setAngle] = useState(0);
    const [fontSize, setFontSize] = useState(14);
    const [fontWeight, setFontWeight] = useState(400);
    const [mnemoschemeActiveObjectType, setMnemoschemeActiveObjectType] = useState(null);

    const getElementAttributes = (event) => {

        if (!event.target) {
            setMnemoschemeActiveObjectType(null);
            return;
        }

        const { width, height, radius, angle, fill, stroke, strokeWidth, rx, ry, skewX, skewY, fontSize, fontWeight } = event.target;

        setMnemoschemeActiveObjectType(event.target.type);
        setWidth(width);
        setHeight(height);
        setRadius(radius);
        setColorElement(fill);
        setColorStrokeElement(stroke);
        setStrokeWidthElement(strokeWidth);
        setRXElement(rx);
        setRYElement(ry);
        setSkewX(skewX);
        setSkewY(skewY);
        setAngle(angle);
        setFontSize(fontSize);
        setFontWeight(fontWeight);
    }

    const changeWidth = (width) => {
        setWidth(width);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ width });
            mnemoscheme.renderAll();
        }
    };

    const changeHeight = (height) => {
        setHeight(height);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ height });
            mnemoscheme.renderAll();
        }
    };

    const changeAngle = (angle) => {
        console.log(mnemoscheme._activeObject);
        setAngle(angle);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ angle });
            mnemoscheme.renderAll();
        }
    };

    const changeRadius = (radius) => {
        setRadius(radius);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ radius });
            mnemoscheme.renderAll();
        }
    };

    const changeColorElement = (color) => {
        setColorElement(color);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fill: color });
            mnemoscheme.renderAll();
        }
    };

    const changeColorStrokeElement = (color) => {
        setColorStrokeElement(color);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ stroke: color });
            mnemoscheme.renderAll();
        }
    };

    const changeStrokeWidthElement = (strokeWidth) => {
        setStrokeWidthElement(strokeWidth);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeWidth });
            mnemoscheme.renderAll();
        }
    };

    const changeRXElement = (rx) => {
        setRXElement(rx);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ rx });
            mnemoscheme.renderAll();
        }
    };

    const changeRYElement = (ry) => {
        setRYElement(ry);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ ry });
            mnemoscheme.renderAll();
        }
    };

    const changeStrokeDashArray = (event) => {
        setStrokeDashArray(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeDashArray: event.target.value.split(' ') });
            mnemoscheme.renderAll();
        }
    };

    const changeSkewX = (skewX) => {
        setSkewX(skewX);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ skewX });
            mnemoscheme.renderAll();
        }
    };

    const changeSkewY = (skewY) => {
        setSkewX(skewY);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ skewY });
            mnemoscheme.renderAll();
        }
    };

    const changeFontSize = (fontSize) => {
        setFontSize(fontSize);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fontSize });
            mnemoscheme.renderAll();
        }
    };

    const changeFontWeight = (fontWeight) => {
        setFontWeight(fontWeight);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fontWeight });
            mnemoscheme.renderAll();
        }
    };

    const deleteSelectedItem = () => {
        if (mnemoscheme._activeObject) {
            mnemoscheme.remove(mnemoscheme.getActiveObject());
        }

        setMnemoschemeActiveObjectType(null);
    };

    useEffect(() => {
        mnemoscheme?.on('mouse:down', getElementAttributes);

        return mnemoscheme?.on('mouse:down', getElementAttributes);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    const selectWidth = ['rect', 'line'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить ширину'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='0' max='1200'
                icon={<BsArrowBarRight size={18} color='#5c5c5c' />}
                value={width}
                onChange={changeWidth}
            />
        </Tooltip>
    ) : null;

    const selectHeight = ['rect', 'line'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить высоту'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='0' max='675'
                icon={<BsArrowBarDown size={18} color='#5c5c5c' />}
                value={height}
                onChange={changeHeight}
            />
        </Tooltip>
    ) : null;

    const selectRadius = ['circle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить радиус'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='1'
                icon={<BsArrowsAngleExpand size={18} color='#5c5c5c' />}
                value={radius}
                onChange={changeRadius}
            />
        </Tooltip>
    ) : null;

    const selectAngle = ['rect', 'line', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Поворот'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrowClockwise size={18} color='#5c5c5c' />}
                value={angle}
                onChange={changeAngle}
            />
        </Tooltip>
    ) : null;

    const selectColorElement = ['rect', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет заливки'>
            <ColorInput
                size='xs'
                variant='filled'
                format="rgba"
                icon={<BsFillSquareFill color={colorElement} size={18} />}
                value={colorElement}
                onChange={changeColorElement}
            />
        </Tooltip>
    ) : null;

    const selectColorStrokeElement = ['rect', 'line', 'path', 'circle', 'triangle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет обводки'>
            <ColorInput
                size='xs'
                variant='filled'
                format="rgba"
                icon={<BsSquare color={colorStrokeElement} size={18} />}
                value={colorStrokeElement}
                onChange={changeColorStrokeElement}
            />
        </Tooltip>
    ) : null;

    const selectStrokeWidthElement = ['rect', 'line', 'circle', 'triangle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить ширину обводки'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsBorderWidth size={18} color='#5c5c5c' />}
                value={strokeWidthElement}
                onChange={changeStrokeWidthElement}
            />
        </Tooltip>
    ) : null;

    const selectRXElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси X'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrow90DegRight size={18} color='#5c5c5c' />}
                value={rxElement}
                onChange={changeRXElement}
            />
        </Tooltip>
    ) : null;

    const selectRYElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Скругление углов по оси Y'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrow90DegUp size={18} color='#5c5c5c' />}
                value={ryElement}
                onChange={changeRYElement}
            />
        </Tooltip>
    ) : null;

    const selectStrokeDashArray = ['rect', 'line', 'circle', 'triangle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Обводка пунктирной линией'>
            <Input
                size='xs'
                variant='filled'
                icon={<BsBorderStyle size={18} color='#5c5c5c' />}
                value={strokeDashArray}
                onChange={changeStrokeDashArray}
            />
        </Tooltip>
    ) : null;

    const selectSkewX = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Наклон по оси X'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsOption size={18} color='#5c5c5c' />}
                value={skewX}
                onChange={changeSkewX}
            />
        </Tooltip>
    ) : null;

    const selectSkewY = ['rect', 'path', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Наклон по оси Y'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                icon={<BsAlt size={18} color='#5c5c5c' />}
                value={skewY}
                onChange={changeSkewY}
            />
        </Tooltip>
    ) : null;

    const selectFontSize = ['text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Размер шрифта'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='5'
                icon={<BsAlt size={18} color='#5c5c5c' />}
                value={fontSize}
                onChange={changeFontSize}
            />
        </Tooltip>
    ) : null;

    const selectFontWeight = ['text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Толщина шрифта'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='100' max='900' step={100}
                icon={<BsAlt size={18} color='#5c5c5c' />}
                value={fontWeight}
                onChange={changeFontWeight}
            />
        </Tooltip>
    ) : null;

    const deleteElement = mnemoschemeActiveObjectType ? (
        <>
            <BsGripVertical size={24} style={{ color: '#aab3ba' }} />

            <ActionIcon color="red" size="lg" variant='light' onClick={deleteSelectedItem}>
                <BsTrash size={18} />
            </ActionIcon>
        </>
    ) : null;

    return (
        <div className='info-block__mnemoscheme-editor__change-block'>
            {selectColorElement}
            {selectColorStrokeElement}

            {selectWidth}
            {selectHeight}
            {selectRadius}
            {selectAngle}

            {selectStrokeWidthElement}
            {selectStrokeDashArray}

            {selectRXElement}
            {selectRYElement}

            {selectSkewX}
            {selectSkewY}

            {selectFontSize}
            {selectFontWeight}

            {deleteElement}
        </div>
    );
}