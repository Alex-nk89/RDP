import {
    useState, useEffect, useRef, useForm, useRequest, useNotification,
    AddChangeGraphic, AddChangeFolder, AddChangeExternalPage,
    Space, ActionIcon, MultiSelect,
    IoAdd
} from '../../index';

const AddChangeElement = ({ operation, componentInfo, updatingNavbar }) => {

    const { treesMenu, externalPages, graphics, adGroups } = { ...componentInfo };
    const [accesses, setAccesses] = useState([]);
    const [oldAccesses, setOldAccesses] = useState([]);
    const [loadingForButton, setLoadingForButton] = useState(false);

    const nameRef = useRef(null);
    const { request } = useRequest();
    const { show } = useNotification();
    const [action, type] = operation.split('-');

    const form = useForm({
        initialValues: {
            name: '',
            access: '',
            link: '',
            product: '',
            productId: 0

        },
        validationRules: {
            name: value => value.trim().length >= 3 && value.trim().length <= 100,
            product: () => type === 'graphic' ? form.values.productId > 0 : true,
            link: value => type === 'externalPage' ? value.trim().length >= 5 && !/[а-яА-Я]/i.test(value) : true
        },
        errorMessages: {
            name: 'Наименование должно содержать от 3 до 100 символов',
            link: 'Ссылка должна содержать от 5 символов и не содержать символов кириллицы',
            product: 'Необходимо выбрать продукт'
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

    const addAccessIcon = (
        <ActionIcon onClick={addAccess}>
            <IoAdd size={18} />
        </ActionIcon>
    );

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
        </> : null;

    const submitForm = values => {
        const component = {
            TreesMenu: {
                Id: action === 'add' ? 0 : treesMenu.id,
                Name: values.name,
                ParentId: action === 'add' ? treesMenu.id : treesMenu.parentId,
                Type: type,
                ComponentId: treesMenu.componentId
            },
            ExternalPages: {
                Id: action === 'add' ? 0 : externalPages.id,
                Link: form.getInputProps('link').value
            },
            Graphics: {
                ComponentId: action === 'add' ? 0 : graphics.componentId,
                productId: form.getInputProps('productId').value
            },
            ADGroups: accesses,
            AdGroupsOld: oldAccesses
        };

        setLoadingForButton(true);

        request('AddChangeElement', 'POST', JSON.stringify(component))
            .then(result => {
                show('success', result.message);

                if(action === 'add') {
                    form.reset();
                    setAccesses([]);
                }

                updatingNavbar();
            })
            .catch(error => show('error', error))
            .finally(() => setLoadingForButton(false));
    };

    useEffect(() => {

        form.reset();
        setAccesses([]);
        setOldAccesses([]);

        if (action === 'change') {
            form.setValues(currentValues => ({
                ...currentValues,
                name: treesMenu.name,
                access: '',
                link: externalPages.link,
                productId: graphics.componentId,
                product: graphics.name
            }));

            setAccesses(adGroups);
            setOldAccesses(adGroups);
        }

        nameRef.current.focus();
        //eslint-disable-next-line
    }, []);

    const attributes = {
        action, form, nameRef: nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton
    };

    switch (type) {
        case 'folder':
            return <AddChangeFolder {...attributes} />;
        case 'graphic':
            return <AddChangeGraphic {...attributes} />;
        case 'externalPage':
            return <AddChangeExternalPage {...attributes} />;
        default: return null;
    }
}

export default AddChangeElement;