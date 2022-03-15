import { Button } from '@mantine/core';
import {
    useState, useEffect, useRef,
    useForm,
    BsSearch,
    TextInput, Space, ColorInput, Loader,
    useRequest, useNotification,
    attributesInputs
} from '../index';

export const ChangeParameterType = ({ operation }) => {

    const { request } = useRequest();
    const { show } = useNotification();
    const parameterTypeNameRef = useRef();

    const [listParameterTypes, setListParameterTypes] = useState([]);
    const [savingData, setSavingData] = useState(false);
    const [searchingData, setSearchingData] = useState(false);

    const visibleListParameterTypes = listParameterTypes.length > 0;

    const form = useForm({
        initialValues: {
            parameterTypeId: 0,
            parameterTypeName: '',
            label: '',
            color: '#fff'
        },
        validationRules: {
            parameterTypeName: value => value.trim().length > 0,
            label: value => value.trim().length > 0,
            color: value => value.trim().length >= 3 && value.trim().length <= 7 && /#/.test(value)
        },
        errorMessages: {
            parameterTypeName: 'Необходимо заполнить поле',
            label: 'Необходимо заполнить поле',
            color: 'Необходимо указать цвет в формате HEX'
        }
    });

    const closeList = () => setListParameterTypes([]);

    const selectParameterType = (event) => {
        const parameterTypeId = event.target.dataset.parameterid;
        const choiseParameterType = listParameterTypes.find(type => Number(type.parameterTypeId) === Number(parameterTypeId));

        form.setValues({
            parameterTypeId: choiseParameterType.parameterTypeId,
            parameterTypeName: choiseParameterType.parameterTypeName,
            label: choiseParameterType.label,
            color: choiseParameterType.color
        });

    };

    const searchParameterTypes = () => {
        const parameterTypeName = form.getInputProps('parameterTypeName').value;
        

        if (parameterTypeName.length > 0 && operation === 'change') {
            form.resetErrors();
            setSearchingData(true);

            request(`GetListParameterTypes?name=${parameterTypeName}`)
                .then(listParameterTypes => {

                    if (listParameterTypes.length === 0) {
                        form.setErrors({ parameterTypeName: 'Поиск не дал результатов' });
                    }

                    setListParameterTypes(listParameterTypes);

                })
                .catch(error => {
                    show('error', error);
                })
                .finally(() => setSearchingData(false));
        } else {
            form.setErrors({ parameterTypeName: 'Введите минимум один символ' });
        }

        parameterTypeNameRef.current.focus();
    };

    const searchButton = operation === 'add' ? null :
        !searchingData ?
            <BsSearch size={16} onClick={searchParameterTypes} /> :
            <Loader size={18} />;

    const submitForm = (values) => {
        const { parameterTypeId, parameterTypeName, label, color } = values;

        setSavingData(true);

        request('EditParameterType', 'POST',
            JSON.stringify({
                parameterTypeId, parameterTypeName, label, color
            }))
            .then(result => {
                form.reset();
                show('success', result.success);
            })
            .catch(error => show('error', error))
            .finally(() => setSavingData(false));
    }

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        parameterTypeNameRef.current.focus();
        form.reset();
        //eslint-disable-next-line
    }, [operation]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(values => submitForm(values))}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('parameterTypeName')}
                    label='Наименование'
                    placeholder='Введите наименование'
                    rightSection={searchButton}
                    ref={parameterTypeNameRef}
                />

                <div className="info-block__form__search-result" open={visibleListParameterTypes}>
                    {listParameterTypes.map(parameterType =>
                        <p
                            key={parameterType.parameterTypeId}
                            data-parameterid={parameterType.parameterTypeId}
                            className="info-block__form__search-result__item"
                            onClick={selectParameterType}>
                            {`${parameterType.label} - ${parameterType.parameterTypeName}`}
                        </p>)}
                </div>

                <Space h="md" />

                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('label')}
                    label='Label'
                    placeholder='Введите label'
                />

                <Space h="md" />

                <ColorInput
                    {...attributesInputs}
                    {...form.getInputProps('color')}
                    label='Цвет'
                    placeholder='Выберите цвет'
                />

                <Space h="md" />

                <Button type='submit' loading={savingData}>
                    Сохранить
                </Button>
            </form>
        </div>
    );
};