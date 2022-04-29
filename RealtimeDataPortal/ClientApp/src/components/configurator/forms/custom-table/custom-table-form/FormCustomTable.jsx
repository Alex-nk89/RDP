import {
    useEffect, useRef,
    Button, Space, TextInput
} from '../';
export const FormCustomTable = ({ form, addAccessIcon, multiSelect, nextStep }) => {
    const nameRef = useRef();

    const next = () => {
        if (form.getInputProps('name').value.trim().length < 3 || form.getInputProps('name').value.trim().length > 100) {
            form.setErrors({ name: 'Наименование должно содержать от 3 до 100 символов' })
        } else {
            nextStep();
        }
    }

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    return (
        <>
            <div className="info-block info-block__form">
                <form>
                    <TextInput
                        {...form.getInputProps('name')}
                        label='Наименование'
                        placeholder='Введите наименование'
                        ref={nameRef}
                        autoComplete='off'
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
        </>
    );
}