import {
    useState, useEffect,
    ActionIcon,
    BsTrash, BsGripVertical,
    MnemoschemeEditorPanelColorsAttribute, MnemoschemeEditorPanelDimensionsAttribute,
    MnemoschemeEditorPanelStrokeAttribute, MnemoschemeEditorPanelTextAttribute,
    MnemoschemeEditorPanelCanvasAttribute
} from '..';

export const MnemoschemeEditorPanelChangeElements = ({ mnemoscheme }) => {
    // От возможности изменять порядок слоев принято решение отказаться, из-за особенностей преобразования в SVG при выводе схемы для просмотра.
    // Для сохранения порядка слоев придется выводить по очереди все объекты, что лишает возможности мемоизировать все объекты за исключением 
    // тегов. С ростом схемы будет падать производительность приложения

    const [mnemoschemeActiveObjectType, setMnemoschemeActiveObjectType] = useState(null);
    const [elementAttributes, setElementAttributes] = useState({
        width: 50,
        height: 50,
        radius: 20,
        fill: 'rgba(255, 255, 255, 1)',
        stroke: 'rgba(255, 255, 255, 1)',
        strokeWidth: 1,
        rx: 0,
        ry: 0,
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
        backgroundColor: 'rgba(255, 255, 255, 1)'
    });

    const getElementAttributes = (event) => {
        if (!event.target) {
            setMnemoschemeActiveObjectType(null);
            return;
        }

        const { width, height, radius, angle, fill, stroke, strokeWidth, rx, ry, skewX, skewY, text, fontSize, fontWeight,
            productId, tagId, tagName, round } = event.target;

        setMnemoschemeActiveObjectType(event.target.type);

        setElementAttributes({
            ...elementAttributes,
            width, height, radius, angle, fill, stroke, strokeWidth, rx, ry, skewX, skewY, fontSize, fontWeight,
            tagId, tagName, productId, round,
            text: productId > 0 ? '%' + tagName : text
        });
    };

    //const bringForward = () => {
    //    mnemoscheme?._activeObject.bringForward();
    //    mnemoscheme.renderAll();
    //};

    //const sendBackwards = () => {
    //    mnemoscheme?._activeObject.sendBackwards();
    //    mnemoscheme.renderAll();
    //};

    const deleteSelectedItem = () => {
        if (mnemoscheme._activeObject) {
            mnemoscheme.remove(mnemoscheme.getActiveObject());
        }

        setMnemoschemeActiveObjectType(null);
    };

    useEffect(() => {
        mnemoscheme?.on('mouse:down', getElementAttributes);

        if (mnemoscheme) {
            setElementAttributes({ ...elementAttributes, backgroundColor: mnemoscheme.backgroundColor });
        }

        return mnemoscheme?.on('mouse:down', getElementAttributes);
        //eslint-disable-next-line
    }, [mnemoscheme]);

    //const selectBringForward = mnemoschemeActiveObjectType
    //    ? (
    //        <Tooltip label='Переместить вперед'>
    //            <ActionIcon color="indigo" size="lg" onClick={bringForward} >
    //                <BsFront size={18} />
    //            </ActionIcon>
    //        </Tooltip>
    //    )
    //    : null;

    //const selectSendBackwards = mnemoschemeActiveObjectType
    //    ? (
    //        <Tooltip label='Переместить назад'>
    //            <ActionIcon color="indigo" size="lg" onClick={sendBackwards} >
    //                <BsBack size={18} />
    //            </ActionIcon>
    //        </Tooltip>
    //    )
    //    : null;

    const deleteElement = mnemoschemeActiveObjectType ? (
        <>
            <BsGripVertical size={24} style={{ color: '#aab3ba' }} />

            <ActionIcon color="red" size="lg" variant='light' onClick={deleteSelectedItem}>
                <BsTrash size={18} />
            </ActionIcon>
        </>
    ) : null;

    return (
        <div className='info-block__mnemoscheme-editor__settings__change-block'>
            <MnemoschemeEditorPanelTextAttribute
                mnemoschemeActiveObjectType={mnemoschemeActiveObjectType}
                elementAttributes={elementAttributes}
                setElementAttributes={setElementAttributes}
                mnemoscheme={mnemoscheme}
            />

            <MnemoschemeEditorPanelColorsAttribute
                mnemoschemeActiveObjectType={mnemoschemeActiveObjectType}
                elementAttributes={elementAttributes}
                setElementAttributes={setElementAttributes}
                mnemoscheme={mnemoscheme}
            />

            <MnemoschemeEditorPanelDimensionsAttribute
                mnemoschemeActiveObjectType={mnemoschemeActiveObjectType}
                elementAttributes={elementAttributes}
                setElementAttributes={setElementAttributes}
                mnemoscheme={mnemoscheme}
            />

            <MnemoschemeEditorPanelStrokeAttribute
                mnemoschemeActiveObjectType={mnemoschemeActiveObjectType}
                elementAttributes={elementAttributes}
                setElementAttributes={setElementAttributes}
                mnemoscheme={mnemoscheme}
            />

            {deleteElement}

            <MnemoschemeEditorPanelCanvasAttribute
                mnemoschemeActiveObjectType={mnemoschemeActiveObjectType}
                elementAttributes={elementAttributes}
                setElementAttributes={setElementAttributes}
                mnemoscheme={mnemoscheme}
            />
        </div>
    );
}