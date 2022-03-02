import {
    useParams,
    Tabs,
    ErrorsPage, ChangeParameterType, EditServer, DeleteElements
} from './index';

import './administrator.sass';

export const Administrstor = () => {
    const { operation } = useParams();
    let title = '';

    switch (operation) {
        case 'parameter-type':
            title = 'Редактор типа параметров';
            break;
        case 'servers':
            title = 'Редактор серверов';
            break;
        default:
            break;
    }

    const Form = (props) => {
        switch (operation) {
            case 'parameter-type':
                return <ChangeParameterType {...props} />;
            case 'servers':
                return <EditServer {...props} />;
            default:
                return <ErrorsPage statusCode={404} statusText='Page not found' message='Страница не найдена' />;
        }
    };

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className='administration-forms'>
                <Tabs variant='pills' orientation='vertical'>
                    <Tabs.Tab label='Создать' >
                        <Form operation='add' />
                    </Tabs.Tab>

                    <Tabs.Tab label='Редактировать'>
                        <Form operation='change' />
                    </Tabs.Tab>

                    <Tabs.Tab label='Удалить'>
                        <DeleteElements typeElements={operation} />
                    </Tabs.Tab>
                </Tabs>
            </div>
        </>
    );
};