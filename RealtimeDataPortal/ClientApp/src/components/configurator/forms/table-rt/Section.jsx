import {
    Divider, Space, ActionIcon, TextInput, InputWrapper, Group,
    BsX, BsPlus, BsDash,
    SectionProducts,
    settingsAddRemoveIcon
} from '../../index';

const Section = ({ number, removeSection, section, enterSection }) => {

    const entryNameSection = (event) => enterSection(--number, { ...section, name: { value: event.target.value, error: '' } });

    const removeCurentSection = () => removeSection(--number);

    const addProduct = () => {
        enterSection(--number, {
            ...section,
            products: [...section.products,
            { id: 0, productId: 0, productName: { value: '', error: '' } }]
        });
    };

    const removeProduct = (index) => {
        if (section.products.length > 1) {
            isNaN(index) ? section.products.pop() : section.products.splice(index, 1);
            enterSection(--number, { ...section, products: [...section.products] });
        }
    };

    const enterProduct = (num, product) => {
        section.products[num] = { ...product };
        enterSection(--number, { ...section, products: [ ...section.products]});
    };

    return (
        <>
            <Divider variant="dotted" size="md" />

            <Space h='sm' />

            <div className='info-block__form__fieldset'>
                <div className='info-block__form__fieldset__title'>
                    <h6>{`Секция №${++number}`}</h6>

                    <ActionIcon onClick={removeCurentSection}>
                        <BsX />
                    </ActionIcon>
                </div>

                <fieldset>
                    <Space h='xs' />

                    <TextInput
                        {...section.name}
                        autoComplete='off'
                        label='Наименование секции'
                        placeholder='Введите наименование секции'
                        onChange={entryNameSection}
                    />

                    <Space h='sm' />

                    <InputWrapper label='Количество продуктов'>
                        <Group>
                            <ActionIcon color='red' {...settingsAddRemoveIcon} onClick={removeProduct}>
                                <BsDash />
                            </ActionIcon>
                            <span>{section.products.length}</span>
                            <ActionIcon color='blue' {...settingsAddRemoveIcon} onClick={addProduct}>
                                <BsPlus />
                            </ActionIcon>
                        </Group>
                    </InputWrapper>

                    {section.products.map((product, index) =>
                        <SectionProducts 
                            key={index} 
                            number={index} 
                            product={product} 
                            removeProduct={removeProduct} 
                            enterProduct={enterProduct}
                        />)}
                </fieldset>
            </div>

            <Space h='md' />
        </>
    );
};

export default Section;