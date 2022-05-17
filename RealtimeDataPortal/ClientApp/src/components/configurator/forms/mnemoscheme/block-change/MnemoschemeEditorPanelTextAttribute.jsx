import {
    useState, useEffect, useNotification, useRequest
    , NumberInput, TextInput, Tooltip
    , BsAlt, BsFonts
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

    const changeFontWeight = (fontWeight) => {
        if (fontWeight >= 300 && fontWeight <= 800) {
            setElementAttributes({ ...elementAttributes, fontWeight });
            mnemoscheme._activeObject.set({ fontWeight });
            mnemoscheme.renderAll();
        }
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
            <Tooltip label='Размер шрифта'>
                <NumberInput
                    size='xs'
                    variant='filled'
                    type='number'
                    min='5'
                    icon={<BsAlt size={18} color='#5c5c5c' />}
                    value={elementAttributes.fontSize}
                    onChange={changeFontSize}
                />
            </Tooltip>
        )
        : null;

    const selectFontWeight = ['text'].includes(mnemoschemeActiveObjectType) ? (
        <Tooltip label='Толщина текста'>
            <NumberInput
                size='xs'
                variant='filled'
                type='number'
                min='300' max='800' step={100}
                icon={<BsAlt size={18} color='#5c5c5c' />}
                value={elementAttributes.fontWeight}
                onChange={changeFontWeight}
            />
        </Tooltip>
    ) : null;

    const findedTagsList = listTags.map(({ tagId, tagName, productName, position, productId, round, color }, index) => (
        <div
            className='dropdown-list__item'
            key={index}
            id={tagId}
            data-tagid={tagId}
            data-productid={productId}
            data-tagname={tagName}
            data-round={round}
            data-color={color}
            onClick={selectTag}
        >
            <div
                className="dropdown-list__item__value"
                id={tagId}
                data-tagid={tagId}
                data-productid={productId}
                data-tagname={tagName}
                data-round={round}
                data-color={color}
            >
                {tagName}
            </div>

            <div
                className="dropdown-list__item__description"
                id={tagId}
                data-tagid={tagId}
                data-productid={productId}
                data-tagname={tagName}
                data-round={round}
                data-color={color}
            >
                {`Продукт: ${productName.length > 0 ? productName : 'Не указан'}`}
                <br />
                {`Позиция: ${position.length > 0 ? position : 'Не указана'}`}
            </div>
        </div>
    ));

    const selectText = ['text'].includes(mnemoschemeActiveObjectType)
        ? (
            <div className='info-block__mnemoscheme-editor__change-block__text-block'>
                <Tooltip label='Изменить текст'>
                    <TextInput
                        size='xs'
                        variant='filled'
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
            {selectFontSize}
            {selectFontWeight}
            {selectText}
        </>
    );
}