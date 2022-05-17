import {
    useState, useEffect, useRef
    , useRequest
    , ActionIcon, Loader, Space, TextInput
    , BsX
    , attributesInputs
} from '../../index';

const ParameterTag = ({ number, tag, enterTag, removeTag }) => {
    const tagNameRef = useRef(null);
    const { request } = useRequest();

    const [tagsList, setTagsList] = useState([]);
    const [loadingTagList, setLoadingTagList] = useState(false);

    const visibleListTags = tagsList.length > 0;
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

    const findedTagsList = tagsList.map(({ tagId, tagName, serverName }, index) => (
        <div key={index} className='dropdown-list__item' id={tagId} onClick={selectTag}>
            <div className="dropdown-list__item__value" id={tagId}>
                {tagName}
            </div>

            <div className="dropdown-list__item__description" id={tagId}>
                {`Сервер: ${serverName}`}
            </div>
        </div>
    ));

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
                        ref={tagNameRef}
                        rightSection={loaderTagList}
                    />
                    <ActionIcon onClick={removeCurrentTag}>
                        <BsX size={18} />
                    </ActionIcon>
                </div>

                <div className='dropdown-list' open={visibleListTags}>
                    {findedTagsList}
                </div>
            </div>
        </>
    );
};

export default ParameterTag;