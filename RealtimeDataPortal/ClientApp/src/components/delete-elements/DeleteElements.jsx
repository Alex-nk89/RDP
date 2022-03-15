import { useState } from 'react';
import { useForm } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { TextInput, Loader, Checkbox, Button, Space, Text } from '@mantine/core';
import { BsSearch } from 'react-icons/bs';

import { useRequest } from '../../hooks/useRequest';
import { useNotification } from '../../hooks/useNotification';

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

const DeleteElements = ({ typeElements }) => {
    const { request } = useRequest();
    const { show } = useNotification();
    const modals = useModals();

    const [listElements, setListElements] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [searchingData, setSearchingData] = useState(false);

    const loaderSubmitForm = loadingSubmit ? <Loader size={16} /> : null;

    const methods = function () {
        switch (typeElements) {
            case 'tag':
                return { find: 'GetTags', delete: 'DeleteTags' };
            case 'product':
                return { find: 'GetListProductsForDelete', delete: 'DeleteProducts' };
            case 'parameter-type':
                return { find: 'GetListParameterTypes', delete: 'DeleteParameterTypes' };
            case 'servers':
                return { find: 'GetListServers', delete: 'DeleteServers' };
            case 'type-tags':
                return { find: 'GetListTypesTag', delete: 'DeleteTypesTag' };
            default:
                return null;
        }
    }();

    const form = useForm({
        initialValues: {
            name: '',
        },
        errorMessages: {
            name: 'Не выбрано ни одного элемента'
        },
        validationRules: {
            name: isSelectSome
        }
    });

    const selectTagToRemove = event => {
        const id = event.target.dataset.id;

        setListElements(listElements.map(element => {
            if (Number(element.id) === Number(id)) element.isChecked = !element.isChecked;

            return element;
        }));
    };

    const list = (
        <ul className='info-block__form__list-elements-to-remove'>
            {listElements.map(({ id, name, isChecked }) =>
                <li key={id}>
                    <Checkbox label={name} data-id={id} onChange={selectTagToRemove} checked={isChecked} />
                </li>)}
        </ul>
    );

    const blockButton = listElements.length > 0 ?
        <>
            <Space h="md" />

            <Button type="submit" color='red' loading={loaderSubmitForm}>Удалить</Button>
        </> : null;

    function isSelectSome() {
        return listElements.find(element => element.isChecked);
    };

    const deleteElements = deletingElements => {
        setLoadingSubmit(true);

        request(methods.delete, 'POST', JSON.stringify(deletingElements))
            .then(result => {
                show('success', result.success);
                form.reset();
                setListElements([]);
            })
            .catch(error => show('error', error))
            .finally(() => setLoadingSubmit(false));
    };

    const confirmModal = deletingElements => modals.openConfirmModal({
        title: 'Удаление элементов',
        children: (
            <Text size="sm">
                Вы уверены что хотите продолжить? Отменить удаление будет не возможно!
            </Text>
        ),
        labels: { confirm: 'Удалить', cancel: 'Отменить' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteElements(deletingElements)
    });

    const submitForm = () => {
        const delitingElements = listElements.filter(element => element.isChecked).map(element => element.id);

        confirmModal(delitingElements);
    };

    const searchElements = () => {
        const name = form.values.name;

        if (name.length > 0) {
            setSearchingData(true);

            request(`${methods.find}?name=${name}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
                        setListElements(result.map(item => {
                            switch (typeElements) {
                                case 'tag':
                                    return { id: item.tagId, name: `${item.tagName} (${item.serverName})`, isChecked: false };
                                case 'product':
                                    return { id: item.productId, name: `${item.productName}`, isChecked: false };
                                case 'parameter-type':
                                    return { id: item.parameterTypeId, name: `${item.label} - ${item.parameterTypeName}`, isChecked: false };
                                case 'servers':
                                    return { id: item.serverId, name: `${item.serverName} (${item.database})`, isChecked: false };
                                case 'type-tags':
                                    return { id: item.tagTypeId, name: `${item.type} - ${item.typeName} (${item.typeShortName})`, isChecked: false };
                                default:
                                    return null;
                            }
                        }));
                    } else {
                        setListElements([]);
                        form.setErrors({ name: 'Поиск не дал результатов' });
                    }
                })
                .catch(error => show('error', error))
                .finally(() => setSearchingData(false));
        }
    };

    const searchButton = !searchingData ?
        <BsSearch size={16} onClick={searchElements} /> : <Loader size={18} />;

    return (
        <div className="info-block info-block__form">
            <form onSubmit={form.onSubmit(submitForm)}>
                <TextInput
                    {...attributesInputs}
                    {...form.getInputProps('name')}
                    label='Наименование'
                    placeholder='Введите наименование'
                    rightSection={searchButton}
                    autoFocus />

                {list}
                {blockButton}
            </form>
        </div>
    );
}

export default DeleteElements;