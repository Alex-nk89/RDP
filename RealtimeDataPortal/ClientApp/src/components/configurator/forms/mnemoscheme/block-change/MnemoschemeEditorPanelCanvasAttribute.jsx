import {
    ColorInput, Tooltip,
    BsFillPaletteFill
} from '..';

export const MnemoschemeEditorPanelCanvasAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {

    const changeMnemoschemeBackgroundColor = (color) => {
        setElementAttributes({ ...elementAttributes, backgroundColor: color });
        mnemoscheme.setBackgroundColor(color, mnemoscheme.renderAll.bind(mnemoscheme));
    };

    const selectMnemoschemeBackgroundColor = !mnemoschemeActiveObjectType
        ? (
            <>
                <Tooltip label='Сменить цвет фона' >
                    <ColorInput
                        size='xs'
                        variant='filled'
                        format='rgba'
                        icon={<BsFillPaletteFill color={elementAttributes.backgroundColor} size={18} />}
                        value={elementAttributes.backgroundColor}
                        onChange={changeMnemoschemeBackgroundColor}
                    />
                </Tooltip>
            </>
        )
        : null;

    return (
        <>
            {selectMnemoschemeBackgroundColor}
        </>
    );
}