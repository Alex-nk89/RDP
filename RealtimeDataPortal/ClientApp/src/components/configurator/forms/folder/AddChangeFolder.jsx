import {
    useSelector,
    TextInput, Space, Button,
    attributesInputs
} from '../../index';

const AddChangeFolder = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'add' ? 'Добавить папку' : 'Редактировать папку';
    const user = useSelector(state => state.user.user);
    const disabledButton = user?.isConfigurator ? false : true;

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block info-block__form">
                <form onSubmit={form.onSubmit(values => submitForm(values))}>
                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('name')}
                        label='Наименование папки'
                        placeholder='Введите наименование папки'
                        ref={nameRef} />

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

                    <Button type="submit" loading={loadingForButton} disabled={disabledButton}>Сохранить</Button>
                </form>
            </div>
        </>
    )
};

export default AddChangeFolder;