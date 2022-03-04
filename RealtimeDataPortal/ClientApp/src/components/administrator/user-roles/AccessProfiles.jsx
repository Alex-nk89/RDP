import {
    useEffect, useState,
    useForm,
    TextInput, Space, Button,
    useRequest, useNotification,
    AppPreloader, ErrorsPage,
    attributesInputs
} from '../index';

export const AccessProfiles = () => {
    const { request, error } = useRequest();
    const { show } = useNotification();

    const [fetchingAccessProfiles, setFetchingAccessProfiles] = useState('loading');
    const [accessProfiles, setAccessProfiles] = useState([]);
    const [savingAccessProfiles, setSavingAccessProfiles] = useState(false);
    const [updateForm, setUpdateForm] = useState(true);

    const form = useForm({
        initialValues: {
            adGroupFullView: '',
            adGroupAdministrator: '',
            adGroupConfigurator: '',
        },
        validationRules: {
            adGroupFullView: value => value.trim().length > 0,
            adGroupAdministrator: value => value.trim().length > 0,
            adGroupConfigurator: value => value.trim().length > 0
        },
        errorMessages: {
            adGroupFullView: 'Необходимо заполнить поле',
            adGroupAdministrator: 'Необходимо заполнить поле',
            adGroupConfigurator: 'Необходимо заполнить поле'
        }
    });

    const submitForm = ({ adGroupFullView, adGroupAdministrator, adGroupConfigurator }) => {
        setSavingAccessProfiles(true);

        request('EditAccessProfiles', 'POST', JSON.stringify(
            accessProfiles.map(accessProfile => {
                switch (accessProfile.function) {
                    case 'fullView':
                        return { ...accessProfile, adGroup: adGroupFullView };
                    case 'customizer':
                        return { ...accessProfile, adGroup: adGroupConfigurator };
                    case 'admin':
                        return { ...accessProfile, adGroup: adGroupAdministrator };
                    default:
                        return null;
                }
            })
        ))
            .then(result => {
                window.location.reload();
                //setUpdateForm(!updateForm);
                show('success', result.success);
            })
            .catch(error => show('error', error))
            .finally(() => setSavingAccessProfiles(false));
    };

    const Form = () => {
        return (
            <div className="info-block info-block__form">
                <form onSubmit={form.onSubmit(values => submitForm(values))}>
                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('adGroupFullView')}
                        label='Полный просмотр'
                        description={accessProfiles.find(access => access.function === 'fullView').description}
                        placeholder='Введите группу'
                    />

                    <Space h='lg' />

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('adGroupConfigurator')}
                        label='Конфигурирование'
                        description={accessProfiles.find(access => access.function === 'customizer').description}
                        placeholder='Введите группу'
                    />

                    <Space h='lg' />

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('adGroupAdministrator')}
                        label='Администрирование'
                        description={accessProfiles.find(access => access.function === 'admin').description}
                        placeholder='Введите группу'
                    />

                    <Space h='lg' />

                    <Button type='submit' loading={savingAccessProfiles}>
                        Сохранить
                    </Button>
                </form>
            </div>
        );
    }

    useEffect(() => {
        request('GetAccessProfiles')
            .then(accessProfiles => {

                form.setValues({
                    adGroupFullView: accessProfiles.find(access => access.function === 'fullView').adGroup,
                    adGroupConfigurator: accessProfiles.find(access => access.function === 'customizer').adGroup,
                    adGroupAdministrator: accessProfiles.find(access => access.function === 'admin').adGroup
                });

                setAccessProfiles(accessProfiles);
                setFetchingAccessProfiles('confirmed');
            })
            .catch(() => setFetchingAccessProfiles('error'));
        //eslint-disable-next-line
    }, [updateForm]);

    switch (fetchingAccessProfiles) {
        case 'loading':
            return <AppPreloader height='calc(100vh - 116px)' />;
        case 'error':
            return <ErrorsPage height='calc(100vh - 116px)' {...error} />;
        case 'confirmed':
            return <Form />;
        default:
            return null;
    };
}