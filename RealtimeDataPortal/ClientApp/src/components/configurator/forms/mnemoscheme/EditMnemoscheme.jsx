import {
    useParams,
    useFabricJSEditor,
    EditMnemoschemeView, EditMnemoschemeForm
} from './';
import './mnemoscheme.sass';

export const EditMnemoscheme = () => {
    console.log('render');
    const { operation } = useParams();
    const { onReady, editor } = useFabricJSEditor();

    const title = operation.includes('create') ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block__mnemoscheme">
                <EditMnemoschemeView onReady={onReady} />

                <EditMnemoschemeForm editor={editor} />
            </div>
        </>
    )
};