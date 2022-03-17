import {
    useEffect, useRef,
    Button, Space, TextInput,
    attributesInputs
} from '..';

export const MnemoschemeEditorForm = ({ form, addAccessIcon, multiSelect, nextStep }) => {
    const nameRef = useRef();

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    const next = () => {
        if(form.getInputProps('name').value.trim().length < 3 || form.getInputProps('name').value.trim().length > 100) {
            form.setErrors({ name: 'Наименование должно содержать от 3 до 100 символов'})
        } else {
            nextStep();
        }
    }

    return (
        <div className="info-block info-block__form">
            <form>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('name')}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={nameRef}
                />

                <Space h="md" />

                <TextInput
                    {...form.getInputProps('access')}
                    autoComplete='off'
                    label='Группы доступа'
                    placeholder='Введите группу из Active Directory'
                    rightSection={addAccessIcon}
                />

                {multiSelect}

                <Space h="md" />

                <Button onClick={next}>Далее</Button>
            </form>
        </div>
    );
};