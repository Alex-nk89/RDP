import {
    useState, useEffect, useRef, useRequest, useNotification, useSelector,
    TextInput, Space, Button, Loader, Text,
    attributesInputs
} from '../../index';

const AddChangeGraphic = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'add' ? 'Добавление графика' : 'Редактирование графика';
    const productRef = useRef(null);
    const { request } = useRequest();
    const { show } = useNotification();
    const user = useSelector(state => state.user.user);
    const disabledButton = user?.isConfigurator ? false : true;

    const [productListFound, setProductListFound] = useState([]);
    const [loadingListProducts, setLoadingListProducts] = useState(false);

    const loaderProductList = loadingListProducts ? <Loader size={16} /> : null;
    const visibleProductList = productListFound.length > 0 ? true : false;

    const closeList = () => {
        setProductListFound([]);
    };

    const selectProduct = event => {
        const selectedProductId = event.target.dataset.productid;
        const selectedProductName = productListFound.find(product => product.productId === Number(selectedProductId)).productName;

        form.setValues((currentValues) => ({ ...currentValues, product: selectedProductName, productId: selectedProductId }));
    }

    useEffect(() => {
        const nameProduct = form.getInputProps('product').value;

        if (nameProduct.length > 3 && document.activeElement === productRef.current) {
            setLoadingListProducts(true);

            request(`GetListProducts?name=${nameProduct}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
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
                        form.setErrors({ product: 'Поиск не дал результатов' });
                        setProductListFound([]);
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setLoadingListProducts(false));
        }

        //eslint-disable-next-line
    }, [form.getInputProps('product').value]);

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block info-block__form">
                <form onSubmit={form.onSubmit(values => submitForm(values))}>
                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('name')}
                        label='Наименование'
                        placeholder='Введите наименование'
                        ref={nameRef}
                    />

                    <Space h="md" />

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('product')}
                        label='Продукт'
                        placeholder='Выберите продукт'
                        ref={productRef}
                        rightSection={loaderProductList}
                    />

                    <div className="info-block__form__search-result" open={visibleProductList}>
                        {productListFound.map(({ productId, productName, position }) =>
                            <div
                                key={productId}
                                data-productid={productId}
                                className="info-block__form__search-result__item"
                                onClick={selectProduct}
                            >
                                <Text data-productid={productId}>{productName}</Text>
                                <Text data-productid={productId}>id: {productId}{position.length > 0 ? `, Позиция: ${position}` : null}</Text>
                            </div>)}
                    </div>

                    <Space h="md" />

                    <TextInput
                        {...form.getInputProps('access')}
                        autoComplete='off'
                        label='Группы доступа'
                        placeholder='Введите группу из Active Directory'
                        rightSection={addAccessIcon}
                    />

                    {multiSelect}

                    <Space h="md" />

                    <Button type="submit" loading={loadingForButton} disabled={disabledButton}>Сохранить</Button>
                </form>
            </div>
        </>
    );
};

export default AddChangeGraphic;