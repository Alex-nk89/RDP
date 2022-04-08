import {
    useState, useEffect,
    ActionIcon, ColorInput, Input, NumberInput, TextInput, Tooltip,
    BsBorderWidth, BsFillSquareFill, BsSquare, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsArrowBarRight,
    BsArrowBarDown, BsTrash, BsGripVertical, BsOption, BsAlt, BsArrowClockwise, BsArrowsAngleExpand, BsFonts,
    useRequest, useNotification
} from '..';

export const MnemoschemeEditorPanelChangeElements = ({ mnemoscheme }) => {
    const [mnemoschemeActiveObjectType, setMnemoschemeActiveObjectType] = useState(null);
    const [listTags, setListTags] = useState([]);
    const [elementAttributes, setElementAttributes] = useState({
        width: 50,
        height: 50,
        radius: 20,
        colorElement: '#000',
        colorStrokeElement: '#000',
        strokeWidthElement: 1,
        rxElement: 0,
        ryElement: 0,
        strokeDashArray: '',
        skewX: 0,
        skewY: 0,
        angle: 0,
        text: '',
        fontSize: 14,
        fontWeight: 400,
        productId: 0,
        tagId: 0,
        tagName: '',
        isAutomaticColorSelection: true
    });

    const { request } = useRequest();
    const { show } = useNotification();

    const visibleListTags = listTags.length > 0 ? true : false;

    const closeList = () => setListTags([]);

    const getElementAttributes = (event) => {
        if (!event.target) {
            setMnemoschemeActiveObjectType(null);
            return;
        }

        const { width, height, radius, angle, fill, stroke, strokeWidth, rx, ry, skewX, skewY, text, fontSize, fontWeight,
            productId, tagId, tagName, round, isAutomaticColorSelection } = event.target;

        setMnemoschemeActiveObjectType(event.target.type);
        setElementAttributes({
            ...elementAttributes, width, height, radius, angle, fill, stroke, strokeWidth, rx, ry,
            skewX, skewY, fontSize, fontWeight,
            text: productId > 0 ? '%' + tagName : text, tagId, tagName, productId, round, isAutomaticColorSelection
        });
    }

    const changeWidth = (width) => {
        setElementAttributes({ ...elementAttributes, width });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ width });
            mnemoscheme.renderAll();
        }
    };

    const changeHeight = (height) => {
        setElementAttributes({ ...elementAttributes, height });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ height });
            mnemoscheme.renderAll();
        }
    };

    const changeAngle = (angle) => {
        setElementAttributes({ ...elementAttributes, angle });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ angle });
            mnemoscheme.renderAll();
        }
    };

    const changeRadius = (radius) => {
        setElementAttributes({ ...elementAttributes, radius });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ radius });
            mnemoscheme.renderAll();
        }
    };

    const changeColorElement = (colorElement) => {
        setElementAttributes({ ...elementAttributes, colorElement });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fill: colorElement });
            mnemoscheme.renderAll();
        }
    };

    const changeColorStrokeElement = (colorStrokeElement) => {
        setElementAttributes({ ...elementAttributes, colorStrokeElement });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ stroke: colorStrokeElement });
            mnemoscheme.renderAll();
        }
    };

    const changeStrokeWidthElement = (strokeWidthElement) => {
        setElementAttributes({ ...elementAttributes, strokeWidthElement });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeWidth: strokeWidthElement });
            mnemoscheme.renderAll();
        }
    };

    const changeRXElement = (rxElement) => {
        setElementAttributes({ ...elementAttributes, rxElement });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ rx: rxElement });
            mnemoscheme.renderAll();
        }
    };

    const changeRYElement = (ryElement) => {
        setElementAttributes({ ...elementAttributes, ryElement });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ ry: ryElement });
            mnemoscheme.renderAll();
        }
    };

    const changeStrokeDashArray = (event) => {
        setElementAttributes({ ...elementAttributes, strokeDashArray: event.target.value });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ strokeDashArray: event.target.value.split(' ') });
            mnemoscheme.renderAll();
        }
    };

    const changeSkewX = (skewX) => {
        setElementAttributes({ ...elementAttributes, skewX });;

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ skewX });
            mnemoscheme.renderAll();
        }
    };

    const changeSkewY = (skewY) => {
        setElementAttributes({ ...elementAttributes, skewY });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ skewY });
            mnemoscheme.renderAll();
        }
    };

    const changeText = (event) => {
        const text = event.target.value;
        setElementAttributes({ ...elementAttributes, text });

        if (mnemoscheme._activeObject) {

            if (text[0] === '%' && text.length > 3) {
                request(`GetTags?name=${text.substring(1)}&forMnemoscheme=true`)
                    .then(listTags => {
                        setListTags(listTags);
                    })
                    .catch(error => show('error', error));
            } else {
                mnemoscheme._activeObject.set({ text });
            }

            mnemoscheme.renderAll();
        }
    };

    const changeFontSize = (fontSize) => {
        setElementAttributes({ ...elementAttributes, fontSize });

        if (mnemoscheme._activeObject) {
            mnemoscheme._activeObject.set({ fontSize });
            mnemoscheme.renderAll();
        }
    };

    const changeFontWeight = (fontWeight) => {
        setElementAttributes({ ...elementAttributes, fontWeight });

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

    const selectTag = (event) => {
        if (elementAttributes.text[0] === '%') {
            const { tagid, productid, tagname, round, color } = event.target.dataset;

            setElementAttributes({ ...elementAttributes, text: '%' + tagname });

            mnemoscheme._activeObject.set({
                tagId: Number(tagid), 
                productId: Number(productid), 
                tagName: tagname,
                text: '000.000', 
                round: Number(round), 
                fill: color, 
                isAutomaticColorSelection: true
            });
            mnemoscheme.renderAll();
        }
    };

    useEffect(() => {
        mnemoscheme?.on('mouse:down', getElementAttributes);

        return mnemoscheme?.on('mouse:down', getElementAttributes);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
    }, []);

    const selectWidth = ['rect', 'line'].includes(mnemoschemeActiveObjectType) ? (
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
                value={elementAttributes.height}
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
                value={elementAttributes.radius}
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
                value={elementAttributes.angle}
                onChange={changeAngle}
            />
        </Tooltip>
    ) : null;

    const selectColorElement = ['rect', 'circle', 'triangle', 'text'].includes(mnemoschemeActiveObjectType) && !elementAttributes.isAutomaticColorSelection
        ? (
            <Tooltip label='Изменить цвет заливки'>
                <ColorInput
                    size='xs'
                    variant='filled'
                    format="rgba"
                    icon={<BsFillSquareFill color={elementAttributes.colorElement} size={18} />}
                    value={elementAttributes.colorElement}
                    onChange={changeColorElement}
                />
            </Tooltip>
        )
        : null;

    const selectColorStrokeElement = ['rect', 'line', 'path', 'circle', 'triangle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет обводки'>
            <ColorInput
                size='xs'
                variant='filled'
                format="rgba"
                icon={<BsSquare color={elementAttributes.colorStrokeElement} size={18} />}
                value={elementAttributes.colorStrokeElement}
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
                value={elementAttributes.strokeWidthElement}
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
                value={elementAttributes.rxElement}
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
                value={elementAttributes.ryElement}
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
                value={elementAttributes.strokeDashArray}
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

    const selectText = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <div className='info-block__mnemoscheme-editor__change-block__text-block'>
                <Tooltip label='Изменить текст'>
                    <TextInput
                        size='xs'
                        variant='filled'
                        icon={<BsFonts size={18} color='#5c5c5c' />}
                        value={elementAttributes.text}
                        onChange={changeText}
                    />
                </Tooltip>

                <div className="info-block__mnemoscheme-editor__change-block__text-block__search-result" open={visibleListTags}>
                    {
                        listTags.map((tag, index) => (
                            <p
                                key={index}
                                id={tag.tagId}
                                data-tagid={tag.tagId}
                                data-productid={tag.productId}
                                data-tagname={tag.tagName}
                                data-round={tag.round}
                                data-color={tag.color}
                                className='info-block__mnemoscheme-editor__change-block__text-block__search-result__item'
                                onClick={selectTag}
                            >
                                <span
                                    data-tagid={tag.tagId}
                                    data-productid={tag.productId}
                                    data-tagname={tag.tagName}
                                    data-round={tag.round}
                                    data-color={tag.color}
                                    style={{ fontSize: '13px' }} >
                                    {tag.tagName}
                                </span>
                                <br />
                                <span
                                    data-tagid={tag.tagId}
                                    data-productid={tag.productId}
                                    data-tagname={tag.tagName}
                                    data-round={tag.round}
                                    data-color={tag.color}
                                    style={{ fontSize: '12px', color: '#909296' }}>
                                    {tag.productName}
                                </span>
                            </p>
                        ))
                    }
                </div>
            </div>
        )
        : null;

    const selectFontSize = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Размер шрифта'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    min='5'
                    icon={<BsAlt size={18} color='#5c5c5c' />}
                    value={elementAttributes.fontSize}
                    onChange={changeFontSize}
                />
            </Tooltip>
        )
        : null;

    const selectFontWeight = ['text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Толщина шрифта'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='100' max='900' step={100}
                icon={<BsAlt size={18} color='#5c5c5c' />}
                value={elementAttributes.fontWeight}
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
            {selectText}
            {selectFontSize}
            {selectFontWeight}

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

            {deleteElement}
        </div>
    );
}