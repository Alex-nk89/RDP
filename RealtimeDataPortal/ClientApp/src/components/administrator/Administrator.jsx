import {
    useParams,
    ErrorsPage, ChangeParameterType
} from './index';

export const Administrstor = () => {
    const { operation } = useParams();
    console.log(operation);

    switch(operation) {
        case 'change-parameter-type':
            return <ChangeParameterType />;
        default:
            return <ErrorsPage statusCode={404} statusText='Page not found' message='Страница не найдена'/>;
    }
};