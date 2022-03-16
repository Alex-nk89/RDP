import {
    useState, useRef,
    ActionIcon, Button, Space, Text, TextInput, Tooltip,
    BsFillSquareFill, BsFillCircleFill, BsSlashLg, BsType, IoSend
} from '..';

export const EditMnemoschemeFormCreate = ({ editor }) => {
    const [text, setText] = useState('');
    const textRef = useRef();
    const [isVisibleTextInput, setIsVisibleTextInput] = useState(false);

    const addRectangle = () => {
        editor.addRectangle();
    };

    const addCircle = () => {
        editor.addCircle();
    };

    const addLine = () => {
        editor.addLine();
    };

    const addText = () => {
        setIsVisibleTextInput(false);
        editor.addText(text);
        setText('');
    };

    const entryTextButton = (
        <ActionIcon onClick={addText}>
            <IoSend />
        </ActionIcon>
    );

    const entryText = (event) => {
        setText(event.target.value);
    };

    const toogleIsVisibleTextInput = () => {
        setText('');
        setIsVisibleTextInput(!isVisibleTextInput);
        textRef.current.focus();
    };

    return (
        <>
            <Text color='dimmed' size='sm'>Создать:</Text>

            <div className='info-block__mnemoscheme_form_create-block'>
                <Tooltip label='Добавить прямоугольник'>
                    <Button variant='light' compact onClick={addRectangle}>
                        <BsFillSquareFill />
                    </Button>
                </Tooltip>

                <Space w='sm' />

                <Tooltip label='Добавить круг'>
                    <Button variant='light' compact onClick={addCircle}>
                        <BsFillCircleFill />
                    </Button>
                </Tooltip>

                <Space w='sm' />

                <Tooltip label='Добавить линию'>
                    <Button variant='light' compact onClick={addLine}>
                        <BsSlashLg />
                    </Button>
                </Tooltip>

                <Space w='sm' />

                <Tooltip label='Добавить текст'>
                    <Button variant='light' compact onClick={toogleIsVisibleTextInput}>
                        <BsType />
                    </Button>
                </Tooltip>

                <Space w='sm' />

                <div className={`text-input ${isVisibleTextInput ? '' : 'text-input_not-visible'}`}>
                    <TextInput
                        size='xs'
                        rightSection={entryTextButton}
                        onChange={entryText}
                        value={text}
                        ref={textRef} />
                </div>

                <Space h='sm' />
            </div>
        </>
    );
};