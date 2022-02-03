import {
    Divider, InputWrapper, Space, Group, ActionIcon, IoAdd, IoRemove, settingsAddRemoveIcon, TextInput,
    attributesInputs, NumberInput, Checkbox
} from '../../index';

const Parameter = ({ number, parameter, enterData }) => {

    const divider = number > 0 ? <Divider variant="dotted" size="md" /> : null;

    const addTag = () => {
        enterData(number, { ...parameter, tags: [...parameter.tags, { id: 0, idTag: '', tagName: '' }] });
    };

    const removeTag = () => {
        if (parameter.tags.length > 1) {
            parameter.tags.pop();
            enterData(number, { ...parameter, tags: [...parameter.tags] });
        }
    };

    const positionEntry = event => {
        enterData(--number, { ...parameter, position: { value: event.target.value, error: '' } });
}

return (
    <>
        {divider}

        <Space h='sm' />

        <InputWrapper label={`Параметер №${++number}`}>
            <fieldset>

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

                <Space h='xs' />

                <TextInput
                    {...attributesInputs}
                    {...parameter.position}
                    label='Позиция'
                    placeholder='Введите позицию'
                    onChange={positionEntry}
                />

                <Space h='xs' />

                <NumberInput
                    {...attributesInputs}
                    {...parameter.round}
                    label="Округление"
                    placeholder="Количество знаков после запятой"
                    type="number"
                    min={0}
                    max={5}
                />

                <Space h='xs' />

                <Checkbox
                    label='Отображение лимитов'
                    checked={parameter.showLimits}
                />
            </fieldset>
        </InputWrapper>

        <Space h='sm' />

    </>
);
};

export default Parameter;