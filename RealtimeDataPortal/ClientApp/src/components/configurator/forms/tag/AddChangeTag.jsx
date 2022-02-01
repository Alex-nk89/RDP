import {
    useState, useEffect, useRef, useForm, useRequest, TextInput, Space, attributesInputs, Select
} from '../../index';

const AddChangeTag = ({ operation, tagAttributes }) => {
    const nameRef = useRef(null);
    const { request } = useRequest();

    const [tagsList, setTagsList] = useState([]);
    const typesList = tagAttributes.types.map(item => ({ label: `${item.type} - ${item.typeShortName}`, value: item.tagTypeId.toString() }));
    const parametersList = tagAttributes.parameters.map(item => ({ label: `${item.label} - ${item.tagParameterName}`, value: item.tagParameterId.toString() }));
    const serversList = tagAttributes.servers.map(item => ({ label: `${item.serverName}`, value: item.serverId.toString() }));

    const visibleListTags = tagsList.length > 0 ? true : false;

    const form = useForm({
        initialValues: {
            name: '',
            type: '',
            parameter: '',
            server: ''
        }
    });

    const closeList = (event) => {
        if (event.target.name !== "tag-input") setTagsList([]);
    };

    const selectTag = (event) => {
        console.log(event);
    }

    useEffect(() => {

        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
    }, []);

    useEffect(() => {
        const name = form.getInputProps('name').value;
        if (name.length > 5 && operation === 'change') {
            request(`GetTags?name=${name}`)
                .then(result => {
                    setTagsList(result);
                })
        } else
            setTagsList([]);

        //eslint-disable-next-line
    }, [form.getInputProps('name').value]);

    useEffect(() => {
        nameRef.current.focus();
        form.reset();
        //eslint-disable-next-line
    }, [operation]);

    return (
        <div className="info-block info-block__form">
            <form>

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('name')}
                    label='Наименование'
                    placeholder='Введите наименование тега'
                    ref={nameRef} />

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
                    {...form.getInputProps('type')}
                    label='Тип'
                    placeholder='Выберите тип тега'
                    data={typesList} />

                <Space h="md" />

                <Select
                    {...attributesInputs}
                    {...form.getInputProps('parameter')}
                    label='Параметер'
                    placeholder='Выберите параметер тега'
                    data={parametersList} />

                <Space h="md" />

                <Select
                    {...attributesInputs}
                    {...form.getInputProps('server')}
                    label='Сервер'
                    placeholder='Выберите сервер'
                    data={serversList} />
            </form>
        </div>
    );
}

export default AddChangeTag;