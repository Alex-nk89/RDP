import {
    useState, useEffect, useRef, useRequest, useNotification, Parameter, attributesInputs, settingsAddRemoveIcon,
    TextInput, Space, InputWrapper, Group, ActionIcon, Button, Loader,
    IoRemove, IoAdd
} from '../../index';

let productList = [];

const AddChangeProduct = ({ operation, attributesForProducts }) => {
    const productNameRef = useRef(null);
    const { request, error } = useRequest();
    const { show } = useNotification();
    const { parameterTypes, maxParameterId } = attributesForProducts;

    const parameter = {
        parameterId: maxParameterId + 1,
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

    //

    const [productName, setProductName] = useState({ value: '', error: '' });
    const [productListFound, setProductListFound] = useState([]);
    const [productId, setProductId] = useState(0);
    const [parameters, setParameters] = useState([parameter]);
    const [initialParameters, setInitialParameters] = useState([]);

    const [loadingProductList, setLoadingProductList] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const loaderProductList = loadingProductList ? <Loader size={16} /> : null;
    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    const visibleProductList = productListFound.length > 0 ? true : false;

    const closeList = () => {
        setProductListFound([]);
    };

    function searchProduct(event) {
        const nameProduct = event.target.value;

        setProductName({ value: nameProduct, error: '' });


        if (nameProduct.length > 3 && operation === 'change') {
            setLoadingProductList(true);

            request(`GetListProducts?name=${nameProduct}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
                        productList = result;

                        const productListFoundIds = Array.from(new Set(
                            result.map(item => item.productId)
                        ));

                        const filteredProductList = productListFoundIds.map(productId => {
                            return {
                                productId: productId,
                                productName: result.find(item => item.productId === productId).productName
                            }
                        });

                        setProductListFound(filteredProductList);

                    } else {
                        setProductName({ value: nameProduct, error: 'Поиск не дал результатов' });
                        setProductListFound([]);
                    }

                    setLoadingProductList(false);
                })
        } else {
            setProductListFound([]);
        }
    };

    const selectProduct = (event) => {
        const productId = event.target.dataset.productid;
        const selectedProduct = productList.filter(product => Number(product.productId) === Number(productId));

        setProductName({ value: event.target.textContent, error: '' });
        setProductId(productId);

        const parametersId = Array.from(new Set(
            selectedProduct.map(({ parameterId }) => parameterId)
        ));

        setParameters(
            parametersId.map(parameterId => {
                const currentParameter = selectedProduct.filter(product => Number(product.parameterId) === Number(parameterId));

                return {
                    parameterId: Number(parameterId),
                    parameterTypeId: { value: currentParameter[0].parameterTypeId.toString(), error: '' },
                    parameterTagId: currentParameter[0].parameterTagId,
                    position: { value: currentParameter[0].position, error: '' },
                    round: { value: currentParameter[0].round, error: ''} ,
                    showLimits: currentParameter[0].showLimit,
                    tags: currentParameter.map(({ tagId, tagName }) => ({
                        tagId: Number(tagId),
                        tag: { value: tagName, error: '' }
                    }))
                }
            })
        );
    };

    const addParameter = () => {
        const newParameter = { ...parameter, parameterId: parameter.parameterId + parameters.length };
        setParameters([...parameters, newParameter]);
    };

    const removeParameter = (index) => {
        if (parameters.length > 1) {
            isNaN(index) ? parameters.pop() : parameters.splice(index, 1);
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

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
    }, []);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={submitForm}>
                <TextInput
                    {...attributesInputs}
                    {...productName}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={productNameRef}
                    rightSection={loaderProductList}
                    onChange={searchProduct} />

                <div className="info-block__form__search-result" open={visibleProductList}>
                    {productListFound.map(({ productId, productName }) =>
                        <p
                            key={productId}
                            data-productid={productId}
                            className="info-block__form__search-result__item"
                            onClick={selectProduct}>
                            {productName}
                        </p>)}
                </div>

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
                        removeParameter={removeParameter}
                    />)}

                <Space h="md" />

                <Button type="submit" loading={loaderSubmitForm}>Сохранить</Button>
            </form>
        </div>
    );
};

export default AddChangeProduct;