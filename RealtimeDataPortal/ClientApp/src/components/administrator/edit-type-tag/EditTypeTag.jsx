import {
    useState, useEffect, useRef,
    useForm,
    IoSearch,
    TextInput, Space, Select, Checkbox, Loader, Button,
    useRequest, useNotification,
    attributesInputs
} from '../index';

export const EditTypeTag = ({ operation }) => {
    const typeNameRef = useRef();
    const { request } = useRequest();
    const { show } = useNotification();

    const [listTypesTag, setListTypesTag] = useState([]);
    const [savingData, setSavingData] = useState(false);
    const [searchingData, setSearchingData] = useState(false);

    const listCalendars = [
        { value: 'range', label: 'Произвольный' },
        { value: 'day', label: 'День' },
        { value: 'month', label: 'Месяц' }
    ];

    const form = useForm({
        initialValues: {
            tagTypeId: 0,
            typeName: '',
            type: '',
            typeShortName: '',
            wwResolution: 0,
            calendar: '',
            visibleToGraphic: false
        },
        validationRules: {
            typeName: value => value.trim().length > 0,
            type: value => value.trim().length > 0,
            typeShortName: value => value.trim().length > 0,
            calendar: value => value.trim().length > 0,
        },
        errorMessages: {
            typeName: 'Необходимо заполнить поле',
            type: 'Необходимо заполнить поле',
            typeShortName: 'Необходимо заполнить поле',
            calendar: 'Необходимо выбрать значение',
        }
    });

    const getListTypeTags = () => {
        const typeName = form.getInputProps('typeName').value;

        if (typeName.length > 0) {
            setSearchingData(true);

            request(`GetListTypesTag?name=${typeName}`)
                .then(listTypesTag => {

                    if (listTypesTag.length === 0) {
                        form.setErrors({ typeName: 'Поиск не дал результатов' });
                    }

                    setListTypesTag(listTypesTag);

                })
                .catch(error => show('error', error))
                .finally(() => setSearchingData(false));
        }else {
            form.setErrors({ typeName: 'Введите минимум один символ' });
        }

        typeNameRef.current.focus();
    };

    const selectTypeTag = (event) => {
        const tagTypeId = event.target.dataset.tagtypeid;
        const choiseTagType = listTypesTag.find(typeTag => Number(typeTag.tagTypeId) === Number(tagTypeId));

        form.setValues({
            tagTypeId: choiseTagType.tagTypeId,
            typeName: choiseTagType.typeName,
            type: choiseTagType.type,
            typeShortName: choiseTagType.typeShortName,
            wwResolution: choiseTagType.wwResolution ?? 0,
            calendar: choiseTagType.calendar,
            visibleToGraphic: choiseTagType.visibleToGraphic
        });
    };

    const submitForm = (values) => {
        const { tagTypeId, typeName, type, typeShortName, wwResolution, calendar, visibleToGraphic } = values;

        if (visibleToGraphic) {
            if (wwResolution <= 0) {
                form.setErrors({ wwResolution: 'Необходимо ввести число больше 0' });
                return;
            }
        }

        setSavingData(true);

        request('EditTypeTag', 'POST', JSON.stringify({
            tagTypeId,
            typeName, type,
            typeShortName,
            wwResolution: visibleToGraphic ? wwResolution : null,
            calendar,
            visibleToGraphic
        }))
            .then(result => {
                form.reset();
                show('success', result.success);
            })
            .catch(error => show('error', error))
            .finally(() => setSavingData(false));

    };

    const searchButton = operation === 'change' ?
        searchingData ? <Loader size={18} /> : <IoSearch size={18} onClick={getListTypeTags} />
        : null;

    const closeList = () => {
        setListTypesTag([]);
    };

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        form.reset();
        typeNameRef.current.focus();
        //eslint-disable-next-line
    }, [operation]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(values => submitForm(values))}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('typeName')}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={typeNameRef}
                    rightSection={searchButton}
                />
                <div className="info-block__form__search-result" open={listTypesTag.length}>
                    {listTypesTag.map(typeTag =>
                        <p
                            key={typeTag.tagTypeId}
                            data-tagtypeid={typeTag.tagTypeId}
                            className="info-block__form__search-result__item"
                            onClick={selectTypeTag}
                        >
                            {typeTag.type} - {typeTag.typeName} ({typeTag.typeShortName})
                        </p>
                    )}
                </div>

                <Space />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('type')}
                    label='Label'
                    placeholder='Введите label'
                />

                <Space />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('typeShortName')}
                    label='Сокращенное наименование'
                    placeholder='Введите сокращенное наименование'
                />

                <Space />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('wwResolution')}
                    label='wwResolution, мс'
                    type='number'
                />

                <Space />

                <Select
                    {...attributesInputs}
                    {...form.getInputProps('calendar')}
                    label='Календарь'
                    placeholder='Выберите тип календаря'
                    data={listCalendars}
                />

                <Space />

                <Checkbox
                    {...form.getInputProps('visibleToGraphic', { type: 'checkbox' })}
                    label='Показывать на графике'
                />

                <Space />

                <Button type='submit' loading={savingData}>
                    Сохранить
                </Button>
            </form>
        </div>
    );
};