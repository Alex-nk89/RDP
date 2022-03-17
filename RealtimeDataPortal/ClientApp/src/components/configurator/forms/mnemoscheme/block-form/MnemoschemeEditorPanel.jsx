import { Button, MnemoschemeEditorPanelCreateElements } from "..";

export const MnemoschemeEditorPanel = ({ mnemoscheme, saveMnemoscheme }) => {

    return (
        <div className='info-block info-block__mnemoscheme_form'>
            <MnemoschemeEditorPanelCreateElements mnemoscheme={mnemoscheme} />

            <div className='info-block__mnemoscheme_form_create-block'>
                <Button onClick={saveMnemoscheme}>Сохранить</Button>
            </div>
        </div>
    );
};