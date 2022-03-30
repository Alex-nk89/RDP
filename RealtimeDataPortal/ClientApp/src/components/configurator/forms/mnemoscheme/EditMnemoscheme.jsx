import {
    useState,
    useSelector,
    Space, Stepper,
    useNotification, useRequest,
    MnemoschemeEditorForm, MnemoschemeEditorPreview, MnemoschemeEditorPanelCreateElements, MnemoschemeEditorPanelChangeElements
} from '.';
import './mnemoscheme.sass';

export const EditMnemoscheme = ({ action, form, nameRef, submitForm, addAccessIcon, multiSelect, loadingForButton }) => {
    const title = action === 'create' ? 'Создание мнемосхемы' : 'Редактирование мнемосхемы';

    const { request } = useRequest();
    const { show } = useNotification();
    const componentInfo = useSelector(state => state.configurator.componentInfo);

    const [activeStep, setActiveStep] = useState(0);
    const [mnemoscheme, setMnemoscheme] = useState(null);

    const saveMnemoscheme = () => {
        //componentInfo.mnemoscheme.mnemoschemeContain = JSON.stringify(mnemoscheme);
        //const component = componentInfo;
        //component.mnemoscheme.mnemoschemeContain = JSON.stringify(mnemoscheme);

        request('AddChangeElement', 'POST', JSON.stringify(componentInfo))
            .then(result => show('success', result.message))
            .catch(error => show('error', error));
    };

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
                    <div className='info-block__mnemoscheme-editor' >
                        <div className='info-block'>
                            <MnemoschemeEditorPanelCreateElements mnemoscheme={mnemoscheme} saveMnemoscheme={saveMnemoscheme} />
                            <MnemoschemeEditorPanelChangeElements mnemoscheme={mnemoscheme} />
                            <MnemoschemeEditorPreview setMnemoscheme={setMnemoscheme} />
                        </div>
                    </div>
                </Stepper.Step>
            </Stepper>
        </>
    );
};

//<MnemoschemeEditorPanel mnemoscheme={mnemoscheme} saveMnemoscheme={saveMnemoscheme} />