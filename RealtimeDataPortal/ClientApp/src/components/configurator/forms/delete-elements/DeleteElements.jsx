import {
    useEffect, useState, useForm, useRequest, attributesInputs, TextInput, Loader, Checkbox, Button, Space, useModals, Text,
    useNotification
} from '../../index';

const DeleteElements = ({ typeElements }) => {
    const { request } = useRequest();
    const { show } = useNotification();
    const modals = useModals();

    const [listElements, setListElements] = useState([]);
    const [loadingElementsList, setLoadingElementsList] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const loaderElementsList = loadingElementsList ? <Loader size={16} /> : null;
    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    const methods = typeElements === 'tag' ?
        { find: 'GetTags', delete: 'DeleteTags' } :
        { find: 'GetListProductsForDelete', delete: 'DeleteProducts' };

    const form = useForm({
        initialValues: {
            name: '',
        },
        errorMessages: {
            name: 'Не выбрано ни одного элемента'
        },
        validationRules: {
            name: isSelectSome
        }
    });

    const selectTagToRemove = event => {
        const id = event.target.dataset.id;

        setListElements(listElements.map(element => {
            if (Number(element.id) === Number(id)) element.isChecked = !element.isChecked;

            return element;
        }));
    };

    const list = (
        <ul className='info-block__form__list-elements-to-remove'>
            {listElements.map(({ id, name, isChecked }) =>
                <li key={id}>
                    <Checkbox label={name} data-id={id} onChange={selectTagToRemove} checked={isChecked} />
                </li>)}
        </ul>
    );

    const blockButton = listElements.length > 0 ?
        <>
            <Space h="md" />

            <Button type="submit" color='red' loading={loaderSubmitForm}>Удалить</Button>
        </> : null;

    function isSelectSome() {
        return listElements.find(element => element.isChecked);
    };

    const deleteElements = deletingElements => {
        request(methods.delete, 'POST', JSON.stringify(deletingElements))
            .then(result => {
                show('success', 'Элементы удалены.');
                form.reset();
                setListElements([]);
            })
            .catch(error => show('error', error))
            .finally(() => setLoadingSubmit(false));
    };

    const confirmModal = deletingElements => modals.openConfirmModal({
        title: 'Удаление элементов',
        children: (
            <Text size="sm">
                Вы уверены что хотите продолжить? Отменить удаление будет не возможно!
            </Text>
        ),
        labels: { confirm: 'Удалить', cancel: 'Отменить' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteElements(deletingElements)
    });

    const submitForm = () => {
        const delitingElements = listElements.filter(element => element.isChecked).map(element => element.id);

        confirmModal(delitingElements);
    };

    useEffect(() => {
        const name = form.values.name;

        if (name.length > 2) {
            setLoadingElementsList(true);

            request(`${methods.find}?name=${name}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
                        setListElements(result.map(item => {
                            switch (typeElements) {
                                case 'tag':
                                    return { id: item.tagId, name: `${item.tagName} (${item.serverName})`, isChecked: false };
                                case 'product':
                                    return { id: item.productId, name: `${item.productName}`, isChecked: false };
                                default:
                                    return null;
                            }
                        }));
                    } else {
                        setListElements([]);
                        form.setErrors({ name: 'Поиск не дал результатов' });
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setLoadingElementsList(false));
        } else setListElements([]);

        //eslint-disable-next-line
    }, [form.values.name]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(submitForm)}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('name')}
                    label='Наименование'
                    placeholder='Введите наименование'
                    rightSection={loaderElementsList}
                    autoFocus />

                {list}
                {blockButton}
            </form>
        </div>
    );
}

export default DeleteElements;