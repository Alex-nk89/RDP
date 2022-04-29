import {
    ActionIcon
    , BsX
} from '..';

export const NewCustomTable = ({ index, removeTable }) => {

    const removeThisTable = () => removeTable(index);

    return (
        <div className='info-block custom-table-editor__new-table'>
            <div className='custom-table-editor__new-table__delete-button'>
                <ActionIcon onClick={removeThisTable}>
                    <BsX size={16} />
                </ActionIcon>
            </div>
        </div>
    );
};