import {
    useState, useEffect, useRef, TextInput, Space, Button, attributesInputs, useForm, MultiSelect,
    ActionIcon, IoAdd, useRequest, useNotification
} from '../../index';

const AddChangeExternalPage = ({ componentInfo, type, updatingNavbar }) => {

    const { treesMenu, externalPages } = { ...componentInfo };
    const { show } = useNotification();
    const { request, error } = useRequest();
    const title = type === 'add' ? 'Добавление страницы' : 'Редактирование страницы';
    const nameRef = useRef(null);
    const accessRef = useRef(null);

    const [accesses, setAccesses] = useState([]);
    const [oldAccesses, setOldAccesses] = useState([]);
    const [loadingForButton, setLoadingForButton] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            link: '',
            access: ''
        },
        validationRules: {
            name: value => value.trim().length >= 3 && value.trim().length <= 100,
            link: value => value.trim().length >= 5 && !/[а-яА-Я]/i.test(value)
        },
        errorMessages: {
            name: 'Наименование должно содержать от 3 до 100 символов',
            link: 'Ссылка должна содержать от 5 символов и не содержать символов кириллицы',
            access: ''
        }
    });

    const addAccess = () => {
        if (form.values.access.trim().length === 0 || accesses.includes(form.values.access))
            form.setFieldError('access', 'Поле не может быть пустым или дублировать выбранные значения');
        else {
            setAccesses([...accesses, form.values.access]);
            form.setFieldValue('access', '');
        }
    };

    const addAccessIcon =
        <ActionIcon onClick={addAccess}>
            <IoAdd size={18} />
        </ActionIcon>;

    const multiSelect = accesses.length !== 0 ?
        <>
            <Space h="sm" />

            <MultiSelect
                data={accesses}
                value={accesses}
                onChange={setAccesses}
                size="md"
                classNames={{
                    input: 'info-block__input',
                    rightSection: 'info-block__rightSection'
                }} />
        </> : null

    const submitForm = (values) => {

        const externalPageComponent = {
            TreesMenu: {
                Id: type === 'add' ? 0 : treesMenu.id,
                Name: values.name,
                ParentId: type === 'add' ? treesMenu.id : treesMenu.parentId,
                Type: 'external-page',
                ComponentId: treesMenu.componentId
            },
            ExternalPages: {
                Id: type === 'add' ? 0 : externalPages.id,
                Link: values.link
            },
            ADGroups: accesses,
            AdGroupsOld: oldAccesses
        };

        setLoadingForButton(true);

        request('AddChangeElement', 'POST', JSON.stringify(externalPageComponent))
            .then(result => {
                if (Object.keys(result).length !== 0) {
                    show('success', result.message);

                    if (type === 'add') {
                        form.reset();
                        setAccesses([]);
                    }

                }

                setLoadingForButton(false);
                updatingNavbar();
            });
    }

    /* const onKeyDownEnter = () => {
        document.addEventListener('keydown', (event) => {
            if(event.key === 'Enter' && document.activeElement === accessRef.current) {
                event.preventDefault();
                addAccess();
            }
        })
    } */

    useEffect(() => {
        if (Object.keys(error).length !== 0) show('error', error.message);
        //eslint-disable-next-line
    }, [error]);

    useEffect(() => {
        form.resetErrors();
        setAccesses([]);
        setOldAccesses([]);

        /* onKeyDownEnter(); */

        if (type === 'change') {
            form.setValues({ name: treesMenu.name, link: externalPages?.link, access: '' })

            if (componentInfo.adGroups[0]) {
                setAccesses(componentInfo.adGroups);
                setOldAccesses(componentInfo.adGroups);
            }
        }

        nameRef.current.focus();
        //eslint-disable-next-line
    }, [componentInfo, type]);

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
                        ref={accessRef} />

                    {multiSelect}

                    <Space h="md" />

                    <Button type="submit" loading={loadingForButton}>Сохранить</Button>
                </form>
            </div>
        </>
    )
}

export default AddChangeExternalPage;