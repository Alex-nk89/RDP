import { useState, useEffect, useRequest, Tabs, AddChangeTag, AppPreloader, ErrorsPage, DeleteElements } from '../../index';
import './tag.sass';

const Tag = () => {
    const { request, error, proccess, setProccess } = useRequest();
    const [tagAttributes, setTagAttributes] = useState({});

    const tabs = (
        <>
            <h3 className="title">Редактор тегов</h3>

            <div className='add-change-tag'>
                <Tabs variant='pills' orientation='vertical'>
                    <Tabs.Tab label='Создать' >
                        <AddChangeTag operation='add' tagAttributes={tagAttributes} />
                    </Tabs.Tab>

                    <Tabs.Tab label='Редактировать'>
                        <AddChangeTag operation='change' tagAttributes={tagAttributes} />
                    </Tabs.Tab>

                    <Tabs.Tab label='Удалить'>
                        <DeleteElements typeElements='tag' />
                    </Tabs.Tab>
                </Tabs>
            </div>
        </>

    );

    useEffect(() => {
        request('GetAttributesForTag')
            .then(result => {
                if (Object.keys(result).length > 0) {
                    setTagAttributes(result);
                    setProccess('confirmed');
                }
            });

        //eslint-disable-next-line
    }, []);

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
}

export default Tag;