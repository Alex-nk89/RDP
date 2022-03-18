import {
    useState,
    ActionIcon, Button, Popover, Tooltip, TextInput,
    fabric,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsType, IoSend,
    attributesInputs
} from "..";

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme }) => {
    const [addedText, setAddedText] = useState('');
    const [openedFieldAddedText, setOpenedFieldAddedText] = useState(false);

    const figureAttributes = { fill: '#fff', stroke: '#000', width: 50, height: 50, };

    const figures = {
        line: { type: 'line', ...attributesInputs },
        rectangle: { type: 'rect', ...figureAttributes },
        circle: { type: 'circle', radius: 25, ...figureAttributes },
        triangle: { type: 'triangle', ...figureAttributes },
    };

    const entryAddedText = (event) => setAddedText(event.target.value);

    const addLine = () => {
        mnemoscheme.add(new fabric.Line([10, 20, 30, 40], { stroke: '#000', top: 10, left: 10 }));
    };

    const addCircle = () => {
        mnemoscheme.add(new fabric.Circle(figures.circle));
    };

    const addTriangle = () => {
        mnemoscheme.add(new fabric.Triangle(figures.triangle));
    };

    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect(figures.rectangle));
    };

    const addText = () => {
        setOpenedFieldAddedText(false);
        mnemoscheme.add(new fabric.Text(addedText, { fontSize: 14, fontFamily: 'system-ui' }));
        setAddedText('');
    };

    const buttonAddText = (
        <ActionIcon onClick={addText}>
            <IoSend />
        </ActionIcon>
    );

    return (
        <div className='info-block__mnemoscheme-editor__panel__create-block'>
            <Tooltip label='Добавить линию'>
                <Button variant='light' compact onClick={addLine}>
                    <BsSlashLg />
                </Button>
            </Tooltip>

            <Tooltip label='Добавить круг'>
                <Button variant='light' compact onClick={addCircle}>
                    <BsFillCircleFill />
                </Button>
            </Tooltip>

            <Tooltip label='Добавить треугольник'>
                <Button variant='light' compact onClick={addTriangle}>
                    <BsTriangleFill />
                </Button>
            </Tooltip>

            <Tooltip label='Добавить прямоугольник'>
                <Button variant='light' compact onClick={addRectangle}>
                    <BsFillSquareFill />
                </Button>
            </Tooltip>

            <Popover
                opened={openedFieldAddedText}
                position='top'
                placement='start'
                onClose={() => setOpenedFieldAddedText(false)}
                target={(
                    <Tooltip label='Добавить текст'>
                        <Button variant='light' compact onClick={() => setOpenedFieldAddedText(!openedFieldAddedText)}>
                            <BsType />
                        </Button>
                    </Tooltip>
                )}
            >
                <TextInput
                    size='xs'
                    label='Введите текст'
                    rightSection={buttonAddText}
                    value={addedText}
                    onChange={entryAddedText}
                />
            </Popover>
        </div>
    )
};