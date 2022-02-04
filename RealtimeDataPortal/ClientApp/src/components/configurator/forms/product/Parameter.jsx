import {
    Divider, InputWrapper, Space, Group, ActionIcon, IoAdd, IoRemove, settingsAddRemoveIcon, TextInput,
    attributesInputs, NumberInput, Checkbox, ParameterTag, Select
} from '../../index';

const Parameter = ({ number, parameter, enterParameter, parameterTypes }) => {
    const typesList = parameterTypes.map(item =>
        ({ label: `${item.label} - ${item.parameterTypeName}`, value: item.parameterTypeId.toString() }));

    const addTag = () => {
        enterParameter(--number, { ...parameter, tags: [...parameter.tags, { tagId: 0, tag: { value: '', error: '' } }] });
    };

    const removeTag = () => {
        if (parameter.tags.length > 1) {
            parameter.tags.pop();
            enterParameter(--number, { ...parameter, tags: [...parameter.tags] });
        }
    };

    const positionEntry = event => enterParameter(--number, { ...parameter, position: { value: event.target.value, error: '' } });

    const limitsEntry = event => enterParameter(--number, { ...parameter, showLimits: event.target.checked });

    const parameterEntry = value => enterParameter(--number, { ...parameter, parameterTypeId: { value, error: ''}});

    const enterTag = (num, tag) => {
        parameter.tags[num] = { ...tag };
        enterParameter(--number, { ...parameter, tags: [...parameter.tags] });
    };

    const tagList = parameter.tags.map((tag, index) =>
        <ParameterTag key={index} number={index} tag={tag} enterTag={enterTag} />);

    return (
        <>
            <Space h='sm' />

            <Divider variant="dotted" size="md" />

            <Space h='sm' />

            <InputWrapper label={`Параметер №${++number}`}>
                <fieldset>
                    <Space h='xs' />

                    <TextInput
                        {...attributesInputs}
                        {...parameter.position}
                        label='Позиция'
                        placeholder='Введите позицию'
                        onChange={positionEntry}
                    />

                    <Space h='xs' />

                    <Select
                        {...attributesInputs} 
                        {...parameter.parameterTypesId}
                        label='Тип параметра'
                        placeholder='Выберите тип параметра'
                        data={typesList}
                        onChange={parameterEntry}
                        defaultValue='1'
                    />

                    <Space h='xs' />

                    <NumberInput
                        {...attributesInputs}
                        {...parameter.round}
                        label="Округление"
                        placeholder="Количество знаков после запятой"
                        min={0}
                        max={5}
                    />

                    <Space h='xs' />

                    <Checkbox
                        label='Отображение лимитов'
                        checked={parameter.showLimits}
                        onChange={limitsEntry}
                    />

                    <Space h='xs' />

                    <InputWrapper label='Количество тегов'>
                        <Group>
                            <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeTag}>
                                <IoRemove />
                            </ActionIcon>
                            <span>{parameter.tags.length}</span>
                            <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addTag}>
                                <IoAdd />
                            </ActionIcon>
                        </Group>
                    </InputWrapper>

                    {tagList}
                </fieldset>
            </InputWrapper>

            <Space h='sm' />

        </>
    );
};

export default Parameter;