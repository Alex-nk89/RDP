import {
    useState, useEffect,
    ActionIcon, ColorInput, Input, Tooltip,
    BsBorderWidth, BsFillSquareFill, BsSquare, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsArrowBarRight, BsArrowBarDown, BsTrash, BsGripVertical
} from '..';

export const MnemoschemeEditorPanelChangeElements = ({ mnemoscheme }) => {
    const [width, setWidth] = useState(50);
    const [height, setHeight] = useState(50);
    const [colorElement, setColorElement] = useState('#000000');
    const [colorStrokeElement, setColorStrokeElement] = useState('#000000');
    const [strokeWidthElement, setStrokeWidthElement] = useState(1);
    const [rxElement, setRXElement] = useState(0);
    const [ryElement, setRYElement] = useState(0);
    const [strokeDashArray, setStrokeDashArray] = useState('');
    const [mnemoschemeActiveObjectType, setMnemoschemeActiveObjectType] = useState(null)

    const getElementAttributes = (event) => {

        if (!event.target) {
            setMnemoschemeActiveObjectType(null);
            return;
        }

        setMnemoschemeActiveObjectType(event.target);
        setColorElement(event.target?.fill);
        setColorStrokeElement(event.target?.stroke);
        setStrokeWidthElement(event.target?.strokeWidth);
        setRXElement(event.target?.rx);
        setRYElement(event.target?.ry);
    }

    const changeWidth = (event) => {
        setWidth(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ width: Number(event.target.value) });
        }
    };

    const changeHeight = (event) => {
        setHeight(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ height: Number(event.target.value) });
        }
    };

    const changeColorElement = (color) => {
        setColorElement(color);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fill: color });
        }
    };

    const changeColorStrokeElement = (color) => {
        setColorStrokeElement(color);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ stroke: color });
        }
    };

    const changeStrokeWidthElement = (event) => {
        setStrokeWidthElement(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeWidth: Number(event.target.value) });
        }
    };

    const changeRXElement = (event) => {
        setRXElement(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ rx: Number(event.target.value) });
        }
    };

    const changeRYElement = (event) => {
        setRYElement(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ ry: Number(event.target.value) });
        }
    };

    const changeStrokeDashArray = (event) => {
        setStrokeDashArray(event.target.value);

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeDashArray: event.target.value.split(' ') });
        }
    };

    useEffect(() => {
        mnemoscheme?.on('mouse:down', getElementAttributes);

        return mnemoscheme?.on('mouse:down', getElementAttributes);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    //useEffect(() => {
    //    mnemoscheme?.on('selection:created', getElementAttributes);
    //    //eslint-disable-next-line
    //}, [mnemoscheme]);

    const selectWidth = ['rect'].includes(mnemoschemeActiveObjectType?.type) ? (
        <Tooltip label='Изменить ширину'>
            <Input
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrowBarRight size={18} color='#5c5c5c' />}
                value={width}
                onChange={changeWidth}
            />
        </Tooltip>
    ) : null;

    const selectHeight = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить высоту'>
            <Input
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrowBarDown size={18} color='#5c5c5c' />}
                value={height}
                onChange={changeHeight}
            />
        </Tooltip>
    ) : null;

    const selectColorElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет заливки'>
            <ColorInput
                size='xs'
                variant='filled'
                icon={<BsFillSquareFill color={colorElement} size={18} />}
                value={colorElement}
                onChange={changeColorElement}
            />
        </Tooltip>
    ) : null;

    const selectColorStrokeElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет обводки'>
            <ColorInput
                size='xs'
                variant='filled'
                icon={<BsSquare color={colorStrokeElement} size={18} />}
                value={colorStrokeElement}
                onChange={changeColorStrokeElement}
            />
        </Tooltip>
    ) : null;

    const selectStrokeWidthElement = ['rect'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить ширину обводки'>
            <Input
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
            <Input
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
            <Input
                size='xs'
                variant='filled'
                type='number'
                icon={<BsArrow90DegUp size={18} color='#5c5c5c' />}
                value={ryElement}
                onChange={changeRYElement}
            />
        </Tooltip>
    ) : null;

    const selectStrokeDashArray = ['rect'].includes(mnemoschemeActiveObjectType) ? (
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

    const deleteElement = mnemoschemeActiveObjectType ? (
        <>
            <BsGripVertical size={24} style={{ color: '#aab3ba' }} />

            <Tooltip label='Удалить элемент'>
                <ActionIcon color="red" size="lg" variant='light' >
                    <BsTrash size={18} />
                </ActionIcon>
            </Tooltip>
        </>
    ) : null;

    return (
        <div className='info-block__mnemoscheme-editor__panel__change-block'>
            {selectWidth}
            {selectHeight}
            {selectColorElement}
            {selectColorStrokeElement}
            {selectStrokeWidthElement}
            {selectRXElement}
            {selectRYElement}
            {selectStrokeDashArray}
            {deleteElement}
        </div>
    );
}