import {
    useParams,
    Tabs,
    ErrorsPage, ChangeParameterType, EditServer, DeleteElements, EditTypeTag, AccessProfiles
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
        case 'type-tags':
            title = 'Редактор типов тега';
            break;
        case 'user-roles':
            title = 'Редактор ролей пользователя';
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
            case 'type-tags':
                return <EditTypeTag {...props} />;
            default:
                return <ErrorsPage statusCode={404} statusText='Page not found' message='Страница не найдена' />;
        }
    };

    if(operation === 'access-profiles') {
        return <AccessProfiles/>
    }

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