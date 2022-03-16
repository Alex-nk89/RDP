import {
    useParams,
    EditMnemoschemeView, EditMnemoschemeForm
} from './';
import './mnemoscheme.sass';

export const EditMnemoscheme = () => {                      console.log('render');
    const { operation } = useParams();
    
    const title = operation.includes('create') ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block__mnemoscheme">
                <EditMnemoschemeView />

                <EditMnemoschemeForm />
            </div>
        </>
    )
};