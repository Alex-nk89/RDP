import {
    attributesInputs, settingsAddRemoveIcon, Divider, InputWrapper, Space, Group, ActionIcon, TextInput,
    NumberInput, Checkbox, ParameterTag, Select, BsPlus, BsDash, BsX,
} from '../../index';

const Parameter = ({ number, parameter, enterParameter, parameterTypes, removeParameter }) => {
    const typesList = parameterTypes.map(item =>
        ({ label: `${item.label} - ${item.parameterTypeName}`, value: item.parameterTypeId.toString() }));

    const addTag = () => {
        enterParameter(--number, { ...parameter, tags: [...parameter.tags, { tagId: 0, tag: { value: '', error: '' } }] });
    };

    const removeTag = (index) => {
        if (parameter.tags.length > 1) {
            isNaN(index) ? parameter.tags.pop() : parameter.tags.splice(index, 1);
            enterParameter(--number, { ...parameter, tags: [...parameter.tags] });
        }
    };

    const positionEntry = event => enterParameter(--number, { ...parameter, position: { value: event.target.value, error: '' } });

    const limitsEntry = event => enterParameter(--number, { ...parameter, showLimits: event.target.checked });

    const parameterEntry = value => enterParameter(--number, { ...parameter, parameterTypeId: { value, error: '' } });

    const roundEntry = value => enterParameter(--number, { ...parameter, round: { value, error: '' } });

    const enterTag = (num, tag) => {
        parameter.tags[num] = { ...tag };
        enterParameter(--number, { ...parameter, tags: [...parameter.tags] });
    };

    const removeCurrentParameter = () => {
        removeParameter(--number);
    }

    const tagList = parameter.tags.map((tag, index) =>
        <ParameterTag key={index} number={index} tag={tag} enterTag={enterTag} removeTag={removeTag} />);

    return (
        <>
            <Space h='sm' />

            <Divider variant="dotted" size="md" />

            <Space h='sm' />

            <div className='info-block__form__fieldset'>
                <div className='info-block__form__fieldset__title'>
                    <h6>{`Параметер №${++number}`}</h6>

                    <ActionIcon onClick={removeCurrentParameter}>
                        <BsX size={18}/>
                    </ActionIcon>
                </div>


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
                        {...parameter.parameterTypeId}
                        label='Тип параметра'
                        placeholder='Выберите тип параметра'
                        data={typesList}
                        onChange={parameterEntry}
                    />

                    <Space h='xs' />

                    <NumberInput
                        {...attributesInputs}
                        {...parameter.round}
                        label="Округление"
                        placeholder="Количество знаков после запятой"
                        min={0}
                        max={5}
                        onChange={roundEntry}
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
                                <BsDash />
                            </ActionIcon>
                            <span>{parameter.tags.length}</span>
                            <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addTag}>
                                <BsPlus />
                            </ActionIcon>
                        </Group>
                    </InputWrapper>

                    {tagList}
                </fieldset>
            </div>

            <Space h='sm' />

        </>
    );
};

export default Parameter;