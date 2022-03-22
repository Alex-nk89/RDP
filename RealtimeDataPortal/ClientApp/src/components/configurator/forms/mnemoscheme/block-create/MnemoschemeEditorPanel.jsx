import { Button, Text, MnemoschemeEditorPanelCreateElements } from "..";

export const MnemoschemeEditorPanel = ({ mnemoscheme, saveMnemoscheme }) => {

    return (
        <div className='info-block__mnemoscheme-editor__panel'>
            <div className='info-block'>
                <MnemoschemeEditorPanelCreateElements mnemoscheme={mnemoscheme} />
            </div>

            {/* <div className='info-block'>
                <Text color='dimmed' size='sm'>Редактировать:</Text>
            </div> */}

            {/* <div className='info-block'>
                <Text color='dimmed' size='sm'>Удалить:</Text>
            </div> */}

            <div className='info-block'>
                <Button onClick={saveMnemoscheme}>Сохранить</Button>
            </div>


            {/* <div className='info-block__mnemoscheme_form_create-block'>
                <Button onClick={saveMnemoscheme}>Сохранить</Button>
            </div> */}
        </div>
    );
};