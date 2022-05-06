import {
    useState,
    Space, Stepper,
    FormCustomTable, EditorCustomTable
} from './index';

import './customtable.sass';

export const EditCustomTable = ({ action, form, submitForm, addAccessIcon, multiSelect }) => {
    const title = action === 'add' ? 'Создание таблицы' : 'Редактирование таблицы';

    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));

    return (
        <>
            <h3 className="title">{title}</h3>

            <Space h='sm' />

            <Stepper active={activeStep} onStepClick={setActiveStep}>
                <Stepper.Step label='Форма' description='Заполнение данных'>
                    <FormCustomTable
                        form={form}
                        addAccessIcon={addAccessIcon}
                        multiSelect={multiSelect}
                        nextStep={nextStep}
                    />
                </Stepper.Step>

                <Stepper.Step label='Таблица' description='Конструктор таблицы'>
                    <EditorCustomTable
                        form={form} 
                        submitForm={submitForm}
                    />
                </Stepper.Step>
            </Stepper>
        </>
    );
};