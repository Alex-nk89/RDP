import { useState, useEffect, useRef, useRequest, TextInput, Space, Loader, attributesInputs, ActionIcon, BsX } from '../../index';

const ParameterTag = ({ number, tag, enterTag, removeTag }) => {
    const tagNameRef = useRef(null);
    const { request } = useRequest();

    const [tagsList, setTagsList] = useState([]);
    const [loadingTagList, setLoadingTagList] = useState(false);

    const visibleListTags = tagsList.length > 0 ? true : false;
    const loaderTagList = loadingTagList ? <Loader size={16} /> : null;

    const tagSearch = event => {
        const tagName = event.target.value;

        if (tagName.length > 2 && document.activeElement === tagNameRef.current) {
            setLoadingTagList(true);

            request(`GetTags?name=${tagName}`)
                .then(result => {
                    if (Object.keys(result).length > 0) {
                        setTagsList(result);
                        enterTag(--number, { ...tag, tag: { value: tagName, error: '' } });
                    }
                    else {
                        enterTag(--number, { ...tag, tag: { value: tagName, error: 'Поиск не дал результатов' } });
                        setTagsList([]);
                    }

                    setLoadingTagList(false);
                })
        } else {
            setTagsList([]);
            enterTag(--number, { tagId: 0, tag: { value: tagName, error: '' } });
        }
    };

    const closeList = () => {
        setTagsList([]);
    };

    const selectTag = event => {
        const selectedTag = tagsList.find(tag => Number(tag.tagId) === Number(event.target.id));
        const { tagId, tagName } = selectedTag;

        enterTag(--number, { tagId, tag: { value: tagName, error: '' } });
        closeList();
    };

    const removeCurrentTag = () => {
        removeTag(--number);
    };

    useEffect(() => {
        document.addEventListener("click", closeList);

        return () => document.removeEventListener("click", closeList);
        //eslint-disable-next-line
    }, []);

    return (
        <>
            <Space h='xs' />

            <div className='info-block__form__fieldset__tag-block'>
                <h6>{`Тег №${++number}`}</h6>

                <div>
                    <TextInput
                        {...attributesInputs}
                        {...tag.tag}
                        onChange={tagSearch}
                        placeholder='Выберите тег'
                        ref={tagNameRef}s
                        rightSection={loaderTagList}
                    />

                    <ActionIcon onClick={removeCurrentTag}>
                        <BsX size={18}/>
                    </ActionIcon>
                </div>


            </div>

            <div className="info-block__form__search-result" open={visibleListTags}>
                {tagsList.map(tag =>
                    <p
                        key={tag.tagId}
                        id={tag.tagId}
                        className="info-block__form__search-result__item"
                        onClick={selectTag}
                    >
                        {`${tag.tagName} (${tag.serverName})`}
                    </p>)}
            </div>
        </>
    );
};

export default ParameterTag;