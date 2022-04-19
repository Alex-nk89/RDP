import {
    ColorInput, Tooltip,
    BsSquare, BsFillSquareFill
} from '..';

export const MnemoschemeEditorPanelColorsAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {

    const changeFill = (fill) => {
        setElementAttributes({ ...elementAttributes, fill });
        mnemoscheme?._activeObject.set({ fill });
        mnemoscheme.renderAll();
    };

    const changeStroke = (stroke) => {
        setElementAttributes({ ...elementAttributes, stroke });
        mnemoscheme?._activeObject.set({ stroke });
        mnemoscheme.renderAll();
    };

    const selectFill = ['rect', 'circle', 'triangle', 'text', 'path'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Изменить цвет заливки'>
                <ColorInput
                    size='xs'
                    variant='filled'
                    format="rgba"
                    icon={<BsFillSquareFill color={elementAttributes.fill} size={18} />}
                    value={elementAttributes.fill}
                    onChange={changeFill}
                />
            </Tooltip>
        )
        : null;

    const selectStroke = ['rect', 'line', 'path', 'circle', 'triangle'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Изменить цвет обводки'>
            <ColorInput
                size='xs'
                variant='filled'
                format="rgba"
                icon={<BsSquare color={elementAttributes.stroke} size={18} />}
                value={elementAttributes.stroke}
                onChange={changeStroke}
            />
        </Tooltip>
    ) : null;

    return (
        <>
            {selectFill}
            {selectStroke}
        </>
    );
}