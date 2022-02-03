import { Tabs, AddChangeProduct } from '../../index';
import './product.sass';

const Product = () => {

    const tabs = (
        <>
            <h3 className="title">Редактор продуктов</h3>

            <div className='add-change-product'>
            <Tabs variant='pills' orientation='vertical'>
                    <Tabs.Tab label='Создать' >
                        <AddChangeProduct operation='add' />
                    </Tabs.Tab>

                    <Tabs.Tab label='Редактировать'>
                        <AddChangeProduct operation='change' />
                    </Tabs.Tab>

                    <Tabs.Tab label='Удалить'>
                        {/* <DeleteElements typeElements='tag' /> */}
                    </Tabs.Tab>
                </Tabs>
            </div>
        </>
    )

    return (
        <>
            {tabs}
        </>
    );
};

export default Product;