import {
    TextInput, Space, Button,
    attributesInputs
} from '../../index';

const AddChangeExternalPage = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'add' ? 'Добавление страницы' : 'Редактирование страницы'

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block info-block__form">
                <form onSubmit={form.onSubmit(values => submitForm(values))}>
                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('name')}
                        label='Наименование страницы'
                        placeholder='Введите наименование страниицы'
                        ref={nameRef} />

                    <Space h="md" />

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('link')}
                        label='Ссылка на страницу'
                        placeholder='Введите ссылку на страницу' />

                    <Space h="md" />

                    <TextInput
                        {...form.getInputProps('access')}
                        label='Группы доступа'
                        placeholder='Введите группу из Active Directory'
                        rightSection={addAccessIcon}
                        /* ref={accessRef} */ />

                    {multiSelect}

                    <Space h="md" />

                    <Button type="submit" loading={loadingForButton}>Сохранить</Button>
                </form>
            </div>
        </>
    );
};

export default AddChangeExternalPage;