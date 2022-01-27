import { Tooltip, ActionIcon, IoShareSocial} from '../Index';

const SaveToExcel = () => {

    return (
        <Tooltip label='Открыть в Excel'>
            <ActionIcon>
                <IoShareSocial size={18}/>
            </ActionIcon>
        </Tooltip>
    );
}

export default SaveToExcel;