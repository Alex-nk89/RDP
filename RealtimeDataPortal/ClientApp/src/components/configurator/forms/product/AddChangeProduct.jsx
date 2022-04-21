import {
    useState, useEffect, useRef, useRequest, useNotification, useSelector, Parameter, attributesInputs, settingsAddRemoveIcon,
    TextInput, Space, InputWrapper, Group, ActionIcon, Button, Loader, Text,
    BsDash, BsPlus, BsSearch
} from '../../index';

let productList = [];
let productId = 0;
let initialParameters = [];

const AddChangeProduct = ({ operation, attributesForProducts }) => {
    const productNameRef = useRef(null);
    const { request } = useRequest();
    const { show } = useNotification();
    const { parameterTypes, maxParameterId } = attributesForProducts;

    const user = useSelector(state => state.user.user);
    const disabledButton = user?.isConfigurator ? false : true;

    const parameter = {
        parameterId: maxParameterId + 1,
        parameterTypeId: { value: '1', error: '' },
        tags: [{
            tagId: 0,
            tag: { value: '', error: '' }
        }],
        position: { value: '', error: '' },
        round: { value: 3, error: '' },
        showLimits: false
    };

    const [productName, setProductName] = useState({ value: '', error: '' });
    const [productListFound, setProductListFound] = useState([]);
    const [parameters, setParameters] = useState([parameter]);

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [searchingProduct, setSearchingProduct] = useState(false);
    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    const visibleProductList = productListFound.length > 0 ? true : false;

    const entryProductName = (event) => setProductName({ value: event.target.value, error: '' });

    const closeList = () => {
        setProductListFound([]);
    };

    const getListProducts = () => {
        if (productName.value.length > 0) {
            setSearchingProduct(true);

            request(`GetListProducts?name=${productName.value}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
                        productList = result;

                        const productListFoundIds = Array.from(new Set(
                            result.map(item => item.productId)
                        ));

                        const filteredProductList = productListFoundIds.map(productId => {
                            return {
                                productId: productId,
                                productName: result.find(item => item.productId === productId).productName,
                                position: result.find(item => item.productId === productId).position
                            }
                        });

                        setProductListFound(filteredProductList);

                    } else {
                        setProductName({ ...productName, error: 'Поиск не дал результатов' });
                        setProductListFound([]);
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setSearchingProduct(false));
        } else {
            setProductName({ ...productName, error: 'Введите минимум 3 символа' })
            setProductListFound([]);
        }

        productNameRef.current.focus();
    };

    const selectProduct = (event) => {
        const selectedProductId = event.target.dataset.productid;
        const selectedProductName = event.target.dataset.productname;
        const selectedProduct = productList.filter(product => Number(product.productId) === Number(selectedProductId));

        setProductName({ value: selectedProductName, error: '' });
        productId = selectedProductId;

        const parametersId = Array.from(new Set(
            selectedProduct.map(({ parameterId }) => parameterId)
        ));

        initialParameters = parametersId.map(parameterId => {
            const currentParameter = selectedProduct.filter(product => Number(product.parameterId) === Number(parameterId));

            return {
                parameterId: Number(parameterId),
                parameterTypeId: { value: currentParameter[0].parameterTypeId.toString(), error: '' },
                parameterTagId: currentParameter[0].parameterTagId,
                position: { value: currentParameter[0].position, error: '' },
                round: { value: currentParameter[0].round, error: '' },
                showLimits: currentParameter[0].showLimits,
                tags: currentParameter.map(({ tagId, tagName }) => ({
                    tagId: Number(tagId),
                    tag: { value: tagName, error: '' }
                }))
            }
        });

        setParameters(initialParameters);
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

        if (productName.value.trim().length < 4) {
            setProductName({ ...productName, error: 'Наименование должно содержать от 4 символов' })
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
                        productId: operation === 'add' ? 0 : productId,
                        productName: productName.value,
                        parameterId: Number(parameter.parameterId),
                        parameterTypeId: Number(parameter.parameterTypeId.value),
                        position: parameter.position.value,
                        round: Number(parameter.round.value),
                        showLimits: Boolean(parameter.showLimits),
                        tagId: Number(tag.tagId)
                    };
                }));

            request('AddChangeProduct', 'POST', JSON.stringify(sentData))
                .then(() => show('success', 'Продукт сохранен'))
                .catch(error => show('error', error))
                .finally(() => setLoadingSubmit(false));

            setParameters([parameter]);
            setProductName({ value: '', error: '' })
        }
    };

    const searchButton = operation === 'change' ?
        searchingProduct ? <Loader size={18} /> : <BsSearch size={16} onClick={getListProducts} />
        : null;

    const productIdView = productId
        ? (
            <>
                <Space h="md" />

                <Group>
                    <Text weight={500} size='sm'>id продукта: </Text>
                    <Text size='sm'>{productId}</Text>
                </Group>


            </>
        )
        : null

    useEffect(() => {
        productNameRef.current.focus();

        setProductName({ value: '', error: '' });
        setParameters([parameter]);
        productId = 0;
        //eslint-disable-next-line
    }, [operation]);

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    return (
        <div className="info-block info-block__form">
            <form onSubmit={submitForm}>
                <TextInput
                    {...attributesInputs}
                    {...productName}
                    onChange={entryProductName}
                    label='Наименование'
                    placeholder='Введите наименование'
                    ref={productNameRef}
                    rightSection={searchButton}
                />

                <div className="info-block__form__search-result" open={visibleProductList}>
                    {productListFound.map(({ productId, productName, position }) =>
                        <div
                            key={productId}
                            data-productid={productId}
                            data-productname={productName}
                            className="info-block__form__search-result__item"
                            onClick={selectProduct}
                        >
                            <Text data-productid={productId} data-productname={productName}>{productName}</Text>
                            <Text data-productid={productId} data-productname={productName}>(id: {productId}{position.length > 0 ? `, Позиция: ${position}` : null})</Text>
                        </div>
                    )}
                </div>

                {productIdView}

                <Space h="md" />

                <InputWrapper label='Количество параметров'>
                    <Group>
                        <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeParameter}>
                            <BsDash />
                        </ActionIcon>
                        <span>{parameters.length}</span>
                        <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addParameter}>
                            <BsPlus />
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

                <Button type="submit" loading={loaderSubmitForm} disabled={disabledButton}>Сохранить</Button>
            </form>
        </div>
    );
};

export default AddChangeProduct;