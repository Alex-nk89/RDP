import {
    useState
    , useSelector, useDispatch
    , useRequest
    , ActionIcon, Loader, TextInput, Tooltip
    , BsTypeBold, BsTextLeft, BsTextCenter, BsTextRight
} from '..';

import { inputCellContain, inputCellStyle } from '../../../../../reducers/customTableSlice';

export const NewCustomTableSettings = ({ indexTable }) => {
    const dispatch = useDispatch();
    const { request } = useRequest();
    const focusedElement = useSelector(state => state.customTable.focusedElement);
    const tables = useSelector(state => state.customTable.tables[indexTable]);

    const [findedTags, setFindedTags] = useState([]);
    const [fetchingTags, setFetchinTags] = useState(false);

    if (indexTable !== Number(focusedElement?.indexTable)) {
        return null;
    }

    const loader = fetchingTags ? <Loader size={16} /> : null;
    const visibleFindedTags = findedTags.length > 0;

    const { indexRow, indexCell } = focusedElement;
    const cell = tables.rows[indexRow].cells[indexCell];

    const cellContain = JSON.parse(cell.cellContain).tagId !== 0
        ? `%${JSON.parse(cell.cellContain).tagName}`
        : JSON.parse(cell.cellContain).value

    const cellStyle = JSON.parse(cell.cellStyle);

    const fontWeightStyle = cellStyle?.fontWeight === 400 ? { variant: 'light' } : { variant: 'filled' };

    const textAlignStyle = {
        start: cellStyle?.textAlign === 'start' ? { variant: 'filled' } : { variant: 'light' },
        center: cellStyle?.textAlign === 'center' ? { variant: 'filled' } : { variant: 'light' },
        end: cellStyle?.textAlign === 'end' ? { variant: 'filled' } : { variant: 'light' }
    }

    const inputThisCellContain = (event) => {
        const cellContain = event.target.value;

        if (cellContain.at(0) === '%') {

            if (cellContain.length >= 4) {
                setFetchinTags(true);

                request(`GetTags?name=${cellContain.substring(1)}&forFindTags=true`)
                    .then(data => setFindedTags(data))
                    .finally(() => setFetchinTags(false));
            }
        }

        dispatch(inputCellContain({
            indexTable,
            indexRow: focusedElement.indexRow,
            indexCell: focusedElement.indexCell,
            cellContain: JSON.stringify({ value: cellContain, tagId: 0, productId: 0, tagName: cellContain, round: 0 })
        }));
    };

    const selectTag = (event) => {
        dispatch(inputCellContain({
            indexTable,
            indexRow: focusedElement.indexRow,
            indexCell: focusedElement.indexCell,
            cellContain: JSON.stringify({
                value: '000.000',
                tagId: Number(event.target.dataset.tagid),
                productId: Number(event.target.dataset.productid),
                tagName: event.target.dataset.tagname,
                round: Number(event.target.dataset.round)
            })
        }));
    };

    const toogleFontWeightStyle = () => {
        dispatch(inputCellStyle({
            indexTable,
            indexRow,
            indexCell,
            cellStyle: JSON.stringify({ ...cellStyle, fontWeight: cellStyle?.fontWeight === 400 ? 700 : 400 })
        }));
    };

    const toogleTextAlignStyle = (event) => {
        dispatch(inputCellStyle({
            indexTable,
            indexRow,
            indexCell,
            cellStyle: JSON.stringify({ ...cellStyle, textAlign: event.target.dataset.textalign })
        }));
    };

    const findedTagsList = findedTags.map(({ tagId, tagName, productId, productName, position, round }, index) => (
        <div key={index} className='dropdown-list__item' onClick={selectTag} data-tagid={tagId} data-productid={productId} data-tagname={tagName} data-round={round}>
            <div className="dropdown-list__item__value" data-tagid={tagId} data-productid={productId} data-tagname={tagName} data-round={round}>
                {tagName}
            </div>

            <div className="dropdown-list__item__description" data-tagid={tagId} data-productid={productId} data-tagname={tagName} data-round={round}>
                {`Продукт: ${productName.length > 0 ? productName : 'Не указан'}`}
                <br />
                {`Позиция: ${position.length > 0 ? position : 'Не указана'}`}
            </div>
        </div>
    ));

    return (
        <>
            {/* Аттрибут data-settings используется как признак того что не надо скрывать панель настроек ячейки при использовании данного элемента */}
            <div className="custom-table-editor__new-table-form__table-settings__cellContain" >
                <TextInput
                    placeholder='Введите текст, тег или формулу'
                    size='xs'
                    rightSection={loader}
                    value={cellContain}
                    onChange={inputThisCellContain}
                    data-settings
                />

                <div className='dropdown-list' open={visibleFindedTags}>
                    {findedTagsList}
                </div>
            </div >

            <div className="custom-table-editor__new-table-form__table-settings__font-weight">
                <Tooltip label='Полужирный'>
                    <ActionIcon {...fontWeightStyle} color='blue' onClick={toogleFontWeightStyle} data-settings>
                        <BsTypeBold size={20} />
                    </ActionIcon>
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__contain-alignment">
                <Tooltip label='По левому краю'>
                    <ActionIcon color='blue' data-settings data-textalign={'start'} {...textAlignStyle.start} onClick={toogleTextAlignStyle}>
                        <BsTextLeft size={20} data-textalign={'start'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По центру'>
                    <ActionIcon color='blue' data-settings data-textalign={'center'} {...textAlignStyle.center} onClick={toogleTextAlignStyle}>
                        <BsTextCenter size={20} data-textalign={'center'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По правому краю'>
                    <ActionIcon color='blue' data-settings data-textalign={'end'} {...textAlignStyle.end} onClick={toogleTextAlignStyle}>
                        <BsTextRight size={20} data-textalign={'end'} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </>
    );
};