import { useState, useEffect, useRequest, Tabs, AddChangeProduct, AppPreloader, ErrorsPage } from '../../index';
import './product.sass';

const Product = () => {
    const { request, error, proccess, setProccess } = useRequest();
    const [attributesForProducts, setAttributesForProducts] = useState({});

    useEffect(() => {
        request('GetAttributesForProducts')
            .then(result => {
                if (Object.keys(result).length > 0) {
                    setAttributesForProducts(result);
                    setProccess('confirmed');
                }
            });

        //eslint-disable-next-line
    }, []);

    const tabs = (
        <>
            <h3 className="title">Редактор продуктов</h3>

            <div className='add-change-product'>
                <Tabs variant='pills' orientation='vertical'>
                    <Tabs.Tab label='Создать' >
                        <AddChangeProduct operation='add' attributesForProducts={attributesForProducts} />
                    </Tabs.Tab>

                    <Tabs.Tab label='Редактировать'>
                        <AddChangeProduct operation='change' attributesForProducts={attributesForProducts} />
                    </Tabs.Tab>

                    <Tabs.Tab label='Удалить'>
                        {/* <DeleteElements typeElements='tag' /> */}
                    </Tabs.Tab>
                </Tabs>
            </div>
        </>
    )

    switch (proccess) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'error':
            return <ErrorsPage {...error} height='calc(100vh - 116px)' />;
        case 'confirmed':
            return tabs;
        default:
            return null;
    }
};

export default Product;