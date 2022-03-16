import {
    useState, useRef,
    ActionIcon, Button, ColorInput, Space, Text, TextInput, Tooltip,
    BsType, IoSend
} from '..';

export const EditMnemoschemeFormChange = ({ editor }) => {
    const [changeableText, setChangeableText] = useState('');
    const changeableTextRef = useRef();
    const [isVisibleChangeTextInput, setIsVisibleChangeTextInput] = useState(false);

    const updateText = () => {
        setIsVisibleChangeTextInput(false);
        editor.updateText(changeableText);
        setChangeableText('');
    };

    const entryChangeableTextButton = (
        <ActionIcon onClick={updateText}>
            <IoSend />
        </ActionIcon>
    );

    const entryChangeableText = (event) => {
        setChangeableText(event.target.value);
    };

    const toogleIsVisibleChangeTextInput = () => {
        if (editor?.canvas?._activeObject?.type === 'text') {
            setChangeableText(editor?.canvas?._activeObject.text);
            setIsVisibleChangeTextInput(!isVisibleChangeTextInput);
            changeableTextRef.current.focus();
        }
    };

    return (
        <>
            <Text color='dimmed' size='sm'>Редактировать:</Text>

            <div className='info-block__mnemoscheme_form_create-block'>
                <Tooltip label='Изменить текст'>
                    <Button variant='light' compact onClick={toogleIsVisibleChangeTextInput}>
                        <BsType />
                    </Button>
                </Tooltip>

                <Space w='sm' />

                <div className={`text-input ${isVisibleChangeTextInput ? '' : 'text-input_not-visible'}`}>
                    <TextInput
                        size='xs'
                        rightSection={entryChangeableTextButton}
                        onChange={entryChangeableText}
                        value={changeableText}
                        ref={changeableTextRef} />
                </div>

                <Space h='sm' />

                <Tooltip label='Изменить цвет'>
                    <ColorInput size='xs' />
                </Tooltip>
            </div>
        </>
    );
};