import {
    useState
    , useSelector, useDispatch
    , useRequest
    , ActionIcon, ColorInput, Loader, NumberInput, TextInput, Tooltip
    , BsTypeBold, BsTextLeft, BsTextCenter, BsTextRight, BsArrowBarRight, BsArrowBarDown, BsChevronUp, BsChevronDown
    , BsChevronBarContract, BsChevronBarUp, BsChevronBarDown
} from '..';

import { inputCellContain, inputCellStyle, addColSpan, removeColSpan, addRowSpan, removeRowSpan } from '../../../../../reducers/customTableSlice';

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
    const { colSpan, rowSpan, color, backgroundColor } = JSON.parse(cell.cellStyle);

    const fontWeightStyle = cellStyle?.fontWeight === 400 ? { variant: 'light' } : { variant: 'filled' };

    const textAlignStyle = {
        start: cellStyle?.textAlign === 'start' ? { variant: 'filled' } : { variant: 'light' },
        center: cellStyle?.textAlign === 'center' ? { variant: 'filled' } : { variant: 'light' },
        end: cellStyle?.textAlign === 'end' ? { variant: 'filled' } : { variant: 'light' }
    };

    const verticalAlignStyle = {
        top: cellStyle?.verticalAlign === 'top' ? { variant: 'filled' } : { variant: 'light' },
        middle: cellStyle?.verticalAlign === 'middle' ? { variant: 'filled' } : { variant: 'light' },
        bottom: cellStyle?.verticalAlign === 'bottom' ? { variant: 'filled' } : { variant: 'light' }
    };

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

    const toogleVerticalAlignStyle = (event) => {
        dispatch(inputCellStyle({
            indexTable,
            indexRow,
            indexCell,
            cellStyle: JSON.stringify({ ...cellStyle, verticalAlign: event.target.dataset.verticalalign })
        }));
    };

    const addColSpanValue = () => {
        if (tables.rows[indexRow].cells.length > Number(indexCell) + 1) {
            dispatch(addColSpan({
                indexTable,
                indexRow,
                indexCell,
                cellStyle: JSON.stringify({ ...cellStyle, colSpan: colSpan + 1 })
            }));
        }
    };

    const removeColSpanValue = () => {
        if (colSpan > 1) {
            dispatch(removeColSpan({
                indexTable,
                indexRow,
                indexCell,
                cellStyle: JSON.stringify({ ...cellStyle, colSpan: colSpan - 1 })
            }));
        }
    };

    const addRowSpanValue = () => {
        if (tables.rows.length > Number(indexRow) + rowSpan) {
            dispatch(addRowSpan({
                indexTable,
                indexRow,
                indexCell,
                cellStyle: JSON.stringify({ ...cellStyle, rowSpan: rowSpan + 1 })
            }));
        }
    };

    const removeRowSpanValue = () => {
        if (rowSpan > 1) {
            dispatch(removeRowSpan({
                indexTable,
                indexRow,
                indexCell,
                cellStyle: JSON.stringify({ ...cellStyle, rowSpan: rowSpan - 1 })
            }));
        }
    };

    const inputColor = (color) => {
        dispatch(inputCellStyle({
            indexTable,
            indexRow,
            indexCell,
            cellStyle: JSON.stringify({ ...cellStyle, color })
        }));
    };

    const inputBackgroundColor = (backgroundColor) => {
        dispatch(inputCellStyle({
            indexTable,
            indexRow,
            indexCell,
            cellStyle: JSON.stringify({ ...cellStyle, backgroundColor })
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
                <Tooltip label='Полужирный' openDelay={1000}>
                    <ActionIcon {...fontWeightStyle} color='blue' onClick={toogleFontWeightStyle} data-settings>
                        <BsTypeBold size={20} />
                    </ActionIcon>
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__contain-alignment">
                <Tooltip label='По левому краю' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-textalign={'start'} {...textAlignStyle.start} onClick={toogleTextAlignStyle}>
                        <BsTextLeft size={20} data-textalign={'start'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По центру' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-textalign={'center'} {...textAlignStyle.center} onClick={toogleTextAlignStyle}>
                        <BsTextCenter size={20} data-textalign={'center'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По правому краю' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-textalign={'end'} {...textAlignStyle.end} onClick={toogleTextAlignStyle}>
                        <BsTextRight size={20} data-textalign={'end'} />
                    </ActionIcon>
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__vertical-alignment">
                <Tooltip label='По верхнему краю' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-verticalalign={'top'} {...verticalAlignStyle.top} onClick={toogleVerticalAlignStyle}>
                        <BsChevronBarUp size={20} data-verticalalign={'top'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По середине' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-verticalalign={'middle'} {...verticalAlignStyle.middle} onClick={toogleVerticalAlignStyle}>
                        <BsChevronBarContract size={20} data-verticalalign={'middle'} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label='По нижнему краю' openDelay={1000}>
                    <ActionIcon color='blue' data-settings data-verticalalign={'bottom'} {...verticalAlignStyle.bottom} onClick={toogleVerticalAlignStyle}>
                        <BsChevronBarDown size={20} data-verticalalign={'bottom'} />
                    </ActionIcon>
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__colspan">
                <Tooltip label='Объединение столбцов' openDelay={1000}>
                    <NumberInput
                        size='xs'
                        data-settings
                        value={colSpan}
                        icon={<BsArrowBarRight size={16} color='blue' />}
                        rightSection={(
                            <div>
                                <ActionIcon size={13} variant='light' data-settings onClick={addColSpanValue}>
                                    <BsChevronUp size={10} />
                                </ActionIcon>

                                <ActionIcon size={13} variant='light' data-settings onClick={removeColSpanValue}>
                                    <BsChevronDown size={10} />
                                </ActionIcon>
                            </div>)}
                    />
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__rowspan">
                <Tooltip label='Объединение строк' openDelay={1000}>
                    <NumberInput
                        size='xs'
                        data-settings
                        value={rowSpan}
                        icon={<BsArrowBarDown size={16} color='blue' />}
                        rightSection={(
                            <div>
                                <ActionIcon size={13} variant='light' data-settings onClick={addRowSpanValue}>
                                    <BsChevronUp size={10} />
                                </ActionIcon>

                                <ActionIcon size={13} variant='light' data-settings onClick={removeRowSpanValue}>
                                    <BsChevronDown size={10} />
                                </ActionIcon>
                            </div>)}
                    />
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__color">
                <Tooltip label='Цвет текста' openDelay={1000}>
                    <ColorInput
                        size='xs'
                        data-settings
                        value={color}
                        onChange={inputColor}
                    />
                </Tooltip>
            </div>

            <div className="custom-table-editor__new-table-form__table-settings__background">
                <Tooltip label='Цвет фона' openDelay={1000}>
                    <ColorInput
                        size='xs'
                        data-settings
                        value={backgroundColor}
                        onChange={inputBackgroundColor}
                    />
                </Tooltip>
            </div>
        </>
    );
};