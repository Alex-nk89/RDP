import {
    useState, useEffect, useRef, useRequest, useNotification, useDispatch, useSelector,
    TextInput, Space, ActionIcon, MultiSelect, Checkbox, Button, InputWrapper, Group, Divider,
    attributesInputs, settingsAddRemoveIcon,
    BsPlus, BsDash,
    Section
} from '../../index';
import './tableRt.sass';

import { updateNavbar } from '../../../../actions';

const AddChangeTableRT = () => {
    // Компонент для добавления/редактирования таблиц реального времени
    // Начальные данные инициализируются в зависимости от типа операции:
    //  - добавление - начальные данные пусты
    //  - редактирование - данные componentInfo приходят из родительского компонента Configurator
    // Форма строится исходя из объекта Sections. Что изменить форму (например, добавить еще одну секцию) необходимо 
    //   изменить изменить обьект
    // При отправке данных необходимо передать 'побочные' данные ...componentInfo, так как метод сохранения общий
    //   для других форм (например, графиков, папок и т.д.)

    const { operation, componentInfo } = useSelector(state => state.configurator);
    const dispatch = useDispatch();
    const isAddOperation = operation === 'add-table' ? true : false;
    const title = isAddOperation ? 'Добавление таблицы реального времени' : 'Редактирование таблицы реального времени';
    const { table, tableSections, sectionProducts, treesMenu, maxSectionId, adGroups } = componentInfo;

    const section = {
        id: maxSectionId + 1,
        name: { value: '', error: '' },
        products: [{
            id: 0,
            productId: 0,
            productName: { value: '', error: '' }
        }]
    };

    const user = useSelector(state => state.user.user);
    const disabledButton = user?.isConfigurator ? false : true;

    const nameRef = useRef();
    const { request } = useRequest();
    const { show } = useNotification();

    const [fetchingData, setFetchingData] = useState(false);

    const [name, setName] = useState({ value: isAddOperation ? '' : treesMenu.name, error: '' });
    const tableId = isAddOperation ? 0 : table.tableId;
    const [access, setAccess] = useState({ value: '', error: '' });
    const [accesses, setAccesses] = useState(adGroups ?? []);
    const oldAccesses = adGroups ?? [];
    const [positionVisible, setPositionVisible] = useState(isAddOperation ? true : table.positionVisible);
    const [unitVisible, setUnitVisible] = useState(isAddOperation ? true : table.unitVisible);
    const [scaleVisible, setScaleVisible] = useState(isAddOperation ? true : table.scaleVisible);
    const [limitVisible, setLimitVisible] = useState(isAddOperation ? false : table.limitVisible);
    const [sections, setSections] = useState(
        isAddOperation ?
            [section] :
            tableSections.map(section => {
                const products = sectionProducts.filter(product => product.sectionId === section.sectionId);

                return {
                    id: section.sectionId,
                    name: { value: section.sectionName, error: '' },
                    products: products.map(product =>
                    ({
                        id: product.id,
                        productId: product.productId,
                        productName: { value: `${product.productName} (${product.position})`, error: '' }
                    }))
                };
            })
    );

    const entryAccess = (event) => setAccess({ value: event.target.value, error: '' });
    const entryPositionVisible = (event) => setPositionVisible(event.target.checked);
    const entryUnitVisible = (event) => setUnitVisible(event.target.checked);
    const entryScaleVisible = (event) => setScaleVisible(event.target.checked);
    const entryLimitVisible = (event) => setLimitVisible(event.target.checked);

    const searchTableRT = (event) => {
        const name = event.target.value;

        setName({ value: name, error: '' });
    };

    const addAccess = () => {
        if (access.value.trim().length > 0 && !accesses.includes(access)) {
            setAccesses([...accesses, access.value]);
            setAccess({ value: '', error: '' });
        } else {
            setAccess({ ...access, error: 'Поле не может быть пустым или дублировать выбранные значения' });
        }
    };

    const addAccessIcon = (
        <ActionIcon onClick={addAccess}>
            <BsPlus size={18} />
        </ActionIcon>
    );

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
        </> : null;

    const addSection = () => {
        const newSection = { ...section, id: section.id + sections.length };
        setSections([...sections, newSection]);
    };

    const removeSection = (index) => {
        if (sections.length > 1) {
            let newSections = [...sections];
            isNaN(index) ? newSections.pop() : newSections.splice(index, 1);
            setSections([...newSections]);
        }
    };

    const enterSection = (id, section) => {
        sections[id] = { ...section };
        setSections([...sections]);
    };

    const resetForm = () => {
        setName({ value: '', error: '' });

    }

    const checkForm = () => {
        // Имя секции может быть пустым. В этом случает все секции без имени будут на сервереобьеденины в одну
        let verified = true;

        if (name.value.trim().length < 5) {
            setName({ ...name, error: 'Наименование должно содержать от 5 символов' });
            verified = false;
        }

        sections.forEach((section) => {
            section.products.forEach((product, indexP) => {
                if (product.productId === 0) {
                    section.products[indexP] = { ...product, productName: { ...product.productName, error: 'Необходимо обязательно выбрать продукт' } };
                    enterSection([...sections]);
                    verified = false;
                }
            });
        });


        return verified;
    };

    const submitForm = (event) => {
        event.preventDefault();

        if (checkForm()) {
            setFetchingData(true);

            const component = {
                //...componentInfo,
                TreesMenu: {
                    Id: isAddOperation ? 0 : treesMenu.id,
                    Name: name.value,
                    ParentId: isAddOperation ? treesMenu.id : treesMenu.parentId,
                    Type: 'table',
                    ComponentId: treesMenu.componentId
                },
                ADGroups: accesses,
                AdGroupsOld: oldAccesses,
                table: { tableId, positionVisible, unitVisible, scaleVisible, limitVisible },
                tableSections: sections.map(section => {
                    return {
                        sectionId: section.id,
                        sectionName: section.name.value,
                        tableId
                    };
                }),
                sectionProducts: sections.flatMap(section =>
                    section.products.map(product => {
                        return {
                            id: product.id,
                            productId: product.productId,
                            sectionId: section.id
                        };
                    }))
            };

            request('AddChangeElement', 'POST', JSON.stringify(component))
                .then(result => {
                    show('success', result.message);

                    if (isAddOperation) {
                        resetForm();
                        setAccesses([]);
                    }

                    dispatch(updateNavbar());
                })
                .catch(error => show('error', error))
                .finally(() => setFetchingData(false));
        }
    };

    useEffect(() => {
        nameRef.current.focus();

        //eslint-disable-next-line
    }, [])

    return (
        <>
            <h3 className="title">{title}</h3>

            <div className="info-block info-block__form">
                <form onSubmit={submitForm}>
                    <TextInput
                        {...attributesInputs}
                        {...name}
                        label='Наименование'
                        placeholder='Введите наименование'
                        ref={nameRef}
                        onChange={searchTableRT}
                    />

                    <Space h="md" />

                    <TextInput
                        {...access}
                        label='Группы доступа'
                        placeholder='Введите группу из Active Directory'
                        autoComplete='off'
                        rightSection={addAccessIcon}
                        onChange={entryAccess}
                    />

                    {multiSelect}

                    <Space h="md" />

                    <InputWrapper label='Количество секций'>
                        <Group>
                            <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeSection}>
                                <BsDash />
                            </ActionIcon>
                            <span>{sections.length}</span>
                            <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addSection}>
                                <BsPlus />
                            </ActionIcon>
                        </Group>
                    </InputWrapper>

                    <Space h="md" />

                    {sections.map((section, index) =>
                        <Section
                            key={section.id}
                            number={index}
                            section={section}
                            removeSection={removeSection}
                            enterSection={enterSection}
                        />)}

                    <Space h="md" />

                    <Divider variant="dotted" size="md" />

                    <Space h="md" />

                    <Checkbox
                        label='Отображать позицию'
                        checked={positionVisible}
                        onChange={entryPositionVisible}
                    />

                    <Space h="md" />

                    <Checkbox
                        label='Отображать единицы измерения'
                        checked={unitVisible}
                        onChange={entryUnitVisible}
                    />

                    <Space h="md" />

                    <Checkbox
                        label='Отображать шкалу'
                        checked={scaleVisible}
                        onChange={entryScaleVisible}
                    />

                    <Space h="md" />

                    <Checkbox
                        style={{ display: 'none' }}
                        label='Отображать норму ТР'
                        checked={limitVisible}
                        onChange={entryLimitVisible}
                    />

                    {/* <Space h="md" /> */}

                    <Button type='submit' loading={fetchingData} disabled={disabledButton}>Сохранить</Button>
                </form>
            </div>
        </>
    );
};

export default AddChangeTableRT;