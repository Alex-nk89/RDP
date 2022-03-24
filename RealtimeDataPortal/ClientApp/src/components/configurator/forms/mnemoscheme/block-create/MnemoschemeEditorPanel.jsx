import {
    ActionIcon, Tooltip,
    BsSave,
    MnemoschemeEditorPanelCreateElements, MnemoschemeEditorPanelChangeElements
} from "..";

export const MnemoschemeEditorPanel = ({ mnemoscheme, saveMnemoscheme }) => {

    return (
        <div className='info-block__mnemoscheme-editor__panel'>
            <div className='info-block'>
                <MnemoschemeEditorPanelCreateElements mnemoscheme={mnemoscheme} />
                <MnemoschemeEditorPanelChangeElements mnemoscheme={mnemoscheme} />

                <Tooltip label='Сохранить'>
                    <ActionIcon color="indigo" size="lg" onClick={saveMnemoscheme}>
                        <BsSave size={18} />
                    </ActionIcon>
                </Tooltip>

            </div>
        </div>
    );
};