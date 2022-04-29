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


//let reader = new FileReader();
//        //reader.readAsDataURL(event.target?.files[0]);
//        //reader.onload = function () {
//            const img = document.createElement('img');
//            img.src = urlToUserImage;
//            mnemoscheme.add(new fabric.Image(img, { width: 600, height: 600 }));
//        //}


//let reader = new FileReader();
//reader.readAsDataURL(event.target?.files[0]);
//reader.onload = function() {
//    const img = document.createElement('img');
//    img.src = reader.result;
//    document.querySelector('.info-block__mnemoscheme-editor__create-block').append(img);
//    //mnemoscheme.add(new fabric.Image(URL.createObjectURL(reader.result)));
//}