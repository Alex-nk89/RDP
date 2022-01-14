import { useEffect, useState, useRef } from 'react';
import { TextInput, MultiSelect, Space, ActionIcon, Button } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { IoAdd } from 'react-icons/io5';

import { useRequest } from '../..';
import { useNotification } from '../..';

import './addChangeFolder.sass';

const AddChangeFolder = ({ componentInfo, type, updatingNavbar }) => {
    const { request, error } = useRequest();
    const { show } = useNotification();
    const [title, setTitle] = useState(null);
    const [loadingForButton, setLoadingForButton] = useState(false);
    const [accesses, setAccesses] = useState([]);
    const [oldAccesses, setOldAccesses] = useState([]);

    const form = useForm({
        initialValues: {
            name: '',
            access: ''
        },
        validationRules: {
            name: value => value.trim().length >= 3
        },
        errorMessages: {
            name: 'Наименование должно содержать минимум 3 символа',
            access: ''
        }
    });

    const attributesInputs = {
        required: true
    }

    const nameRef = useRef(null);

    const addAccess = () => {
        if (form.values.access.trim().length === 0 || accesses.includes(form.values.access))
            form.setFieldError('access', 'Поле не может быть пустым или дублировать выбранные значения');
        else {
            setAccesses([...accesses, form.values.access]);
            form.setFieldValue('access', '');
        }
    }

    const submitForm = (values) => {

        const folder = {
            Id: type === 'add' ? 0 : componentInfo.id,
            Name: values.name,
            IdParent: type === 'add' ? componentInfo.id : componentInfo.idParent,
            Type: 'folder',
            IdComponent: componentInfo.idComponent,
            ADGroups: accesses,
            AdGroupsOld: oldAccesses
        };

        setLoadingForButton(true);

        request('AddChangeFolder', 'POST', JSON.stringify(folder))
            .then(result => {
                if (Object.keys(result).length !== 0) {
                    show('success', result.message);

                    if (type === 'add') {
                        form.reset();
                        setAccesses([]);
                    }

                } else {
                    show('error', error.message);
                }

            })
            .finally(() => {
                setLoadingForButton(false);
                updatingNavbar();
            });
    }

    const addAccessIcon =
        <ActionIcon onClick={addAccess}>
            <IoAdd size={18} />
        </ActionIcon>

    const multiSelect = accesses.length !== 0 ?
        <>
            <Space h="sm" />

            <MultiSelect
                data={accesses}
                value={accesses}
                onChange={setAccesses}
                size="md"
                classNames={{
                    input: 'info-block__input',
                    rightSection: 'info-block__rightSection'
                }} />
        </> : null



    useEffect(() => {
        form.resetErrors();
        setAccesses([]);
        setOldAccesses([]);

        if (type === 'add') {
            setTitle('Добавление новой папки');
            form.setValues({ name: '', access: '' });
        } else {
            setTitle('Редактирование папки');
            form.setValues({ name: componentInfo.name, access: '' });

            if (componentInfo.adGroups[0]) {
                setAccesses(componentInfo.adGroups);
                setOldAccesses(componentInfo.adGroups);
            }
        }

        nameRef.current.focus();

        //eslint-disable-next-line
    }, [componentInfo, type])

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block info-block__add-change-folder">
                <form onSubmit={form.onSubmit(values => submitForm(values))}>

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('name')}
                        label='Наименование папки'
                        placeholder='Введите наименование папки'
                        ref={nameRef} />

                    <Space h="md" />

                    <TextInput
                        {...attributesInputs}
                        {...form.getInputProps('access')}
                        label='Группы доступа'
                        placeholder='Введите группу из Active Directory'
                        rightSection={addAccessIcon}
                    />

                    {multiSelect}

                    <Space h="md" />

                    <Button type="submit" loading={loadingForButton}>Сохранить</Button>

                </form>
            </div>
        </>
    )
}

export default AddChangeFolder;