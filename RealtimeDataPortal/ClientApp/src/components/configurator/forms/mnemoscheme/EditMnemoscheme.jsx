import {
    useState,
    Space, Stepper,
    MnemoschemeEditorForm
} from '.';

export const EditMnemoscheme = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'create' ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';

    const [activeStep, setActiveStep] = useState(0);
    const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));

    return (
        <>
            <h3 className="title">{title}</h3>

            <Space h='sm' />

            <Stepper active={activeStep} onStepClick={setActiveStep}>
                <Stepper.Step label='Форма' description='Заполнение данных'>
                    <MnemoschemeEditorForm
                        form={form}
                        addAccessIcon={addAccessIcon}
                        multiSelect={multiSelect}
                        nextStep={nextStep}
                    />
                </Stepper.Step>

                <Stepper.Step label='Мнемосхема' description='Рисование мнемосхемы'>
                    <h4>Полотно для рисования</h4>
                </Stepper.Step>
            </Stepper>
        </>
    );
};



/* import {
    useState,
    useParams,
    useSelector,
    useRequest, useNotification,
    MnemoschemeEditorPanel, MnemoschemeEditorCanvas
} from '.';
import './mnemoscheme.sass';

export const EditMnemoscheme = () => {
    const { operation } = useParams();
    const title = operation.includes('create') ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';
    const [mnemoscheme, setMnemoscheme] = useState(null);

    const { request } = useRequest();
    const { show } = useNotification();

    const componentInfo = useSelector(state => state.configurator.componentInfo);

    const saveMnemoscheme = () => {
        componentInfo.mnemoscheme.mnemoschemeContain = JSON.stringify(mnemoscheme);

        request('AddChangeElement', 'POST', JSON.stringify(componentInfo))
            .then(result => show('success', result.message))
            .catch(error => show('error', error));
    };

    return (
        <>
            <h3 className="title">{title}</h3>

            <MnemoschemeEditorCanvas setMnemoscheme={setMnemoscheme} mnemoscheme={mnemoscheme} />
            <MnemoschemeEditorPanel mnemoscheme={mnemoscheme} saveMnemoscheme={saveMnemoscheme} />
        </>
    )
}; */