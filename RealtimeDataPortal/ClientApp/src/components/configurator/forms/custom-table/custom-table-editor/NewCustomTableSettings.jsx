import {
    useState
    , useSelector, useDispatch
    , useRequest
    , Loader, TextInput
} from '..';

import { inputCellContain } from '../../../../../reducers/customTableSlice';

export const NewCustomTableSettings = ({ indexTable }) => {
    const dispatch = useDispatch();
    const { request } = useRequest();
    const focusedElement = useSelector(state => state.customTable.focusedElement);
    const tables = useSelector(state => state.customTable.tables[indexTable]);

    const [findedTags, setFindedTags] = useState([]);
    const [fetchingTags, setFetchinTags] = useState(false);

    const loader = fetchingTags ? <Loader size={16} /> : null;
    const visibleFindedTags = findedTags.length > 0;

    if (indexTable !== Number(focusedElement?.indexTable)) {
        return null;
    }

    const { indexRow, indexCell } = focusedElement;
    const cell = tables.rows[indexRow].cells[indexCell];

    const inputThisCellContain = (event) => {
        const cellContain = event.target.value;

        if (cellContain[0] === '%') {
            if (cellContain.length >= 4) {
                setFetchinTags(true);

                request(`GetTags?name=${cellContain.substring(1)}&forFindTags=true`)
                    .then(data => setFindedTags(data))
                    .finally(() => setFetchinTags(false));
            }
        }

        dispatch(inputCellContain({
            indexTable, indexRow: focusedElement.indexRow,
            indexCell: focusedElement.indexCell, cellContain, typeCell: 'text'
        }));
    };

    const findedTagsList = findedTags.map(({ tagName, productName, position }, index) => (
        <div key={index} className='dropdown-list__item'>
            <div className="dropdown-list__item__value">
                {tagName}
            </div>

            <div className="dropdown-list__item__description">
                {`Продукт: ${productName.length > 0 ? productName: 'Не указан'}`}
                <br />
                {`Позиция: ${position.length > 0 ? position : 'Не указана'}`}
            </div>
        </div>
    ));

    return (
        <>
            <div className="custom-table-editor__new-table-form__table-settings__cellContain" >
                <TextInput
                    label='Содержимое ячейки'
                    placeholder='Введите текст, тег или формулу'
                    size='xs'
                    rightSection={loader}
                    value={cell.cellContain}
                    onChange={inputThisCellContain}
                    data-settings // Аттрибут используется как признак того что не надо скрывать панель настроек ячейки при использовании данного элемента
                />

                <div className='dropdown-list' open={visibleFindedTags}>
                    {findedTagsList}
                </div>
            </div >
        </>
    );
};