import {
    useState, useEffect, useRef, useRequest, useNotification, Parameter, attributesInputs, settingsAddRemoveIcon,
    TextInput, Space, InputWrapper, Group, ActionIcon, Button, Loader,
    IoRemove, IoAdd
} from '../../index';

const AddChangeProduct = ({ operation, parameterTypes }) => {
    const productNameRef = useRef(null);
    const { request, error } = useRequest();
    const { show } = useNotification();

    const parameter = {
        parameterId: 0,
        parameterTypeId: { value: '1', error: '' },
        parameterTagId: 0,
        tags: [{
            tagId: 0,
            tag: { value: '', error: '' }
        }],
        position: { value: '', error: '' },
        round: { value: 0, error: '' },
        showLimits: false
    };

    const [productName, setProductName] = useState({ value: '', error: '' });
    const [productId, setProductId] = useState(0);
    const [parameters, setParameters] = useState([parameter]);

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    function searchProduct(event) {
        const nameProduct = event.target.value;

        setProductName({ value: nameProduct, error: '' });
    };

    const addParameter = () => {
        const newParameter = { ...parameter, parameterId: parameter.parameterId + parameters.length };
        setParameters([...parameters, newParameter]);
    };

    const removeParameter = () => {
        if (parameters.length > 1) {
            parameters.pop();
            setParameters([...parameters]);
        }
    };

    const enterParameter = (id, parameter) => {
        parameters[id] = { ...parameter };
        setParameters([...parameters]);
    };

    const checkForm = () => {
        let verified = true;

        if (productName.value.trim().length < 5 || /[а-яА-Я]/i.test(productName.value)) {
            setProductName({ ...productName, error: 'Наименование должно содержать от 5 символов и не содержать символов кириллицы' })
            verified = false;
        }

        parameters.forEach((parameter, indexP) => {

            parameter.tags.forEach((tag, indexT) => {
                if (Number(tag.tagId) === 0) {
                    parameter.tags[indexT] = { ...tag, tag: { value: tag.tag.value, error: 'Необходимо обязательно выбрать тег' } };
                    enterParameter(indexP, { ...parameter, tags: [...parameter.tags] });
                    verified = false;
                }
            });
        });

        return verified;
    };

    const submitForm = event => {
        event.preventDefault();

        if (checkForm()) {
            setLoadingSubmit(true);
            const sentData = parameters.flatMap(parameter =>
                parameter.tags.map(tag => {
                    return {
                        productId,
                        productName: productName.value,
                        parameterId: Number(parameter.parameterId),
                        parameterTypeId: Number(parameter.parameterTypeId.value),
                        position: parameter.position.value,
                        round: Number(parameter.round.value),
                        showLimits: Boolean(parameter.showLimits),
                        parameterTagId: Number(parameter.parameterTagId),
                        tagId: Number(tag.tagId)
                    };
                }));

            request('AddChangeProduct', 'POST', JSON.stringify(sentData))
                .then(result => {
                    if (result) {
                        show('success', 'Продукт сохранен.');
                        setLoadingSubmit(false);
                    }
                });

            console.log(sentData);
        }
    };

    useEffect(() => {
        productNameRef.current.focus();

        setProductName({ value: '', error: '' });
        setParameters([parameter]);
        //eslint-disable-next-line
    }, [operation]);

    useEffect(() => {
        if (Object.keys(error).length !== 0) show('error', error.message);
        //eslint-disable-next-line
    }, [error]);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={submitForm}>
                <TextInput
                    {...attributesInputs}
                    {...productName}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={productNameRef}
                    /* value={nameProduct.value}
                    error={nameProduct.error} */
                    onChange={searchProduct}
                    onFocus={searchProduct} />

                <Space h="md" />

                <InputWrapper label='Количество параметров'>
                    <Group>
                        <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeParameter}>
                            <IoRemove />
                        </ActionIcon>
                        <span>{parameters.length}</span>
                        <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addParameter}>
                            <IoAdd />
                        </ActionIcon>
                    </Group>
                </InputWrapper>

                {parameters.map((parameter, index) =>
                    <Parameter
                        key={index}
                        number={index}
                        parameter={parameter}
                        enterParameter={enterParameter}
                        parameterTypes={parameterTypes}
                    />)}

                <Space h="md" />

                <Button type="submit" loading={loaderSubmitForm}>Сохранить</Button>
            </form>
        </div>
    );
};

export default AddChangeProduct;