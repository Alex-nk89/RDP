import {
    useState,
    ActionIcon, Popover, Tooltip, TextInput,
    fabric,
    BsSlashLg, BsFillCircleFill, BsFillSquareFill, BsTriangleFill, BsArrowDown, BsFonts, BsGripHorizontal, BsSave, IoSend,
    attributesInputs
} from "..";

export const MnemoschemeEditorPanelCreateElements = ({ mnemoscheme, saveMnemoscheme }) => {
    const [addedText, setAddedText] = useState('');
    const [openedFieldAddedText, setOpenedFieldAddedText] = useState(false);

    const figureAttributes = { fill: '#fff', stroke: '#000', width: 50, height: 50, top: 50, left: 50 };

    const figures = {
        line: { ...attributesInputs },
        rectangle: { ...figureAttributes },
        circle: { radius: 25, ...figureAttributes },
        triangle: { ...figureAttributes },
    };

    const entryAddedText = (event) => setAddedText(event.target.value);

    const addLine = () => {
        mnemoscheme.add(new fabric.Line([10, 20, 100, 20], { stroke: '#000', top: 50, left: 50, strokeWidth: 3 }));
    };

    const addArrow = () => {
        mnemoscheme.add(new fabric.Path(`M 8 1 a 0.5 0.5 0 0 1 0.5 0.5 v 11.793 l 3.146 -3.147 a 0.5 0.5 0 0 
            1 0.708 0.708 l -4 4 a 0.5 0.5 0 0 1 -0.708 0 l -4 -4 a 0.5 0.5 0 0 1 0.708 
            -0.708 L 7.5 13.293 V 1.5 A 0.5 0.5 0 0 1 8 1 Z`, { stroke: '#000', strokeWidth: 1, top: 50, left: 50 }));
    };

    const addCircle = () => {
        mnemoscheme.add(new fabric.Circle(figures.circle));
    };

    const addTriangle = () => {
        mnemoscheme.add(new fabric.Triangle(figures.triangle));
    };

    const addRectangle = () => {
        mnemoscheme.add(new fabric.Rect({ ...figures.rectangle }));
    };

    const addText = () => {
        setOpenedFieldAddedText(false);
        mnemoscheme.add(new fabric.Text(addedText, { fontSize: 14, fontFamily: 'system-ui' }));
        setAddedText('');
    };

    const addTag = () => {
        const tag = new fabric.Text(addedText, { fontSize: 14, fontFamily: 'system-ui' });

        tag.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    productId: this.productId,
                    tagId: this.tagId
                });
            };
        })(tag.toObject);

        tag.productId = 1
        mnemoscheme.add(tag);

        setOpenedFieldAddedText(false);
        setAddedText('');
    };

    const buttonAddText = (
        <ActionIcon onClick={addTag}>
            <IoSend />
        </ActionIcon>
    );

    return (
        <div className='info-block__mnemoscheme-editor__create-block'>
            <Tooltip label='Добавить линию'>
                <ActionIcon color="indigo" size="lg" onClick={addLine}>
                    <BsSlashLg size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить стрелку'>
                <ActionIcon color="indigo" size="lg" onClick={addArrow}>
                    <BsArrowDown size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить круг'>
                <ActionIcon color="indigo" size="lg" onClick={addCircle}>
                    <BsFillCircleFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить треугольник'>
                <ActionIcon color="indigo" size="lg" onClick={addTriangle}>
                    <BsTriangleFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label='Добавить прямоугольник'>
                <ActionIcon color="indigo" size="lg" onClick={addRectangle}>
                    <BsFillSquareFill size={18} />
                </ActionIcon>
            </Tooltip>

            <Popover
                opened={openedFieldAddedText}
                position='top'
                placement='start'
                onClose={() => setOpenedFieldAddedText(false)}
                target={(
                    <Tooltip label='Добавить текст'>
                        <ActionIcon color="indigo" size="lg" onClick={() => setOpenedFieldAddedText(!openedFieldAddedText)}>
                            <BsFonts size={20} />
                        </ActionIcon>
                    </Tooltip>
                )}
            >
                <div className='info-block__mnemoscheme-editor__panel__create-block__block-add-text'>
                    <TextInput
                        size='xs'
                        label='Введите текст'
                        rightSection={buttonAddText}
                        value={addedText}
                        onChange={entryAddedText}
                    />
                </div>
            </Popover>

            <BsGripHorizontal size={24} style={{ color: '#aab3ba' }} />

            <Tooltip label='Сохранить'>
                <ActionIcon color="indigo" size="lg" onClick={saveMnemoscheme}>
                    <BsSave size={18} />
                </ActionIcon>
            </Tooltip>
        </div>
    )
};

