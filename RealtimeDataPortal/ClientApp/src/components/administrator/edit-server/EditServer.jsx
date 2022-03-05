import {
    useState, useEffect, useRef,
    useForm,
    IoSearch,
    TextInput, Space, Button, Loader, Checkbox,
    useRequest, useNotification,
    attributesInputs
} from '../index';

export const EditServer = ({ operation }) => {
    const serverNameRef = useRef();
    const { request } = useRequest();
    const { show } = useNotification();

    const [listServers, setListServers] = useState([]);
    const [savingData, setSavingData] = useState(false);
    const [searchingData, setSearchingData] = useState(false);

    const form = useForm({
        initialValues: {
            serverId: 0,
            serverName: '',
            database: '',
            userName: '',
            password: '',
            isDateOffset: false
        },
        validationRules: {
            serverName: value => value.trim().length > 0 && !/[а-яА-Я]/i.test(value),
            database: value => value.trim().length > 0 && !/[а-яА-Я]/i.test(value),
            userName: value => value.trim().length > 0 && !/[а-яА-Я]/i.test(value),
            password: value => value.trim().length > 0
        },
        errorMessages: {
            serverName: 'Наименование должно содержать минимум 1 символ и не содержать символов кириллицы',
            database: 'Необходимо заполнить поле',
            userName: 'Необходимо заполнить поле',
            password: 'Необходимо заполнить поле'
        }
    });

    const getListServers = () => {
        const serverName = form.getInputProps('serverName').value;

        if (serverName.length > 0) {
            setSearchingData(true);

            request(`GetListServers?name=${serverName}`)
                .then(listServers => {

                    if (listServers.length === 0) {
                        form.setErrors({ serverName: 'Поиск не дал результатов' });
                    }

                    setListServers(listServers);
                })
                .catch(error => show('error', error))
                .finally(() => setSearchingData(false));
        } else {
            form.setErrors({ serverName: 'Введите минимум один символ' });
        }

        serverNameRef.current.focus();
    };

    const searchButton = operation === 'change' ?
        searchingData ? <Loader size={18} /> : <IoSearch size={18} onClick={getListServers} />
        : null;

    const selectServer = (event) => {
        const serverId = event.target.dataset.serverid;
        const choiseServer = listServers.find(server => Number(server.serverId) === Number(serverId));

        form.setValues({
            serverId: choiseServer.serverId,
            serverName: choiseServer.serverName,
            database: choiseServer.database,
            userName: choiseServer.userName,
            password: choiseServer.password,
            isDateOffset: choiseServer.isDateOffset
        });
    };

    const submitForm = (values) => {
        const { serverId, serverName, database, userName, password, isDateOffset } = values;

        setSavingData(true);

        request('EditServer', 'POST',
            JSON.stringify({ serverId, serverName, database, userName, password, isDateOffset }))
            .then(result => {
                form.reset();
                show('success', result.success);
            })
            .catch(error => show('error', error))
            .finally(() => setSavingData(false));
    };

    const closeList = () => {
        setListServers([]);
    };

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        form.reset();
        serverNameRef.current.focus();
        //eslint-disable-next-line
    }, [operation]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(values => submitForm(values))}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('serverName')}
                    label='Наименование сервера'
                    placeholder='Введите наименование сервера'
                    ref={serverNameRef}
                    rightSection={searchButton}
                />


                <div className="info-block__form__search-result" open={listServers.length}>
                    {listServers.map(server =>
                        <p
                            key={server.serverId}
                            data-serverid={server.serverId}
                            className="info-block__form__search-result__item"
                            onClick={selectServer}
                        >
                            {server.serverName} ({server.database})
                        </p>
                    )}
                </div>

                <Space h="md" />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('database')}
                    label='Наименование базы данных'
                    placeholder='Введите наименование базы данных'
                />

                <Space h="md" />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('userName')}
                    label='Имя пользователя'
                    placeholder='Введите имя пользователя'
                />

                <Space h="md" />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('password')}
                    label='Пароль'
                    placeholder='Введите пароль'
                />

                <Space h="md" />

                <Checkbox
                    {...form.getInputProps('isDateOffset', { type: 'checkbox' })}
                    label='Смещение даты'
                />

                <Space h="md" />

                <Button type='submit' loading={savingData}>
                    Сохранить
                </Button>
            </form>
        </div>
    );
};