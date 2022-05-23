import {
    useState, useEffect, useNotification, useRequest
    , ActionIcon, NumberInput, TextInput, Tooltip
    , BsFonts, BsChevronUp, BsChevronDown, BsType, BsTypeBold
} from '..';

export const MnemoschemeEditorPanelTextAttribute = ({ mnemoschemeActiveObjectType, elementAttributes, setElementAttributes, mnemoscheme }) => {
    const { request } = useRequest();
    const { show } = useNotification();

    const [listTags, setListTags] = useState([]);
    const visibleFindedTags = listTags.length > 0;

    const closeList = () => setListTags([]);

    const changeText = (event) => {
        const text = event.target.value;
        setElementAttributes({ ...elementAttributes, text });

        if (mnemoscheme._activeObject) {

            if (text[0] === '%' && text.length > 3) {
                request(`GetTags?name=${text.substring(1)}&forFindTags=true`)
                    .then(listTags => {
                        setListTags(listTags);
                    })
                    .catch(error => show('error', error));
            } else {
                mnemoscheme._activeObject.set({ text });
            }

            mnemoscheme.renderAll();
        }
    };

    const changeFontSize = (fontSize) => {
        if (fontSize >= 5) {
            setElementAttributes({ ...elementAttributes, fontSize });
            mnemoscheme._activeObject.set({ fontSize });
            mnemoscheme.renderAll();
        }
    };

    const increaseFontSize = () => changeFontSize(++elementAttributes.fontSize);

    const decreaseFontSize = () => changeFontSize(--elementAttributes.fontSize);

    const changeFontWeight = () => {
        setElementAttributes({ ...elementAttributes, fontWeight: elementAttributes?.fontWeight === 400 ? 700 : 400 });
        mnemoscheme._activeObject.set({ fontWeight: elementAttributes?.fontWeight === 400 ? 700 : 400 });
        mnemoscheme.renderAll();
    };

    const selectTag = (event) => {
        if (elementAttributes.text[0] === '%') {
            const { tagid, productid, tagname, round, color } = event.target.dataset;

            setElementAttributes({ ...elementAttributes, text: '%' + tagname });

            mnemoscheme._activeObject.set({
                tagId: Number(tagid),
                productId: Number(productid),
                tagName: tagname,
                text: '000.000',
                round: Number(round),
                fill: color
            });
            mnemoscheme.renderAll();
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
    }, []);

    const selectFontSize = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Размер шрифта' openDelay={1000}>
                <NumberInput
                    size='xs'
                    type='number'
                    min='5'
                    icon={<BsType size={18} color='#5c5c5c' />}
                    value={elementAttributes.fontSize}
                    onChange={changeFontSize}
                    rightSection={(
                        <div>
                            <ActionIcon size={13} variant='light' data-settings onClick={increaseFontSize}>
                                <BsChevronUp size={10} />
                            </ActionIcon>

                            <ActionIcon size={13} variant='light' data-settings onClick={decreaseFontSize}>
                                <BsChevronDown size={10} />
                            </ActionIcon>
                        </div>
                    )}
                />
            </Tooltip>
        )
        : null;

    const fontWeightStyle = elementAttributes?.fontWeight === 400 ? { variant: 'light' } : { variant: 'filled' };

    const selectFontWeight = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <Tooltip label='Полужирный' openDelay={1000}>
                <ActionIcon {...fontWeightStyle} color='blue' onClick={changeFontWeight} data-settings>
                    <BsTypeBold size={20} />
                </ActionIcon>
            </Tooltip>
        )
        : null;

    const findedTagsList = listTags.map(({ tagId, tagName, productName, position, productId, round, color }, index) => {
        const attributes = {
            'id': tagId,
            'data-tagid': tagId,
            'data-productid': productId,
            'data-tagname': tagName,
            'data-round': round,
            'data-color': color
        };

        return (
            <div key={index} className='dropdown-list__item' {...attributes} onClick={selectTag} >
                <div className="dropdown-list__item__value" {...attributes} >
                    {tagName}
                </div>

                <div className="dropdown-list__item__description" {...attributes} >
                    {`Продукт: ${productName.length > 0 ? productName : 'Не указан'}`}
                    <br />
                    {`Позиция: ${position.length > 0 ? position : 'Не указана'}`}
                </div>
            </div>
        )
    });

    const selectText = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <div className='info-block__mnemoscheme-editor__settings__change-block__text-block'>
                <Tooltip label='Изменить текст' openDelay={1000}>
                    <TextInput
                        size='xs'
                        icon={<BsFonts size={18} color='#5c5c5c' />}
                        value={elementAttributes.text}
                        onChange={changeText}
                    />
                </Tooltip>

                <div className='dropdown-list' open={visibleFindedTags}>
                    {findedTagsList}
                </div>
            </div>
        )
        : null;

    return (
        <>
            {selectText}
            {selectFontSize}
            {selectFontWeight}
        </>
    );
}