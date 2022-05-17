import {
    useState, useEffect, useRef, useRequest,
    TextInput, Space, ActionIcon, Loader,
    BsX,
    attributesInputs
} from '../../index';

const SectionProducts = ({ number, product, removeProduct, enterProduct }) => {
    const productRef = useRef();
    const { request } = useRequest();

    const [productsList, setProductsList] = useState([]);
    const [loadingProductList, setLoadingProductList] = useState(false);

    const visibleListTags = productsList.length > 0;
    const loaderProductList = loadingProductList ? <Loader size={16} /> : null;

    const removeCurrentProduct = () => removeProduct(--number);

    const searchProduct = (event) => {
        const name = event.target.value;

        if (name.length > 3 && document.activeElement === productRef.current) {
            setLoadingProductList(true);

            request(`GetListProducts?name=${name}`)
                .then(productsList => {
                    if (Object.keys(productsList).length > 0) {
                        const productListFoundIds = Array.from(new Set(
                            productsList.map(item => item.productId)
                        ));

                        const filteredProductList = productListFoundIds.map(productId => {
                            return {
                                productId: productId,
                                productName: productsList.find(item => item.productId === productId).productName,
                                position: productsList.find(item => item.productId === productId).position
                            }
                        });

                        setProductsList(filteredProductList);
                        enterProduct(--number, { ...product, productId: 0, productName: { value: name, error: '' } });
                    } else {
                        setProductsList([]);
                        enterProduct(--number, { ...product, productId: 0, productName: { value: name, error: 'Поиск не дал результатов' } });
                    }

                    setLoadingProductList(false);
                });
        } else {
            enterProduct(--number, { ...product, productId: 0, productName: { value: name, error: '' } });
        }
    };

    const selectProduct = (event) => {
        const selectedProductId = event.target.dataset.productid;
        const { productId, productName } = productsList.find(product => Number(product.productId) === Number(selectedProductId));

        enterProduct(--number, { ...product, productId: Number(productId), productName: { value: productName, error: '' } });
    };

    const closeList = () => {
        setProductsList([]);
    };

    const findedProductsList = productsList.map(({ productId, productName, position }) => (
        <div key={productId} className='dropdown-list__item' data-productid={productId} onClick={selectProduct}>
            <div className="dropdown-list__item__value" data-productid={productId}>
                {productName}
            </div>

            <div className="dropdown-list__item__description" data-productid={productId}>
                {`id: ${productId},`}
                {` Позиция: ${position.length > 0 ? position : 'Не указана'}`}
            </div>
        </div>
    ));

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <Space h='xs' />

            <div className='info-block__form__fieldset__product-block'>
                <h6>{`Продукт №${++number}`}</h6>

                <div>
                    <TextInput
                        {...attributesInputs}
                        {...product.productName}
                        placeholder='Выберите продукт'
                        description={product.productId > 0 ? `id: ${product.productId}, Позиция: ${product.position}` : null}
                        onChange={searchProduct}
                        ref={productRef}
                        rightSection={loaderProductList}
                    />

                    <ActionIcon onClick={removeCurrentProduct}>
                        <BsX />
                    </ActionIcon>
                </div>

                <div className='dropdown-list' open={visibleListTags}>
                    {findedProductsList}
                </div>
            </div>
        </>
    );
};

export default SectionProducts;