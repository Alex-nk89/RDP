import {
    useState, useEffect, useRef,
    useForm,
    TextInput, Space, attributesInputs, Select, Loader, Button,
    useRequest, useNotification,
    IoSearch
} from '../../index';

const AddChangeTag = ({ operation, tagAttributes }) => {
    const nameRef = useRef(null);
    const { request } = useRequest();
    const { show } = useNotification();

    const [tagsList, setTagsList] = useState([]);
    const [loadingTagList, setLoadingTagList] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const typesList = tagAttributes.types.map(item => ({ label: `${item.type} - ${item.typeShortName}`, value: item.tagTypeId.toString() }));
    const serversList = tagAttributes.servers.map(item => ({ label: `${item.serverName}`, value: item.serverId.toString() }));

    const visibleListTags = tagsList.length > 0 ? true : false;
    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    const form = useForm({
        initialValues: {
            tagId: '',
            tagName: '',
            tagTypeId: '',
            serverId: ''
        },
        validationRules: {
            tagName: value => value.trim().length >= 3 && !/[а-яА-Я]/i.test(value),
            tagTypeId: value => value.trim().length > 0,
            serverId: value => value.trim().length > 0
        },
        errorMessages: {
            tagName: 'Наименование должно содержать от 5 символов и не содержать символов кириллицы',
            tagTypeId: 'Необходимо выбрать тип тега',
            serverId: 'Необходимо выбрать сервер'
        }
    });

    const closeList = () => {
        setTagsList([]);
    };

    const selectTag = (event) => {
        const selectedTag = tagsList.find(tag => Number(tag.tagId) === Number(event.target.id));
        const { tagId, tagName, tagTypeId, serverId } = selectedTag;

        form.setValues(() => ({
            tagId: tagId.toString(),
            tagName,
            tagTypeId: tagTypeId.toString(),
            serverId: serverId.toString()
        }));

        form.resetErrors();
    };

    const submitForm = values => {
        setLoadingSubmit(true);

        const tag = JSON.stringify({
            tagId: Number(values.tagId),
            tagName: values.tagName,
            tagTypeId: Number(values.tagTypeId),
            serverId: Number(values.serverId)
        });

        request('AddChangeTag', 'POST', tag)
            .then(result => {
                if (Object.keys(result).length > 0) {
                    show('success', 'Тег сохранен');
                    form.reset();
                }

                setLoadingSubmit(false);
            });
    };

    const getListTags = () => {
        const name = form.getInputProps('tagName').value;

        if (name.length > 0) {
            setLoadingTagList(true);

            request(`GetTags?name=${name}`)
                .then(result => {
                    if (Object.keys(result).length > 0)
                        setTagsList(result);
                    else {
                        form.setErrors({ tagName: 'Поиск не дал результатов' });
                        setTagsList([]);
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setLoadingTagList(false));
        } else {
            setTagsList([]);
        }
    };

    const searchButton = operation === 'change' ?
        loadingTagList ? <Loader size={18} /> : <IoSearch size={18} onClick={getListTags} />
        : null;

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
    }, []);

    useEffect(() => {
        nameRef.current.focus();
        form.reset();
        //eslint-disable-next-line
    }, [operation]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(values => submitForm(values))}>

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('tagName')}
                    label='Наименование'
                    placeholder='Введите наименование тега'
                    ref={nameRef}
                    rightSection={searchButton} />

                <div className="info-block__form__search-result" open={visibleListTags}>
                    {tagsList.map(tag =>
                        <p
                            key={tag.tagId}
                            id={tag.tagId}
                            className="info-block__form__search-result__item"
                            onClick={selectTag}>
                            {`${tag.tagName} (${tag.serverName})`}
                        </p>)}
                </div>

                <Space h="md" />

                <Select
                    {...attributesInputs}
                    {...form.getInputProps('tagTypeId')}
                    label='Тип'
                    placeholder='Выберите тип тега'
                    data={typesList} />

                <Space h="md" />

                <Select
                    {...attributesInputs}
                    {...form.getInputProps('serverId')}
                    label='Сервер'
                    placeholder='Выберите сервер'
                    data={serversList} />

                <Space h="md" />

                <Button type="submit" loading={loaderSubmitForm}>Сохранить</Button>
            </form>
        </div>
    );
}

export default AddChangeTag;