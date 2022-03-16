import { EditMnemoschemeFormCreate, EditMnemoschemeFormChange } from "..";

export const EditMnemoschemeForm = ({ editor }) => {


    return (
        <div className='info-block info-block__mnemoscheme_form'>
            <EditMnemoschemeFormCreate editor={editor} />
            <EditMnemoschemeFormChange editor={editor} />

            {/* <Text color='dimmed' size='sm'>Удалить:</Text>

            <div className='info-block__mnemoscheme_form_create-block'>

            </div> */}
        </div>
    );
};