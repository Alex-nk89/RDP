import {
    Button, Tooltip,
    fabric,
    BsFillSquareFill
} from "..";

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme }) => {
    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect({
            top: 100,
            left: 100,
            width: 50,
            height: 50,
            fill: '#fff',
            borderColor: '#000',
            hasBorders: true,
            stroke: '#000'
        }));
    }

    return (
        <div className='info-block__mnemoscheme_form_create-block'>
            <Tooltip label='Добавить прямоугольник'>
                <Button variant='light' compact onClick={addRectangle}>
                    <BsFillSquareFill />
                </Button>
            </Tooltip>
        </div>
    )
};